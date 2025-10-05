import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormEmail {
  type: "contact";
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ServiceRequestEmail {
  type: "service-request";
  customerName: string;
  customerEmail: string;
  phone: string;
  serviceType: string;
  description: string;
  address: string;
  preferredDate?: string;
  membership?: boolean;
}

type EmailRequest = ContactFormEmail | ServiceRequestEmail;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();
    
    console.log("Processing email request:", emailData.type);

    const businessEmail = "contact@bermanelectrical.com";
    const fromEmail = Deno.env.get("RESEND_FROM") || "Berman Electric <onboarding@resend.dev>";

    if (emailData.type === "contact") {
      // Handle contact form submission
      const { name, email, phone, service, message } = emailData;

      // Send notification to business
      const { data: businessData, error: businessError } = await resend.emails.send({
        from: fromEmail,
        to: businessEmail,
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
        from: fromEmail,
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
      } else {
        console.log("Customer confirmation sent. ID:", confirmData?.id);
      }

      return new Response(
        JSON.stringify({ success: true, businessEmailId: businessData?.id, confirmEmailId: confirmData?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );

    } else if (emailData.type === "service-request") {
      // Handle service request from dashboard
      const { customerName, customerEmail, phone, serviceType, description, address, preferredDate, membership } = emailData;

      // Send notification to business
      const { data: businessData, error: businessError } = await resend.emails.send({
        from: fromEmail,
        to: businessEmail,
        replyTo: customerEmail,
        subject: `New Service Request: ${serviceType} - ${customerName}`,
        html: `
          <h2>New Service Request</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Address:</strong> ${address}</p>
          ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
          ${membership ? `<p><strong>⭐ Membership Requested</strong></p>` : ''}
          <p><strong>Description:</strong></p>
          <p>${description}</p>
        `,
      });

      if (businessError) {
        console.error("Business notification error:", businessError);
        throw businessError;
      }

      console.log("Service request notification sent. ID:", businessData?.id);

      // Send confirmation to customer
      const { data: confirmData, error: confirmError } = await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: "Service Request Received",
        html: `
          <h2>Thank you for your service request</h2>
          <p>Hi ${customerName},</p>
          <p>We've received your service request and will contact you shortly to schedule your appointment.</p>
          <p><strong>Request details:</strong></p>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Address:</strong> ${address}</p>
          ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
          ${membership ? `<p><strong>Membership:</strong> You've requested to join our maintenance membership program. We'll include details in our follow-up.</p>` : ''}
          <br>
          <p>Best regards,<br>Berman Electric Team</p>
        `,
      });

      if (confirmError) {
        console.error("Customer confirmation error:", confirmError);
      } else {
        console.log("Customer confirmation sent. ID:", confirmData?.id);
      }

      return new Response(
        JSON.stringify({ success: true, businessEmailId: businessData?.id, confirmEmailId: confirmData?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      throw new Error("Invalid email type");
    }

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);
