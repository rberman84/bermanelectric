import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { getReliabilityManager } from "../_shared/delivery.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitErrorResponse, getClientIP } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zod schemas for input validation
const contactFormSchema = z.object({
  type: z.literal("contact_form"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(30, "Phone must be less than 30 characters"),
  service: z.string().trim().min(1, "Service is required").max(100, "Service must be less than 100 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const serviceRequestSchema = z.object({
  type: z.literal("service_request"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(30, "Phone must be less than 30 characters"),
  service: z.string().trim().min(1, "Service is required").max(100, "Service must be less than 100 characters"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
  preferredDate: z.string().trim().max(50, "Preferred date must be less than 50 characters").optional(),
  description: z.string().trim().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
});

const emailRequestSchema = z.discriminatedUnion("type", [contactFormSchema, serviceRequestSchema]);

// HTML escaping function to prevent XSS/injection
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

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMITS.EMAIL);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitErrorResponse(rateLimitResult, corsHeaders);
  }

  try {
    const manager = getReliabilityManager();
    const fromEmail =
      Deno.env.get("RESEND_FROM") ||
      "Berman Electric <contact@bermanelectrical.com>";

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = emailRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.warn("Validation failed:", parseResult.error.errors);
      return buildResponse({
        error: "Validation failed",
        details: parseResult.error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message,
        })),
      }, 400);
    }

    const emailData = parseResult.data;

    if (emailData.type === "contact_form") {
      const { name, email, phone, service, message } = emailData;

      // Escape all user-provided values for HTML
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safePhone = escapeHtml(phone);
      const safeService = escapeHtml(service);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

      const businessHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `;

      const customerHtml = `
        <h2>Thank you for contacting Berman Electric</h2>
        <p>Hi ${safeName},</p>
        <p>We've received your inquiry about ${safeService} and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
        <br>
        <p>Best regards,<br>Berman Electric Team</p>
        <p>📞 (516) 361-4068</p>
      `;

      console.log("Sending contact form emails via reliability manager...");

      const [businessOutcome, customerOutcome] = await Promise.all([
        manager.deliver({
          jobType: "contact_form_business",
          resendPayload: {
            from: fromEmail,
            to: ["Rob@bermanelectrical.com"],
            subject: `New Contact Form: ${safeService}`,
            html: businessHtml,
          },
          metadata: {
            type: "contact_form",
            recipient: "business",
            email,
            phone,
            service,
          },
          description: `Contact form submission from ${name} for ${service}`,
        }),
        manager.deliver({
          jobType: "contact_form_customer",
          resendPayload: {
            from: fromEmail,
            to: [email],
            subject: "Thank you for contacting Berman Electric",
            html: customerHtml,
          },
          metadata: {
            type: "contact_form",
            recipient: "customer",
            email,
            phone,
            service,
          },
          description: `Contact form confirmation email to ${name} for ${service}`,
        }),
      ]);

      console.log("Business email outcome:", businessOutcome);
      console.log("Customer email outcome:", customerOutcome);

      const businessSuccess =
        businessOutcome.status === "sent" || businessOutcome.status === "queued";
      const customerSuccess =
        customerOutcome.status === "sent" || customerOutcome.status === "queued";

      return buildResponse({
        success: businessSuccess && customerSuccess,
        businessEmail: businessOutcome.status,
        customerEmail: customerOutcome.status,
      });
    }

    if (emailData.type === "service_request") {
      const { name, email, phone, service, address, preferredDate, description } =
        emailData;

      // Escape all user-provided values for HTML
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safePhone = escapeHtml(phone);
      const safeService = escapeHtml(service);
      const safeAddress = escapeHtml(address);
      const safePreferredDate = preferredDate ? escapeHtml(preferredDate) : null;
      const safeDescription = escapeHtml(description).replace(/\n/g, "<br>");

      const businessHtml = `
        <h2>New Service Request</h2>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Address:</strong> ${safeAddress}</p>
        <p><strong>Preferred Date:</strong> ${safePreferredDate || "Not specified"}</p>
        <p><strong>Description:</strong></p>
        <p>${safeDescription}</p>
      `;

      const customerHtml = `
        <h2>Service Request Received</h2>
        <p>Hi ${safeName},</p>
        <p>Thank you for choosing Berman Electric! We've received your service request for ${safeService}.</p>
        <p><strong>Your details:</strong></p>
        <ul>
          <li>Address: ${safeAddress}</li>
          <li>Preferred Date: ${safePreferredDate || "To be scheduled"}</li>
          <li>Description: ${safeDescription}</li>
        </ul>
        <p>We'll contact you shortly to confirm the appointment.</p>
        <br>
        <p>Best regards,<br>Berman Electric Team</p>
        <p>📞 (516) 361-4068</p>
      `;

      console.log("Sending service request emails via reliability manager...");

      const [businessOutcome, customerOutcome] = await Promise.all([
        manager.deliver({
          jobType: "service_request_business",
          resendPayload: {
            from: fromEmail,
            to: ["Rob@bermanelectrical.com"],
            subject: `New Service Request: ${safeService}`,
            html: businessHtml,
          },
          metadata: {
            type: "service_request",
            recipient: "business",
            email,
            phone,
            service,
            address,
          },
          description: `Service request from ${name} for ${service}`,
        }),
        manager.deliver({
          jobType: "service_request_customer",
          resendPayload: {
            from: fromEmail,
            to: [email],
            subject: "Service Request Received - Berman Electric",
            html: customerHtml,
          },
          metadata: {
            type: "service_request",
            recipient: "customer",
            email,
            phone,
            service,
            address,
          },
          description: `Service request confirmation email to ${name} for ${service}`,
        }),
      ]);

      console.log("Business email outcome:", businessOutcome);
      console.log("Customer email outcome:", customerOutcome);

      const businessSuccess =
        businessOutcome.status === "sent" || businessOutcome.status === "queued";
      const customerSuccess =
        customerOutcome.status === "sent" || customerOutcome.status === "queued";

      return buildResponse({
        success: businessSuccess && customerSuccess,
        businessEmail: businessOutcome.status,
        customerEmail: customerOutcome.status,
      });
    }

    return buildResponse({ error: "Invalid email type" }, 400);
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return buildResponse({ error: "An error occurred processing your request" }, 500);
  }
};

serve(handler);
