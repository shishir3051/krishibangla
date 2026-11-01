'use client';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

// The inline script in the layout sets data-theme before paint; this button just flips it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
const getServerTheme = (): Theme | null => null;

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem('theme', next);
        } catch {
          // private mode: the choice just isn't remembered
        }
      }}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      title={theme === 'dark' ? labels.toLight : labels.toDark}
      className="grid size-10 place-items-center rounded-full border border-line bg-surface text-lg text-fg hover:bg-surface-2"
    >
      <span aria-hidden>{theme === 'dark' ? '☀️' : theme === 'light' ? '🌙' : '◐'}</span>
    </button>
  );
}
