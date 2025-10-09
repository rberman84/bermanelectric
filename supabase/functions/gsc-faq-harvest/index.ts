import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v2.9/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SearchAnalyticsRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type Suggestion = {
  pageUrl: string;
  query: string;
  question: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const normaliseServiceAccount = (raw?: string) => {
  if (!raw) return null;
  try {
    const decoded = atob(raw);
    return JSON.parse(decoded);
  } catch (_err) {
    return JSON.parse(raw);
  }
};

const pemToArrayBuffer = (pem: string) => {
  const cleaned = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const buildQuestion = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return "What electrical question should we answer?";
  const capitalised = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  return capitalised.endsWith("?") ? capitalised : `${capitalised}?`;
};

const getAccessToken = async (serviceAccount: any) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const jwt = await create({ alg: "RS256", typ: "JWT" }, payload, privateKey);

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to request access token: ${errorText}`);
  }

  const tokenJson = await tokenResponse.json();
  return tokenJson.access_token as string;
};

const fetchSearchAnalytics = async (
  token: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
): Promise<SearchAnalyticsRow[]> => {
  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page", "query"],
        rowLimit: 5000,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search Console API error: ${text}`);
  }

  const json = await response.json();
  return (json.rows ?? []) as SearchAnalyticsRow[];
};

const groupSuggestions = (rows: SearchAnalyticsRow[], minImpressions: number): Suggestion[] => {
  const grouped = new Map<string, Suggestion[]>();

  rows.forEach((row) => {
    const [pageUrl, query] = row.keys;
    if (!pageUrl || !query) return;
    if (!pageUrl.startsWith("https://")) return;
    if (row.impressions < minImpressions) return;

    const suggestion: Suggestion = {
      pageUrl,
      query,
      question: buildQuestion(query),
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr,
      position: row.position,
    };

    const bucket = grouped.get(pageUrl) ?? [];
    bucket.push(suggestion);
    grouped.set(pageUrl, bucket);
  });

  const topSuggestions: Suggestion[] = [];

  grouped.forEach((bucket) => {
    const sorted = bucket
      .sort((a, b) => {
        if (a.impressions === b.impressions) {
          return b.clicks - a.clicks;
        }
        return b.impressions - a.impressions;
      })
      .slice(0, 5);

    topSuggestions.push(...sorted);
  });

  return topSuggestions;
};

const listToInFilter = (values: string[]) => {
  const quoted = values.map((value) => `"${value.replace(/"/g, '""')}"`);
  return `(${quoted.join(",")})`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const serviceAccount = normaliseServiceAccount(Deno.env.get("GSC_SERVICE_ACCOUNT"));
  const siteUrl = Deno.env.get("GSC_SITE_URL") ?? "https://bermanelectrical.com/";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceAccount || !supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing environment configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const now = new Date();
  const endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const startDate = new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);
  const format = (date: Date) => date.toISOString().slice(0, 10);

  try {
    const token = await getAccessToken(serviceAccount);
    const rows = await fetchSearchAnalytics(token, siteUrl, format(startDate), format(endDate));
    const suggestions = groupSuggestions(rows, 3);

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, { global: { fetch } });
    const groupedByPage = suggestions.reduce<Record<string, Suggestion[]>>((acc, suggestion) => {
      if (!acc[suggestion.pageUrl]) acc[suggestion.pageUrl] = [];
      acc[suggestion.pageUrl].push(suggestion);
      return acc;
    }, {});

    const results: Record<string, number> = {};

    for (const [pageUrl, pageSuggestions] of Object.entries(groupedByPage)) {
      const { data: existing } = await supabaseClient
        .from("faq_suggestions")
        .select("question, answer, approved, approved_at, archived")
        .eq("page_url", pageUrl);

      const payload = pageSuggestions.map((suggestion) => {
        const existingRow = existing?.find((row) => row.question === suggestion.question);
        return {
          page_url: suggestion.pageUrl,
          query: suggestion.query,
          question: suggestion.question,
          impressions: suggestion.impressions,
          clicks: suggestion.clicks,
          ctr: suggestion.ctr,
          position: suggestion.position,
          suggested_at: new Date().toISOString(),
          approved: existingRow?.approved ?? false,
          approved_at: existingRow?.approved_at ?? null,
          answer: existingRow?.answer ?? null,
          archived: existingRow?.archived ?? false,
        };
      });

      if (payload.length > 0) {
        await supabaseClient
          .from("faq_suggestions")
          .upsert(payload, { onConflict: "page_url,question" });

        const keepQuestions = payload.map((item) => item.question);
        if (keepQuestions.length > 0) {
          await supabaseClient
            .from("faq_suggestions")
            .update({ archived: true })
            .eq("page_url", pageUrl)
            .not("question", "in", listToInFilter(keepQuestions))
            .eq("approved", false);
        }
      }

      results[pageUrl] = payload.length;
    }

    return new Response(
      JSON.stringify({
        harvested: suggestions.length,
        pages: Object.keys(groupedByPage).length,
        details: results,
        range: { startDate: format(startDate), endDate: format(endDate) },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    console.error("gsc-faq-harvest error", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
