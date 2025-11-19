import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getSmtpSender } from "../_shared/smtp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormEmail {
  type: "contact_form";
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ServiceRequestEmail {
  type: "service_request";
  name: string;
  email: string;
  phone: string;
  service: string;
  address: string;
  preferredDate?: string;
  description: string;
}

type EmailRequest = ContactFormEmail | ServiceRequestEmail;

function buildResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return buildResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const smtp = getSmtpSender();
    const fromEmail = Deno.env.get("HOSTINGER_SMTP_USER") || "contact@bermanelectrical.com";

    const emailData: EmailRequest = await req.json();

    if (emailData.type === "contact_form") {
      const { name, email, phone, service, message } = emailData;

      const businessHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;

      const customerHtml = `
        <h2>Thank you for contacting Berman Electric</h2>
        <p>Hi ${name},</p>
        <p>We've received your inquiry about ${service} and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>Berman Electric Team</p>
        <p>📞 (516) 361-4068</p>
      `;

      console.log("Sending contact form emails...");
      const [businessResult, customerResult] = await Promise.all([
        smtp.send({
          from: fromEmail,
          to: "Rob@bermanelectrical.com",
          subject: `New Contact Form: ${service}`,
          html: businessHtml,
        }),
        smtp.send({
          from: fromEmail,
          to: email,
          subject: "Thank you for contacting Berman Electric",
          html: customerHtml,
        }),
      ]);

      console.log("Business email result:", businessResult);
      console.log("Customer email result:", customerResult);

      return buildResponse({
        success: businessResult.success && customerResult.success,
        businessEmail: businessResult.success ? "sent" : "failed",
        customerEmail: customerResult.success ? "sent" : "failed",
      });
    }

    if (emailData.type === "service_request") {
      const { name, email, phone, service, address, preferredDate, description } = emailData;

      const businessHtml = `
        <h2>New Service Request</h2>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate || "Not specified"}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `;

      const customerHtml = `
        <h2>Service Request Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for choosing Berman Electric! We've received your service request for ${service}.</p>
        <p><strong>Your details:</strong></p>
        <ul>
          <li>Address: ${address}</li>
          <li>Preferred Date: ${preferredDate || "To be scheduled"}</li>
          <li>Description: ${description}</li>
        </ul>
        <p>We'll contact you shortly to confirm the appointment.</p>
        <br>
        <p>Best regards,<br>Berman Electric Team</p>
        <p>📞 (516) 361-4068</p>
      `;

      console.log("Sending service request emails...");
      const [businessResult, customerResult] = await Promise.all([
        smtp.send({
          from: fromEmail,
          to: "Rob@bermanelectrical.com",
          subject: `New Service Request: ${service}`,
          html: businessHtml,
        }),
        smtp.send({
          from: fromEmail,
          to: email,
          subject: "Service Request Received - Berman Electric",
          html: customerHtml,
        }),
      ]);

      console.log("Business email result:", businessResult);
      console.log("Customer email result:", customerResult);

      return buildResponse({
        success: businessResult.success && customerResult.success,
        businessEmail: businessResult.success ? "sent" : "failed",
        customerEmail: customerResult.success ? "sent" : "failed",
      });
    }

    return buildResponse({ error: "Invalid email type" }, 400);
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return buildResponse({ error: error.message }, 500);
  }
};

serve(handler);
