import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY") || "";
  const domainId = Deno.env.get("RESEND_DOMAIN_ID") || ""; // optional
  const fromExample = Deno.env.get("RESEND_FROM") || "contact@bermanelectrical.com";

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const base = {
    env_HAS_RESEND_API_KEY: Boolean(apiKey),
    fromConfiguredExample: fromExample,
    tip: "From must match a verified domain in Resend.",
  };

  // If no key, just return basic info
  if (!apiKey) {
    return new Response(
      JSON.stringify(base, null, 2),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // If no domain id, return a helpful note
  if (!domainId) {
    return new Response(
      JSON.stringify({ ...base, note: "Set RESEND_DOMAIN_ID secret to fetch domain status" }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const r = await fetch(`https://api.resend.com/domains/${domainId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await r.json();
    return new Response(
      JSON.stringify({ ...base, ok: r.ok, status: r.status, domain: data }, null, 2),
      { status: r.ok ? 200 : r.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("resend-status error:", error);
    return new Response(
      JSON.stringify({ ...base, error: error?.message ?? "Unknown error" }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});