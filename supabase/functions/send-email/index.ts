import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: EmailRequest = await req.json();
    
    console.log("Sending email for:", { name, email, service });

    // Send notification to business
    const { data: businessData, error: businessError } = await resend.emails.send({
      from: Deno.env.get("RESEND_FROM") || "Berman Electric <onboarding@resend.dev>",
      to: "contact@bermanelectrical.com",
      replyTo: email,
      subject: `New Contact: ${name} - ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (businessError) {
      console.error("Business notification error:", businessError);
      throw businessError;
    }

    console.log("Business notification sent. ID:", businessData?.id);

    // Send confirmation to customer
    const { data: confirmData, error: confirmError } = await resend.emails.send({
      from: Deno.env.get("RESEND_FROM") || "Berman Electric <onboarding@resend.dev>",
      to: email,
      subject: "We received your request",
      html: `
        <h2>Thank you for contacting Berman Electric</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your request details:</strong></p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br>
        <p>Best regards,<br>Berman Electric Team</p>
      `,
    });

    if (confirmError) {
      console.error("Customer confirmation error:", confirmError);
      // Don't throw - business notification already sent
    } else {
      console.log("Customer confirmation sent. ID:", confirmData?.id);
    }

    return new Response(
      JSON.stringify({ success: true, businessEmailId: businessData?.id, confirmEmailId: confirmData?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);
