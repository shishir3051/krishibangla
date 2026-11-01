/**
 * chatStream.js — Client helper for the streaming /api/chat endpoint.
 * Buffers partial SSE lines across network chunks so no text is dropped.
 *
 * Imported by: AIChat.js, GenericCropGuide.js
 */

export class ChatError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * @param {{ messages: {role: 'user'|'assistant', content: string}[], context?: { cropId?: string }, signal?: AbortSignal, onText: (fullText: string) => void }} options
 * @returns {Promise<string>} the full reply text
 */
export async function streamChat({ messages, context, signal, onText }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
    signal,
  });
  if (!res.ok) throw new ChatError(`Chat request failed (${res.status})`, res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') return fullText;
      try {
        const obj = JSON.parse(raw);
        if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta' && obj.delta?.text) {
          fullText += obj.delta.text;
          onText(fullText);
        }
      } catch { }
    }
  }
  return fullText;
}
