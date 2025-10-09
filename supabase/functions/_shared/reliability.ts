import { delay } from "https://deno.land/std@0.224.0/async/delay.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

export interface ResendLikeClient {
  emails: {
    send(payload: Record<string, unknown>): Promise<unknown>;
  };
}

export interface EmailProvider {
  name: string;
  client: ResendLikeClient;
  maxAttempts?: number;
}

export interface SmsConfig {
  accountSid: string;
  authToken: string;
  from: string;
  to: string;
}

export interface LogConfig {
  s3Endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
}

export interface SupabaseConfig {
  url: string;
  serviceKey: string;
}

export interface DeliveryRequest {
  jobType: string;
  resendPayload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  description?: string;
  priority?: number;
  queueMaxAttempts?: number;
  dedupeKey?: string;
  alertMessage?: string;
  notifyOwner?: boolean;
}

export interface AttemptRecord {
  provider: string;
  attempt: number;
  error?: string;
  timestamp: string;
}

export interface DeliveryOutcome {
  status: "sent" | "queued";
  provider?: string;
  result?: unknown;
  queueId?: string;
  attempts: AttemptRecord[];
  error?: string;
}

export interface ProcessOutcome {
  status: "sent" | "failed" | "retry";
  attempts: AttemptRecord[];
  result?: unknown;
  error?: string;
}

interface ReliabilityOptions {
  providers: EmailProvider[];
  supabase?: SupabaseConfig;
  sms?: SmsConfig;
  log?: LogConfig;
  queueTable?: string;
  eventsTable?: string;
  maxAttemptsPerProvider?: number;
  queueMaxAttempts?: number;
  baseBackoffMs?: number;
  maxBackoffMs?: number;
  queueBatchAttempts?: number;
}

const DEFAULT_QUEUE_TABLE = "email_delivery_queue";
const DEFAULT_EVENTS_TABLE = "email_delivery_events";

const DEFAULT_BASE_BACKOFF_MS = 1_500;
const DEFAULT_MAX_BACKOFF_MS = 15 * 60 * 1000;

function safeJson(value: unknown) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_err) {
    return value;
  }
}

function computeBackoff(base: number, max: number, attempt: number) {
  const jitter = Math.random() * base;
  const backoff = Math.min(max, base * 2 ** (attempt - 1) + jitter);
  return Math.round(backoff);
}

export class EmailReliabilityManager {
  private readonly providers: EmailProvider[];
  private readonly queueTable: string;
  private readonly eventsTable: string;
  private readonly maxAttemptsPerProvider: number;
  private readonly queueMaxAttempts: number;
  private readonly baseBackoffMs: number;
  private readonly maxBackoffMs: number;
  private readonly queueBatchAttempts: number;
  private readonly logConfig?: LogConfig;
  private readonly smsConfig?: SmsConfig;
  private readonly supabaseConfig?: SupabaseConfig;
  private supabase?: SupabaseClient;

  constructor(options: ReliabilityOptions) {
    this.providers = options.providers;
    this.supabaseConfig = options.supabase;
    this.smsConfig = options.sms;
    this.logConfig = options.log;
    this.queueTable = options.queueTable ?? DEFAULT_QUEUE_TABLE;
    this.eventsTable = options.eventsTable ?? DEFAULT_EVENTS_TABLE;
    this.maxAttemptsPerProvider = options.maxAttemptsPerProvider ?? 3;
    this.queueMaxAttempts = options.queueMaxAttempts ?? 12;
    this.baseBackoffMs = options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
    this.maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
    this.queueBatchAttempts = options.queueBatchAttempts ?? 2;
  }

  private getSupabase(): SupabaseClient | undefined {
    if (!this.supabase && this.supabaseConfig) {
      this.supabase = createClient(this.supabaseConfig.url, this.supabaseConfig.serviceKey, {
        auth: { persistSession: false },
      });
    }
    return this.supabase;
  }

  private async recordEvent(queueId: string | null, eventType: string, eventDetails: Record<string, unknown>) {
    const supabase = this.getSupabase();
    if (!supabase) return;

    try {
      await supabase.from(this.eventsTable).insert({
        queue_id: queueId,
        event_type: eventType,
        event_details: safeJson(eventDetails),
      });
    } catch (error) {
      console.error("Failed to record email delivery event", error);
    }
  }

