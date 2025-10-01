import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface CsvRow {
  type?: string;
  name?: string;
  email?: string;
  date?: string;
  service?: string;
  [key: string]: any;
}

async function fetchCsvData(): Promise<{ ok: boolean; rows?: CsvRow[]; error?: string }> {
  const csvUrl = Deno.env.get("SHEET_CSV_URL");
  if (!csvUrl) {
    return { ok: false, error: "SHEET_CSV_URL not configured" };
  }

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return { ok: false, error: `Failed to fetch CSV: ${response.status}` };
    }

    const text = await response.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      return { ok: true, rows: [] };
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: CsvRow = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.trim() || "";
      });
      rows.push(row);
    }

    return { ok: true, rows };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Optional auth token for cron jobs
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const cronToken = Deno.env.get("CRON_TOKEN");
    if (cronToken && token !== cronToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!Deno.env.get("RESEND_API_KEY")) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const csvResult = await fetchCsvData();
    if (!csvResult.ok) {
      return new Response(
        JSON.stringify({ error: csvResult.error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const rows = csvResult.rows || [];
    const now = Date.now();
    const sixMonths = 180 * 24 * 60 * 60 * 1000;

    // Find latest service per email
    const latestByEmail = new Map<string, { row: CsvRow; timestamp: number }>();
    for (const row of rows) {
      const email = (row.email || "").toLowerCase().trim();
      if (!email || !email.includes("@")) continue;

      const dateStr = row.date || "";
      const timestamp = Date.parse(dateStr);
      if (isNaN(timestamp)) continue;

      const existing = latestByEmail.get(email);
      if (!existing || timestamp > existing.timestamp) {
        latestByEmail.set(email, { row, timestamp });
      }
    }

    let sent = 0;
    const FROM = Deno.env.get("RESEND_FROM") || "Berman Electric <contact@bermanelectrical.com>";
    const siteUrl = Deno.env.get("SITE_URL") || "https://bermanelectrical.com";

    for (const [email, { row, timestamp }] of latestByEmail.entries()) {
      // Skip if less than 6 months old
      if (now - timestamp < sixMonths) continue;

      // Check if reminder already sent
      const alreadySent = rows.some(
        (r) =>
          (r.type || "").toLowerCase() === "reminder_sent" &&
          (r.email || "").toLowerCase().trim() === email
      );
      if (alreadySent) continue;

      const name = row.name || "valued customer";

      const html = `
        <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6">
          <h2>It's been a while — want a quick checkup?</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We recommend a periodic electrical safety check to keep your home safe and efficient.</p>
          
          <h3 style="margin-top:24px;color:#16a34a">What we check:</h3>
          <ul style="margin-top:10px;padding-left:20px">
            <li style="margin-bottom:8px">Panel tune-up and inspection</li>
            <li style="margin-bottom:8px">GFCI/AFCI outlet testing</li>
            <li style="margin-bottom:8px">Smoke and CO detector check</li>
            <li style="margin-bottom:8px">Identify potential safety issues</li>
          </ul>
          
          <p style="margin-top:20px">
            <a href="${siteUrl}/dashboard" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600">
              Book a Visit
            </a>
          </p>
          
          <p style="margin-top:24px;padding:15px;background:#f3f4f6;border-left:4px solid #16a34a">
            <b>Not interested?</b> No worries — just reply and let us know to hold off.
          </p>
          
          <p style="margin-top:20px;color:#6b7280;font-size:14px">
            — The Berman Electric Team<br>
            <a href="tel:5163614068" style="color:#16a34a">516-361-4068</a>
          </p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: FROM,
          to: [email],
          subject: "Quick electrical safety check?",
          html,
          reply_to: Deno.env.get("DEST_EMAIL") || "info@bermanelectrical.com",
        });

        console.log(`Sent maintenance reminder to ${email}`);

        // Log to webhook
        const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
        if (webhookUrl) {
          try {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "reminder_sent",
                name,
                email,
                service: "maintenance",
                extra: "6mo",
                timestamp: new Date().toISOString(),
              }),
            });
          } catch {}
        }

        sent++;
      } catch (emailError) {
        console.error(`Failed to send reminder to ${email}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, sent, checked: latestByEmail.size }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-maintenance-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
