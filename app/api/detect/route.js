import { GoogleGenerativeAI } from '@google/generative-ai';

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
  "message_bn": "গাছটি সম্পূর্ণ সুস্থ দেখাচ্ছে। কোনো রোগব্যাধি পাওয়া যায়নি।"
}`;

export async function POST(req) {
  try {
    const { image } = await req.json();
    
    // Fallback key handling if environment variable fail to load
    const GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyDcCXwAdRJQVpzjD-xFRImY2skgTdCUavI";
    
    // Debug logging to verify key loading
    console.log("KrishiBangla API: Checking for GEMINI_API_KEY...");
    if (!GEMINI_KEY) {
      console.error("KrishiBangla Error: GEMINI_API_KEY is not defined.");
      return new Response(JSON.stringify({ error: "Gemini API Key is missing. Please check your .env.local file." }), { status: 500 });
    }
    console.log("KrishiBangla API: Key loaded (starts with: " + GEMINI_KEY.substring(0, 8) + "...)");

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    // Extract base64 part
    const base64Data = image.split(',')[1];

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      },
      { text: SYSTEM_PROMPT }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handling potential markdown formatting)
    const jsonString = text.includes('```json') 
      ? text.split('```json')[1].split('```')[0]
      : text;

    return new Response(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Gemini Detection Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
