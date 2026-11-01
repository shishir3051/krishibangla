/**
 * dictionary.ts — UI strings per locale. Common strings live in messages/{en,bn}.json; each feature
 * has its own messages/<feature>.{en,bn}.json, exposed as dict.<feature>. Server components load
 * the whole dictionary; client components receive only the strings they need as props.
 */
import 'server-only';
import type { Locale } from './i18n';
import type about from '@/messages/about.en.json';
import type chat from '@/messages/chat.en.json';
import type climate from '@/messages/climate.en.json';
import type crops from '@/messages/crops.en.json';
import type common from '@/messages/en.json';
import type home from '@/messages/home.en.json';
import type markets from '@/messages/markets.en.json';
import type scan from '@/messages/scan.en.json';

export type Dictionary = typeof common & {
  home: typeof home;
  markets: typeof markets;
  climate: typeof climate;
  crops: typeof crops;
  scan: typeof scan;
  chat: typeof chat;
  about: typeof about;
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => ({
    ...(await import('@/messages/en.json')).default,
    home: (await import('@/messages/home.en.json')).default,
    markets: (await import('@/messages/markets.en.json')).default,
    climate: (await import('@/messages/climate.en.json')).default,
    crops: (await import('@/messages/crops.en.json')).default,
    scan: (await import('@/messages/scan.en.json')).default,
    chat: (await import('@/messages/chat.en.json')).default,
    about: (await import('@/messages/about.en.json')).default,
  }),
  // Bangla files must have the same keys as English (enforced by dictionary.test.ts).
  bn: async () => ({
    ...(await import('@/messages/bn.json')).default,
    home: (await import('@/messages/home.bn.json')).default,
    markets: (await import('@/messages/markets.bn.json')).default,
    climate: (await import('@/messages/climate.bn.json')).default,
    crops: (await import('@/messages/crops.bn.json')).default,
    scan: (await import('@/messages/scan.bn.json')).default,
    chat: (await import('@/messages/chat.bn.json')).default,
    about: (await import('@/messages/about.bn.json')).default,
  }) as Dictionary,
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();

/** Fills `{name}` placeholders: fill('{n} districts', { n: 64 }) → '64 districts'. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
