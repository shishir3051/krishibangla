/**
 * tcb.ts — TCB (Trading Corporation of Bangladesh) daily retail prices for Dhaka city, parsed from the
 * sheet TCB publishes every day (lib/sources/tcb.ts fetches it; lib/xlsx.ts reads it).
 * The sheet gives a lowest–highest price for each item today, a week ago, a month ago and a year ago.
 * Pure (no fetching), unit-tested in tcb.test.ts against a real sheet.
 */
import { excelSerialToIso, type SheetRow } from '@/lib/xlsx';
import type { Bilingual } from './vocab';

export type PriceRange = { min: number; max: number };
export const PERIODS = ['today', 'week', 'month', 'year'] as const;
export type Period = (typeof PERIODS)[number];

export const TCB_GROUPS = {
  rice: { en: 'Rice', bn: 'চাল' },
  flour: { en: 'Flour', bn: 'আটা ও ময়দা' },
  oil: { en: 'Edible oil', bn: 'ভোজ্য তেল' },
  pulses: { en: 'Pulses', bn: 'ডাল' },
  vegetables: { en: 'Vegetables', bn: 'সবজি' },
  protein: { en: 'Fish, meat and eggs', bn: 'মাছ, মাংস ও ডিম' },
  spices: { en: 'Spices', bn: 'মসলা' },
  other: { en: 'Other', bn: 'অন্যান্য' },
} satisfies Record<string, Bilingual>;
export type TcbGroup = keyof typeof TCB_GROUPS;
const GROUP_ORDER = Object.keys(TCB_GROUPS) as TcbGroup[];

export type TcbItem = {
  id: string | null; // catalog id, null for an item TCB added that the catalog does not know yet
  key: string; // unique per row (some items are priced in several pack sizes)
  name: Bilingual;
  unit: Bilingual;
  group: TcbGroup;
  prices: Record<Period, PriceRange | null>; // null = not on sale / not reported
};

export type TcbPrices = {
  date: string; // YYYY-MM-DD the prices are for
  dates: Record<Period, string | null>; // the comparison dates printed on the sheet
  markets: string | null; // the Dhaka markets TCB surveyed, as printed (Bangla)
  items: TcbItem[];
};

type CatalogEntry = { id: string; tcb: string; group: TcbGroup; name: Bilingual };

