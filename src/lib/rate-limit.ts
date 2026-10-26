/**
 * Simple in-memory rate limiter (single-container friendly — Zerops app uses 1 container).
 * Survives neither redeploy nor multi-instance; still blocks casual brute force.
 */

type Bucket = {
  count: number;
  resetAt: number;
  blockedUntil: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function clientIpFromRequest(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

/**
 * @param key unique bucket key (e.g. `admin-login:1.2.3.4`)
 * @param limit max attempts in the window
 * @param windowMs sliding/fixed window length
 * @param blockMs extra lockout after limit is hit
 */
export function consumeRateLimit(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
  blockMs = 15 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs, blockedUntil: 0 };
    buckets.set(key, bucket);
  }

  if (bucket.blockedUntil > now) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    bucket.blockedUntil = now + blockMs;
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil(blockMs / 1000),
    };
  }

  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec: 0,
  };
}

/** Call after a successful login so the next attempts start clean. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}
