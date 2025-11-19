import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { getSmtpSender } from "../_shared/smtp.ts";

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
    const smtp = getSmtpSender();
    const destEmail = Deno.env.get("DEST_EMAIL") || "Rob@bermanelectrical.com";
    const fromEmail = Deno.env.get("HOSTINGER_SMTP_USER") || "contact@bermanelectrical.com";

    const body = await req.json();
    const parsed = approveEstimateSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { estimateId, name, email, upsells } = parsed.data;
    
    const dest = destEmail.split(",").map((s) => s.trim()).filter(Boolean);
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

    const emailResponse = await smtp.send({
      from: fromEmail,
      to: dest,
      subject,
      html,
      replyTo: email,
    });

    if (!emailResponse.success) {
      console.error("Email send error:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailResponse.error }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Estimate approval email sent successfully");

    // Forward to Google Sheet webhook (fire and forget)
    const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "estimate_approved",
            estimateId,
            name,
            email,
            upsells,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Webhook error (non-blocking):", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Estimate approval recorded" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-estimate-approve:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
