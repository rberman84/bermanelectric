import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { checkRateLimit, getClientIP, rateLimitErrorResponse, RATE_LIMITS } from "../_shared/rateLimit.ts";
import { handleError, handleApiError, handleValidationError, ErrorCode } from "../_shared/errorHandler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const requestSchema = z.object({
  imageBase64: z.string().min(100).max(10485760, "Image data too large"), // ~10MB base64 limit
  fileName: z.string().min(3).max(200),
  mimeType: z.string().max(100).optional(),
  consentToStore: z.boolean().optional().default(false),
  zipCode: z.string().trim().regex(/^\d{5}$/, "Valid 5 digit ZIP code required"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
  clientName: z.string().trim().max(100).optional(),
  clientEmail: z.string().email().max(255).optional(),
  clientPhone: z.string().trim().max(30).optional(),
});

const zipHints: Record<string, string> = {
  "11779": "Ronkonkoma",
  "11727": "Coram",
  "11741": "Holbrook",
  "11738": "Farmingville",
  "11742": "Holtsville",
  "11720": "Centereach",
  "11749": "Islandia",
  "11776": "Port Jefferson Station",
};

type OpenAIMessage = {
  role: "system" | "user";
  content: Array<
    | { type: "text"; text: string }
    | { type: "input_text"; text: string }
    | { type: "input_image"; image_base64: string; media_type?: string }
  >;
};

type TriageAnalysis = {
  hazardLevel: "safe" | "watch" | "warning" | "critical";
  hazardSummary: string;
  likelyCause: string;
  urgencyLevel: "same_day" | "next_24_hours" | "schedule";
  urgencyMinutes?: number;
  nextSteps: string[];
  estimatedJobLengthMinutes?: number;
  recommendedServiceType?: string;
  confidence?: string;
};

function parseAnalysis(raw: string): TriageAnalysis {
  try {
    const data = JSON.parse(raw);
    return {
      hazardLevel: data.hazardLevel || data.hazard_level || "warning",
      hazardSummary: data.hazardSummary || data.summary || "Electrical issue detected.",
      likelyCause: data.likelyCause || data.cause || "Unable to determine",
      urgencyLevel: data.urgencyLevel || data.urgency || "schedule",
      urgencyMinutes: data.urgencyMinutes || data.responseMinutes,
      nextSteps: Array.isArray(data.nextSteps)
        ? data.nextSteps
        : typeof data.nextSteps === "string"
        ? [data.nextSteps]
        : [],
      estimatedJobLengthMinutes:
        typeof data.estimatedJobLengthMinutes === "number"
          ? data.estimatedJobLengthMinutes
          : typeof data.jobLengthMinutes === "number"
          ? data.jobLengthMinutes
          : undefined,
      recommendedServiceType:
        data.recommendedServiceType || data.serviceType || undefined,
      confidence: data.confidence,
    };
  } catch (error) {
    console.error("Failed to parse analysis JSON", error, raw);
    return {
      hazardLevel: "warning",
      hazardSummary: raw.slice(0, 300) || "Potential electrical hazard detected.",
      likelyCause: "Model returned non-JSON output.",
      urgencyLevel: "next_24_hours",
      nextSteps: ["Schedule an in-person visit for a licensed electrician."],
    };
  }
}

