/**
 * world-bank.ts — National agriculture indicators for Bangladesh from the World Bank API.
 * The World Bank publishes these yearly, so the result is part of the prerendered shell and
 * regenerated weekly in the background. Indicators are fetched in parallel; any that fail are
 * simply left out (the rest are still shown).
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { env } from '@/lib/env';
import { INDICATOR_KEYS, INDICATORS, indicatorUrl, parseIndicator, type IndicatorData, type IndicatorKey } from '@/lib/domain/indicators';
import type { SourceResult } from './types';

const SOURCE = { source: 'World Bank', url: 'https://data.worldbank.org/country/bangladesh' };

export type NationalIndicators = Partial<Record<IndicatorKey, IndicatorData>>;

async function fetchIndicator(id: string): Promise<IndicatorData> {
  const res = await fetch(indicatorUrl(env.WORLD_BANK_API_URL, id), { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`World Bank responded ${res.status} for ${id}`);
  const data = parseIndicator(await res.json());
  if (!data) throw new Error(`World Bank returned no Bangladesh data for ${id}`);
  return data;
}

export async function getNationalIndicators(): Promise<SourceResult<NationalIndicators>> {
  'use cache';
  cacheTag('world-bank');
  const meta = { ...SOURCE, fetchedAt: new Date().toISOString() };

  const results = await Promise.allSettled(INDICATOR_KEYS.map((key) => fetchIndicator(INDICATORS[key].id)));
  const data: NationalIndicators = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') data[INDICATOR_KEYS[i]] = r.value;
    else console.error('World Bank indicator failed:', r.reason);
  });

  const count = Object.keys(data).length;
  if (count === 0) {
    cacheLife('minutes');
    return { ok: false, error: 'World Bank data unavailable', meta };
  }
  // Retry sooner when some indicators are missing.
  if (count === INDICATOR_KEYS.length) cacheLife('weeks');
  else cacheLife('hours');
  return { ok: true, data, meta };
}
