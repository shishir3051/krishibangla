/**
 * prices.ts — WFP retail food prices for Bangladesh (HDX CSV): parsing, and aggregation into national
 * monthly prices, 24-month series and the latest price in each district.
 * Pure (no fetching), unit-tested in prices.test.ts; the cached fetch lives in lib/sources/wfp.ts.
 *
 * Data decisions, checked against the full file (34,491 rows, Nov 2026):
 * - Retail prices in BDT only. The file also has ~870 historical Wholesale rows (Dhaka, 1998–2020).
 *   Non-food items (fuel, soap, toothpaste…) are dropped — this is a food and farming site.
 * - priceflag: 'actual' is a price collected at that market. 'aggregate' (also 'actual,aggregate') is a
 *   monthly figure WFP computed by averaging several collected prices. From 2020 to Aug 2024 the series
 *   is aggregate-only ("Barisal Sadar", "Comilla Sadar"…); since Sep 2024 every row is 'actual'. Both
 *   describe a single market, so both are used. The exception is the pseudo-markets named
 *   "… Division" (2020–21), which average a whole division: they would count that division's markets
 *   twice and cannot be placed in one district, so they are dropped. Any other flag (e.g. 'forecast')
 *   is dropped too: only observed prices are shown.
 * - National price = MEDIAN across the markets that reported that month, not the mean. The file has
 *   entry errors such as wheat flour at ৳182–190/kg in two markets (Aug 2026, where others are ~৳55),
 *   which move a mean by 8% but the median by about 2%.
 * - A month counts as a national figure only when markets in at least MIN_DISTRICTS districts reported.
 *   Some months (Nov 2025, Jan 2026) contain only the four Cox's Bazar camp-area markets.
 * - Month-on-month change compares the SAME markets in both months (ratio of their medians), against
 *   the previous national month, and only when that month is at most MAX_GAP_MONTHS earlier and at
 *   least MIN_COMMON_MARKETS markets reported in both. WFP's market sample changes a lot (it doubled in
 *   May 2026), so comparing all-market figures would mix price changes with sample changes.
 */
import { z } from 'zod';
import { compareCommodities } from './commodities';
import { findDistrictByName } from './districts';

export const MIN_DISTRICTS = 5;
export const MAX_GAP_MONTHS = 2;
export const MIN_COMMON_MARKETS = 5;
/** Length of the national series (calendar months ending at the dataset's latest month). */
export const SERIES_MONTHS = 24;
/** A commodity is "current" when its latest national month is at most this many months old. */
export const RECENT_MONTHS = 6;
/** District prices older than this many months (vs the dataset's latest month) are not shown. */
export const DISTRICT_MONTHS = 12;

/** One usable price observation (a market's price for one commodity in one month). */
export type PriceRow = {
  month: string; // YYYY-MM (WFP dates every row on the 15th)
  admin2: string; // district name as spelled by WFP
  marketId: string;
  category: string;
  commodity: string;
  unit: string;
  price: number; // BDT
};

export type SeriesPoint = { month: string; price: number; markets: number };

export type CommodityPrices = {
  commodity: string; // WFP name, e.g. "Rice (coarse)"
  unit: string; // WFP unit, e.g. "KG", "L", "1 piece"
  category: string;
  latest: SeriesPoint & { districts: number };
  /** Same-market change vs the previous national month; null when there is no comparable month. */
  change: { pct: number; since: string; markets: number } | null;
  /** National months within the last SERIES_MONTHS months of the dataset, oldest first (gaps possible). */
  series: SeriesPoint[];
};

export type DistrictPrice = {
  commodity: string;
  unit: string;
  month: string;
  price: number; // median of the district's markets that month
  markets: number;
  /** National price for the same commodity and month, when that month is a national figure. */
  national: number | null;
};

export type PriceAggregate = {
  /** Newest month in the dataset (individual commodities can be older). */
  latestMonth: string;
  /** First month of the series window, so every sparkline shares the same time axis. */
  seriesStart: string;
  /** Commodities with a recent national figure. */
  commodities: CommodityPrices[];
  /** District slug → latest price per commodity (only districts with data). */
  districts: Record<string, DistrictPrice[]>;
};

