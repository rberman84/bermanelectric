/**
 * Rate limiting utility using Deno KV
 * Implements a sliding window rate limiter to prevent abuse of public endpoints
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Usually IP address or user ID
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const kv = await Deno.openKv();
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = [config.keyPrefix, identifier];

  try {
    // Get current request log
    const entry = await kv.get<{ timestamps: number[] }>(key);
    let timestamps = entry.value?.timestamps || [];

    // Remove timestamps outside the current window
    timestamps = timestamps.filter((ts) => ts > windowStart);

    // Check if rate limit exceeded
    const allowed = timestamps.length < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - timestamps.length);

    if (allowed) {
      // Add current timestamp
      timestamps.push(now);
      
      // Store updated timestamps with expiration
      await kv.set(key, { timestamps }, {
        expireIn: config.windowMs * 2, // Keep data for 2x window for safety
      });
    }

    const oldestTimestamp = timestamps[0] || now;
    const resetAt = new Date(oldestTimestamp + config.windowMs);

    return {
      allowed,
      remaining: allowed ? remaining - 1 : 0,
      resetAt,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // On error, allow the request but log the failure
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now + config.windowMs),
    };
  }
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  // Try various headers in order of preference
  const ip = cfConnectingIp || realIp || forwarded?.split(",")[0].trim() || "unknown";
  
  return ip;
}

/**
 * Build a rate limit error response
 */
export function rateLimitErrorResponse(
  result: RateLimitResult,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded. Please try again later.",
      resetAt: result.resetAt.toISOString(),
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-RateLimit-Limit": "Rate limit active",
        "X-RateLimit-Reset": result.resetAt.toISOString(),
        "Retry-After": Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
      },
    }
  );
}

// Predefined rate limit configs for different endpoint types
export const RATE_LIMITS = {
  // AI endpoints - expensive operations
  AI_CHAT: {
    maxRequests: 10,
    windowMs: 60000, // 10 requests per minute
    keyPrefix: "ratelimit:ai-chat",
  },
  AI_TRIAGE: {
    maxRequests: 5,
    windowMs: 60000, // 5 requests per minute (expensive vision API)
    keyPrefix: "ratelimit:ai-triage",
  },
  // Booking/estimate endpoints
  BOOKING: {
    maxRequests: 20,
    windowMs: 300000, // 20 requests per 5 minutes
    keyPrefix: "ratelimit:booking",
  },
  ESTIMATE: {
    maxRequests: 20,
    windowMs: 300000, // 20 requests per 5 minutes
    keyPrefix: "ratelimit:estimate",
  },
  // General endpoints
  GENERAL: {
    maxRequests: 30,
    windowMs: 60000, // 30 requests per minute
    keyPrefix: "ratelimit:general",
  },
};
