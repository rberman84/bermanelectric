
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: ContactFormData = await req.json();

    // Send email to business
    const businessEmailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "info@bermanelectric.com", // Replace with your actual business email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Needed:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Berman Electric <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Berman Electric",
      html: `
        <h2>Thank you for contacting Berman Electric</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding ${service} services. Our team will review your request and get back to you within 24 hours.</p>
        <p>Here's a summary of your request:</p>
        <ul>
          <li>Service Needed: ${service}</li>
          <li>Message: ${message}</li>
        </ul>
        <p>If you need immediate assistance, please call us at (516) 123-4567.</p>
        <p>Best regards,<br>The Berman Electric Team</p>
      `,
    });

    console.log("Emails sent successfully:", {
      business: businessEmailResponse,
      customer: customerEmailResponse
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