// ---------- months ----------

const monthIndex = (month: string) => Number(month.slice(0, 4)) * 12 + Number(month.slice(5, 7)) - 1;

/** Whole months from `from` to `to` ('2026-05' → '2026-07' is 2). */
export function monthsBetween(from: string, to: string): number {
  return monthIndex(to) - monthIndex(from);
}

export function addMonths(month: string, n: number): string {
  const i = monthIndex(month) + n;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
}

// ---------- CSV ----------

/** RFC 4180 parser: quoted fields may contain commas, doubled quotes and line breaks. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const COLUMNS = ['date', 'admin2', 'market', 'market_id', 'category', 'commodity', 'unit', 'priceflag', 'pricetype', 'currency', 'price'] as const;

const rowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  admin2: z.string().min(1),
  market: z.string().min(1),
  market_id: z.string().min(1),
  category: z.string().min(1),
  commodity: z.string().min(1),
  unit: z.string().min(1),
  priceflag: z.string(),
  pricetype: z.literal('Retail'),
  currency: z.literal('BDT'),
  price: z.coerce.number().positive().finite(),
});

/** Market-level observed prices: 'actual', 'aggregate' or both (see the header comment). */
const isObservedFlag = (flag: string) => flag.split(',').every((f) => f === 'actual' || f === 'aggregate');
/** "Barisal Division", "Dhaka Division"… — division-wide averages, not markets. */
const isDivisionAverage = (market: string) => /\bdivision$/i.test(market.trim());

/**
 * Parses the WFP/HDX CSV into usable retail food price rows. Skips HXL tag rows ("#date,…"),
 * malformed rows and everything excluded above. Returns null when the header lacks a required column.
 */
export function parseWfpCsv(text: string): PriceRow[] | null {
  const [header, ...lines] = parseCsv(text.replace(/^﻿/, ''));
  if (!header) return null;
  const index = Object.fromEntries(COLUMNS.map((c) => [c, header.indexOf(c)]));
  if (Object.values(index).some((i) => i === -1)) return null;

  const rows: PriceRow[] = [];
  for (const line of lines) {
    if (line[0]?.startsWith('#')) continue;
    const parsed = rowSchema.safeParse(Object.fromEntries(COLUMNS.map((c) => [c, line[index[c]]])));
    if (!parsed.success) continue;
    const r = parsed.data;
    if (r.category === 'non-food' || !isObservedFlag(r.priceflag) || isDivisionAverage(r.market)) continue;
    rows.push({
      month: r.date.slice(0, 7),
      admin2: r.admin2.trim(),
      marketId: r.market_id,
      category: r.category,
      commodity: r.commodity.trim(),
      unit: r.unit.trim(),
      price: r.price,
    });
  }
  return rows;
}

// ---------- aggregation ----------

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const round = (n: number, digits = 2) => Math.round(n * 10 ** digits) / 10 ** digits;

/** One commodity in one month: price per market (a market reporting twice is averaged). */
type MonthData = { prices: Map<string, number>; districts: Set<string> };

function monthData(rows: PriceRow[]): MonthData {
  const sums = new Map<string, { sum: number; n: number }>();
  for (const r of rows) {
    const s = sums.get(r.marketId) ?? { sum: 0, n: 0 };
    s.sum += r.price;
    s.n += 1;
    sums.set(r.marketId, s);
  }
  return {
    prices: new Map([...sums].map(([id, s]) => [id, s.sum / s.n])),
    districts: new Set(rows.map((r) => r.admin2.toLowerCase())),
  };
}

function sameMarketChange(latest: MonthData, previous: MonthData) {
  const common = [...latest.prices.keys()].filter((id) => previous.prices.has(id));
  if (common.length < MIN_COMMON_MARKETS) return null;
  const now = median(common.map((id) => latest.prices.get(id)!));
  const before = median(common.map((id) => previous.prices.get(id)!));
  return { pct: round((now / before - 1) * 100), markets: common.length };
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const group = groups.get(k);
    if (group) group.push(item);
    else groups.set(k, [item]);
  }
  return groups;
}

