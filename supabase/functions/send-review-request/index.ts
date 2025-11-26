import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getReliabilityManager } from "../_shared/delivery.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewRequestPayload {
  serviceRequestId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { serviceRequestId }: ReviewRequestPayload = await req.json();
    console.log("Processing review request for service:", serviceRequestId);

    // Get service request details
    const { data: serviceRequest, error: serviceError } = await supabaseAdmin
      .from("service_requests")
      .select(`
        *,
        profiles:user_id (
          display_name
        )
      `)
      .eq("id", serviceRequestId)
      .single();

    if (serviceError || !serviceRequest) {
      throw new Error(`Service request not found: ${serviceError?.message}`);
    }

    // Update service request with review_requested_at timestamp
    await supabaseAdmin
      .from("service_requests")
      .update({ review_requested_at: new Date().toISOString() })
      .eq("id", serviceRequestId);

    // Get user email
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      serviceRequest.user_id
    );

    if (userError || !user?.email) {
      throw new Error(`User not found: ${userError?.message}`);
    }

    const reviewUrl = `${Deno.env.get("SUPABASE_URL").replace(".supabase.co", ".lovable.app")}/review/${serviceRequestId}`;
    const customerName = serviceRequest.profiles?.display_name || "Valued Customer";

    const manager = getReliabilityManager();
    const fromEmail = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You, ${customerName}!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              We recently completed your <strong>${serviceRequest.service_type}</strong> service, and we hope everything met your expectations!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Your feedback helps us improve and helps other homeowners in ${serviceRequest.address?.split(',')[1]?.trim() || 'Long Island'} make informed decisions when choosing an electrician.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${reviewUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px;">
                Share Your Experience
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
              It only takes a minute and means the world to our small business
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #4b5563;">
                <strong>Need something?</strong> We're here to help! Contact us anytime at <a href="tel:+15163614068" style="color: #1e40af;">(516) 361-4068</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailOutcome = await manager.deliver({
      jobType: "review_request",
      resendPayload: {
        from: fromEmail,
        to: [user.email],
        subject: `Thanks for choosing Berman Electric! Share your experience`,
        html: emailHtml,
      },
      metadata: {
        type: "review_request",
        serviceRequestId,
        customerEmail: user.email,
      },
      description: `Review request email to ${customerName} for ${serviceRequest.service_type}`,
    });

    console.log("Review request email outcome:", emailOutcome);

    if (emailOutcome.status !== "sent" && emailOutcome.status !== "queued") {
      throw new Error(`Failed to send email: ${emailOutcome.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Review request sent successfully" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending review request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
