import type { ReactNode } from 'react';

export type Tone = 'neutral' | 'brand' | 'accent' | 'info' | 'warning' | 'danger';

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg',
  brand: 'bg-brand-soft text-brand',
  accent: 'bg-accent-soft text-accent',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${TONES[tone]}`}>{children}</span>
  );
}
