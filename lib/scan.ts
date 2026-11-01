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

/** Same photo → same answer: no sampling randomness for scans. */
export const SCAN_GENERATION = { temperature: 0, seed: 7 } as const;

export const MAX_CANDIDATES = 3;

export const SCAN_PROMPT = `You are KrishiBangla's crop disease assistant for farmers in Bangladesh. Look at the photo and suggest what the problem might be.

A single photo is often not enough to be certain, so give a short ranked list of possible causes instead of one answer, and tell the farmer what to check to confirm.

INSTRUCTIONS
1. If the image contains text labels (e.g. "BLAST", "RHIZOCTONIA"), use them as context.
2. Potato: black, dirt-like crusts that do not wash off suggest black scurf (Rhizoctonia); corky, pitted or raised lesions suggest common scab.
3. If disease or pest damage is visible: set detected=true and fill crop_en/crop_bn. Fill candidates with 1 to ${MAX_CANDIDATES} possible causes, most likely first. For each give disease_en/disease_bn (the common name; in Bangla use the name farmers in Bangladesh use) and check_en/check_bn: one or two short, practical things the farmer can look at to confirm it or tell it apart from the other candidates (leaves, stems, pattern, smell, where on the plant). Only add a second or third cause if it is genuinely plausible from this photo.
4. description_en/description_bn: what is visible in the photo, in plain words.
5. treatment_en/treatment_bn: 3 to 5 practical steps that make sense for the listed causes — removing infected parts, spacing and airflow, watering, and a suitable control by active ingredient with "follow the product label". Never give doses.
6. If the plant looks healthy, or the image is not a crop: detected=false and fill message_en/message_bn.
7. photo_ok=false when the photo is too small, blurry, dark or far away to judge well, and fill photo_tip_en/photo_tip_bn with how to retake it; otherwise photo_ok=true with empty tips.

All *_bn fields must be natural Bangla. Leave fields that do not apply as empty strings or empty lists.`;

const str = { type: Type.STRING };
const strList = { type: Type.ARRAY, items: str };

const candidateSchema: Schema = {
  type: Type.OBJECT,
  properties: { disease_en: str, disease_bn: str, check_en: str, check_bn: str },
  required: ['disease_en', 'disease_bn', 'check_en', 'check_bn'],
};

const diagnosisProperties = {
  detected: { type: Type.BOOLEAN },
  crop_en: str,
  crop_bn: str,
  candidates: { type: Type.ARRAY, items: candidateSchema, maxItems: String(MAX_CANDIDATES) },
  description_en: str,
  description_bn: str,
  treatment_en: strList,
  treatment_bn: strList,
  message_en: str,
  message_bn: str,
  photo_ok: { type: Type.BOOLEAN },
  photo_tip_en: str,
  photo_tip_bn: str,
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

const text = z
  .string()
  .optional()
  .transform((v) => v?.trim() ?? '');

// Retake advice, only when the model judged the photo too poor to read well.
const photo = {
  photo_ok: z.boolean().default(true),
  photo_tip_en: text,
  photo_tip_bn: text,
};

const candidate = z.object({
  disease_en: z.string().trim().min(1),
  disease_bn: z.string().trim().min(1),
  check_en: text,
  check_bn: text,
});

const diagnosisSchema = z.discriminatedUnion('detected', [
  z.object({
    detected: z.literal(true),
    crop_en: z.string(),
    crop_bn: z.string(),
    // Ranked, most likely first; at least one usable cause is required.
    candidates: z
      .array(z.unknown())
      .transform((items) =>
        items
          .flatMap((item) => {
            const parsed = candidate.safeParse(item);
            return parsed.success ? [parsed.data] : [];
          })
          .slice(0, MAX_CANDIDATES)
      )
      .refine((list) => list.length > 0, { error: 'No usable candidate' }),
    description_en: text,
    description_bn: text,
    treatment_en: z.array(z.string()).default([]),
    treatment_bn: z.array(z.string()).default([]),
    ...photo,
  }),
  z.object({
    detected: z.literal(false),
    message_en: textOr('No disease was detected in this photo.'),
    message_bn: textOr('এই ছবিতে কোনো রোগ শনাক্ত হয়নি।'),
    ...photo,
  }),
]);

export type Diagnosis = z.infer<typeof diagnosisSchema>;
export type DiagnosisCandidate = z.infer<typeof candidate>;

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

