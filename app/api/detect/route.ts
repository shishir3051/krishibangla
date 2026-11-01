import { GEMINI_MODEL, geminiErrorResponse, getGemini, missingKeyResponse } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';
import { diagnosisResponseSchema, parseDiagnosis, parseImageDataUrl, SCAN_GENERATION, SCAN_PROMPT } from '@/lib/scan';

export async function POST(req: Request) {
  const limited = await rateLimit('detect', req);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = parseImageDataUrl((body as { image?: unknown } | null)?.image);
  if (!parsed.ok) return Response.json({ error: parsed.error, code: parsed.code }, { status: parsed.status });

  const gemini = getGemini();
  if (!gemini) return missingKeyResponse();

  try {
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ inlineData: parsed.image }, { text: SCAN_PROMPT }] }],
      config: { ...SCAN_GENERATION, responseMimeType: 'application/json', responseSchema: diagnosisResponseSchema },
    });

    const diagnosis = parseDiagnosis(response.text);
    if (!diagnosis) {
      return Response.json({ error: 'The AI returned an unreadable result. Please try again.', code: 'bad_ai_output' }, { status: 502 });
    }
    return Response.json(diagnosis);
  } catch (error) {
    return geminiErrorResponse(error, 'scan');
  }
}
