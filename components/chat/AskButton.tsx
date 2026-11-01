'use client';
import type { ReactNode } from 'react';
import { useChatSheet } from './ChatSheet';

/** Any button that opens the chat sheet (header, tab bar, page CTAs). */
export function AskButton({ className, children, ariaLabel }: { className?: string; children: ReactNode; ariaLabel?: string }) {
  const { open } = useChatSheet();
  return (
    <button type="button" onClick={open} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
