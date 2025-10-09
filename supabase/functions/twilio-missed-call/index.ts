import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioFromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

function parseForm(body: string): Record<string, string> {
  const params = new URLSearchParams(body);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

async function sendFollowUpSms(to: string) {
  if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) return null;

  const body = new URLSearchParams({
    To: to,
    From: twilioFromNumber,
    Body: "Want a fast estimate? Reply YES.",
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
    const text = await response.text();
    console.error("Failed to send follow-up SMS:", text);
    return { error: text };
  }

  return response.json();
}

async function recordCallEvent(payload: {
  callSid: string;
  from: string;
  to: string;
  status: string;
  duration?: number;
  trackingNumber?: string;
  sessionId?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, unknown>;
  autoSmsSent: boolean;
}) {
  if (!supabase) return;

  await supabase.from("call_events").insert({
    call_sid: payload.callSid,
    from_number: payload.from,
    to_number: payload.to,
    status: payload.status,
    duration: payload.duration ?? null,
    tracking_number: payload.trackingNumber ?? null,
    session_id: payload.sessionId ?? null,
    source_page: payload.sourcePage ?? null,
    utm_source: payload.utmSource ?? null,
    utm_medium: payload.utmMedium ?? null,
    utm_campaign: payload.utmCampaign ?? null,
    metadata: payload.metadata ?? null,
    auto_sms_sent: payload.autoSmsSent,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const textBody = await req.text();
    const data = parseForm(textBody);

    const callStatus = data["CallStatus"] || "unknown";
    const callSid = data["CallSid"] || crypto.randomUUID();
    const from = data["From"] || "";
    const to = data["To"] || "";
    const duration = data["CallDuration"] ? Number(data["CallDuration"]) : undefined;
    const ringingDuration = data["DialCallDuration"] ? Number(data["DialCallDuration"]) : undefined;
    const noAnswerDuration = ringingDuration ?? duration ?? 0;

    const wasMissed = ["no-answer", "busy", "failed"].includes(callStatus) || noAnswerDuration < 20;

    let smsResponse: unknown = null;
    if (wasMissed && from) {
      smsResponse = await sendFollowUpSms(from);
    }

    await recordCallEvent({
      callSid,
      from,
      to,
      status: callStatus,
      duration,
      autoSmsSent: !!smsResponse,
      trackingNumber: data["TrackingNumber"] || undefined,
      sessionId: data["SessionId"] || undefined,
      sourcePage: data["SourcePage"] || undefined,
      utmSource: data["UtmSource"] || undefined,
      utmMedium: data["UtmMedium"] || undefined,
      utmCampaign: data["UtmCampaign"] || undefined,
      metadata: data,
    });

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>\n<Response></Response>`;

    return new Response(xmlResponse, {
      status: 200,
      headers: { "Content-Type": "text/xml", ...corsHeaders },
    });
  } catch (error) {
    console.error("Twilio webhook error", error);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
});
