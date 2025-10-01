import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const approveEstimateSchema = z.object({
  estimateId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  upsells: z.array(z.string()).optional(),
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
    const parsed = approveEstimateSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { estimateId, name, email, upsells } = parsed.data;
    
    const dest = (Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const FROM = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";
    const subject = `Estimate Approved: ${estimateId} — ${name}`;
    
    const upsellsSection = upsells && upsells.length > 0 
      ? `<h3 style="margin-top:20px;color:#16a34a">✅ Selected Add-ons:</h3>
         <ul style="margin-top:10px">
           ${upsells.map(u => `<li>${escapeHtml(u)}</li>`).join("")}
         </ul>`
      : "";
    
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
        <h2 style="color:#16a34a">✅ Estimate Approved</h2>
        <p><b>Estimate ID:</b> ${escapeHtml(estimateId)}</p>
        <p><b>Customer Name:</b> ${escapeHtml(name)}</p>
        <p><b>Customer Email:</b> ${escapeHtml(email)}</p>
        ${upsellsSection}
        <p style="margin-top:20px;padding:15px;background:#f3f4f6;border-left:4px solid #16a34a">
          <b>Next Steps:</b> Contact customer to schedule the approved work.
        </p>
      </div>
    `;

    console.log("Sending estimate approval email:", { estimateId, name, email, upsells: upsells?.length || 0 });

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

    console.log("Estimate approval email sent successfully:", emailResponse);

    // Forward to Google Sheet webhook (fire and forget)
    const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "estimate_approval",
            estimateId,
            name,
            email,
            upsells: upsells || [],
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("Forwarded estimate approval to Google Sheet webhook");
      } catch (webhookError) {
        console.error("Failed to forward to webhook:", webhookError);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, id: (emailResponse as any)?.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-estimate-approve function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
