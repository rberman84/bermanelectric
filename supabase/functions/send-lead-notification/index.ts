import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getReliabilityManager } from "../_shared/delivery.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  lead: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip: string;
    preferred_contact_method: string;
    job_type: string;
    job_priority: string;
    job_description: string;
    budget_range?: string;
    access_notes?: string;
  };
  mediaUrls: string[];
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

  try {
    const manager = getReliabilityManager();
    const fromEmail = Deno.env.get("HOSTINGER_SMTP_USER") || "contact@bermanelectrical.com";
    
    const { lead, mediaUrls }: LeadNotificationRequest = await req.json();

    const priorityLabels = {
      emergency: "🚨 EMERGENCY (Today/24 hours)",
      soon: "⚡ Soon (1-3 days)",
      flexible: "📅 Flexible"
    };

    const contactMethodLabels = {
      call: "📞 Call",
      text: "💬 Text",
      email: "📧 Email"
    };

    const fullAddress = [
      lead.address_line1,
      lead.address_line2,
      `${lead.city}, ${lead.state} ${lead.zip}`
    ].filter(Boolean).join("<br>");

    const mediaSection = mediaUrls.length > 0
      ? `
        <h3>Uploaded Files (${mediaUrls.length}):</h3>
        <ul>
          ${mediaUrls.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}
        </ul>
      `
      : '<p><em>No files uploaded</em></p>';

    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d; border-bottom: 3px solid #3182ce; padding-bottom: 10px;">
          🔔 New Thumbtack Lead
        </h1>
        
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2d3748; margin-top: 0;">Priority: ${priorityLabels[lead.job_priority as keyof typeof priorityLabels]}</h2>
          <p style="font-size: 18px; color: #1a365d; margin: 5px 0;"><strong>${lead.job_type}</strong></p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Contact Information</h3>
          <p><strong>Name:</strong> ${lead.full_name}</p>
          <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
          ${lead.email ? `<p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>` : ''}
          <p><strong>Preferred Contact:</strong> ${contactMethodLabels[lead.preferred_contact_method as keyof typeof contactMethodLabels]}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Location</h3>
          <p>${fullAddress}</p>
          ${lead.access_notes ? `
            <div style="background-color: #fff5f5; padding: 10px; border-left: 4px solid #fc8181; margin-top: 10px;">
              <strong>Access Notes:</strong><br>
              ${lead.access_notes}
            </div>
          ` : ''}
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Job Details</h3>
          <p><strong>Description:</strong></p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; white-space: pre-wrap;">
${lead.job_description}
          </div>
          ${lead.budget_range ? `<p style="margin-top: 15px;"><strong>Budget Range:</strong> ${lead.budget_range}</p>` : ''}
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Media Files</h3>
          ${mediaSection}
        </div>

        <div style="background-color: #edf2f7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #4a5568;">
            <strong>Lead ID:</strong> ${lead.id}
          </p>
        </div>
      </div>
    `;

    console.log("Sending lead notification email...");

    const outcome = await manager.deliver({
      jobType: "lead_notification",
      resendPayload: {
        from: fromEmail,
        to: ["Rob@bermanelectrical.com"],
        subject: `New Thumbtack Lead – ${lead.full_name} – ${lead.job_type}`,
        html: businessHtml,
      },
      metadata: {
        type: "lead_notification",
        lead_id: lead.id,
        job_type: lead.job_type,
        priority: lead.job_priority,
      },
      description: `Lead notification for ${lead.full_name} - ${lead.job_type}`,
    });

    console.log("Email outcome:", outcome);

    const success = outcome.status === "sent" || outcome.status === "queued";

    return new Response(
      JSON.stringify({
        success,
        status: outcome.status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);