/** Food items on TCB's sheet as of Nov 2026: their exact sheet name, our group and display names. */
const CATALOG: CatalogEntry[] = [
  { id: 'rice-aromatic', tcb: 'চাল সুগন্ধী (পোলাও)', group: 'rice', name: { en: 'Aromatic rice (polao)', bn: 'সুগন্ধি চাল (পোলাও)' } },
  { id: 'rice-fine', tcb: 'চাল সরু (নাজির/মিনিকেট)', group: 'rice', name: { en: 'Fine rice (Nazir/Miniket)', bn: 'সরু চাল (নাজির/মিনিকেট)' } },
  { id: 'rice-medium', tcb: 'চাল (মাঝারী)পাইজাম/আটাশ', group: 'rice', name: { en: 'Medium rice (Paijam/BR-28)', bn: 'মাঝারি চাল (পাইজাম/আটাশ)' } },
  { id: 'rice-coarse', tcb: 'চাল (মোটা)/স্বর্ণা/চায়না ইরি', group: 'rice', name: { en: 'Coarse rice (Swarna/China IRRI)', bn: 'মোটা চাল (স্বর্ণা/চায়না ইরি)' } },
  { id: 'atta-loose', tcb: 'আটা সাদা (খোলা)', group: 'flour', name: { en: 'Wheat flour, atta (loose)', bn: 'সাদা আটা (খোলা)' } },
  { id: 'atta-packet', tcb: 'আটা (প্যাকেট)', group: 'flour', name: { en: 'Wheat flour, atta (packet)', bn: 'আটা (প্যাকেট)' } },
  { id: 'maida-loose', tcb: 'ময়দা (খোলা)', group: 'flour', name: { en: 'Refined flour, maida (loose)', bn: 'ময়দা (খোলা)' } },
  { id: 'maida-packet', tcb: 'ময়দা (প্যাকেট)', group: 'flour', name: { en: 'Refined flour, maida (packet)', bn: 'ময়দা (প্যাকেট)' } },
  { id: 'soybean-loose', tcb: 'সয়াবিন তেল (লুজ)', group: 'oil', name: { en: 'Soybean oil (loose)', bn: 'সয়াবিন তেল (খোলা)' } },
  { id: 'soybean-bottle', tcb: 'সয়াবিন তেল (বোতল)', group: 'oil', name: { en: 'Soybean oil (bottled)', bn: 'সয়াবিন তেল (বোতল)' } },
  { id: 'palm-loose', tcb: 'পাম অয়েল (লুজ)', group: 'oil', name: { en: 'Palm oil (loose)', bn: 'পাম তেল (খোলা)' } },
  { id: 'super-palm-loose', tcb: 'সুপার পাম অয়েল (লুজ)', group: 'oil', name: { en: 'Super palm oil (loose)', bn: 'সুপার পাম তেল (খোলা)' } },
  { id: 'rice-bran-oil', tcb: 'রাইস ব্রান তেল (বোতল)', group: 'oil', name: { en: 'Rice bran oil (bottled)', bn: 'রাইস ব্রান তেল (বোতল)' } },
  { id: 'lentil-large', tcb: 'মশুর ডাল (বড় দানা)', group: 'pulses', name: { en: 'Lentils, masur (large grain)', bn: 'মসুর ডাল (বড় দানা)' } },
  { id: 'lentil-medium', tcb: 'মশুর ডাল (মাঝারী দানা)', group: 'pulses', name: { en: 'Lentils, masur (medium grain)', bn: 'মসুর ডাল (মাঝারি দানা)' } },
  { id: 'lentil-small', tcb: 'মশুর ডাল (ছোট দানা)', group: 'pulses', name: { en: 'Lentils, masur (small grain)', bn: 'মসুর ডাল (ছোট দানা)' } },
  { id: 'mung', tcb: 'মুগ ডাল (মানভেদে)', group: 'pulses', name: { en: 'Mung dal (by quality)', bn: 'মুগ ডাল (মানভেদে)' } },
  { id: 'anchor', tcb: 'এ্যাংকর ডাল', group: 'pulses', name: { en: 'Anchor dal (split peas)', bn: 'অ্যাংকর ডাল' } },
  { id: 'chickpea', tcb: 'ছোলা (মানভেদে)', group: 'pulses', name: { en: 'Chickpeas (by quality)', bn: 'ছোলা (মানভেদে)' } },
  { id: 'potato', tcb: 'আলু (নতুন/পুরাতন)', group: 'vegetables', name: { en: 'Potato (new/old)', bn: 'আলু (নতুন/পুরাতন)' } },
  { id: 'onion-local', tcb: 'পিঁয়াজ (দেশী)', group: 'vegetables', name: { en: 'Onion (local)', bn: 'পেঁয়াজ (দেশি)' } },
  { id: 'onion-imported', tcb: 'পিঁয়াজ (আমদানি)', group: 'vegetables', name: { en: 'Onion (imported)', bn: 'পেঁয়াজ (আমদানি)' } },
  { id: 'garlic-local', tcb: 'রসুন (দেশী)', group: 'vegetables', name: { en: 'Garlic (local)', bn: 'রসুন (দেশি)' } },
  { id: 'garlic-imported', tcb: 'রসুন (আমদানি)', group: 'vegetables', name: { en: 'Garlic (imported)', bn: 'রসুন (আমদানি)' } },
  { id: 'ginger-local', tcb: 'আদা (দেশী)', group: 'vegetables', name: { en: 'Ginger (local)', bn: 'আদা (দেশি)' } },
  { id: 'ginger-imported', tcb: 'আদা (আমদানি)', group: 'vegetables', name: { en: 'Ginger (imported)', bn: 'আদা (আমদানি)' } },
  { id: 'green-chilli', tcb: 'কাঁচামরিচ', group: 'vegetables', name: { en: 'Green chilli', bn: 'কাঁচা মরিচ' } },
  { id: 'brinjal', tcb: 'বেগুন', group: 'vegetables', name: { en: 'Brinjal (eggplant)', bn: 'বেগুন' } },
  { id: 'cucumber', tcb: 'শসা', group: 'vegetables', name: { en: 'Cucumber', bn: 'শসা' } },
  { id: 'lemon', tcb: 'লেবু', group: 'vegetables', name: { en: 'Lemon', bn: 'লেবু' } },
  { id: 'rui', tcb: 'রুই', group: 'protein', name: { en: 'Rui fish', bn: 'রুই মাছ' } },
  { id: 'hilsa', tcb: 'ইলিশ', group: 'protein', name: { en: 'Hilsa', bn: 'ইলিশ মাছ' } },
  { id: 'beef', tcb: 'গরু', group: 'protein', name: { en: 'Beef', bn: 'গরুর মাংস' } },
  { id: 'mutton', tcb: 'খাসী', group: 'protein', name: { en: 'Goat meat', bn: 'খাসির মাংস' } },
  { id: 'chicken-broiler', tcb: 'মুরগী(ব্রয়লার)', group: 'protein', name: { en: 'Chicken (broiler)', bn: 'ব্রয়লার মুরগি' } },
  { id: 'chicken-local', tcb: 'মুরগী (দেশী)', group: 'protein', name: { en: 'Chicken (local)', bn: 'দেশি মুরগি' } },
  { id: 'eggs', tcb: 'ডিম (ফার্ম)', group: 'protein', name: { en: 'Eggs (farm)', bn: 'ফার্মের ডিম' } },
  { id: 'chilli-dried-local', tcb: 'শুকনা মরিচ (দেশী)', group: 'spices', name: { en: 'Dried chilli (local)', bn: 'শুকনা মরিচ (দেশি)' } },
  { id: 'chilli-dried-imported', tcb: 'শুকনা মরিচ (আমদানি)', group: 'spices', name: { en: 'Dried chilli (imported)', bn: 'শুকনা মরিচ (আমদানি)' } },
  { id: 'turmeric-local', tcb: 'হলুদ (দেশী)', group: 'spices', name: { en: 'Turmeric (local)', bn: 'হলুদ (দেশি)' } },
  { id: 'turmeric-imported', tcb: 'হলুদ (আমদানি)', group: 'spices', name: { en: 'Turmeric (imported)', bn: 'হলুদ (আমদানি)' } },
  { id: 'cumin', tcb: 'জিরা', group: 'spices', name: { en: 'Cumin', bn: 'জিরা' } },
  { id: 'cinnamon', tcb: 'দারুচিনি', group: 'spices', name: { en: 'Cinnamon', bn: 'দারুচিনি' } },
  { id: 'cloves', tcb: 'লবঙ্গ', group: 'spices', name: { en: 'Cloves', bn: 'লবঙ্গ' } },
  { id: 'cardamom', tcb: 'এলাচ(ছোট)', group: 'spices', name: { en: 'Cardamom (small)', bn: 'এলাচ (ছোট)' } },
  { id: 'coriander', tcb: 'ধনে', group: 'spices', name: { en: 'Coriander seed', bn: 'ধনে' } },
  { id: 'bay-leaf', tcb: 'তেজপাতা', group: 'spices', name: { en: 'Bay leaf', bn: 'তেজপাতা' } },
  { id: 'sugar', tcb: 'চিনি', group: 'other', name: { en: 'Sugar', bn: 'চিনি' } },
  { id: 'dates', tcb: 'খেজুর(সাধারণ মানের)', group: 'other', name: { en: 'Dates (ordinary)', bn: 'খেজুর (সাধারণ মানের)' } },
  { id: 'salt', tcb: 'লবণ(প্যাঃ)আয়োডিনযুক্ত', group: 'other', name: { en: 'Iodised salt (packet)', bn: 'আয়োডিনযুক্ত লবণ (প্যাকেট)' } },
];