  private async logToS3(payload: Record<string, unknown>) {
    if (!this.logConfig?.s3Endpoint) return;

    try {
      const response = await fetch(this.logConfig.s3Endpoint, {
        method: this.logConfig.method ?? "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.logConfig.headers,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to log email failure to S3", await response.text());
      }
    } catch (error) {
      console.error("Error logging email failure to S3", error);
    }
  }

  private async sendSmsAlert(message: string) {
    if (!this.smsConfig) return;

    const { accountSid, authToken, from, to } = this.smsConfig;

    if (!accountSid || !authToken || !from || !to) {
      console.warn("SMS alert configuration incomplete, skipping alert");
      return;
    }

    const body = new URLSearchParams({
      To: to,
      From: from,
      Body: message,
    });

    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
        },
        body: body.toString(),
      });

      if (!response.ok) {
        console.error("Failed to send SMS alert", await response.text());
      } else {
        console.log("Sent SMS alert to owner");
      }
    } catch (error) {
      console.error("Error sending SMS alert", error);
    }
  }

  private resolveProviders(): EmailProvider[] {
    return this.providers.filter((provider) => !!provider.client);
  }

  private async attemptDelivery(
    payload: Record<string, unknown>,
    attemptsAllowedPerProvider: number,
  ): Promise<{ success: boolean; provider?: string; result?: unknown; attempts: AttemptRecord[]; error?: string }> {
    const attempts: AttemptRecord[] = [];

    for (const provider of this.resolveProviders()) {
      const maxAttempts = Math.max(1, Math.min(attemptsAllowedPerProvider, provider.maxAttempts ?? attemptsAllowedPerProvider));

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await provider.client.emails.send(payload);
          attempts.push({
            provider: provider.name,
            attempt,
            timestamp: new Date().toISOString(),
          });
          return { success: true, provider: provider.name, result, attempts };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          attempts.push({
            provider: provider.name,
            attempt,
            error: errorMessage,
            timestamp: new Date().toISOString(),
          });

          if (attempt < maxAttempts) {
            const waitMs = computeBackoff(this.baseBackoffMs, this.maxBackoffMs, attempt);
            await delay(waitMs);
          }
        }
      }
    }

    const lastError = attempts[attempts.length - 1]?.error ?? "Unknown delivery error";
    return { success: false, attempts, error: lastError };
  }

  private async enqueueFailure(
    request: DeliveryRequest,
    attempts: AttemptRecord[],
    errorMessage: string,
  ): Promise<string | undefined> {
    const supabase = this.getSupabase();
    if (!supabase) {
      console.error("Supabase client not configured, cannot queue failed email");
      return undefined;
    }

    const totalAttempts = attempts.length;
    const nextDelay = computeBackoff(this.baseBackoffMs, this.maxBackoffMs, totalAttempts + 1);
    const nextAttemptAt = new Date(Date.now() + nextDelay).toISOString();

    try {
      const { data, error } = await supabase
        .from(this.queueTable)
        .insert({
          job_type: request.jobType,
          payload: safeJson(request.resendPayload),
          metadata: safeJson({ ...request.metadata, description: request.description }),
          status: "pending",
          priority: request.priority ?? 0,
          attempt_count: totalAttempts,
          max_attempts: request.queueMaxAttempts ?? this.queueMaxAttempts,
          next_attempt_at: nextAttemptAt,
          last_error: errorMessage,
          last_error_at: new Date().toISOString(),
          attempt_history: safeJson(attempts),
          dedupe_key: request.dedupeKey ?? null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Failed to enqueue email for retry", error);
        return undefined;
      }

      const queueId = data?.id as string | undefined;
      await this.recordEvent(queueId ?? null, "queued", {
        attempts,
        error: errorMessage,
        next_attempt_at: nextAttemptAt,
        metadata: request.metadata ?? {},
      });

      return queueId;
    } catch (error) {
      console.error("Error inserting queued email", error);
      return undefined;
    }
  }

  public async deliver(request: DeliveryRequest): Promise<DeliveryOutcome> {
    const providers = this.resolveProviders();
    if (providers.length === 0) {
      const error = "No email providers configured";
      console.error(error);
      await this.logToS3({
        level: "error",
        error,
        request: safeJson(request),
        timestamp: new Date().toISOString(),
      });
      await this.sendSmsAlert(`Email delivery unavailable: ${request.description ?? request.jobType}`);
      return { status: "queued", attempts: [], error };
    }

    const result = await this.attemptDelivery(request.resendPayload, this.maxAttemptsPerProvider);

    if (result.success) {
      await this.recordEvent(null, "sent", {
        job_type: request.jobType,
        provider: result.provider,
        metadata: request.metadata ?? {},
      });
      return {
        status: "sent",
        provider: result.provider,
        result: result.result,
        attempts: result.attempts,
      };
    }

    const queueId = await this.enqueueFailure(request, result.attempts, result.error ?? "Unknown error");

    await this.logToS3({
      level: "error",
      error: result.error,
      job_type: request.jobType,
      metadata: request.metadata ?? {},
      attempts: result.attempts,
      queue_id: queueId ?? null,
      timestamp: new Date().toISOString(),
    });

    const shouldNotify = request.notifyOwner ?? true;
    if (shouldNotify) {
      const alertMessage = request.alertMessage ?? `Lead email failed (${request.jobType}). Check queue.`;
      await this.sendSmsAlert(alertMessage);
    }

    return {
      status: "queued",
      queueId,
      attempts: result.attempts,
      error: result.error,
    };
  }

  public async processQueuedRecord(record: {
    id: string;
    job_type: string;
    payload: Record<string, unknown>;
    metadata?: Record<string, unknown> | null;
    attempt_count: number;
    max_attempts: number;
    attempt_history?: AttemptRecord[] | null;
  }): Promise<ProcessOutcome> {
    const remaining = Math.max(0, record.max_attempts - record.attempt_count);
    if (remaining === 0) {
      await this.recordEvent(record.id, "exhausted", {
        attempts: record.attempt_history ?? [],
      });
      return { status: "failed", attempts: record.attempt_history ?? [], error: "Max attempts exhausted" };
    }

    const attemptsAllowed = Math.min(this.queueBatchAttempts, remaining);
    const result = await this.attemptDelivery(record.payload, attemptsAllowed);

    const supabase = this.getSupabase();
    if (!supabase) {
      return {
        status: result.success ? "sent" : "retry",
        attempts: result.attempts,
        result: result.result,
        error: result.error,
      };
    }

    const combinedAttempts = [...(record.attempt_history ?? []), ...result.attempts];
    const totalAttempts = record.attempt_count + result.attempts.length;
    const updates: Record<string, unknown> = {
      attempt_count: totalAttempts,
      attempt_history: safeJson(combinedAttempts),
    };

    if (result.success) {
      updates.status = "sent";
      updates.sent_at = new Date().toISOString();
      updates.last_error = null;
      updates.last_error_at = null;
      updates.next_attempt_at = null;
      await this.recordEvent(record.id, "sent", {
        provider: result.provider,
        attempts: result.attempts,
      });
    } else {
      updates.last_error = result.error ?? "Unknown error";
      updates.last_error_at = new Date().toISOString();

      if (totalAttempts >= record.max_attempts) {
        updates.status = "failed";
        await this.recordEvent(record.id, "failed", {
          error: result.error,
          attempts: combinedAttempts,
        });
        await this.logToS3({
          level: "fatal",
          queue_id: record.id,
          error: result.error,
          attempts: combinedAttempts,
          timestamp: new Date().toISOString(),
        });
        await this.sendSmsAlert(`Email queue exhausted for job ${record.id}`);
      } else {
        updates.status = "pending";
        const nextDelay = computeBackoff(this.baseBackoffMs, this.maxBackoffMs, totalAttempts + 1);
        updates.next_attempt_at = new Date(Date.now() + nextDelay).toISOString();
        await this.recordEvent(record.id, "retry", {
          error: result.error,
          next_attempt_in_ms: nextDelay,
        });
      }
    }

    try {
      await supabase.from(this.queueTable).update(updates).eq("id", record.id);
    } catch (error) {
      console.error("Failed to update queue record", error);
    }

    return {
      status: result.success ? "sent" : totalAttempts >= record.max_attempts ? "failed" : "retry",
      attempts: result.attempts,
      result: result.result,
      error: result.error,
    };
  }
}
