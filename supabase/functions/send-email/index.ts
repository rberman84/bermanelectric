import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import twilio from "npm:twilio@4.19.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackingPayload {
  id?: string;
  display?: string;
  value?: string;
}

interface AttributionPayload {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  msclkid?: string;
  fbclid?: string;
  landingPage?: string;
  pageUrl?: string;
  referrer?: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
  searchParams?: Record<string, string>;
}

interface BaseLeadPayload {
  tracking?: TrackingPayload;
  attribution?: AttributionPayload;
  pageUrl?: string;
  bookingLink?: string;
  smsOptIn?: boolean;
}

interface ContactFormEmail extends BaseLeadPayload {
  type: "contact";
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ServiceRequestEmail extends BaseLeadPayload {
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

type TwilioClient = ReturnType<typeof twilio> | null;

type IntegrationResult = {
  service: "airtable" | "hubspot";
  success: boolean;
  status?: number;
  detail?: string;
};

type SmsResult = {
  to: string;
  type: "business" | "customer";
  sid?: string;
  error?: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
      global: { headers: { "x-application-name": "lead-router" } },
    })
  : null;

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
const TWILIO_NOTIFICATION_NUMBER = Deno.env.get("TWILIO_NOTIFICATION_NUMBER");
const TWILIO_AUTOREPLY_ENABLED = (Deno.env.get("TWILIO_CUSTOMER_AUTOREPLY_ENABLED") ?? "true").toLowerCase() !== "false";
const BUSINESS_EMAIL = Deno.env.get("LEAD_ROUTER_BUSINESS_EMAIL") || "contact@bermanelectrical.com";
const FROM_EMAIL = Deno.env.get("RESEND_FROM") || "Berman Electric <onboarding@resend.dev>";
const BOOKING_LINK = Deno.env.get("BOOKING_LINK") || "https://cal.com/berman-electric/consultation";
const BRAND_NAME = Deno.env.get("LEAD_ROUTER_BRAND_NAME") || "Berman Electric";

const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
const AIRTABLE_TABLE = Deno.env.get("AIRTABLE_LEADS_TABLE") || "Leads";

const HUBSPOT_TOKEN = Deno.env.get("HUBSPOT_PRIVATE_APP_TOKEN");

const twilioClient: TwilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

const normalizePhone = (input?: string | null): string | null => {
  if (!input) return null;
  const digits = input.replace(/[^0-9+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  return `+${digits}`;
};

const renderAttributionHtml = (payload: BaseLeadPayload): string => {
  const attribution = payload.attribution;
  if (!attribution) return "";
  const entries: string[] = [];
  if (attribution.utmSource) entries.push(`<li><strong>UTM Source:</strong> ${attribution.utmSource}</li>`);
  if (attribution.utmMedium) entries.push(`<li><strong>UTM Medium:</strong> ${attribution.utmMedium}</li>`);
  if (attribution.utmCampaign) entries.push(`<li><strong>UTM Campaign:</strong> ${attribution.utmCampaign}</li>`);
  if (attribution.utmTerm) entries.push(`<li><strong>UTM Term:</strong> ${attribution.utmTerm}</li>`);
  if (attribution.utmContent) entries.push(`<li><strong>UTM Content:</strong> ${attribution.utmContent}</li>`);
  if (attribution.gclid) entries.push(`<li><strong>GCLID:</strong> ${attribution.gclid}</li>`);
  if (attribution.msclkid) entries.push(`<li><strong>MSCLKID:</strong> ${attribution.msclkid}</li>`);
  if (attribution.fbclid) entries.push(`<li><strong>FBCLID:</strong> ${attribution.fbclid}</li>`);
  if (attribution.landingPage) entries.push(`<li><strong>Landing Page:</strong> ${attribution.landingPage}</li>`);
  if (attribution.pageUrl) entries.push(`<li><strong>Page URL:</strong> ${attribution.pageUrl}</li>`);
  if (attribution.referrer) entries.push(`<li><strong>Referrer:</strong> ${attribution.referrer}</li>`);
  if (!entries.length) return "";
  return `
    <hr style="margin:20px 0;" />
    <h3>Attribution</h3>
    <ul>
      ${entries.join("\n")}
    </ul>
  `;
};

const logLead = async (leadType: "contact" | "service-request", payload: EmailRequest) => {
  if (!supabaseAdmin) {
    console.warn("Supabase admin client unavailable - skipping lead logging");
    return { id: null, metadata: null };
  }

  const attribution = payload.attribution || {};
  const tracking = payload.tracking || {};

  const baseMetadata = {
    attribution,
    tracking,
    bookingLink: payload.bookingLink || BOOKING_LINK,
    pageUrl: payload.pageUrl || attribution.pageUrl,
    firstSeenAt: attribution.firstSeenAt,
    lastSeenAt: attribution.lastSeenAt,
    searchParams: attribution.searchParams,
  };

  const insertPayload = {
    lead_type: leadType,
    name: leadType === "contact" ? (payload as ContactFormEmail).name : (payload as ServiceRequestEmail).customerName,
    email: leadType === "contact" ? (payload as ContactFormEmail).email : (payload as ServiceRequestEmail).customerEmail,
    phone: payload.phone,
    service: leadType === "contact" ? (payload as ContactFormEmail).service : (payload as ServiceRequestEmail).serviceType,
    message: leadType === "contact" ? (payload as ContactFormEmail).message : (payload as ServiceRequestEmail).description,
    sms_opt_in: Boolean(payload.smsOptIn),
    tracking_number_id: tracking.id || null,
    tracking_number_value: tracking.value || null,
    tracking_number_display: tracking.display || null,
    utm_source: attribution.utmSource || null,
    utm_medium: attribution.utmMedium || null,
    utm_campaign: attribution.utmCampaign || null,
    utm_term: attribution.utmTerm || null,
    utm_content: attribution.utmContent || null,
    gclid: attribution.gclid || null,
    msclkid: attribution.msclkid || null,
    fbclid: attribution.fbclid || null,
    landing_page: attribution.landingPage || null,
    page_url: payload.pageUrl || attribution.pageUrl || null,
    referrer: attribution.referrer || null,
    metadata: baseMetadata,
  };

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert(insertPayload)
    .select("id, metadata")
    .single();

  if (error) {
    console.error("Lead logging failed", error);
    throw new Error(`Lead logging failed: ${error.message}`);
  }

  return { id: data?.id ?? null, metadata: baseMetadata };
};

const updateLeadMetadata = async (leadId: string | null, metadata: Record<string, unknown>) => {
  if (!leadId || !supabaseAdmin) return;
  await supabaseAdmin.from("leads").update({ metadata }).eq("id", leadId);
};

const sendTwilioMessage = async (client: TwilioClient, to: string, body: string): Promise<SmsResult> => {
  if (!client || !TWILIO_FROM_NUMBER) {
    return { to, type: "business", error: "Twilio client not configured" };
  }
  try {
    const message = await client.messages.create({
      to,
      from: TWILIO_FROM_NUMBER,
      body,
    });
    return { to, type: TWILIO_NOTIFICATION_NUMBER && to === TWILIO_NOTIFICATION_NUMBER ? "business" : "customer", sid: message.sid };
  } catch (error) {
    console.error("Twilio message error", error);
    return { to, type: "business", error: error instanceof Error ? error.message : "Unknown Twilio error" };
  }
};

const syncToAirtable = async (payload: ContactFormEmail, leadId: string | null): Promise<IntegrationResult | null> => {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return null;
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  const body = {
    fields: {
      Name: payload.name,
      Email: payload.email,
      Phone: payload.phone,
      Service: payload.service,
      Message: payload.message,
      LeadId: leadId || undefined,
      TrackingNumber: payload.tracking?.id,
      LandingPage: payload.attribution?.landingPage || payload.pageUrl,
      UTM_Source: payload.attribution?.utmSource,
      UTM_Medium: payload.attribution?.utmMedium,
      UTM_Campaign: payload.attribution?.utmCampaign,
      SubmittedAt: new Date().toISOString(),
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Airtable sync failed", detail);
    return { service: "airtable", success: false, status: response.status, detail };
  }

  return { service: "airtable", success: true, status: response.status };
};

const syncToHubSpot = async (payload: ContactFormEmail, leadId: string | null): Promise<IntegrationResult | null> => {
  if (!HUBSPOT_TOKEN) return null;
  const endpoint = "https://api.hubapi.com/crm/v3/objects/contacts";
  const body = {
    properties: {
      email: payload.email,
      firstname: payload.name,
      phone: payload.phone,
      message: payload.message,
      lead_source: payload.attribution?.utmSource || "web",
      utm_source: payload.attribution?.utmSource,
      utm_medium: payload.attribution?.utmMedium,
      utm_campaign: payload.attribution?.utmCampaign,
      landing_page: payload.attribution?.landingPage || payload.pageUrl,
      service_interest: payload.service,
      lead_id: leadId || undefined,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    // Contact exists - treat as success but log detail
    console.warn("HubSpot contact already exists for", payload.email);
    return { service: "hubspot", success: true, status: response.status, detail: "Contact already exists" };
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error("HubSpot sync failed", detail);
    return { service: "hubspot", success: false, status: response.status, detail };
  }

  return { service: "hubspot", success: true, status: response.status };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();
    console.log("Processing email request:", emailData.type);

    let leadLogId: string | null = null;
    let baseMetadata: Record<string, unknown> | null = null;

    if (emailData.type === "contact" || emailData.type === "service-request") {
      const logResult = await logLead(emailData.type, emailData);
      leadLogId = logResult.id;
      baseMetadata = logResult.metadata;
    }

    if (emailData.type === "contact") {
      const { name, email, phone, service, message } = emailData;

      const businessHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        ${emailData.tracking?.id ? `<p><strong>Tracking Number:</strong> ${emailData.tracking.display} (${emailData.tracking.id})</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        ${renderAttributionHtml(emailData)}
        <hr style="margin:20px 0;" />
        <p><strong>Lead ID:</strong> ${leadLogId ?? "(not logged)"}</p>
      `;

      const customerHtml = `
        <h2>Thank you for contacting ${BRAND_NAME}</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your request details:</strong></p>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
        <p>${message}</p>
        ${emailData.bookingLink || BOOKING_LINK ? `<p style="margin:24px 0; text-align:center;"><a href="${emailData.bookingLink || BOOKING_LINK}" style="display:inline-block;padding:12px 24px;background:#0d6efd;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Book Your Appointment</a></p>` : ""}
        <p>Best regards,<br/>${BRAND_NAME} Team</p>
      `;

      const businessEmailPromise = resend.emails.send({
        from: FROM_EMAIL,
        to: BUSINESS_EMAIL,
        replyTo: email,
        subject: `New Contact: ${name} - ${service}`,
        html: businessHtml,
      });

      const customerEmailPromise = resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `We received your request - ${BRAND_NAME}`,
        html: customerHtml,
      });

      const [{ data: businessData, error: businessError }, { data: customerData, error: customerError }] = await Promise.all([
        businessEmailPromise,
        customerEmailPromise,
      ]);

      if (businessError) {
        console.error("Business notification error:", businessError);
        throw businessError;
      }

      if (customerError) {
        console.error("Customer confirmation error:", customerError);
      }

      const smsResults: SmsResult[] = [];
      if (twilioClient && TWILIO_NOTIFICATION_NUMBER) {
        const normalizedBusiness = normalizePhone(TWILIO_NOTIFICATION_NUMBER);
        if (normalizedBusiness) {
          const businessMessage = `${BRAND_NAME}: New lead from ${name} (${phone}). Service: ${service}. Lead ID: ${leadLogId ?? "n/a"}.`;
          const smsResult = await sendTwilioMessage(twilioClient, normalizedBusiness, businessMessage);
          smsResult.type = "business";
          smsResults.push(smsResult);
        }
      }

      if (twilioClient && TWILIO_AUTOREPLY_ENABLED && emailData.smsOptIn !== false) {
        const customerPhone = normalizePhone(phone);
        if (customerPhone) {
          const smsBody = `${BRAND_NAME}: Thanks ${name}! We received your request for ${service}. Book here: ${emailData.bookingLink || BOOKING_LINK}. Reply STOP to opt out.`;
          const smsResult = await sendTwilioMessage(twilioClient, customerPhone, smsBody);
          smsResult.type = "customer";
          smsResults.push(smsResult);
        }
      }

      const integrations: IntegrationResult[] = [];
      const airtableResult = await syncToAirtable(emailData, leadLogId);
      if (airtableResult) integrations.push(airtableResult);
      const hubspotResult = await syncToHubSpot(emailData, leadLogId);
      if (hubspotResult) integrations.push(hubspotResult);

      if (leadLogId && baseMetadata) {
        await updateLeadMetadata(leadLogId, {
          ...baseMetadata,
          email: {
            businessId: businessData?.id,
            customerId: customerData?.id,
          },
          sms: smsResults,
          integrations,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          leadId: leadLogId,
          businessEmailId: businessData?.id,
          customerEmailId: customerData?.id,
          smsResults,
          integrations,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (emailData.type === "service-request") {
      const { customerName, customerEmail, phone, serviceType, description, address, preferredDate, membership } = emailData;

      const html = `
        <h2>New Service Request</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Address:</strong> ${address}</p>
        ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ""}
        ${membership ? `<p><strong>⭐ Membership Requested</strong></p>` : ""}
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        ${renderAttributionHtml(emailData)}
        <hr style="margin:20px 0;" />
        <p><strong>Lead ID:</strong> ${leadLogId ?? "(not logged)"}</p>
      `;

      const { data: businessData, error: businessError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: BUSINESS_EMAIL,
        replyTo: customerEmail,
        subject: `New Service Request: ${serviceType} - ${customerName}`,
        html,
      });

      if (businessError) {
        console.error("Service request notification error:", businessError);
        throw businessError;
      }

      const { data: confirmData, error: confirmError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `${BRAND_NAME} received your service request`,
        html: `
          <h2>Thank you for your service request</h2>
          <p>Hi ${customerName},</p>
          <p>We've received your service request and will contact you shortly to schedule your appointment.</p>
          <p><strong>Request details:</strong></p>
          <ul>
            <li><strong>Service Type:</strong> ${serviceType}</li>
            <li><strong>Address:</strong> ${address}</li>
            ${preferredDate ? `<li><strong>Preferred Date:</strong> ${preferredDate}</li>` : ""}
          </ul>
          ${membership ? `<p><strong>Membership:</strong> You've requested to join our maintenance membership program. We'll include details in our follow-up.</p>` : ""}
          ${emailData.bookingLink || BOOKING_LINK ? `<p style="margin:24px 0; text-align:center;"><a href="${emailData.bookingLink || BOOKING_LINK}" style="display:inline-block;padding:12px 24px;background:#0d6efd;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Book a follow-up</a></p>` : ""}
          <p>Best regards,<br/>${BRAND_NAME} Team</p>
        `,
      });

      if (confirmError) {
        console.error("Customer confirmation error:", confirmError);
      }

      if (leadLogId && baseMetadata) {
        await updateLeadMetadata(leadLogId, {
          ...baseMetadata,
          email: {
            businessId: businessData?.id,
            customerId: confirmData?.id,
          },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          leadId: leadLogId,
          businessEmailId: businessData?.id,
          confirmEmailId: confirmData?.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    throw new Error("Invalid email type");
  } catch (error) {
    console.error("Lead router error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
};

serve(handler);
