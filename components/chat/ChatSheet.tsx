'use client';
/**
 * ChatSheet — AI assistant in a side sheet, opened from the header, the mobile tab bar or page CTAs.
 * Right-hand sheet from md up, full-height bottom sheet on phones. The conversation UI (markdown,
 * streaming) is code-split and only loads the first time the sheet opens; after that it stays mounted
 * (hidden) so the conversation survives closing and reopening.
 *
 * CONTRACT (used by components/shell/*, keep these exports and props stable):
 *   <ChatProvider locale labels cropId?>{children}</ChatProvider>  renders children + the sheet
 *   useChatSheet().open()                                          opens the sheet
 */
import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';

type ChatSheetApi = { open: () => void };

const ChatSheetContext = createContext<ChatSheetApi>({ open: () => {} });

const ChatConversation = dynamic(() => import('./ChatConversation').then((m) => m.ChatConversation), {
  ssr: false,
  loading: () => (
    <div className="grid flex-1 place-items-center">
      <span aria-hidden className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  ),
});

export function ChatProvider({
  locale,
  labels,
  cropId,
  children,
}: {
  locale: Locale;
  labels: Dictionary['chat'];
  /** Crop page context, sent to /api/chat as context.cropId. */
  cropId?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const open = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const api = useMemo(() => ({ open }), [open]);

  // Navigating away hides this page (React Activity) instead of unmounting it: close the sheet so it
  // isn't still open when the reader comes back (and don't move focus to the old opener then).
  useLayoutEffect(
    () => () => {
      wasOpenRef.current = false;
      setIsOpen(false);
    },
    []
  );

  // Give focus back to whatever opened the sheet.
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      openerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <ChatSheetContext.Provider value={api}>
      {/* While the sheet is open the page behind it can't be focused, clicked or read (aria-modal). */}
      <div className="contents" inert={isOpen}>
        {children}
      </div>
      {hasOpened && (
        <Sheet open={isOpen} onClose={close} labels={labels} locale={locale}>
          <ChatConversation labels={labels} cropId={cropId} open={isOpen} />
        </Sheet>
      )}
    </ChatSheetContext.Provider>
  );
}

export const useChatSheet = () => useContext(ChatSheetContext);

function Sheet({
  open,
  onClose,
  labels,
  locale,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labels: Dictionary['chat'];
  locale: Locale;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // The conversation focuses its input; until it has loaded, focus the dialog itself.
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.isComposing) onClose();
    };
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden'; // no page scrolling behind the sheet
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <div hidden={!open} lang={locale} className="no-print fixed inset-0 z-50 font-ui text-fg">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/40 transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-x-0 top-6 bottom-0 flex flex-col overflow-hidden rounded-t-3xl border-t border-line bg-surface shadow-2xl outline-none transition-transform duration-300 ease-out starting:translate-y-full motion-reduce:transition-none md:top-0 md:left-auto md:w-[28rem] md:rounded-none md:rounded-l-3xl md:border-t-0 md:border-l md:starting:translate-x-full md:starting:translate-y-0"
      >
        <header className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-brand text-lg text-on-brand">
            🌾
          </span>
          <h2 id={titleId} className="font-semibold">
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            title={labels.close}
            className="ml-auto grid size-10 place-items-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg"
          >
            <span aria-hidden className="text-lg">
              ✕
            </span>
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
