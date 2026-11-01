/**
 * format.ts — Price and month formatting for the markets UI (safe in client components).
 * Builds on lib/format.ts: Bengali digits for Bangla, Asia/Dhaka calendar.
 */
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

/**
 * 'YYYY-MM' → "Jul 2026" / "জুলাই ২০২৬" (Bangla short month names are not in common use).
 * ICU spells জানুয়ারী/ফেব্রুয়ারী; the Bangla Academy spelling is জানুয়ারি/ফেব্রুয়ারি.
 */
export function formatMonth(locale: Locale, month: string): string {
  const text = new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    month: locale === 'bn' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(`${month}-15T12:00:00+06:00`));
  return locale === 'bn' ? text.replace('ুয়ারী', 'ুয়ারি') : text;
}

/** Taka with useful precision: ৳10.6 per egg, ৳55.9 per kg of atta, ৳189 per litre of oil. */
export function formatTaka(locale: Locale, value: number): string {
  return `৳${formatNumber(locale, value, value < 100 ? 1 : 0)}`;
}

/** Absolute percentage, e.g. 2.2% / ২.২% (direction is shown separately). */
export function formatPct(locale: Locale, pct: number): string {
  return `${formatNumber(locale, Math.abs(pct), 1)}%`;
}
