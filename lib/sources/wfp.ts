/**
 * wfp.ts — WFP retail food prices for Bangladesh, from the HDX CSV (~4.5 MB, monthly).
 * WFP adds a month at a time with a lag, so the aggregate is cached for days and regenerated in the
 * background; failures are retried after a few minutes. Only the compact aggregate (~110 kB) is cached —
 * the CSV itself bypasses Next's fetch cache (it is larger than the 2 MB fetch-cache limit).
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { aggregatePrices, parseWfpCsv, type PriceAggregate } from '@/lib/domain/prices';
import type { SourceResult } from './types';

const CSV_URL =
  'https://data.humdata.org/dataset/c76eabb7-fdb5-43b7-a5c4-09091bb8acde/resource/966ab7ac-56d6-4dac-8eba-dfe815d59a52/download/wfp_food_prices_bgd.csv';
const SOURCE = { source: 'WFP / HDX', url: 'https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh' };

/** Current month in Dhaka as YYYY-MM (servers run in UTC). */
const dhakaMonth = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Dhaka' }).format(date).slice(0, 7);

/** National and district retail prices; `data.latestMonth` is the newest month WFP has published. */
export async function getWfpPrices(): Promise<SourceResult<PriceAggregate>> {
  'use cache';
  cacheTag('wfp-prices');
  const now = new Date();
  const meta = { ...SOURCE, fetchedAt: now.toISOString() };

  try {
    const res = await fetch(CSV_URL, { cache: 'no-store', signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HDX responded ${res.status}`);
    const rows = parseWfpCsv(await res.text());
    if (!rows) throw new Error('WFP CSV is missing expected columns');
    const data = aggregatePrices(rows, { now: dhakaMonth(now) });
    if (!data) throw new Error('WFP CSV has no usable retail food prices');
    cacheLife('days');
    return { ok: true, data, meta };
  } catch (error) {
    console.error('WFP prices failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Market prices unavailable', meta };
  }
}
