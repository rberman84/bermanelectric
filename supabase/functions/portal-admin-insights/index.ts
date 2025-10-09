import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type InsightRow = {
  town: string;
  page: string;
  impressions: number;
  ctr: number;
  calls: number;
  formFills: number;
  estimatedRevenue: number;
};

type CachedPayload = {
  timestamp: number;
  payload: { updatedAt: string; rows: InsightRow[] };
};

let cache: CachedPayload | null = null;

function parseNumber(value: string): number {
  if (!value) return 0;
  const numeric = value.replace(/[^0-9.\-]/g, "");
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCtr(value: string): number {
  if (!value) return 0;
  if (value.includes("%")) {
    return parseNumber(value) / 100;
  }
  return parseNumber(value);
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  out.push(current);
  return out;
}

async function fetchInsights(): Promise<{ updatedAt: string; rows: InsightRow[] }> {
  const insightsUrl = Deno.env.get("CONTENT_IMPACT_CSV_URL");
  if (!insightsUrl) {
    throw new Error("CONTENT_IMPACT_CSV_URL not configured");
  }

  const response = await fetch(insightsUrl, { headers: { "Cache-Control": "no-cache" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch insights: ${response.status}`);
  }

  const csvText = await response.text();
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { updatedAt: new Date().toISOString(), rows: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const townIdx = headers.findIndex((h) => h.toLowerCase().includes("town"));
  const pageIdx = headers.findIndex((h) => h.toLowerCase().includes("page"));
  const impressionsIdx = headers.findIndex((h) => h.toLowerCase().includes("impression"));
  const ctrIdx = headers.findIndex((h) => h.toLowerCase().includes("ctr"));
  const callsIdx = headers.findIndex((h) => h.toLowerCase().includes("call"));
  const formIdx = headers.findIndex((h) => h.toLowerCase().includes("form"));
  const revenueIdx = headers.findIndex((h) => h.toLowerCase().includes("revenue"));

  const getValue = (values: string[], index: number): string =>
    index >= 0 && index < values.length ? values[index] : "";

  const rows: InsightRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    rows.push({
      town: getValue(values, townIdx),
      page: getValue(values, pageIdx),
      impressions: parseNumber(getValue(values, impressionsIdx)),
      ctr: parseCtr(getValue(values, ctrIdx)),
      calls: parseNumber(getValue(values, callsIdx)),
      formFills: parseNumber(getValue(values, formIdx)),
      estimatedRevenue: parseNumber(getValue(values, revenueIdx)),
    });
  }

  return { updatedAt: new Date().toISOString(), rows };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cacheWindowMinutes = Number.parseInt(Deno.env.get("CONTENT_IMPACT_CACHE_MINUTES") || "60", 10);
    const cacheWindowMs = Math.max(cacheWindowMinutes, 5) * 60 * 1000;

    if (cache && Date.now() - cache.timestamp < cacheWindowMs) {
      return new Response(JSON.stringify(cache.payload), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const payload = await fetchInsights();
    cache = { timestamp: Date.now(), payload };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in portal-admin-insights function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
