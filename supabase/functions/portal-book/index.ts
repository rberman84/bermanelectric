import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const bookServiceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  serviceType: z.string().trim().min(1).max(100),
  preferredDate: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  membership: z.boolean().optional(),
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

    const parsed = bookServiceSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, phone, address, serviceType, preferredDate, notes, membership } = parsed.data;
    
    const dest = (Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const FROM = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";
    const subject = `Service Booking: ${serviceType} — ${name}`;
    
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
        <h2>New Service Booking Request</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
        ${address ? `<p><b>Address:</b> ${escapeHtml(address)}</p>` : ""}
        <p><b>Service Type:</b> ${escapeHtml(serviceType)}</p>
        ${preferredDate ? `<p><b>Preferred Date:</b> ${escapeHtml(preferredDate)}</p>` : ""}
        ${membership ? `<p><b>Berman Plus Membership:</b> ✅ YES - $19/month (Priority scheduling, annual safety check, 10% off service calls)</p>` : ""}
        ${notes ? `<p><b>Notes:</b><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>` : ""}
      </div>
    `;

    console.log("Sending service booking email:", { name, email, serviceType });

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

    console.log("Service booking email sent successfully:", emailResponse);

    // Send confirmation email to customer
    const customerHtml = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
        <h2>Thanks, ${escapeHtml(name)} — we've got it.</h2>
        <p>We received your request for <b>${escapeHtml(serviceType)}</b>${preferredDate ? ` on ${escapeHtml(preferredDate)}` : ''}.</p>
        
        <h3 style="margin-top:24px;color:#16a34a">What to do before we arrive:</h3>
        <ol style="margin-top:10px;padding-left:20px">
          <li style="margin-bottom:8px">Clear access to electrical panel and work area</li>
          <li style="margin-bottom:8px">Secure pets in a separate room</li>
          <li style="margin-bottom:8px">Have photos or notes about the issue ready</li>
        </ol>
        
        <p style="margin-top:24px;padding:15px;background:#f3f4f6;border-left:4px solid #16a34a">
          <b>Questions?</b> Call us at <a href="tel:5163614068">516-361-4068</a> or reply to this email.
        </p>
        
        <p style="margin-top:20px;color:#6b7280;font-size:14px">
          — The Berman Electric Team
        </p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: FROM,
        to: [email],
        subject: `We got your request: ${serviceType}`,
        html: customerHtml,
        reply_to: Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com",
      });
      console.log("Customer confirmation email sent");
    } catch (confirmError) {
      console.error("Failed to send customer confirmation:", confirmError);
      // Don't fail the request if customer email fails
    }

    // Forward to Google Sheet webhook (fire and forget)
    const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "book",
            name,
            email,
            phone: phone || "",
            address: address || "",
            service: serviceType,
            preferredDate: preferredDate || "",
            membership: membership || false,
            notes: notes || "",
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("Forwarded booking to Google Sheet webhook");
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
    console.error("Error in portal-book function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
