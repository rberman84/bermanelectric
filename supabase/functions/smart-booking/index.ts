import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "npm:resend@4.0.0";
import { checkRateLimit, getClientIP, rateLimitErrorResponse, RATE_LIMITS } from "../_shared/rateLimit.ts";
import { handleError, handleValidationError, ErrorCode } from "../_shared/errorHandler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const zipCoords: Record<string, { lat: number; lon: number }> = {
  "11779": { lat: 40.8157, lon: -73.1128 },
  "11727": { lat: 40.8682, lon: -73.0438 },
  "11741": { lat: 40.7915, lon: -73.0735 },
  "11738": { lat: 40.8315, lon: -73.0547 },
  "11742": { lat: 40.815, lon: -73.0454 },
  "11720": { lat: 40.8709, lon: -73.0824 },
  "11749": { lat: 40.8049, lon: -73.1718 },
  "11776": { lat: 40.9118, lon: -73.0517 },
  "11726": { lat: 40.6763, lon: -73.3891 },
  "11701": { lat: 40.673, lon: -73.4157 },
};

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 18;
const SEARCH_HORIZON_DAYS = 14;
const SLOT_GRANULARITY_MINUTES = 15;

const requestSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  zipCode: z.string().trim().regex(/^\d{5}$/),
  serviceType: z.string().min(2).max(120),
  jobLengthMinutes: z.number().min(30).max(480),
  earliestStart: z.string().optional(),
  notes: z.string().max(2000).optional(),
  confirm: z.boolean().optional(),
  triageId: z.string().uuid().optional(),
  slot: z
    .object({
      crewId: z.string().uuid(),
      start: z.string(),
    })
    .optional(),
});

type CrewMember = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  home_zip: string | null;
  default_buffer_before_minutes: number;
  default_buffer_after_minutes: number;
};

type CrewEvent = {
  start_time: string;
  end_time: string;
  job_zip: string;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  status: string;
};

type SlotProposal = {
  crewId: string;
  crewName: string;
  start: string;
  end: string;
  travelMinutesFromPrev: number;
  travelMinutesToNext: number;
  travelMiles: number;
  bufferBefore: number;
  bufferAfter: number;
};

function getCoords(zip: string) {
  if (zipCoords[zip]) return zipCoords[zip];
  const prefix = zip.slice(0, 3);
  const match = Object.entries(zipCoords).find(([key]) => key.startsWith(prefix));
  return match ? match[1] : zipCoords["11779"];
}

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * R * Math.asin(Math.sqrt(Math.min(1, h)));
}

