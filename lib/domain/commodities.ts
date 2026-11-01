/**
 * commodities.ts — Display names for WFP commodity and unit names (the CSV is English-only).
 * Keys are WFP's exact `commodity` / `unit` strings; anything missing falls back to the WFP text.
 */
import type { Locale } from '@/lib/i18n';
import type { Bilingual } from './vocab';

/** Food items WFP has priced in Bangladesh since late 2024, in the order tables list them. */
const COMMODITIES: [wfp: string, name: Bilingual][] = [
  // Cereals and tubers
  ['Rice (coarse)', { en: 'Rice (coarse)', bn: 'মোটা চাল' }],
  ['Rice (coarse, BR-8/ 11/, Guti Sharna)', { en: 'Rice (coarse, BR-8/11, Guti Swarna)', bn: 'মোটা চাল (বিআর-৮/১১, গুটি স্বর্ণা)' }],
  ['Rice (BRRI-28)', { en: 'Rice (BRRI dhan28)', bn: 'চাল (ব্রি ধান২৮)' }],
  ['Rice (BRRI-29)', { en: 'Rice (BRRI dhan29)', bn: 'চাল (ব্রি ধান২৯)' }],
  ['Rice (BRRI-49)', { en: 'Rice (BRRI dhan49)', bn: 'চাল (ব্রি ধান৪৯)' }],
  ['Rice (Gazi)', { en: 'Rice (Gazi)', bn: 'চাল (গাজী)' }],
  ['Rice (Kajla)', { en: 'Rice (Kajla)', bn: 'চাল (কাজলা)' }],
  ['Rice (Nurjahan)', { en: 'Rice (Nurjahan)', bn: 'চাল (নূরজাহান)' }],
  ['Rice (Pyzam)', { en: 'Rice (Paijam)', bn: 'চাল (পাইজাম)' }],
  ['Wheat flour', { en: 'Wheat flour (atta)', bn: 'আটা' }],
  ['Wheat', { en: 'Wheat', bn: 'গম' }],
  ['Potatoes (Holland, white)', { en: 'Potatoes (Holland, white)', bn: 'আলু (হল্যান্ড, সাদা)' }],
  // Pulses
  ['Lentils (masur)', { en: 'Lentils (masur)', bn: 'মসুর ডাল' }],
  ['Beans (mung, large grain)', { en: 'Mung beans (large grain)', bn: 'মুগ ডাল (বড় দানা)' }],
  ['Chickpeas', { en: 'Chickpeas', bn: 'ছোলা' }],
  // Oil
  ['Oil (soybean, fortified)', { en: 'Soybean oil (fortified)', bn: 'সয়াবিন তেল (ভিটামিনযুক্ত)' }],
  ['Oil (palm)', { en: 'Palm oil', bn: 'পাম তেল' }],
  ['Oil (mustard)', { en: 'Mustard oil', bn: 'সরিষার তেল' }],
  // Other staples
  ['Sugar', { en: 'Sugar', bn: 'চিনি' }],
  ['Salt (iodized, Molla)', { en: 'Salt (iodised, Molla)', bn: 'লবণ (আয়োডিনযুক্ত, মোল্লা)' }],
  ['Turmeric (powder, Fresh)', { en: 'Turmeric powder (Fresh)', bn: 'হলুদের গুঁড়া (ফ্রেশ)' }],
  ['Chili (whole, dry, Indian Teja)', { en: 'Dry chilli (Indian Teja)', bn: 'শুকনা মরিচ (ভারতীয় তেজা)' }],
  // Vegetables and fruit
  ['Chili (green)', { en: 'Green chilli', bn: 'কাঁচা মরিচ' }],
  ['Onions (imported, China)', { en: 'Onions (imported, China)', bn: 'পেঁয়াজ (আমদানি, চীন)' }],
  ['Onions (imported, India)', { en: 'Onions (imported, India)', bn: 'পেঁয়াজ (আমদানি, ভারত)' }],
  ['Garlic (imported, China)', { en: 'Garlic (imported, China)', bn: 'রসুন (আমদানি, চীন)' }],
  ['Ginger (imported)', { en: 'Ginger (imported)', bn: 'আদা (আমদানি)' }],
  ['Ginger (local)', { en: 'Ginger (local)', bn: 'আদা (দেশি)' }],
  ['Tomatoes (red)', { en: 'Tomatoes', bn: 'টমেটো' }],
  ['Eggplants', { en: 'Aubergine (brinjal)', bn: 'বেগুন' }],
  ['Gourd (bottle)', { en: 'Bottle gourd', bn: 'লাউ' }],
  ['Gourd (bitter)', { en: 'Bitter gourd', bn: 'করলা' }],
  ['Snake gourd', { en: 'Snake gourd', bn: 'চিচিঙ্গা' }],
  ['Papaya (green)', { en: 'Green papaya', bn: 'কাঁচা পেঁপে' }],
  ['Pumpkin', { en: 'Pumpkin', bn: 'মিষ্টিকুমড়া' }],
  ['Hyacinth (sim)', { en: 'Hyacinth bean (shim)', bn: 'শিম' }],
  ['Cabbage', { en: 'Cabbage', bn: 'বাঁধাকপি' }],
  ['Cauliflower', { en: 'Cauliflower', bn: 'ফুলকপি' }],
  ['Carrots', { en: 'Carrots', bn: 'গাজর' }],
  ['Cucumber (short, khira)', { en: 'Cucumber (khira)', bn: 'খিরা' }],
  ['Spinach (red)', { en: 'Red amaranth (lal shak)', bn: 'লাল শাক' }],
  ['Spinach (malabar)', { en: 'Malabar spinach (pui shak)', bn: 'পুঁই শাক' }],
  ['Lemon (medium size)', { en: 'Lemon (medium)', bn: 'লেবু (মাঝারি)' }],
  ['Bananas (ripe)', { en: 'Bananas (ripe)', bn: 'পাকা কলা' }],
  ['Bananas (green)', { en: 'Bananas (green, cooking)', bn: 'কাঁচা কলা' }],
  ['Oranges (malta)', { en: 'Malta oranges', bn: 'মাল্টা' }],
  ['Apples (royal gala)', { en: 'Apples (Royal Gala)', bn: 'আপেল (রয়্যাল গালা)' }],
  // Meat, fish, eggs and milk
  ['Eggs (brown)', { en: 'Eggs (brown)', bn: 'ডিম (লাল)' }],
  ['Eggs (white)', { en: 'Eggs (white)', bn: 'ডিম (সাদা)' }],
  ['Meat (chicken, broiler)', { en: 'Chicken (broiler)', bn: 'ব্রয়লার মুরগি' }],
  ['Meat (chicken, sonali)', { en: 'Chicken (Sonali)', bn: 'সোনালি মুরগি' }],
  ['Meat (beef)', { en: 'Beef', bn: 'গরুর মাংস' }],
  ['Fish (live, pangasius)', { en: 'Pangas fish (live)', bn: 'পাঙ্গাশ মাছ (জীবিত)' }],
  ['Fish (live, tilapia)', { en: 'Tilapia (live)', bn: 'তেলাপিয়া মাছ (জীবিত)' }],
  ['Fish (tilapia, fresh)', { en: 'Tilapia (fresh)', bn: 'তেলাপিয়া মাছ (তাজা)' }],
  ['Fish (dry, belt 10-12")', { en: 'Dried ribbonfish (10–12 inch)', bn: 'ছুরি শুঁটকি (১০–১২ ইঞ্চি)' }],
  ['Milk', { en: 'Milk', bn: 'দুধ' }],
  ['Milk (cow, pasteurized)', { en: 'Cow milk (pasteurised)', bn: 'গরুর দুধ (পাস্তুরিত)' }],
  ['Milk (powder)', { en: 'Milk powder', bn: 'গুঁড়া দুধ' }],
];

