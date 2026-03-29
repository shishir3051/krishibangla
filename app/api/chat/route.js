import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are KrishiBangla AI, a passionate and knowledgeable expert on Bangladesh's complete agricultural sector. Reply in the SAME LANGUAGE the user writes in — Bangla question = full Bangla answer, English question = full English answer.

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

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Fallback key handling if environment variable fails to load
    const GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyDcCXwAdRJQVpzjD-xFRImY2skgTdCUavI";

    // Debug logging to verify key loading
    console.log("KrishiBangla Chat API: Checking for GEMINI_API_KEY...");
    if (!GEMINI_KEY) {
      console.error("KrishiBangla Chat Error: GEMINI_API_KEY is not defined.");
      return new Response(JSON.stringify({ error: "Gemini API Key is missing. Please check your .env.local file." }), { status: 500 });
    }
    console.log("KrishiBangla Chat API: Key loaded (starts with: " + GEMINI_KEY.substring(0, 8) + "...)");

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
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
