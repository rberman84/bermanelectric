import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequestData {
  customerName: string;
  customerEmail: string;
  phone: string;
  serviceType: string;
  description: string;
  address: string;
  preferredDate?: string;
}

const serviceRequestSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  customerEmail: z.string().trim().email().max(255),
  phone: z.string().trim().max(30),
  serviceType: z.string().trim().max(100),
  description: z.string().trim().min(10).max(2000),
  address: z.string().trim().min(10).max(200),
  preferredDate: z.string().optional(),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!Deno.env.get("RESEND_API_KEY")) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const parsed = serviceRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { customerName, customerEmail, phone, serviceType, description, address, preferredDate } = parsed.data;
    console.log("send-service-request-email invoked", { 
      customerName, 
      customerEmail, 
      phone, 
      serviceType, 
      ts: new Date().toISOString() 
    });

    // Send email to business
    const businessEmailResponse = await resend.emails.send({
      from: Deno.env.get("RESEND_FROM") ?? "Berman Electric Service Request <onboarding@resend.dev>",
      reply_to: customerEmail,
      to: ["contact@bermanelectrical.com"],
      subject: `New Service Request: ${serviceType} from ${customerName}`,
      html: `
        <h2>New Service Request Submitted</h2>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Service Address:</strong> ${address}</p>
        ${preferredDate ? `<p><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>` : ""}
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This request was submitted through the customer dashboard.</p>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: Deno.env.get("RESEND_FROM") ?? "Berman Electric <onboarding@resend.dev>",
      reply_to: "info@bermanelectrical.com",
      to: [customerEmail],
      subject: "Service Request Received - Berman Electric",
      html: `
        <h2>Thank you for your service request!</h2>
        <p>Dear ${customerName},</p>
        <p>We have received your service request for <strong>${serviceType}</strong> services. Our team will review your request and contact you shortly to schedule an appointment.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li><strong>Service Type:</strong> ${serviceType}</li>
          <li><strong>Service Address:</strong> ${address}</li>
          ${preferredDate ? `<li><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</li>` : ""}
          <li><strong>Description:</strong> ${description}</li>
        </ul>
        <p>We will contact you at <strong>${phone}</strong> or reply to this email within 24 hours to confirm your appointment.</p>
        <p>For immediate assistance or questions, please call us at <strong>(516) 361-4068</strong>.</p>
        <p>Best regards,<br>The Berman Electric Team</p>
      `,
    });

    const businessError = (businessEmailResponse as any)?.error;
    const customerError = (customerEmailResponse as any)?.error;

    if (businessError) {
      console.error("Business email failed:", businessError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send notification email", 
          provider: "resend", 
          details: businessError 
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Service request emails sent successfully:", {
      business: businessEmailResponse,
      customer: customerEmailResponse,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: (customerEmailResponse as any)?.data?.id ?? null 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-service-request-email function:", error);
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
