import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Row = { [key: string]: string };

// Parse CSV line handling quoted fields
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (c === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

async function fetchCsvRows(): Promise<{ ok: boolean; rows?: Row[]; error?: string }> {
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
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    
    if (lines.length === 0) {
      return { ok: true, rows: [] };
    }

    const headers = parseCsvLine(lines[0]);
    const rows: Row[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      rows.push(row);
    }

    return { ok: true, rows };
  } catch (error: any) {
    console.error("Error fetching CSV:", error);
    return { ok: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await fetchCsvRows();
    
    if (!result.ok) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify(result.rows || []),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in portal-admin-submissions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
