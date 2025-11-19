import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getSmtpSender } from "../_shared/smtp.ts";

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

    const smtp = getSmtpSender();
    const fromEmail = Deno.env.get("HOSTINGER_SMTP_USER") || "contact@bermanelectrical.com";

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
    for (const [customerEmail, { row, timestamp }] of latestByEmail) {
      const age = now - timestamp;
      if (age < sixMonths) continue;

      // Check if we already sent a reminder
      const alreadySent = rows.some(
        (r) =>
          (r.email || "").toLowerCase().trim() === customerEmail &&
          (r.type || "").toLowerCase().trim() === "reminder_sent"
      );
      if (alreadySent) continue;

      const customerName = row.name || "Valued Customer";
      const lastService = row.service || "electrical service";

      const htmlBody = `
        <div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.6;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:30px;text-align:center;border-radius:10px 10px 0 0">
            <h1 style="color:#fff;margin:0;font-size:24px">Time for Your Electrical Check-Up!</h1>
          </div>
          <div style="background:#fff;padding:40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px">
            <p>Hi ${escapeHtml(customerName)},</p>
            <p>It's been over 6 months since your last <strong>${escapeHtml(lastService)}</strong> with Berman Electric!</p>
            <p>Regular maintenance helps prevent costly repairs and keeps your home safe.</p>
            <div style="text-align:center;margin:40px 0">
              <a href="https://bermanelectrical.com/contact" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:18px">
                Schedule Your Maintenance
              </a>
            </div>
            <p style="font-size:14px;color:#6b7280">
              <strong>Benefits of regular electrical maintenance:</strong><br>
              ✓ Prevent electrical fires<br>
              ✓ Lower energy bills<br>
              ✓ Extend equipment lifespan<br>
              ✓ Maintain home value
            </p>
            <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-top:30px">
              <p style="margin:0;font-size:14px;color:#4b5563">
                Questions? Call us at <a href="tel:+15163614068" style="color:#1e40af">(516) 361-4068</a>
              </p>
            </div>
          </div>
        </div>
      `;

      try {
        const result = await smtp.send({
          from: fromEmail,
          to: customerEmail,
          subject: "Time for Your Electrical System Check-Up!",
          html: htmlBody,
        });
        console.log(`Sent reminder to ${customerEmail}:`, result);

        if (result.success) {
          sent++;

          // Log the reminder in the webhook (fire and forget)
          const webhookUrl = Deno.env.get("PROCESS_WEBHOOK_URL");
          if (webhookUrl) {
            try {
              await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "reminder_sent",
                  name: customerName,
                  email: customerEmail,
                  date: new Date().toISOString(),
                  service: lastService,
                }),
              });
            } catch (err) {
              console.error("Webhook error (non-blocking):", err);
            }
          }
        }
      } catch (emailError) {
        console.error(`Failed to send to ${customerEmail}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Maintenance reminders sent to ${sent} customer(s)`,
        sent,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-maintenance-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
