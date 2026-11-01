/**
 * dictionary.ts — UI strings per locale (messages/*.json). Server components load the whole
 * dictionary; client components receive only the strings they need as props.
 */
import 'server-only';
import type { Locale } from './i18n';
import type en from '@/messages/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/messages/en.json').then((m) => m.default),
  bn: () => import('@/messages/bn.json').then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();

/** Fills `{name}` placeholders: fill('{n} districts', { n: 64 }) → '64 districts'. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
