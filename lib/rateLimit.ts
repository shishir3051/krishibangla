/**
 * rateLimit.ts — Per-IP rate limiting for the AI routes (/api/chat, /api/detect).
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN (or Vercel's KV_REST_API_URL/TOKEN)
 * are set, so limits are shared across all serverless instances. Without them it falls back
 * to an in-memory window, which is fine for local dev but NOT enforced across Vercel instances.
 */
import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/lib/env';

type LimitName = 'chat' | 'detect';
type Limit = { requests: number; window: `${number} m`; ms: number };

const LIMITS: Record<LimitName, Limit> = {
  chat: { requests: 20, window: '5 m', ms: 5 * 60_000 },
  detect: { requests: 10, window: '10 m', ms: 10 * 60_000 },
};

const redisUrl = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
const redisToken = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const upstashLimiters = redis
  ? (Object.fromEntries(
      (Object.entries(LIMITS) as [LimitName, Limit][]).map(([name, l]) => [
        name,
        new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(l.requests, l.window), prefix: `krishibangla:${name}` }),
      ])
    ) as Record<LimitName, Ratelimit>)
  : null;

const memoryHits = new Map<string, number[]>();

function memoryLimit(key: string, { requests, ms }: Limit): { success: boolean; reset: number } {
  const now = Date.now();
  if (memoryHits.size > 5000) {
    for (const [k, hits] of memoryHits) {
      if (now - hits[hits.length - 1] > ms) memoryHits.delete(k);
    }
  }
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < ms);
  if (hits.length >= requests) {
    memoryHits.set(key, hits);
    return { success: false, reset: hits[0] + ms };
  }
  hits.push(now);
  memoryHits.set(key, hits);
  return { success: true, reset: now + ms };
}

// Vercel sets x-real-ip itself, so prefer it over the client-controllable x-forwarded-for chain.
function clientIp(req: Request): string {
  return req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
}

/** Returns a 429 Response when the caller is over the limit for `name`, otherwise null. */
export async function rateLimit(name: LimitName, req: Request): Promise<Response | null> {
  const limit = LIMITS[name];
  const ip = clientIp(req);

  let result: { success: boolean; reset: number };
  try {
    result = upstashLimiters ? await upstashLimiters[name].limit(ip) : memoryLimit(`${name}:${ip}`, limit);
  } catch (error) {
    console.error('Rate limiter unavailable, using in-memory fallback:', error instanceof Error ? error.message : error);
    result = memoryLimit(`${name}:${ip}`, limit);
  }
  if (result.success) return null;

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return Response.json(
    { error: 'Too many requests. Please wait a few minutes and try again.', code: 'rate_limited' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
