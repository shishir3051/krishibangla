/**
 * env.ts — Validated server environment. Import `env` instead of reading process.env directly.
 *
 * Every key is optional so `next build` and CI work without secrets; features that need a key
 * (e.g. Gemini) check for it at request time and return a clear error.
 */
import 'server-only';
import { z } from 'zod';

// Treat `KEY=` (empty) the same as an unset key.
const optional = <T extends z.ZodType>(schema: T) => z.preprocess((v) => (v === '' ? undefined : v), schema.optional());

const schema = z.object({
  GEMINI_API_KEY: optional(z.string()),
  GEMINI_MODEL: optional(z.string()).transform((v) => v ?? 'gemini-2.5-flash'),
  UPSTASH_REDIS_REST_URL: optional(z.url()),
  UPSTASH_REDIS_REST_TOKEN: optional(z.string()),
  KV_REST_API_URL: optional(z.url()),
  KV_REST_API_TOKEN: optional(z.string()),
  WORLD_BANK_API_URL: optional(z.url()).transform((v) => v ?? 'https://api.worldbank.org/v2'),
});

export const env = schema.parse(process.env);
