import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { getSmtpSender } from "../_shared/smtp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const jobCompleteSchema = z.object({
  jobId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  service: z.string().trim().max(100).optional(),
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
    const fromEmail = Deno.env.get("HOSTINGER_SMTP_USER") || "contact@bermanelectrical.com";

    const body = await req.json();
    const parsed = jobCompleteSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { jobId, name, email, service } = parsed.data;
    
    // TODO: Replace with actual Google review link
    const reviewUrl = "https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_REVIEW_LINK/review";
    
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
        <h2>Thanks, ${escapeHtml(name)}!</h2>
        <p>We just completed your ${service ? escapeHtml(service) : 'service'} and hope everything looks great.</p>
        
        <h3 style="margin-top:24px;color:#16a34a">How did we do?</h3>
        <p>Your feedback helps neighbors choose the right electrician.</p>
        
        <p style="margin-top:20px">
          <a href="${reviewUrl}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600">
            Leave a quick Google review
          </a>
        </p>
        
        <p style="margin-top:24px;font-size:14px;color:#6b7280">
          Takes 30 seconds and makes a huge difference for us.
        </p>
        
        <p style="margin-top:24px;padding:15px;background:#f3f4f6;border-left:4px solid #16a34a">
          <b>Something not perfect?</b> Reply to this email and we'll make it right immediately.
        </p>
        
        <p style="margin-top:20px;color:#6b7280;font-size:14px">
          — The Berman Electric Team<br>
          <a href="tel:5163614068" style="color:#16a34a">516-361-4068</a>
        </p>
      </div>
    `;

    console.log("Sending job completion review request:", { jobId, name, email, service });

    const emailResponse = await smtp.send({
      from: fromEmail,
      to: email,
      subject: `How did we do on your ${service || 'service'}?`,
      html,
      replyTo: Deno.env.get("DEST_EMAIL") || "contact@bermanelectrical.com",
    });

    if (!emailResponse.success) {
      console.error("Email send error:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailResponse.error }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Job completion email sent successfully");

    // Forward to Google Sheet webhook (fire and forget)
    const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "job_complete",
            jobId,
            name,
            email,
            service,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Webhook error (non-blocking):", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Review request sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-job-complete:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
