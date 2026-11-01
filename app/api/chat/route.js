import { GoogleGenerativeAI } from '@google/generative-ai';
import { cropsData } from '@/data/cropsData';
import { rateLimit } from '@/lib/rateLimit';

const MAX_MESSAGES = 20;   // most recent messages sent to the model
const MAX_HISTORY = 100;   // longer conversations are rejected outright
const MAX_CHARS = 4000;    // per message

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

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return 'messages must be a non-empty array.';
  if (messages.length > MAX_HISTORY) return 'This conversation is too long. Please start a new chat.';
  for (const m of messages) {
    if (m?.role !== 'user' && m?.role !== 'assistant') return 'Only "user" and "assistant" roles are allowed.';
    if (typeof m.content !== 'string') return 'Message content must be text.';
    if (m.content.length > MAX_CHARS) return `Each message must be under ${MAX_CHARS} characters.`;
  }
  const last = messages[messages.length - 1];
  if (last.role !== 'user' || !last.content.trim()) return 'The last message must be a non-empty user question.';
  return null;
}

// Bangla script outweighs Latin letters → reply in Bangla; otherwise English.
function detectLanguage(text) {
  const bangla = (text.match(/[ঀ-৿]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  return bangla > latin ? 'bn' : 'en';
}

function buildSystemPrompt(replyLanguage, crop) {
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

export async function POST(req) {
  const limited = await rateLimit('chat', req);
  if (limited) return limited;

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const problem = validateMessages(body?.messages);
    if (problem) return Response.json({ error: problem }, { status: 400 });

    const messages = body.messages.slice(-MAX_MESSAGES);
    const cropId = typeof body.context?.cropId === 'string' ? body.context.cropId.toLowerCase() : null;
    const crop = cropId ? cropsData[cropId] ?? null : null;
    const replyLanguage = detectLanguage(messages[messages.length - 1].content);
    
    // Load API key strictly from environment variables — no hardcoded fallback
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      console.error("KrishiBangla Chat Error: GEMINI_API_KEY is not defined.");
      return new Response(JSON.stringify({ error: "Gemini API Key is missing. Please check your .env.local file." }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemPrompt(replyLanguage, crop),
    });

    // Formatting messages for Gemini - Ensuring no empty content or invalid roles
    const historyData = messages.slice(0, -1)
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Gemini requires history to start with a 'user' message and alternate correctly
    const formattedHistory = historyData.length > 0 && historyData[0].role === 'model' 
      ? historyData.slice(1) 
      : historyData;

    // Last message is the user prompt
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              const fakeSSE = JSON.stringify({
                type: 'content_block_delta',
                delta: {
                  type: 'text_delta',
                  text: chunkText
                }
              });
              controller.enqueue(encoder.encode(`data: ${fakeSSE}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