function validateAnalysis(analysis: TriageAnalysis): TriageAnalysis {
  const hazardMap: Record<string, TriageAnalysis["hazardLevel"]> = {
    safe: "safe",
    watch: "watch",
    monitor: "watch",
    caution: "watch",
    warning: "warning",
    urgent: "warning",
    critical: "critical",
    danger: "critical",
  };
  const urgencyMap: Record<string, TriageAnalysis["urgencyLevel"]> = {
    schedule: "schedule",
    routine: "schedule",
    next_24_hours: "next_24_hours",
    "24h": "next_24_hours",
    same_day: "same_day",
    immediate: "same_day",
    emergency: "same_day",
  };

  return {
    ...analysis,
    hazardLevel: hazardMap[analysis.hazardLevel] || "warning",
    urgencyLevel: urgencyMap[analysis.urgencyLevel] || "next_24_hours",
    nextSteps:
      analysis.nextSteps && analysis.nextSteps.length > 0
        ? analysis.nextSteps
        : ["Schedule a licensed electrician to inspect on site."],
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check - strict limit for expensive vision API
  const clientIP = getClientIP(req);
  const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMITS.AI_TRIAGE);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitErrorResponse(rateLimitResult, corsHeaders);
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const start = performance.now();

  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return handleValidationError(parsed.error, "ai-onsite-triage", corsHeaders);
    }

    const {
      imageBase64,
      fileName,
      mimeType,
      consentToStore,
      zipCode,
      description,
      clientEmail,
      clientName,
      clientPhone,
    } = parsed.data;

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: "Vision model not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const prompt =
      `You are a master electrician performing remote photo triage for Berman Electric in Long Island, NY. ` +
      `Respond ONLY in JSON with keys: hazardLevel (safe|watch|warning|critical), hazardSummary, likelyCause, urgencyLevel ` +
      `(schedule|next_24_hours|same_day), urgencyMinutes (integer, optional), nextSteps (array of actionable strings), ` +
      `estimatedJobLengthMinutes (integer, optional), recommendedServiceType (string). ` +
      `Focus on actionable safety info. If unsure, err toward caution.`;

    const locationHint = zipHints[zipCode] ? `The service address is near ${zipHints[zipCode]} (${zipCode}).` : `ZIP: ${zipCode}.`;

    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content: [{ type: "text", text: prompt }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Client description: ${description || "No description provided."}\n${locationHint}`,
          },
          {
            type: "input_image",
            image_base64: imageBase64.replace(/^data:[^,]+,/, ""),
            media_type: mimeType || "image/jpeg",
          },
        ],
      },
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: messages,
        max_output_tokens: 400,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      return await handleApiError(response, "ai-onsite-triage", corsHeaders);
    }

    const completion = await response.json();
    const modelOutput: string = completion.output_text || completion.choices?.[0]?.message?.content || "";
    const parsedAnalysis = validateAnalysis(parseAnalysis(modelOutput));

    const latencyMs = Math.round(performance.now() - start);

    let imagePath: string | null = null;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (consentToStore && supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const bucketPath = `${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
        const binary = Uint8Array.from(atob(imageBase64.replace(/^data:[^,]+,/, "")), (c) => c.charCodeAt(0));
        const { error: uploadError } = await supabase.storage
          .from("triage-consented")
          .upload(bucketPath, binary, {
            contentType: mimeType || "image/jpeg",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Failed to upload consented image", uploadError);
        } else {
          imagePath = `triage-consented/${bucketPath}`;
        }
      } catch (storageError) {
        console.error("Storage upload failure", storageError);
      }
    }

    let triageId: string | null = null;

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: inserted, error: insertError } = await supabase
          .from("ai_triage_reports")
          .insert({
            hazard_level: parsedAnalysis.hazardLevel,
            hazard_summary: parsedAnalysis.hazardSummary,
            likely_cause: parsedAnalysis.likelyCause,
            urgency_level: parsedAnalysis.urgencyLevel,
            urgency_minutes: parsedAnalysis.urgencyMinutes,
            next_steps: parsedAnalysis.nextSteps,
            analysis: completion,
            consent: consentToStore,
            image_path: imagePath,
            client_email: clientEmail,
            client_name: clientName,
            client_phone: clientPhone,
            job_zip: zipCode,
            job_length_minutes: parsedAnalysis.estimatedJobLengthMinutes,
            model_latency_ms: latencyMs,
            model_used: completion.model || "gpt-4o-mini",
            triage_reference: completion.id,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Failed to log triage report", insertError);
        } else {
          triageId = inserted?.id ?? null;
        }
      } catch (insertError) {
        console.error("Failed to log triage report", insertError);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        latencyMs,
        analysis: parsedAnalysis,
        consentStored: consentToStore && !!imagePath,
        imagePath,
        triageId,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return handleError(error, "ai-onsite-triage", corsHeaders);
  }
};

serve(handler);
