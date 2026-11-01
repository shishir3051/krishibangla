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

/**
 * "YYYY-MM-DD" → "1 November 2026" / "১ নভেম্বর, ২০২৬".
 * ICU spells জানুয়ারী/ফেব্রুয়ারী; the Bangla Academy spelling is জানুয়ারি/ফেব্রুয়ারি.
 */
export function formatDate(locale: Locale, isoDate: string): string {
  const text = new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(
    new Date(`${isoDate}T12:00:00+06:00`)
  );
  return locale === 'bn' ? text.replace('ুয়ারী', 'ুয়ারি') : text;
}

/** ISO timestamp → day, month and time in Dhaka, e.g. "1 Nov, 14:05" / "১ নভে, ১৪:০৫". */
export function formatDateTime(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  }).format(new Date(iso));
}

/** ISO timestamp → time of day in Dhaka, e.g. "14:05" / "১৪:০৫". */
export function formatTime(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(new Date(iso));
}
