import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface TrackingContext {
  sessionId?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  trackingNumber?: string;
  trackingId?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const addOnCatalog = new Map([
  ["surge_protection", { label: "Whole-home surge protection", cost: 375 }],
  ["generator_inlet", { label: "Generator inlet & interlock", cost: 450 }],
  ["ev_ready", { label: "EV charger circuit rough-in", cost: 525 }],
  ["smart_panel", { label: "Smart load monitoring", cost: 780 }],
]);

const requestSchema = z.object({
  amps: z.number().int().min(60).max(400),
  runLength: z.number().min(0).max(500),
  panelCapacity: z.number().int().min(6).max(84),
  addOns: z.array(z.string()).optional().default([]),
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().max(30).optional(),
  tracking: z
    .object({
      sessionId: z.string().trim().max(120).optional(),
      sourcePage: z.string().trim().max(200).optional(),
      utmSource: z.string().trim().max(120).optional(),
      utmMedium: z.string().trim().max(120).optional(),
      utmCampaign: z.string().trim().max(120).optional(),
      trackingNumber: z.string().trim().max(40).optional(),
      trackingId: z.string().trim().max(80).optional(),
    })
    .optional()
    .default({}),
});

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFrom = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";
const destinationEmails = (Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const crmWebhook = Deno.env.get("CRM_WEBHOOK_URL");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioFromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function roundCurrency(value: number): number {
  return Math.round(value / 5) * 5;
}

function calculateBaseLabor(amps: number): number {
  if (amps <= 100) return 1650;
  if (amps <= 150) return 1980;
  if (amps <= 200) return 2450;
  if (amps <= 300) return 3125;
  return 3680;
}

function runLengthCost(runLength: number, amps: number): number {
  const perFoot = amps > 200 ? 11.5 : amps >= 150 ? 8.75 : 7.5;
  return runLength * perFoot;
}

function panelCapacityCost(panelCapacity: number): number {
  const blocks = Math.ceil(panelCapacity / 8);
  return blocks * 140;
}

function buildPriceBands(basePrice: number) {
  return [
    {
      id: "conservative",
      label: "Essentials install",
      min: roundCurrency(basePrice * 0.92),
      max: roundCurrency(basePrice * 1.01),
      description: "Standard labor, permitting, and inspection scheduling included.",
    },
    {
      id: "standard",
      label: "Preferred install",
      min: roundCurrency(basePrice * 1.02),
      max: roundCurrency(basePrice * 1.15),
      description: "Includes copper upgrade, full panel labeling, and load balancing tune-up.",
    },
    {
      id: "priority",
      label: "Priority 10-day turnaround",
      min: roundCurrency(basePrice * 1.18),
      max: roundCurrency(basePrice * 1.32),
      description: "Expedited permitting, dedicated project manager, and weekend cut-over.",
    },
  ];
}

function determineCTA(amps: number, addOnKeys: string[]): string {
  if (addOnKeys.includes("ev_ready")) {
    return "Reserve your EV-ready panel upgrade walkthrough";
  }
  if (amps >= 200) {
    return "Book a 200A service upgrade site visit";
  }
  if (addOnKeys.includes("generator_inlet")) {
    return "Schedule a generator readiness consultation";
  }
  return "Lock in your electrical safety inspection";
}

function buildAddOnSummary(addOnKeys: string[]) {
  return addOnKeys
    .map((key) => {
      const addOn = addOnCatalog.get(key);
      if (!addOn) return null;
      return { id: key, label: addOn.label, cost: addOn.cost };
    })
    .filter(Boolean) as { id: string; label: string; cost: number }[];
}

async function logTrackingSession(tracking: TrackingContext) {
  if (!supabase || !tracking.sessionId || !tracking.trackingNumber) return;

  await supabase
    .from("quote_tracking_sessions")
    .upsert(
      {
        session_id: tracking.sessionId,
        tracking_number: tracking.trackingNumber,
        source_page: tracking.sourcePage || null,
        utm_source: tracking.utmSource || null,
        utm_medium: tracking.utmMedium || null,
        utm_campaign: tracking.utmCampaign || null,
      },
      { onConflict: "session_id" }
    );
}

async function logQuoteRequest(payload: {
  name?: string;
  email?: string;
  phone?: string;
  amps: number;
  runLength: number;
  panelCapacity: number;
  addOns: string[];
  tracking: TrackingContext;
  priceLow: number;
  priceHigh: number;
  priceBands: unknown;
  recommendedCta: string;
  crmResponse?: unknown;
  emailStatus?: unknown;
  smsStatus?: unknown;
}) {
  if (!supabase) return;

  await supabase.from("quote_requests").insert({
    name: payload.name || null,
    email: payload.email || null,
    phone: payload.phone || null,
    amps: payload.amps,
    run_length: payload.runLength,
    panel_capacity: payload.panelCapacity,
    add_ons: payload.addOns,
    price_low: payload.priceLow,
    price_high: payload.priceHigh,
    recommended_cta: payload.recommendedCta,
    price_bands: payload.priceBands,
    session_id: payload.tracking.sessionId || null,
    source_page: payload.tracking.sourcePage || null,
    utm_source: payload.tracking.utmSource || null,
    utm_medium: payload.tracking.utmMedium || null,
    utm_campaign: payload.tracking.utmCampaign || null,
    tracking_number: payload.tracking.trackingNumber || null,
    tracking_id: (payload.tracking as any)?.trackingId || null,
    crm_response: payload.crmResponse || null,
    email_status: payload.emailStatus || null,
    sms_status: payload.smsStatus || null,
  });
}

async function sendEmailSummary(args: {
  name?: string;
  email?: string;
  priceBands: ReturnType<typeof buildPriceBands>;
  recommendedCta: string;
  addOnSummary: ReturnType<typeof buildAddOnSummary>;
  amps: number;
  runLength: number;
  panelCapacity: number;
}) {
  if (!resend) return null;

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
      <h2>New Quote Engine Submission</h2>
      <p><strong>Name:</strong> ${args.name ? args.name : "Unknown"}</p>
      <p><strong>Email:</strong> ${args.email ? args.email : "Unknown"}</p>
      <p><strong>Service size:</strong> ${args.amps}A</p>
      <p><strong>Conduit run:</strong> ${args.runLength} ft</p>
      <p><strong>Panel capacity:</strong> ${args.panelCapacity} spaces</p>
      <p><strong>Recommended CTA:</strong> ${args.recommendedCta}</p>
      <h3>Price bands</h3>
      <ul>
        ${args.priceBands
          .map(
            (band) => `
              <li>
                <strong>${band.label}:</strong> $${band.min.toLocaleString()} - $${band.max.toLocaleString()}<br/>
                <em>${band.description}</em>
              </li>
            `
          )
          .join("")}
      </ul>
      <h3>Add-ons selected</h3>
      <ul>
        ${args.addOnSummary.length
          ? args.addOnSummary
              .map((addOn) => `<li>${addOn.label} (+$${addOn.cost})</li>`)
              .join("")
          : "<li>None</li>"}
      </ul>
    </div>
  `;

  return resend.emails.send({
    from: resendFrom,
    to: destinationEmails,
    subject: `Quote engine request — ${args.amps}A service`,
    html,
  });
}

async function notifyVisitorByEmail(args: {
  email?: string;
  name?: string;
  recommendedCta: string;
  priceBands: ReturnType<typeof buildPriceBands>;
}) {
  if (!resend || !args.email) return null;

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
      <h2>Your Berman Electric Estimate</h2>
      <p>Thanks${args.name ? `, ${args.name.split(" ")[0]}` : ""}! Here's what we project based on your inputs:</p>
      <ul>
        ${args.priceBands
          .map(
            (band) => `<li><strong>${band.label}:</strong> $${band.min.toLocaleString()} - $${band.max.toLocaleString()}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Next step:</strong> ${args.recommendedCta}</p>
      <p>Reply to this email or call us to lock in your preferred install window.</p>
    </div>
  `;

  return resend.emails.send({
    from: resendFrom,
    to: args.email,
    subject: "Your fast electrical estimate",
    html,
  });
}

async function notifyVisitorBySms(phone: string, message: string) {
  if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) return null;

  const body = new URLSearchParams({
    To: phone,
    From: twilioFromNumber,
    Body: message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
      },
      body,
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Failed to send SMS:", errText);
    return { error: errText };
  }

  return response.json();
}

async function forwardToCrm(payload: Record<string, unknown>) {
  if (!crmWebhook) return null;

  const response = await fetch(crmWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("CRM webhook failed:", err);
    return { error: err };
  }

  return response.json().catch(() => ({}));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid payload", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const { amps, runLength, panelCapacity, addOns, name, email, phone, tracking } = parsed.data;

    const baseLabor = calculateBaseLabor(amps);
    const runCost = runLengthCost(runLength, amps);
    const panelCost = panelCapacityCost(panelCapacity);
    const addOnSummary = buildAddOnSummary(addOns);
    const addOnTotal = addOnSummary.reduce((sum, item) => sum + item.cost, 0);
    const basePrice = baseLabor + runCost + panelCost + addOnTotal;

    const priceBands = buildPriceBands(basePrice);
    const priceLow = priceBands[0].min;
    const priceHigh = priceBands[priceBands.length - 1].max;
    const recommendedCta = determineCTA(amps, addOns);

    await logTrackingSession(tracking);

    const crmPayload = {
      type: "quote_request",
      name,
      email,
      phone,
      amps,
      runLength,
      panelCapacity,
      addOns: addOnSummary,
      priceBands,
      recommendedCta,
      tracking,
    };

    const [crmResponse, emailStatus, visitorEmailStatus, smsStatus] = await Promise.all([
      forwardToCrm(crmPayload),
      sendEmailSummary({
        name,
        email,
        amps,
        runLength,
        panelCapacity,
        addOnSummary,
        priceBands,
        recommendedCta,
      }),
      notifyVisitorByEmail({ email, name, priceBands, recommendedCta }),
      phone ? notifyVisitorBySms(phone, `Thanks for checking out Berman Electric. ${recommendedCta}. Reply to confirm a visit.`) : null,
    ]);

    await logQuoteRequest({
      name,
      email,
      phone,
      amps,
      runLength,
      panelCapacity,
      addOns,
      tracking,
      priceLow,
      priceHigh,
      priceBands,
      recommendedCta,
      crmResponse: crmResponse ?? null,
      emailStatus: emailStatus ?? visitorEmailStatus ?? null,
      smsStatus: smsStatus ?? null,
    });

    return new Response(
      JSON.stringify({
        priceBands,
        recommendedCta,
        addOns: addOnSummary,
        priceLow,
        priceHigh,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    console.error("Estimate function error", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
