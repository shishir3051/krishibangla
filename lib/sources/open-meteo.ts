/**
 * open-meteo.ts — Live forecast for all 64 districts in one request, shared across instances.
 * Cached for an hour (Open-Meteo updates hourly); failures are retried after a few minutes.
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { DISTRICTS } from '@/lib/domain/districts';
import { forecastUrl, parseForecast, type DistrictWeather } from '@/lib/domain/weather';
import type { SourceResult } from './types';

const SOURCE = { source: 'Open-Meteo', url: 'https://open-meteo.com/' };

export async function getDistrictForecasts(): Promise<SourceResult<Record<string, DistrictWeather>>> {
  'use cache: remote';
  cacheTag('weather');
  const meta = { ...SOURCE, fetchedAt: new Date().toISOString() };

  try {
    const res = await fetch(forecastUrl(DISTRICTS), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const data = parseForecast(await res.json(), DISTRICTS.map((d) => d.slug));
    if (!data) throw new Error('Open-Meteo response did not match the expected shape');
    cacheLife('hours');
    return { ok: true, data, meta };
  } catch (error) {
    console.error('Open-Meteo forecast failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Forecast unavailable', meta };
  }
}
