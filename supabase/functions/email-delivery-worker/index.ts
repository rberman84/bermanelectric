import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { getProviders, getReliabilityManager, parseEnvInt } from "../_shared/delivery.ts";
import type { AttemptRecord } from "../_shared/reliability.ts";

const providers = getProviders();
const reliabilityManager = getReliabilityManager();

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function unauthorizedResponse(status = 401) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function processQueue(batchSize: number) {
  if (!supabase) {
    throw new Error("Supabase service role not configured for worker");
  }

  const { data, error } = await supabase
    .from("email_delivery_queue")
    .select("id, job_type, payload, metadata, attempt_count, max_attempts, attempt_history")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("next_attempt_at", { ascending: true })
    .limit(batchSize);

  if (error) {
    throw error;
  }

  const records = data ?? [];
  const outcomes: Array<{ id: string; status: string; attempts: AttemptRecord[]; error?: string }> = [];

  for (const record of records) {
    const outcome = await reliabilityManager.processQueuedRecord({
      id: record.id as string,
      job_type: record.job_type as string,
      payload: record.payload as Record<string, unknown>,
      metadata: (record.metadata ?? null) as Record<string, unknown> | null,
      attempt_count: record.attempt_count as number,
      max_attempts: record.max_attempts as number,
      attempt_history: (record.attempt_history ?? []) as AttemptRecord[],
    });

    outcomes.push({ id: record.id as string, status: outcome.status, attempts: outcome.attempts, error: outcome.error });
  }

  return { processed: outcomes.length, outcomes };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (providers.length === 0) {
    return new Response(JSON.stringify({ error: "No email providers configured" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase credentials missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const workerToken = Deno.env.get("EMAIL_QUEUE_WORKER_TOKEN");
  if (workerToken) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (token !== workerToken) {
      return unauthorizedResponse(401);
    }
  }

  try {
    const batchSize = parseEnvInt("EMAIL_QUEUE_WORKER_BATCH", 10);
    const result = await processQueue(batchSize);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email delivery worker failed", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
