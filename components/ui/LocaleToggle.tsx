'use client';
import { useLanguage } from '@/components/LanguageProvider';

/** Switches /bn ↔ /en for the current page and remembers the choice (see LanguageProvider). */
export function LocaleToggle({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  const { toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={ariaLabel}
      className="h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-2"
    >
      {label}
    </button>
  );
}
