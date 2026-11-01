import { buildSystemPrompt, detectLanguage, findCrop, MAX_MESSAGES, parseChatRequest, toGeminiContents } from '@/lib/chat';
import { GEMINI_MODEL, geminiErrorResponse, getGemini, missingKeyResponse } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';

const encoder = new TextEncoder();
const sse = (data: string) => encoder.encode(`data: ${data}\n\n`);

export async function POST(req: Request) {
  const limited = await rateLimit('chat', req);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = parseChatRequest(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const gemini = getGemini();
  if (!gemini) return missingKeyResponse();

  const messages = parsed.data.messages.slice(-MAX_MESSAGES);
  const replyLanguage = detectLanguage(messages[messages.length - 1].content);
  const crop = findCrop(parsed.data.context?.cropId);

  try {
    const stream = await gemini.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: toGeminiContents(messages),
      config: { systemInstruction: buildSystemPrompt(replyLanguage, crop) },
    });

    // Same event shape the chat UIs already parse (see lib/chatStream.ts).
    const events = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(sse(JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text } })));
          }
          controller.enqueue(sse('[DONE]'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(events, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  } catch (error) {
    return geminiErrorResponse(error, 'chat');
  }
}
