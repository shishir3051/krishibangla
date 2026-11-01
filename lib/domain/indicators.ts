/**
 * indicators.ts — World Bank national indicators for Bangladesh: request URL, response parsing
 * (latest non-null value + recent series) and number scaling for display.
 * Pure (no fetching), unit-tested in indicators.test.ts; the cached fetch lives in lib/sources/world-bank.ts.
 */
import { z } from 'zod';
import type { Locale } from '@/lib/i18n';

/**
 * The indicators we show. Every id was checked against the live API for Bangladesh (BGD).
 * `unit` is the unit the World Bank publishes the value in.
 */
export const INDICATORS = {
  agriGdp: { id: 'NV.AGR.TOTL.ZS', unit: 'percent' }, // Agriculture, forestry, and fishing, value added (% of GDP)
  agriEmployment: { id: 'SL.AGR.EMPL.ZS', unit: 'percent' }, // Employment in agriculture (% of total employment) (modeled ILO estimate)
  cerealProduction: { id: 'AG.PRD.CREL.MT', unit: 'tonnes' }, // Cereal production (metric tons)
  cerealYield: { id: 'AG.YLD.CREL.KG', unit: 'kgPerHa' }, // Cereal yield (kg per hectare)
  fisheries: { id: 'ER.FSH.PROD.MT', unit: 'tonnes' }, // Total fisheries production (metric tons)
  aquaculture: { id: 'ER.FSH.AQUA.MT', unit: 'tonnes' }, // Aquaculture production (metric tons)
  capture: { id: 'ER.FSH.CAPT.MT', unit: 'tonnes' }, // Capture fisheries production (metric tons)
  agriLand: { id: 'AG.LND.AGRI.ZS', unit: 'percent' }, // Agricultural land (% of land area)
} as const;

export type IndicatorKey = keyof typeof INDICATORS;
export const INDICATOR_KEYS = Object.keys(INDICATORS) as IndicatorKey[];

export type YearValue = { year: number; value: number };

export type IndicatorData = {
  id: string;
  /** The World Bank's own English name for the indicator, e.g. "Cereal production (metric tons)". */
  name: string;
  latest: YearValue;
  /** Non-null values for the `years` years up to and including `latest.year`, oldest first. */
  series: YearValue[];
};

/** Years of history kept for sparklines. */
export const SERIES_YEARS = 20;

/** ~60 rows (newest first) is enough for a 20-year series even with recent gaps. */
export function indicatorUrl(baseUrl: string, id: string, country = 'BGD'): string {
  return `${baseUrl.replace(/\/$/, '')}/country/${country}/indicator/${encodeURIComponent(id)}?format=json&per_page=60`;
}

/** The public page for an indicator, for the SourceTag link. */
export function indicatorPageUrl(id: string, country = 'BD'): string {
  return `https://data.worldbank.org/indicator/${id}?locations=${country}`;
}

const rowSchema = z.object({
  indicator: z.object({ id: z.string(), value: z.string() }),
  date: z.string(),
  value: z.number().nullable(),
});
// A successful response is `[meta, rows]`; an error is `[{ message: [...] }]` (still HTTP 200).
const responseSchema = z.tuple([z.object({ page: z.number() }).loose(), z.array(rowSchema)]);

/** Parses one indicator response; null when it is an error payload or has no values. */
export function parseIndicator(json: unknown, years = SERIES_YEARS): IndicatorData | null {
  const parsed = responseSchema.safeParse(json);
  if (!parsed.success) return null;

  const points = parsed.data[1]
    .filter((r): r is typeof r & { value: number } => r.value != null && Number.isFinite(r.value) && /^\d{4}$/.test(r.date))
    .map((r) => ({ year: Number(r.date), value: r.value }))
    .sort((a, b) => a.year - b.year);
  if (points.length === 0) return null;

  const latest = points[points.length - 1];
  const first = parsed.data[1][0].indicator;
  return { id: first.id, name: first.value, latest, series: points.filter((p) => p.year > latest.year - years) };
}

export type FisheriesSplit = { year: number; aquaculture: number; capture: number; aquacultureShare: number };

/** Aquaculture vs capture for the latest year both are published — a ratio of the two real series. */
export function fisheriesSplit(aquaculture: IndicatorData | undefined, capture: IndicatorData | undefined): FisheriesSplit | null {
  if (!aquaculture || !capture) return null;
  const captureByYear = new Map(capture.series.map((p) => [p.year, p.value]));
  const common = aquaculture.series.filter((p) => captureByYear.has(p.year)).at(-1);
  if (!common) return null;
  const captured = captureByYear.get(common.year)!;
  const total = common.value + captured;
  if (total <= 0) return null;
  return { year: common.year, aquaculture: common.value, capture: captured, aquacultureShare: common.value / total };
}

/** Which unit template a scaled tonnage uses (see messages/climate.*.json → kpi.units). */
export type TonnesScale = 'large' | 'medium' | 'plain';

// English groups by thousands/millions; Bangla by lakh (10⁵) and crore (10⁷), as Bangladeshi
// statistics and newspapers do. The message templates carry the matching words.
const TONNE_SCALES: Record<Locale, { large: number; medium: number }> = {
  en: { large: 1e6, medium: 1e3 },
  bn: { large: 1e7, medium: 1e5 },
};

/** 66 347 850 t → en { value: 66.3, scale: 'large' } ("66.3 million t"); bn { value: 6.63, scale: 'large' } ("৬.৬৩ কোটি টন"). */
export function scaleTonnes(locale: Locale, tonnes: number): { value: number; digits: number; scale: TonnesScale } {
  const { large, medium } = TONNE_SCALES[locale];
  const abs = Math.abs(tonnes);
  if (abs >= large) {
    const value = tonnes / large;
    return { value, digits: Math.abs(value) < 10 ? 2 : 1, scale: 'large' };
  }
  if (abs >= medium) {
    const value = tonnes / medium;
    return { value, digits: 1, scale: 'medium' };
  }
  return { value: tonnes, digits: 0, scale: 'plain' };
}
