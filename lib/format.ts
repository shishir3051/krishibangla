/**
 * format.ts — Locale-aware number/date formatting. Always Asia/Dhaka (servers run in UTC);
 * Bangla uses Bengali digits via the bn-BD locale.
 */
import type { Locale } from './i18n';

const TZ = 'Asia/Dhaka';
const intlLocale = (locale: Locale) => (locale === 'bn' ? 'bn-BD' : 'en-GB');

export function formatNumber(locale: Locale, value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits }).format(value);
}

/** "YYYY-MM-DD" (a Dhaka calendar day) → short weekday, e.g. "Mon" / "সোম". */
export function formatWeekday(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: 'short', timeZone: TZ }).format(new Date(`${isoDate}T12:00:00+06:00`));
}

/** "YYYY-MM-DD" → "3 Nov" / "৩ নভে". */
export function formatDayMonth(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', timeZone: TZ }).format(new Date(`${isoDate}T12:00:00+06:00`));
}

/** ISO timestamp → time of day in Dhaka, e.g. "14:05" / "১৪:০৫". */
export function formatTime(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(new Date(iso));
}
