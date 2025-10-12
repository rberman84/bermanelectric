import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { checkRateLimit, getClientIP, rateLimitErrorResponse, RATE_LIMITS } from "../_shared/rateLimit.ts";
import { handleError, handleValidationError, ErrorCode } from "../_shared/errorHandler.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const estimateRequestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  projectType: z.string().trim().min(1).max(100),
  budgetRange: z.string().trim().max(50).optional().or(z.literal("")),
  timeline: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  _hp: z.string().optional(), // Honeypot field
});

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMITS.ESTIMATE);
  
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
    if (!Deno.env.get("RESEND_API_KEY")) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    
    // Check honeypot - if filled, it's a bot
    if (body._hp) {
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parsed = estimateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return handleValidationError(parsed.error, "portal-estimate", corsHeaders);
    }

    const { name, email, phone, address, projectType, budgetRange, timeline, notes } = parsed.data;
    
    const dest = (Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const FROM = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";
    const subject = `Estimate Request: ${projectType} — ${name}`;
    
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
        <h2>New Estimate Request</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
        ${address ? `<p><b>Address:</b> ${escapeHtml(address)}</p>` : ""}
        <p><b>Project Type:</b> ${escapeHtml(projectType)}</p>
        ${budgetRange ? `<p><b>Budget:</b> ${escapeHtml(budgetRange)}</p>` : ""}
        ${timeline ? `<p><b>Timeline:</b> ${escapeHtml(timeline)}</p>` : ""}
        ${notes ? `<p><b>Notes:</b><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>` : ""}
      </div>
    `;

    console.log("Sending estimate request email:", { name, email, projectType });

    const emailResponse = await resend.emails.send({
      from: FROM,
      to: dest,
      subject,
      html,
      reply_to: email,
    });

    const emailError = (emailResponse as any)?.error;
    if (emailError) {
      console.error("Email send error:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Estimate request email sent successfully:", emailResponse);

    // Forward to Google Sheet webhook (fire and forget)
    const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "estimate",
            name,
            email,
            phone: phone || "",
            address: address || "",
            projectType,
            budgetRange: budgetRange || "",
            timeline: timeline || "",
            notes: notes || "",
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("Forwarded estimate request to Google Sheet webhook");
      } catch (webhookError) {
        // Don't fail the request if webhook fails
        console.error("Failed to forward to webhook:", webhookError);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, id: (emailResponse as any)?.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return handleError(error, "portal-estimate", corsHeaders);
  }
};

serve(handler);
