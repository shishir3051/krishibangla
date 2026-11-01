/**
 * scan.ts — Image validation, prompt and response schema for /api/detect (crop disease scan).
 * Pure functions, unit-tested in scan.test.ts.
 */
import { Type, type Schema } from '@google/genai';
import { z } from 'zod';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB

type ImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type ImageInput = { mimeType: ImageType; data: string };
type ImageError = { ok: false; status: 400 | 413 | 415; code: string; error: string };

/** Validates a `data:image/...;base64,...` URL and returns Gemini inline data. */
export function parseImageDataUrl(value: unknown): { ok: true; image: ImageInput } | ImageError {
  const match = typeof value === 'string' ? value.match(/^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!match) {
    return { ok: false, status: 400, code: 'invalid_image', error: 'Send the photo as a base64 image data URL.' };
  }
  const [, mimeType, data] = match;
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType)) {
    return { ok: false, status: 415, code: 'unsupported_type', error: 'Only JPEG, PNG or WebP photos are supported.' };
  }
  if (Math.floor((data.length * 3) / 4) > MAX_IMAGE_BYTES) {
    return { ok: false, status: 413, code: 'too_large', error: 'The photo is larger than 4 MB.' };
  }
  return { ok: true, image: { mimeType: mimeType as ImageType, data } };
}

export const SCAN_PROMPT = `You are KrishiBangla AI Disease Expert, a high-precision Vision Model. You specialize in identifying diseases in crops and vegetables grown in Bangladesh.

CRITICAL INSTRUCTIONS:
1. READ IMAGE TEXT: If the image contains any text labels or titles (e.g., "RHIZOCTONIA", "BLAST"), prioritize that information for the diagnosis as it provides definitive context.
2. POTATO SPECIALIZATION:
   - BLACK SCURF (Rhizoctonia): Manifests as black, "dirt-like" sclerotia on the surface that do not wash off.
   - COMMON SCAB: Manifests as pitted, corky, or raised lesions.
   - DO NOT CONFUSE THEM. Black spots = likely Rhizoctonia.
3. RICE/VEGETABLES: Maintain extreme precision for Blast, Blight, and Mosaic viruses.

Analyze the image with EXTREME PRECISION. Look at textures, colors, and any provided text.

If a disease is found: set detected=true and fill crop_en/crop_bn, disease_en/disease_bn, confidence (0 to 1),
description_en/description_bn (technical analysis of the symptoms and any visible text labels) and
treatment_en/treatment_bn (specific actions).
If no disease is found or the image is not an agricultural plant: set detected=false and fill message_en/message_bn.
All *_bn fields must be in Bangla.`;

const str = { type: Type.STRING };
const strList = { type: Type.ARRAY, items: str };

const diagnosisProperties = {
  detected: { type: Type.BOOLEAN },
  crop_en: str,
  crop_bn: str,
  disease_en: str,
  disease_bn: str,
  confidence: { type: Type.NUMBER },
  description_en: str,
  description_bn: str,
  treatment_en: strList,
  treatment_bn: strList,
  message_en: str,
  message_bn: str,
};

/**
 * Gemini structured-output schema; zod below re-validates what comes back.
 * Every field is required so the model fills both languages (irrelevant fields come back empty).
 */
export const diagnosisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: diagnosisProperties,
  required: Object.keys(diagnosisProperties),
};

// Blank or missing text → fallback, so a partial answer never shows an empty card.
const textOr = (fallback: string) =>
  z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v : fallback));

const diagnosisSchema = z.discriminatedUnion('detected', [
  z.object({
    detected: z.literal(true),
    crop_en: z.string(),
    crop_bn: z.string(),
    disease_en: z.string(),
    disease_bn: z.string(),
    // Models sometimes answer 0–100; normalise to 0–1.
    confidence: z
      .number()
      .transform((v) => (v > 1 ? v / 100 : v))
      .pipe(z.number().min(0).max(1))
      .default(0),
    description_en: z.string().default(''),
    description_bn: z.string().default(''),
    treatment_en: z.array(z.string()).default([]),
    treatment_bn: z.array(z.string()).default([]),
  }),
  z.object({
    detected: z.literal(false),
    message_en: textOr('No disease was detected in this photo.'),
    message_bn: textOr('এই ছবিতে কোনো রোগ শনাক্ত হয়নি।'),
  }),
]);

export type Diagnosis = z.infer<typeof diagnosisSchema>;

/** Parses the model's JSON text; returns null when it is missing or doesn't match the schema. */
export function parseDiagnosis(text: string | undefined): Diagnosis | null {
  if (!text) return null;
  try {
    const result = diagnosisSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
