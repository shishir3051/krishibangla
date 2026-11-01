/**
 * chat.ts — Request validation, reply-language detection and prompt building for /api/chat.
 * Pure functions, unit-tested in chat.test.ts.
 */
import { z } from 'zod';
import { getCrop } from '@/lib/domain/crops';

export const MAX_MESSAGES = 20; // most recent messages sent to the model
export const MAX_HISTORY = 100; // longer conversations are rejected outright
export const MAX_CHARS = 4000; // per message

const messageSchema = z.object({
  role: z.enum(['user', 'assistant'], { error: 'Only "user" and "assistant" roles are allowed.' }),
  content: z
    .string({ error: 'Message content must be text.' })
    .max(MAX_CHARS, { error: `Each message must be under ${MAX_CHARS} characters.` }),
});

const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema, { error: 'messages must be a non-empty array.' })
    .min(1, { error: 'messages must be a non-empty array.' })
    .max(MAX_HISTORY, { error: 'This conversation is too long. Please start a new chat.' })
    .refine((messages) => messages.at(-1)?.role === 'user' && messages.at(-1)?.content.trim() !== '', {
      error: 'The last message must be a non-empty user question.',
    }),
  context: z.object({ cropId: z.string().max(40).optional() }).optional(),
});

export type ChatMessage = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ReplyLanguage = 'bn' | 'en';
type Crop = { en: string; bn: string };

/** Returns the parsed request, or the first validation error as a user-facing message. */
export function parseChatRequest(body: unknown): { ok: true; data: ChatRequest } | { ok: false; error: string } {
  const result = chatRequestSchema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.issues[0]?.message ?? 'Invalid request.' };
}

/** Bangla script outweighs Latin letters → reply in Bangla; otherwise English. */
export function detectLanguage(text: string): ReplyLanguage {
  const bangla = (text.match(/[ঀ-৿]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return bangla > latin ? 'bn' : 'en';
}

/** Looks up crop context sent by a crop page; unknown ids are ignored. */
export function findCrop(cropId: string | undefined): Crop | null {
  const crop = cropId ? getCrop(cropId.toLowerCase()) : undefined;
  return crop ? crop.name : null;
}

const SYSTEM_PROMPT = `You are KrishiBangla AI, a knowledgeable and practical assistant for farmers and fishers in Bangladesh. Always answer in the REPLY LANGUAGE given at the end of these instructions.

HOW TO ANSWER
- Be clear and practical: short sections, bullet points or numbered steps, focused on what the farmer can do now.
- Never invent numbers. Do not state production figures, prices, market shares, percentages or yields unless they are well-established published recommendations you are confident about, and then say who recommends them (e.g. "BRRI recommends…"). If you are not sure, say so.
- For fertiliser and pesticide doses, explain the general approach and tell the user to follow the product label and their local Department of Agricultural Extension (DAE) office.
- Weather, market prices and disaster alerts change daily: point users to KrishiBangla's district desk, markets and climate pages instead of guessing current values.
- For anything serious or uncertain, suggest the Upazila agriculture or fisheries office, or the Krishi Call Center (16123).

BACKGROUND (general knowledge, not current figures)
- Rice has three seasons: Aus (pre-monsoon, about March–August), Aman (monsoon, about June–December) and Boro (dry season, irrigated, about November–May). BRRI breeds varieties for each, including submergence-tolerant (Sub1) and salt-tolerant varieties.
- Good rice practice: quality seed and seed treatment, healthy seedbeds, timely transplanting at the recommended spacing, alternate wetting and drying (AWD) to save irrigation water, fertiliser based on soil tests, integrated pest management (IPM) for brown planthopper, stem borer, blast and sheath blight, harvesting at the right maturity and drying grain well before storage.
- Fisheries: hilsa conservation relies on seasonal fishing bans during spawning and protection of juvenile hilsa (jatka); pond aquaculture of carps, pangasius and tilapia; shrimp and prawn farming in the south-west coastal districts.
- Climate risks: river floods, flash floods in the haor, cyclones and storm surges, salinity in coastal areas, drought in the Barind tract, cold waves and heat stress.
- Institutions: BRRI, BARI, BINA, BJRI, DAE, the Department of Fisheries (DoF), BARC and Bangladesh Agricultural University.`;

export function buildSystemPrompt(replyLanguage: ReplyLanguage, crop: Crop | null): string {
  let prompt = `${SYSTEM_PROMPT}\n\nREPLY LANGUAGE: ${
    replyLanguage === 'bn'
      ? 'Write the entire answer in Bangla (বাংলা).'
      : 'Write the entire answer in English. Bangla terms may appear only in brackets.'
  }`;
  if (crop) {
    prompt += `\n\nFOCUS: The user is reading the ${crop.en} (${crop.bn}) guide. Act as an agronomist specialised in ${crop.en} in Bangladesh and give precise, actionable advice.`;
  }
  return prompt;
}

/** Chat history → Gemini contents: assistant becomes "model", empty turns and a leading model turn are dropped. */
export function toGeminiContents(messages: ChatMessage[]) {
  const contents = messages
    .filter((m) => m.content.trim() !== '')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  while (contents[0]?.role === 'model') contents.shift();
  return contents;
}