const NAMES = new Map(COMMODITIES.map(([wfp, name]) => [wfp, name]));
const ORDER = new Map(COMMODITIES.map(([wfp], i) => [wfp, i]));

/** Staples for the home-page snapshot, in priority order (items without recent data are skipped). */
export const KEY_STAPLES = [
  'Rice (coarse)',
  'Lentils (masur)',
  'Oil (soybean, fortified)',
  'Eggs (brown)',
  'Chili (green)',
  'Wheat flour',
  'Potatoes (Holland, white)',
  'Sugar',
  'Onions (imported, China)',
];

const UNITS: Record<string, Bilingual> = {
  KG: { en: 'kg', bn: 'কেজি' },
  L: { en: 'litre', bn: 'লিটার' },
  '1 piece': { en: 'piece', bn: 'পিস' },
  '10 pcs': { en: '10 pieces', bn: '১০ পিস' },
  '500 G': { en: '500 g', bn: '৫০০ গ্রাম' },
  '100 KG': { en: '100 kg', bn: '১০০ কেজি' },
};

export function commodityName(wfp: string, locale: Locale): string {
  return NAMES.get(wfp)?.[locale] ?? wfp;
}

export function hasCommodityName(wfp: string): boolean {
  return NAMES.has(wfp);
}

/** Unit noun, e.g. 'KG' → 'kg' / 'কেজি', '1 piece' → 'piece' / 'পিস' (shown as "per kg" / "প্রতি কেজি"). */
export function unitName(unit: string, locale: Locale): string {
  return UNITS[unit]?.[locale] ?? unit;
}

/** Sort comparator: the list order above, then anything unknown alphabetically. */
export function compareCommodities(a: string, b: string): number {
  return (ORDER.get(a) ?? Infinity) - (ORDER.get(b) ?? Infinity) || a.localeCompare(b);
}