/** Sheet headings → our groups, for items the catalog does not know yet. */
const SHEET_GROUPS: [RegExp, TcbGroup][] = [
  [/চাল/, 'rice'],
  [/আটা|ময়দা/, 'flour'],
  [/তেল/, 'oil'],
  [/ডাল/, 'pulses'],
  [/মসলা/, 'spices'],
  [/মাছ|গোশত/, 'protein'],
];

/** Not farm produce: writing paper, steel rods, and branded milk powder. */
const EXCLUDED_ITEMS = /কাগজ|রড/;
const EXCLUDED_GROUPS = /দুধ/;

const UNITS: [tcb: string, unit: Bilingual][] = [
  ['প্রতি কেজি', { en: 'per kg', bn: 'প্রতি কেজি' }],
  ['প্রতি কেজি প্যাঃ', { en: 'per kg, packaged', bn: 'প্রতি কেজি (প্যাকেট)' }],
  ['প্রতি লিটার', { en: 'per litre', bn: 'প্রতি লিটার' }],
  ['প্রতি হালি', { en: 'per 4 (hali)', bn: 'প্রতি হালি' }],
];

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const toAsciiDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
const toBanglaDigits = (s: string) => s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
/** Spacing and Unicode forms vary between TCB's sheets ("মুরগী(ব্রয়লার)" vs "মুরগী (দেশী)"). */
const normalize = (s: string) => s.normalize('NFC').replace(/\s+/g, '');