function estimateTravelMinutes(fromZip: string | null, toZip: string) {
  const from = getCoords(fromZip || toZip);
  const to = getCoords(toZip);
  const miles = haversine(from, to);
  const driveMinutes = Math.max(12, Math.round((miles / 28) * 60));
  return { minutes: driveMinutes, miles };
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function roundToSlot(date: Date) {
  const result = new Date(date);
  result.setSeconds(0, 0);
  const minutes = result.getMinutes();
  const remainder = minutes % SLOT_GRANULARITY_MINUTES;
  if (remainder !== 0) {
    result.setMinutes(minutes + (SLOT_GRANULARITY_MINUTES - remainder));
  }
  return result;
}

function alignToWorkingHours(date: Date) {
  const result = new Date(date);
  result.setSeconds(0, 0);
  const hour = result.getHours();
  if (hour < WORK_START_HOUR) {
    result.setHours(WORK_START_HOUR, 0, 0, 0);
  } else if (hour >= WORK_END_HOUR) {
    result.setDate(result.getDate() + 1);
    result.setHours(WORK_START_HOUR, 0, 0, 0);
  }
  return roundToSlot(result);
}

function dayEnd(date: Date) {
  const end = new Date(date);
  end.setHours(WORK_END_HOUR, 0, 0, 0);
  return end;
}

function getPrevEvent(events: CrewEvent[], target: Date, crew: CrewMember) {
  let prev: CrewEvent | null = null;
  for (const event of events) {
    const end = addMinutes(new Date(event.end_time), event.buffer_after_minutes ?? crew.default_buffer_after_minutes);
    if (end <= target) {
      prev = event;
    } else if (new Date(event.start_time) > target) {
      break;
    }
  }
  return prev;
}

function getNextEvent(events: CrewEvent[], target: Date, crew: CrewMember) {
  for (const event of events) {
    const start = addMinutes(new Date(event.start_time), -1 * (event.buffer_before_minutes ?? crew.default_buffer_before_minutes));
    if (start >= target) {
      return event;
    }
  }
  return null;
}

function findSlot(
  crew: CrewMember,
  events: CrewEvent[],
  jobLengthMinutes: number,
  zipCode: string,
  searchStart: Date
): SlotProposal | null {
  const sorted = events
    .filter((event) => ["scheduled", "pending"].includes(event.status))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const horizon = addMinutes(searchStart, SEARCH_HORIZON_DAYS * 24 * 60);
  let candidate = alignToWorkingHours(searchStart);

  while (candidate < horizon) {
    const prev = getPrevEvent(sorted, candidate, crew);
    const prevAvailableTime = prev
      ? addMinutes(new Date(prev.end_time), (prev.buffer_after_minutes ?? crew.default_buffer_after_minutes))
      : candidate;
    const prevZip = prev ? prev.job_zip : crew.home_zip;
    const { minutes: travelFromPrev, miles } = estimateTravelMinutes(prevZip, zipCode);
    const earliestStart = alignToWorkingHours(addMinutes(prevAvailableTime, travelFromPrev + crew.default_buffer_before_minutes));

    if (candidate < earliestStart) {
      candidate = earliestStart;
      continue;
    }

    const next = getNextEvent(sorted, candidate, crew);
    const travelToNext = next
      ? estimateTravelMinutes(zipCode, next.job_zip).minutes
      : estimateTravelMinutes(zipCode, crew.home_zip || zipCode).minutes;

    const nextStartLimit = next
      ? addMinutes(new Date(next.start_time), -1 * ((next.buffer_before_minutes ?? crew.default_buffer_before_minutes) + travelToNext))
      : horizon;

    const workingEnd = dayEnd(candidate);
    const limit = new Date(Math.min(nextStartLimit.getTime(), workingEnd.getTime()));

    const end = addMinutes(candidate, jobLengthMinutes);
    const endWithWrap = addMinutes(end, crew.default_buffer_after_minutes);

    if (endWithWrap <= limit) {
      return {
        crewId: crew.id,
        crewName: crew.name,
        start: candidate.toISOString(),
        end: end.toISOString(),
        travelMinutesFromPrev: travelFromPrev,
        travelMinutesToNext: travelToNext,
        travelMiles: Math.round((miles + Number.EPSILON) * 10) / 10,
        bufferBefore: crew.default_buffer_before_minutes,
        bufferAfter: crew.default_buffer_after_minutes,
      };
    }

    const advance = Math.max(SLOT_GRANULARITY_MINUTES, Math.ceil((endWithWrap.getTime() - candidate.getTime()) / (60 * 1000)));
    candidate = alignToWorkingHours(addMinutes(candidate, advance));
  }

  return null;
}

function formatHuman(dateIso: string) {
  return new Date(dateIso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatIcsDate(date: Date) {
  const iso = date.toISOString().replace(/[-:]/g, "").split(".")[0];
  return `${iso}Z`;
}

function buildIcs(
  uid: string,
  start: Date,
  end: Date,
  summary: string,
  description: string,
  location: string
) {
  const dtStamp = formatIcsDate(new Date());
  const dtStart = formatIcsDate(start);
  const dtEnd = formatIcsDate(end);

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Berman Electric//Smart Booking//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtStamp}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:${summary}\nDESCRIPTION:${description.replace(/\n/g, "\\n")}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMITS.BOOKING);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitErrorResponse(rateLimitResult, corsHeaders);
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return handleValidationError(parsed.error, "smart-booking", corsHeaders);
    }

    const {
      name,
      email,
      phone,
      zipCode,
      serviceType,
      jobLengthMinutes,
      earliestStart,
      notes,
      confirm,
      triageId,
      slot,
    } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: crews, error: crewError } = await supabase
      .from("crew_members")
      .select("id, name, email, phone, home_zip, default_buffer_before_minutes, default_buffer_after_minutes")
      .order("name", { ascending: true });

    if (crewError) throw crewError;
    if (!crews || crews.length === 0) {
      return new Response(
        JSON.stringify({ error: "No crews configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const searchStart = earliestStart ? new Date(earliestStart) : addMinutes(new Date(), 120);

    const crewEventsMap: Record<string, CrewEvent[]> = {};
    for (const crew of crews) {
      const { data: events, error: eventsError } = await supabase
        .from("crew_calendar")
        .select("start_time, end_time, job_zip, buffer_before_minutes, buffer_after_minutes, status")
        .eq("crew_id", crew.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true });

      if (eventsError) throw eventsError;
      crewEventsMap[crew.id] = events || [];
    }

    const proposals = crews
      .map((crew) => ({ crew, slot: findSlot(crew, crewEventsMap[crew.id] || [], jobLengthMinutes, zipCode, searchStart) }))
      .filter((entry) => entry.slot !== null) as { crew: CrewMember; slot: SlotProposal }[];

    if (!confirm) {
      if (proposals.length === 0) {
        return new Response(
          JSON.stringify({ ok: false, error: "No availability in the next two weeks." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      proposals.sort((a, b) => new Date(a.slot.start).getTime() - new Date(b.slot.start).getTime());
      return new Response(
        JSON.stringify({ ok: true, proposal: proposals[0].slot }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!slot) {
      return new Response(
        JSON.stringify({ error: "Missing slot confirmation data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const selectedCrew = crews.find((crew) => crew.id === slot.crewId);
    if (!selectedCrew) {
      return new Response(
        JSON.stringify({ error: "Crew not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const events = crewEventsMap[selectedCrew.id] || [];
    const proposedStart = new Date(slot.start);
    const verification = findSlot(selectedCrew, events, jobLengthMinutes, zipCode, proposedStart);

    if (!verification || verification.start !== slot.start) {
      return new Response(
        JSON.stringify({ error: "Slot no longer available", proposal: verification }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const startDate = new Date(slot.start);
    const endDate = addMinutes(startDate, jobLengthMinutes);

    const { data: inserted, error: insertError } = await supabase
      .from("crew_calendar")
      .insert({
        crew_id: selectedCrew.id,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        job_zip: zipCode,
        job_length_minutes: jobLengthMinutes,
        buffer_before_minutes: selectedCrew.default_buffer_before_minutes,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        buffer_after_minutes: selectedCrew.default_buffer_after_minutes,
        travel_minutes: verification.travelMinutesFromPrev + verification.travelMinutesToNext,
        status: "scheduled",
        title: `${serviceType} — ${name}`,
        notes,
        source: "smart-booking",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to insert crew calendar entry", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to secure slot" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (triageId) {
      try {
        await supabase
          .from("ai_triage_reports")
          .update({
            earliest_slot: startDate.toISOString(),
            crew_id: selectedCrew.id,
            crew_name: selectedCrew.name,
            travel_minutes: verification.travelMinutesFromPrev + verification.travelMinutesToNext,
          })
          .eq("id", triageId);
      } catch (updateError) {
        console.error("Failed to link triage record", updateError);
      }
    }

    if (Deno.env.get("RESEND_API_KEY")) {
      try {
        const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
        const ics = buildIcs(
          inserted.id,
          startDate,
          endDate,
          `Berman Electric — ${serviceType}`,
          `Client: ${name}\\nPhone: ${phone}\\nService: ${serviceType}\\nAddress ZIP: ${zipCode}\\nNotes: ${notes || "None"}`,
          zipCode
        );
        await resend.emails.send({
          from: Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>",
          to: [
            email,
            selectedCrew.email || "contact@bermanelectrical.com",
          ].filter(Boolean),
          subject: `Confirmed: ${serviceType} on ${formatHuman(slot.start)}`,
          html: `
            <p>Hi ${name.split(" ")[0]},</p>
            <p>Your visit is confirmed for <strong>${formatHuman(slot.start)}</strong> with our ${selectedCrew.name} team.</p>
            <ul>
              <li>Service: ${serviceType}</li>
              <li>Estimated on-site time: ${jobLengthMinutes} minutes</li>
              <li>Travel buffers: ${verification.travelMinutesFromPrev + verification.travelMinutesToNext} minutes total</li>
            </ul>
            <p>If anything changes, call us at <a href="tel:5163614068">516-361-4068</a>.</p>
            <p>— Berman Electric Dispatch</p>
          `,
          attachments: [
            {
              filename: "berman-electric-visit.ics",
              content: btoa(ics),
            },
          ],
        });
      } catch (emailError) {
        console.error("Failed to send calendar invite", emailError);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        bookingId: inserted.id,
        crewName: selectedCrew.name,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return handleError(error, "smart-booking", corsHeaders);
  }
};

serve(handler);
