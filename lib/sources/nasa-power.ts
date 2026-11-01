/**
 * nasa-power.ts — Monthly temperature and rainfall anomalies for the eight division capitals,
 * from NASA POWER (monthly values vs POWER's own long-term climatology).
 * POWER publishes monthly values with a lag of one to two months, so the result is part of the
 * prerendered shell and regenerated weekly. Requests run two at a time to be gentle on the API.
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import {
  DIVISION_CAPITALS,
  addMonths,
  climatologyUrl,
  dhakaYearMonth,
  monthlyUrl,
  parseClimatology,
  parseMonthly,
  recentAnomalies,
  summarise,
  type AnomalySummary,
  type Baseline,
  type Climatology,
  type MonthAnomaly,
  type MonthlyObs,
} from '@/lib/domain/climate';
import { getDistrict } from '@/lib/domain/districts';
import type { DivisionId } from '@/lib/domain/vocab';
import type { SourceResult } from './types';

const SOURCE = { source: 'NASA POWER', url: 'https://power.larc.nasa.gov/' };
const CONCURRENCY = 2;

export type DivisionClimate = {
  division: DivisionId;
  district: string;
  months: MonthAnomaly[];
  summary: AnomalySummary;
};

export type ClimateAnomalies = {
  baseline: Baseline | null;
  /** Divisions in DIVISION_CAPITALS order; ones that failed to load are left out. */
  divisions: DivisionClimate[];
  /** Last month (YYYY-MM) of the 12-month window, the same for every division. */
  latestMonth: string;
};

async function getJson(url: string): Promise<{ status: number; json: unknown }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  return { status: res.status, json: res.ok ? await res.json() : null };
}

type Loaded = { division: DivisionId; district: string; obs: MonthlyObs; clim: Climatology };

async function loadDivision(division: DivisionId, district: string, currentMonth: string): Promise<Loaded> {
  const place = getDistrict(district);
  if (!place) throw new Error(`Unknown district ${district}`);
  const year = Number(currentMonth.slice(0, 4));

  // Three calendar years always contain the latest 12 published months. POWER rejects an end
  // year beyond its data (HTTP 422), which can happen just after New Year — then use last year.
  let monthly = await getJson(monthlyUrl(place.lat, place.lon, year - 2, year));
  if (monthly.status === 422) monthly = await getJson(monthlyUrl(place.lat, place.lon, year - 3, year - 1));
  if (monthly.status !== 200) throw new Error(`NASA POWER monthly responded ${monthly.status} for ${district}`);
  const obs = parseMonthly(monthly.json);
  if (!obs) throw new Error(`NASA POWER monthly response for ${district} did not match the expected shape`);

  const climatology = await getJson(climatologyUrl(place.lat, place.lon));
  if (climatology.status !== 200) throw new Error(`NASA POWER climatology responded ${climatology.status} for ${district}`);
  const clim = parseClimatology(climatology.json);
  if (!clim) throw new Error(`NASA POWER climatology response for ${district} did not match the expected shape`);

  if (recentAnomalies(obs, clim, currentMonth).length === 0) throw new Error(`NASA POWER has no complete months for ${district}`);
  return { division, district, obs, clim };
}

/** Runs `fn` over `items`, at most `limit` at a time, keeping input order. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try {
        results[i] = { status: 'fulfilled', value: await fn(items[i]) };
      } catch (reason) {
        results[i] = { status: 'rejected', reason };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function getClimateAnomalies(): Promise<SourceResult<ClimateAnomalies>> {
  'use cache';
  cacheTag('nasa-power');
  const now = new Date();
  const meta = { ...SOURCE, fetchedAt: now.toISOString() };
  const currentMonth = dhakaYearMonth(now);

  const results = await mapLimit(DIVISION_CAPITALS, CONCURRENCY, ({ division, district }) => loadDivision(division, district, currentMonth));
  const loaded = results.flatMap((r) => {
    if (r.status === 'fulfilled') return [r.value];
    console.error('NASA POWER failed:', r.reason);
    return [];
  });

  if (loaded.length === 0) {
    cacheLife('minutes');
    return { ok: false, error: 'NASA POWER data unavailable', meta };
  }

  // Same 12 months for every division: end at the latest month all of them have published.
  const latestMonth = loaded.map((l) => recentAnomalies(l.obs, l.clim, currentMonth).at(-1)!.month).sort()[0];
  const divisions = loaded.map(({ division, district, obs, clim }) => {
    const months = recentAnomalies(obs, clim, addMonths(latestMonth, 1));
    return { division, district, months, summary: summarise(months) };
  });

  // Retry sooner when some divisions are missing.
  if (loaded.length === DIVISION_CAPITALS.length) cacheLife('weeks');
  else cacheLife('hours');
  return { ok: true, data: { baseline: loaded.find((l) => l.clim.baseline)?.clim.baseline ?? null, divisions, latestMonth }, meta };
}
