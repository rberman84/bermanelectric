import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_FROM") || "Berman Electric <noreply@bermanelectrical.com>",
        to: [user.email],
        subject: "How did we do? Share your experience with Berman Electric",
        html: `
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
                  <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Leave a Review
                  </a>
                </div>
                
                <div style="background: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #666;">
                    <strong>Your review takes just 2 minutes</strong> and you can optionally include photos of the completed work.
                  </p>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  Best regards,<br>
                  <strong>Rob Berman & The Berman Electric Team</strong><br>
                  📞 (516) 361-4068
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                <p>Berman Electric - Licensed & Insured Electrician serving Nassau & Suffolk County</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Review request email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Review request sent successfully",
        emailId: emailResult.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending review request:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});