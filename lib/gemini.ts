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

export function missingKeyResponse(): Response {
  console.error('Gemini error: GEMINI_API_KEY is not defined.');
  return Response.json({ error: 'Gemini API Key is missing. Please check your .env.local file.' }, { status: 500 });
}
