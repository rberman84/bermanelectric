
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

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

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")).transform(v => v ?? ""),
  service: z.string().trim().max(100),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000),
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
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, phone, service, message } = parsed.data;
    console.log("send-contact-email invoked", { name, email, phone, service, ts: new Date().toISOString() });

    // Send email to business
    const businessEmailResponse = await resend.emails.send({
      from: Deno.env.get("RESEND_FROM") ?? "Berman Electric Contact Form <onboarding@resend.dev>",
      reply_to: email,
      to: ["info@bermanelectrical.com"],
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
      from: Deno.env.get("RESEND_FROM") ?? "Berman Electric <onboarding@resend.dev>",
      reply_to: "info@bermanelectrical.com",
      to: [email],
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
        <p>If you need immediate assistance, please call us at (516) 361-4068.</p>
        <p>Best regards,<br>The Berman Electric Team</p>
      `,
    });

    const businessError = (businessEmailResponse as any)?.error;
    const customerError = (customerEmailResponse as any)?.error;

    if (businessError) {
      console.error("Business email failed:", businessError);
      return new Response(
        JSON.stringify({ success: false, error: "Business email failed", provider: "resend", details: businessError }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Emails sent successfully:", {
      business: businessEmailResponse,
      customer: customerEmailResponse,
    });

    return new Response(
      JSON.stringify({ success: true, customerEmailId: (customerEmailResponse as any)?.data?.id ?? null }),
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
