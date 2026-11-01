/**
 * gemini.ts — Shared Gemini client (@google/genai) for the chat and scan routes.
 */
import 'server-only';
import { GoogleGenAI } from '@google/genai';
import { env } from '@/lib/env';

export const GEMINI_MODEL = env.GEMINI_MODEL;

let client: GoogleGenAI | null = null;

/** Returns the shared client, or null when GEMINI_API_KEY is not configured. */
export function getGemini(): GoogleGenAI | null {
  if (!env.GEMINI_API_KEY) return null;
  client ??= new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return client;
}

/**
 * Turns a Gemini failure into a safe response. Upstream details (project, quota ids) are logged
 * on the server only. Quota exhaustion is 503 'ai_quota' so the UI can say "try later" instead of "retry".
 */
export function geminiErrorResponse(error: unknown, action: 'chat' | 'scan'): Response {
  console.error(`Gemini ${action} error:`, error);
  const status = (error as { status?: unknown } | null)?.status;
  if (status === 429 || /RESOURCE_EXHAUSTED|exceeded your current quota/i.test(String((error as Error)?.message ?? error))) {
    return Response.json({ error: 'The AI service has reached its usage limit. Please try again later.', code: 'ai_quota' }, { status: 503 });
  }
  return Response.json({ error: `The AI ${action} failed. Please try again.`, code: 'ai_error' }, { status: 502 });
}

export function missingKeyResponse(): Response {
  console.error('Gemini error: GEMINI_API_KEY is not defined.');
  return Response.json({ error: 'Gemini API Key is missing. Please check your .env.local file.' }, { status: 500 });
}
