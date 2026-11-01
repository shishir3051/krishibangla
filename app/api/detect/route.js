import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from '@/lib/rateLimit';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB

const SYSTEM_PROMPT = `You are KrishiBangla AI Disease Expert, a high-precision Vision Model. You specialize in identifying diseases in crops and vegetables grown in Bangladesh.

CRITICAL INSTRUCTIONS:
1. READ IMAGE TEXT: If the image contains any text labels or titles (e.g., "RHIZOCTONIA", "BLAST"), prioritize that information for the diagnosis as it provides definitive context.
2. POTATO SPECIALIZATION:
   - BLACK SCURF (Rhizoctonia): Manifests as black, "dirt-like" sclerotia on the surface that do not wash off.
   - COMMON SCAB: Manifests as pitted, corky, or raised lesions.
   - DO NOT CONFUSE THEM. Black spots = likely Rhizoctonia.
3. RICE/VEGETABLES: Maintain extreme precision for Blast, Blight, and Mosaic viruses.

Analyze the image with EXTREME PRECISION. Look at textures, colors, and any provided text.

RESPONSE FORMAT (JSON ONLY):
{
  "detected": true,
  "crop_en": "Crop Name",
  "crop_bn": "ফসলের নাম",
  "disease_en": "Disease Name",
  "disease_bn": "রোগের নাম",
  "confidence": 0.99,
  "description_en": "A highly technical analysis of symptoms and any visible text labels.",
  "description_bn": "লক্ষণ এবং দৃশ্যমান টেক্সট লেবেলের একটি অত্যন্ত প্রযুক্তিগত বিশ্লেষণ।",
  "treatment_en": ["Specific Action 1", "Specific Action 2"],
  "treatment_bn": ["নির্দিষ্ট পদক্ষেপ ১", "নির্দিষ্ট পদক্ষেপ ২"]
}

If no disease is found or the image is not an agricultural plant:
{
  "detected": false,
  "message_en": "Plant appears in peak health. No pathological patterns found.",
  "message_bn": "গাছটি সম্পূর্ণ সুস্থ দেখাচ্ছে। কোনো রোগব্যাধি পাওয়া যায়নি।"
}`;

export async function POST(req) {
  const limited = await rateLimit('detect', req);
  if (limited) return limited;

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const match = typeof body?.image === 'string' && body.image.match(/^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return Response.json({ error: 'Send the photo as a base64 image data URL.', code: 'invalid_image' }, { status: 400 });
    }
    const [, mimeType, base64Data] = match;
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return Response.json({ error: 'Only JPEG, PNG or WebP photos are supported.', code: 'unsupported_type' }, { status: 415 });
    }
    if (Math.floor((base64Data.length * 3) / 4) > MAX_BYTES) {
      return Response.json({ error: 'The photo is larger than 4 MB.', code: 'too_large' }, { status: 413 });
    }

    // Load API key strictly from environment variables — no hardcoded fallback
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      console.error("KrishiBangla Error: GEMINI_API_KEY is not defined.");
      return new Response(JSON.stringify({ error: "Gemini API Key is missing. Please check your .env.local file." }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: SYSTEM_PROMPT }
    ]);

    let diagnosis;
    try {
      diagnosis = JSON.parse(result.response.text());
    } catch {
      return Response.json({ error: 'The AI returned an unreadable result. Please try again.', code: 'bad_ai_output' }, { status: 502 });
    }
    return Response.json(diagnosis);

  } catch (error) {
    console.error("Gemini Detection Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
