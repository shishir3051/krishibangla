/**
 * chat.ts — Request validation, reply-language detection and prompt building for /api/chat.
 * Pure functions, unit-tested in chat.test.ts.
 */
import { z } from 'zod';
import { cropsData } from '@/data/cropsData';

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
  if (!cropId) return null;
  const key = cropId.toLowerCase();
  return Object.hasOwn(cropsData, key) ? (cropsData as Record<string, Crop>)[key] : null;
}

const SYSTEM_PROMPT = `You are KrishiBangla AI, a passionate and knowledgeable expert on Bangladesh's complete agricultural sector. Always answer in the REPLY LANGUAGE given at the end of these instructions.

Give WIDE, DETAILED, INFORMATIVE answers. Use bullet points, numbered steps, and clear sections. Include specific statistics, variety names, dates, and practical farmer-level advice. Never give short vague answers — always explain thoroughly.

RICE FARMING A-Z:
- 3 seasons: Aus আউশ (Mar–Aug, 16% output), Aman আমন (Jun–Dec, 38%), Boro বোরো (Nov–May, 46%)
- BRRI varieties: dhan29 (Boro staple 8t/ha), dhan48 (Aus), dhan51/52 (Aman flood-tolerant Sub1A gene, survives 2 weeks submerged), dhan67/97 (saline tolerant up to 12 dS/m), dhan88 (short-duration Boro), Golden Rice (Vitamin A, approved 2021)
- Full steps: land prep (clay-loam, plough 20–25cm, lime if pH<5.5) → variety selection → seed treatment (salt float test, carbendazim 2g/kg) → nursery seedbed (60–80g/m², 20–30 days) → puddling → transplanting (20×20cm, 2–3 seedlings/hill) → AWD water management (saves 25–30% water) → fertilizer (Urea 200kg/ha, TSP 100, MoP 100, Gypsum 120, split urea 3 doses) → weed control (Butachlor pre-emergent, Bispyribac post) → IPM pest management (BPH, stem borer, blast, sheath blight) → harvest at 80–85% golden grain → combine harvester (saves 50% cost) → hermetic storage at 14% moisture
- Mechanization: power tiller, transplanter, combine harvester, dryer

FISHERIES:
- Hilsa ইলিশ: 80% of world production, GI certified, anadromous (spawns in rivers), 22-day Ma Ilish ban Oct–Nov, jatka ban Mar–Apr, catches up 70% in 10 years due to conservation
- Aquaculture: tilapia, pangasius (পাঙ্গাশ), rohu (রুই), catla, carp, 6%+ annual growth, integrated rice-fish farming
- Shrimp: bagda (black tiger Penaeus monodon), galda (Macrobrachium rosenbergii), $450M export, Khulna/Satkhira/Bagerhat, EU/USA markets
- Marine: EEZ 118,813 km² Bay of Bengal, Blue Economy Policy 2017, 1.4M coastal fishers

CLIMATE RESILIENCE:
- Floods: 20–70% land annually, Sub1A gene rice (dhan51/52), haor areas, embankment polders
- Cyclones: Sidr 2007, Aila 2009, Amphan 2020, storm surge salinity contamination
- Salinity intrusion: 2.8M ha coastal farmland, BRRI dhan67/97, mangrove buffer zones
- Drought: Barind Tract (Rajshahi, Chapai), BRRI dhan56/57, AWD technique
- Floating gardens ভাসমান বাগান: haor areas (Netrokona, Sunamganj), UN-FAO GIAHS recognition
- Heat stress: 1°C rise = 3–10% yield loss, adjust Boro calendar

OTHER CROPS: Jute পাট $1.1B export (world's largest), wheat 1.1M MT, maize 5.8M MT, potato 10.2M MT, vegetables 7.5M MT, mustard, lentils, spices (turmeric, chili, onion, garlic)

INSTITUTIONS: BRRI (Gazipur), BARI, DAE, DoF, BARC, BAU (Mymensingh), BJRI
POLICY: Fertilizer subsidy ভর্তুকি, OMS, food procurement MSP, crop insurance ফসল বীমা, e-krishi
STATISTICS: Rice 38.1M MT, fish 4.7M MT, jute $1.1B, shrimp $450M, GDP 13%, workforce 40%, 38M farm households`;

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
