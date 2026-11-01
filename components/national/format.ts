/**
 * format.ts — Extra locale-aware formatters for the national-data and climate views
 * (years, months, date ranges, signed numbers). Asia/Dhaka; Bengali digits for Bangla.
 */
import type { Locale } from '@/lib/i18n';

const TZ = 'Asia/Dhaka';
const intlLocale = (locale: Locale) => (locale === 'bn' ? 'bn-BD' : 'en-GB');

/** CLDR spells two Bangla months with ী; Bangla Academy spelling (and most Bangladeshi media) use ি. */
const bnMonths = (text: string) => text.replace(/জানুয়ারী/g, 'জানুয়ারি').replace(/ফেব্রুয়ারী/g, 'ফেব্রুয়ারি');

/** 2024 → "2024" / "২০২৪" (no thousands separator). */
export function formatYear(locale: Locale, year: number): string {
  return new Intl.NumberFormat(intlLocale(locale), { useGrouping: false }).format(year);
}

/** +0.44 → "+0.4", −0.04 → "0.0" (a rounded zero carries no sign). */
export function formatSigned(locale: Locale, value: number, digits = 1): string {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: digits, minimumFractionDigits: digits, signDisplay: 'exceptZero' }).format(value);
}

/** Fixed decimals, e.g. 28.2 / ২৮.২. */
export function formatFixed(locale: Locale, value: number, digits = 1): string {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

/** "2026-09" → "Sept 2026" / "সেপ্টেম্বর ২০২৬" (Bangla short month names are inconsistent, so use full names). */
export function formatMonthYear(locale: Locale, yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number);
  return bnMonths(
    new Intl.DateTimeFormat(intlLocale(locale), { month: locale === 'bn' ? 'long' : 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 15)))
  );
}

/** Two ISO times → "21 May – 30 Oct 2026" / "২১ মে – ৩০ অক্টোবর, ২০২৬", in Dhaka time. */
export function formatDateRange(locale: Locale, fromIso: string, toIso: string): string {
  const fmt = new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: locale === 'bn' ? 'long' : 'short', year: 'numeric', timeZone: TZ });
  const from = new Date(fromIso);
  const to = new Date(toIso);
  return bnMonths(to < from ? fmt.format(from) : fmt.formatRange(from, to));
}

/** ISO time → "YYYY-MM-DD" in Dhaka, for <time dateTime>. */
export function dhakaDate(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}