const catalogByName = new Map(CATALOG.map((entry) => [normalize(entry.tcb), entry]));
const unitsByName = new Map(UNITS.map(([tcb, unit]) => [normalize(tcb), unit]));

function unitName(raw: string): Bilingual {
  const known = unitsByName.get(normalize(raw));
  if (known) return known;
  // Pack sizes such as "৫ লিটার", "2 লিটার", "১ কেজি".
  const ascii = toAsciiDigits(raw).replace(/\s+/g, ' ').trim();
  const en = ascii.replace('প্রতি', 'per').replace('কেজি', 'kg').replace('লিটার', /^1\b/.test(ascii) ? 'litre' : 'litres');
  return { en, bn: toBanglaDigits(ascii) };
}

function number(raw: string | undefined): number | null {
  if (raw == null) return null;
  const value = Number(toAsciiDigits(raw).replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

/** Lowest–highest price; 0 on TCB's sheet means the item was not on sale (e.g. hilsa during the fishing ban). */
function priceRange(low: string | undefined, high: string | undefined): PriceRange | null {
  const values = [number(low), number(high)].filter((v): v is number => v != null && v > 0);
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
}

const nextColumn = (col: string): string =>
  col.endsWith('Z') ? `${col.length > 1 ? nextColumn(col.slice(0, -1)) : 'A'}A` : col.slice(0, -1) + String.fromCharCode(col.charCodeAt(col.length - 1) + 1);

const HEADINGS: [RegExp, Period][] = [
  [/অদ্যকার/, 'today'],
  [/সপ্তাহ\s*পূর্বের/, 'week'],
  [/মাস\s*পূর্বের/, 'month'],
  [/বছর\s*পূর্বের/, 'year'],
];

/** Columns holding each period's lowest price (the highest is in the next column), from a header row. */
function headerColumns(cells: Record<string, string>): Record<Period, string> | null {
  const cols: Partial<Record<Period, string>> = {};
  for (const [col, text] of Object.entries(cells)) {
    const period = HEADINGS.find(([re]) => re.test(text))?.[1];
    if (period) cols[period] = col;
  }
  return PERIODS.every((p) => cols[p]) ? (cols as Record<Period, string>) : null;
}

/** "তারিখঃ ০১-১১-২০২৬" → "2026-11-01" (fallback when the date row is missing). */
function printedDate(rows: SheetRow[]): string | null {
  for (const { cells } of rows) {
    for (const text of Object.values(cells)) {
      const m = toAsciiDigits(text).match(/তারিখ\S*\s*(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }
  }
  return null;
}

/** Parses TCB's daily retail price sheet; null if it does not look like one. */
export function parseTcbSheet(rows: SheetRow[]): TcbPrices | null {
  let cols: Record<Period, string> | null = null;
  let dates: Record<Period, string | null> | null = null;
  let sheetGroup = '';
  let markets: string | null = null;
  const items: TcbItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const { cells } = rows[i];
    const header = headerColumns(cells);
    if (header) {
      // The header repeats at the top of each printed page; the row after the first one holds the dates.
      cols = header;
      if (!dates) {
        const next = rows[i + 1]?.row === rows[i].row + 1 ? rows[i + 1].cells : {};
        dates = Object.fromEntries(
          PERIODS.map((p) => {
            const serial = number(next[header[p]]);
            return [p, serial != null && serial > 40_000 && serial < 60_000 ? excelSerialToIso(serial) : null];
          })
        ) as Record<Period, string | null>;
      }
      continue;
    }
    const name = cells.A;
    if (!cols || !name) continue;

    if (/বাজার\s*হতে\s*তথ্য/.test(name)) {
      markets = Object.entries(cells).find(([col]) => col !== 'A')?.[1] ?? null;
      continue;
    }

    const unitRaw = cells.B;
    const todayLow = number(cells[cols.today]);
    if (!unitRaw || todayLow == null) {
      if (!unitRaw) sheetGroup = name;
      continue;
    }
    if (EXCLUDED_ITEMS.test(name) || EXCLUDED_GROUPS.test(sheetGroup)) continue;

    const entry = catalogByName.get(normalize(name));
    const key = `${entry?.id ?? normalize(name)}|${normalize(unitRaw)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const c = cols;
    items.push({
      id: entry?.id ?? null,
      key,
      name: entry?.name ?? { en: name, bn: name },
      unit: unitName(unitRaw),
      group: entry?.group ?? SHEET_GROUPS.find(([re]) => re.test(sheetGroup))?.[1] ?? 'other',
      prices: Object.fromEntries(PERIODS.map((p) => [p, priceRange(cells[c[p]], cells[nextColumn(c[p])])])) as Record<Period, PriceRange | null>,
    });
  }

  const date = dates?.today ?? printedDate(rows);
  if (!date || items.filter((item) => item.prices.today).length < 10) return null;
  return {
    date,
    dates: { ...(dates ?? { today: null, week: null, month: null, year: null }), today: date },
    markets,
    items: items.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)),
  };
}

/** Percentage change between the midpoints of two price ranges (TCB's own method); null if either is missing. */
export function rangeChange(now: PriceRange | null, before: PriceRange | null): number | null {
  if (!now || !before) return null;
  const mid = (r: PriceRange) => (r.min + r.max) / 2;
  return ((mid(now) - mid(before)) / mid(before)) * 100;
}

/** Where TCB keeps its sheets (the daily page links to them); anything else is refused. */
const SHEET_HOSTS = [/^objectstorage\.[a-z0-9-]+\.oraclecloud\d*\.com$/, /^(www\.)?tcb\.gov\.bd$/];

/** The newest sheet linked from TCB's daily price page (the list is newest first); null if none. */
export function latestSheetUrl(html: string): string | null {
  for (const [, href] of html.matchAll(/href="(https:\/\/[^"]+\.xlsx)"/g)) {
    const url = new URL(href);
    if (SHEET_HOSTS.some((re) => re.test(url.hostname))) return url.href;
  }
  return null;
}

/** First item with a catalog id (e.g. "rice-coarse"), if TCB priced it. */
export function findTcbItem(data: TcbPrices, id: string): TcbItem | undefined {
  return data.items.find((item) => item.id === id);
}

/** Staples shown on the home page, in order. */
export const TCB_STAPLES = ['rice-coarse', 'atta-loose', 'lentil-large', 'soybean-loose', 'potato', 'onion-local'];
