import { Resend } from "npm:resend@4.0.0";
import { EmailReliabilityManager, type EmailProvider } from "./reliability.ts";

let cachedProviders: EmailProvider[] | null = null;
let cachedManager: EmailReliabilityManager | null = null;

export function parseEnvInt(name: string, defaultValue: number): number {
  const value = Deno.env.get(name);
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function buildProviders(): EmailProvider[] {
  const providers: EmailProvider[] = [];
  const primaryKey = Deno.env.get("RESEND_API_KEY");
  const fallbackKey = Deno.env.get("RESEND_FALLBACK_API_KEY");

  if (primaryKey) {
    providers.push({
      name: "resend-primary",
      client: new Resend(primaryKey),
      maxAttempts: parseEnvInt("EMAIL_PROVIDER_ATTEMPTS", 3),
    });
  }

  if (fallbackKey) {
    providers.push({
      name: "resend-fallback",
      client: new Resend(fallbackKey),
      maxAttempts: parseEnvInt("EMAIL_FALLBACK_ATTEMPTS", 2),
    });
  }

  return providers;
}

export function getProviders(): EmailProvider[] {
  if (!cachedProviders) {
    cachedProviders = buildProviders();
  }
  return cachedProviders;
}

export function getReliabilityManager(): EmailReliabilityManager {
  if (!cachedManager) {
    const providers = getProviders();
    cachedManager = new EmailReliabilityManager({
      providers,
      supabase:
        Deno.env.get("SUPABASE_URL") && Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
          ? {
            url: Deno.env.get("SUPABASE_URL")!,
            serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
          }
          : undefined,
      sms:
        Deno.env.get("TWILIO_ACCOUNT_SID") &&
        Deno.env.get("TWILIO_AUTH_TOKEN") &&
        Deno.env.get("ALERT_SMS_FROM") &&
        Deno.env.get("OWNER_ALERT_SMS_TO")
          ? {
            accountSid: Deno.env.get("TWILIO_ACCOUNT_SID")!,
            authToken: Deno.env.get("TWILIO_AUTH_TOKEN")!,
            from: Deno.env.get("ALERT_SMS_FROM")!,
            to: Deno.env.get("OWNER_ALERT_SMS_TO")!,
          }
          : undefined,
      log: {
        s3Endpoint: Deno.env.get("EMAIL_FAILURE_LOG_URL") ?? undefined,
        method: Deno.env.get("EMAIL_FAILURE_LOG_METHOD") ?? undefined,
      },
      maxAttemptsPerProvider: parseEnvInt("EMAIL_PROVIDER_ATTEMPTS", 3),
      queueMaxAttempts: parseEnvInt("EMAIL_QUEUE_MAX_ATTEMPTS", 12),
      baseBackoffMs: parseEnvInt("EMAIL_BACKOFF_BASE_MS", 1_500),
      maxBackoffMs: parseEnvInt("EMAIL_BACKOFF_MAX_MS", 15 * 60 * 1000),
      queueBatchAttempts: parseEnvInt("EMAIL_QUEUE_BATCH_ATTEMPTS", 2),
    });
  }

  return cachedManager;
}
