import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getProviders, getReliabilityManager } from "../_shared/delivery.ts";

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

const providers = getProviders();
const reliabilityManager = getReliabilityManager();

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

  if (providers.length === 0) {
    return buildResponse({ error: "Email service not configured" }, 503);
  }

  try {
    const emailData: EmailRequest = await req.json();
    const requestId = crypto.randomUUID();
    const businessEmail = "contact@bermanelectrical.com";
    const fromEmail = Deno.env.get("RESEND_FROM") || "Berman Electric <onboarding@resend.dev>";

    if (emailData.type === "contact") {
      const { name, email, phone, service, message } = emailData;

      const businessPayload = {
        from: fromEmail,
        to: businessEmail,
        reply_to: email,
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
      } as Record<string, unknown>;

      const businessDelivery = await reliabilityManager.deliver({
        jobType: "contact-business",
        resendPayload: businessPayload,
        metadata: {
          requestId,
          leadType: "contact",
          customerEmail: email,
          customerName: name,
          phone,
        },
        description: `Contact lead from ${name}`,
        priority: 10,
        alertMessage: `Contact lead from ${name} could not be emailed. Check queue immediately.`,
        notifyOwner: true,
      });

      const customerPayload = {
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
      } as Record<string, unknown>;

      const confirmationDelivery = await reliabilityManager.deliver({
        jobType: "contact-customer",
        resendPayload: customerPayload,
        metadata: {
          requestId,
          leadType: "contact",
          customerEmail: email,
          customerName: name,
        },
        description: `Contact confirmation for ${email}`,
        notifyOwner: false,
      });

      const status = businessDelivery.status === "sent" ? 200 : 202;
      return buildResponse(
        {
          success: businessDelivery.status === "sent",
          business: businessDelivery,
          confirmation: confirmationDelivery,
          requestId,
        },
        status,
      );
    }

    if (emailData.type === "service-request") {
      const { customerName, customerEmail, phone, serviceType, description, address, preferredDate, membership } =
        emailData;

      const businessPayload = {
        from: fromEmail,
        to: businessEmail,
        reply_to: customerEmail,
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
      } as Record<string, unknown>;

      const businessDelivery = await reliabilityManager.deliver({
        jobType: "service-request-business",
        resendPayload: businessPayload,
        metadata: {
          requestId,
          leadType: "service-request",
          customerEmail,
          customerName,
          phone,
          membership: Boolean(membership),
        },
        description: `Service request from ${customerName}`,
        priority: 10,
        alertMessage: `Service request from ${customerName} could not be emailed. Check queue immediately.`,
        notifyOwner: true,
      });

      const customerPayload = {
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
      } as Record<string, unknown>;

      const confirmationDelivery = await reliabilityManager.deliver({
        jobType: "service-request-customer",
        resendPayload: customerPayload,
        metadata: {
          requestId,
          leadType: "service-request",
          customerEmail,
          customerName,
          membership: Boolean(membership),
        },
        description: `Service request confirmation for ${customerEmail}`,
        notifyOwner: false,
      });

      const status = businessDelivery.status === "sent" ? 200 : 202;
      return buildResponse(
        {
          success: businessDelivery.status === "sent",
          business: businessDelivery,
          confirmation: confirmationDelivery,
          requestId,
        },
        status,
      );
    }

    return buildResponse({ error: "Invalid email type" }, 400);
  } catch (error: unknown) {
    console.error("Error handling lead email", error);
    const message = error instanceof Error ? error.message : String(error);
    return buildResponse({ error: message }, 500);
  }
};

serve(handler);
