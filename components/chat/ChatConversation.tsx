'use client';
/**
 * ChatConversation — the body of the chat sheet: greeting, quick prompts, streamed replies and the
 * question box. Loaded lazily by ChatSheet the first time the sheet opens.
 */
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Dictionary } from '@/lib/dictionary';
import { ChatError, streamChat } from '@/lib/chatStream';
import { ChatMarkdown } from './ChatMarkdown';

type Labels = Dictionary['chat'];
type Message = { role: 'user' | 'assistant'; content: string; status?: 'error' | 'stopped' };

const MAX_INPUT_HEIGHT = 128; // px, then the box scrolls

function cropLabels(labels: Labels, cropId: string | undefined) {
  return cropId && Object.hasOwn(labels.crops, cropId) ? labels.crops[cropId as keyof Labels['crops']] : undefined;
}

export function ChatConversation({ labels, cropId, open }: { labels: Labels; cropId?: string; open: boolean }) {
  const crop = cropLabels(labels, cropId);
  const prompts = crop?.prompts ?? labels.prompts;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0); // id of the latest request; replies to older ones are ignored
  const followRef = useRef(true); // keep the newest text in view unless the reader scrolled up

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Stop streaming if the sheet goes away (page change).
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const log = logRef.current;
    if (log && followRef.current) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  };

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const history = [
      ...messages.filter((m) => m.status !== 'error' && m.content.trim()).map(({ role, content }) => ({ role, content })),
      { role: 'user' as const, content: question },
    ];
    const id = ++requestRef.current;
    const updateReply = (patch: Partial<Message>) => {
      if (requestRef.current !== id) return;
      setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, ...patch } : m)));
    };

    setInput('');
    requestAnimationFrame(resizeInput);
    setMessages((prev) => [...prev, { role: 'user', content: question }, { role: 'assistant', content: '' }]);
    setBusy(true);
    followRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat({
        messages: history,
        context: cropId ? { cropId } : undefined,
        signal: controller.signal,
        onText: (content) => updateReply({ content }),
      });
    } catch (error) {
      if (controller.signal.aborted) updateReply({ status: 'stopped' });
      else updateReply({ content: error instanceof ChatError && error.status === 429 ? labels.tooMany : labels.connection, status: 'error' });
    } finally {
      if (requestRef.current === id) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }

  function newChat() {
    requestRef.current++;
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setMessages([]);
    inputRef.current?.focus();
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter adds a line; never send while an input method is composing (Bangla keyboards).
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void ask(input);
    }
  }

  return (
    <>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-label={labels.title}
        onScroll={(e) => {
          const el = e.currentTarget;
          followRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <Bubble role="assistant" who={labels.assistant}>
          <p>{labels.welcome}</p>
          <p className="mt-1.5">{crop?.greeting ?? labels.greeting}</p>
        </Bubble>

        {messages.length === 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-fg-muted">{labels.suggestions}</p>
            <ul className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onClick={() => void ask(p.prompt)}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-sm text-fg hover:border-brand hover:text-brand"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <Bubble key={i} role="user" who={labels.you}>
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
            </Bubble>
          ) : (
            <Bubble key={i} role="assistant" who={labels.assistant} error={m.status === 'error'}>
              {m.content ? (
                m.status === 'error' ? (
                  <p>{m.content}</p>
                ) : (
                  <ChatMarkdown text={m.content} />
                )
              ) : busy && i === messages.length - 1 ? (
                <p className="animate-pulse text-fg-muted">{labels.thinking}</p>
              ) : null}
              {m.status === 'stopped' && <p className="mt-1.5 text-xs text-fg-muted">{labels.stopped}</p>}
            </Bubble>
          )
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="border-t border-line px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2">
          <label htmlFor={inputId} className="sr-only">
            {labels.inputLabel}
          </label>
          <textarea
            id={inputId}
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeInput();
            }}
            onKeyDown={onInputKeyDown}
            placeholder={labels.placeholder}
            maxLength={4000}
            className="min-h-11 flex-1 resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-danger px-4 text-sm font-medium text-on-brand hover:opacity-90"
            >
              <span aria-hidden className="size-2.5 rounded-sm bg-current" />
              {labels.stop}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-11 shrink-0 rounded-xl bg-brand px-4 text-sm font-medium text-on-brand hover:opacity-90 disabled:opacity-50"
            >
              {labels.send}
            </button>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="text-xs text-fg-muted">{labels.note}</p>
          {messages.length > 0 && (
            <button type="button" onClick={newChat} className="shrink-0 text-xs font-medium text-brand underline underline-offset-2">
              {labels.newChat}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

function Bubble({ role, who, error, children }: { role: Message['role']; who: string; error?: boolean; children: ReactNode }) {
  const user = role === 'user';
  return (
    <div className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          user ? 'rounded-br-md bg-brand text-on-brand' : error ? 'rounded-bl-md bg-danger-soft text-danger' : 'rounded-bl-md bg-surface-2 text-fg'
        }`}
      >
        <span className="sr-only">{who}: </span>
        {children}
      </div>
    </div>
  );
}
