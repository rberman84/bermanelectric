import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean | null>;
}

interface AnalyticsRequestBody {
  client_id?: string;
  user_id?: string;
  user_properties?: Record<string, { value: string | number | boolean }>;
  events?: AnalyticsEvent[];
  non_personalized_ads?: boolean;
}

const MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");
const API_SECRET = Deno.env.get("GA4_API_SECRET");

if (!MEASUREMENT_ID || !API_SECRET) {
  console.warn("GA4 measurement environment variables are not fully configured.");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!MEASUREMENT_ID || !API_SECRET) {
    return new Response(JSON.stringify({ error: "Analytics service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as AnalyticsRequestBody;

    if (!body?.client_id || !Array.isArray(body?.events) || body.events.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: client_id and at least one event are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const endpoint =
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

    const gaPayload = {
      client_id: body.client_id,
      user_id: body.user_id,
      non_personalized_ads: body.non_personalized_ads ?? false,
      events: body.events.map((event) => ({
        name: event.name,
        params: sanitizeParams(event.params),
      })),
      user_properties: sanitizeUserProperties(body.user_properties),
    };

    const gaResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gaPayload),
    });

    if (!gaResponse.ok) {
      const errorBody = await gaResponse.text();
      console.error("GA4 measurement protocol error", {
        status: gaResponse.status,
        response: errorBody,
      });

      return new Response(
        JSON.stringify({ error: "Failed to forward analytics event" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error while forwarding analytics", error);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const sanitizeParams = (
  params: Record<string, string | number | boolean | null | undefined> | undefined,
) => {
  if (!params) return undefined;
  const sanitized: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "number" && !Number.isFinite(value)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    }
  }
  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
};

const sanitizeUserProperties = (
  properties: Record<string, { value: string | number | boolean | null | undefined }> | undefined,
) => {
  if (!properties) return undefined;
  const sanitized: Record<string, { value: string | number | boolean }> = {};
  for (const [key, prop] of Object.entries(properties)) {
    if (!prop) continue;
    const value = prop.value;
    if (value === undefined || value === null) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = { value };
    }
  }
  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
};

serve(handler);
