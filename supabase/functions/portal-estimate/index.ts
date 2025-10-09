import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { extractZip, scoreLead } from "../_shared/leadScoring.ts";

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
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, phone, address, projectType, budgetRange, timeline, notes } = parsed.data;

    const zip = extractZip(address);
    const leadScore = scoreLead({
      zip,
      queryIntent: "estimate",
      serviceCategory: projectType,
      notes,
      budgetRange,
    });

    const routingActions: string[] = [];

    const triggerRouting = async () => {
      if (leadScore.route === "phone_sms") {
        const phoneWebhook = Deno.env.get("A_LEAD_PHONE_WEBHOOK_URL");
        if (phoneWebhook) {
          try {
            await fetch(phoneWebhook, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                phone: phone || "",
                projectType,
                score: leadScore.score,
                tier: leadScore.tier,
              }),
            });
            routingActions.push("phone_webhook");
          } catch (phoneError) {
            console.error("Failed to trigger phone webhook", phoneError);
          }
        }

        const smsWebhook = Deno.env.get("A_LEAD_SMS_WEBHOOK_URL");
        if (smsWebhook && phone) {
          try {
            await fetch(smsWebhook, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone,
                message: `A-lead estimate: ${name} for ${projectType}. Score ${leadScore.score}.`,
              }),
            });
            routingActions.push("sms_webhook");
          } catch (smsError) {
            console.error("Failed to trigger SMS webhook", smsError);
          }
        }
      } else {
        if (email) {
          try {
            await resend.emails.send({
              from: FROM,
              to: [email],
              subject: `Next steps for your ${projectType} estimate`,
              html: `
                <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
                  <h2>Thanks for the details, ${escapeHtml(name)}.</h2>
                  <p>Our estimators are reviewing your ${escapeHtml(projectType)} project.</p>
                  ${budgetRange ? `<p>We noted your budget at <b>${escapeHtml(budgetRange)}</b>.</p>` : ""}
                  <p style="margin-top:18px;color:#6b7280;font-size:14px">Expect a reply with next steps within one business day.</p>
                </div>
              `,
            });
            routingActions.push("email_drip");
          } catch (dripError) {
            console.error("Failed to send estimate drip email", dripError);
          }
        }
      }
    };
    
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
        <p style="margin-top:24px;padding:15px;background:#f4f4f5;border-radius:8px">
          <b>Lead Score:</b> ${leadScore.score} (${leadScore.tier}-lead → ${leadScore.route === "phone_sms" ? "Phone + SMS" : "Email drip"})<br />
          <span style="font-size:14px;color:#6b7280">Zip: ${zip || "n/a"} • Intent: estimate • Job size bonus: ${leadScore.breakdown.jobSize}</span>
        </p>
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

    await triggerRouting();

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
            score: leadScore.score,
            tier: leadScore.tier,
            route: leadScore.route,
            routingActions: routingActions.join("|"),
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
      JSON.stringify({ ok: true, id: (emailResponse as any)?.data?.id, score: leadScore.score, route: leadScore.route, tier: leadScore.tier, routingActions }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-estimate function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