/**
 * Aggregates parsed rows. `now` (YYYY-MM, Dhaka) drops rows dated in the future, which would
 * otherwise become the "latest month". Returns null when there are no usable rows.
 */
export function aggregatePrices(allRows: PriceRow[], options: { now?: string } = {}): PriceAggregate | null {
  const rows = options.now ? allRows.filter((r) => r.month <= options.now!) : allRows;
  if (rows.length === 0) return null;

  const latestMonth = rows.reduce((max, r) => (r.month > max ? r.month : max), rows[0].month);
  const seriesStart = addMonths(latestMonth, -(SERIES_MONTHS - 1));
  const districtStart = addMonths(latestMonth, -(DISTRICT_MONTHS - 1));
  const recentStart = addMonths(latestMonth, -RECENT_MONTHS);

  const commodities: CommodityPrices[] = [];
  const districts: Record<string, DistrictPrice[]> = {};

  // Same commodity name with a different unit is a different series (e.g. "Milk" per L vs 500 G).
  for (const group of groupBy(rows, (r) => `${r.commodity}|${r.unit}`).values()) {
    const { commodity, unit, category } = group[0];
    const byMonth = [...groupBy(group, (r) => r.month)].sort(([a], [b]) => (a < b ? -1 : 1));

    // National months, oldest first.
    const national = byMonth
      .map(([month, monthRows]) => ({ month, data: monthData(monthRows) }))
      .filter((m) => m.data.districts.size >= MIN_DISTRICTS);
    const nationalPrice = new Map(national.map((m) => [m.month, median([...m.data.prices.values()])]));

    const last = national.at(-1);
    if (last && last.month >= recentStart) {
      const prev = national.at(-2);
      const change =
        prev && monthsBetween(prev.month, last.month) <= MAX_GAP_MONTHS ? sameMarketChange(last.data, prev.data) : null;
      commodities.push({
        commodity,
        unit,
        category,
        latest: {
          month: last.month,
          price: round(nationalPrice.get(last.month)!),
          markets: last.data.prices.size,
          districts: last.data.districts.size,
        },
        change: change && prev ? { ...change, since: prev.month } : null,
        series: national
          .filter((m) => m.month >= seriesStart)
          .map((m) => ({ month: m.month, price: round(nationalPrice.get(m.month)!), markets: m.data.prices.size })),
      });
    }

    // Latest month per district, within the district window (keyed by slug, so WFP spelling variants merge).
    const recentRows = group.filter((r) => r.month >= districtStart);
    for (const [slug, districtRows] of groupBy(recentRows, (r) => findDistrictByName(r.admin2)?.slug ?? '')) {
      if (!slug) continue;
      const month = districtRows.reduce((max, r) => (r.month > max ? r.month : max), districtRows[0].month);
      const data = monthData(districtRows.filter((r) => r.month === month));
      const nationalThatMonth = nationalPrice.get(month);
      (districts[slug] ??= []).push({
        commodity,
        unit,
        month,
        price: round(median([...data.prices.values()])),
        markets: data.prices.size,
        national: nationalThatMonth === undefined ? null : round(nationalThatMonth),
      });
    }
  }

  const byName = (a: { commodity: string; unit: string }, b: { commodity: string; unit: string }) =>
    compareCommodities(a.commodity, b.commodity) || a.unit.localeCompare(b.unit);
  commodities.sort(byName);
  for (const list of Object.values(districts)) list.sort(byName);
  return { latestMonth, seriesStart, commodities, districts };
}

/** National prices for one WFP commodity name (if WFP uses several units, the first in sort order). */
export function findCommodity(aggregate: PriceAggregate, commodity: string): CommodityPrices | undefined {
  return aggregate.commodities.find((c) => c.commodity === commodity);
}
