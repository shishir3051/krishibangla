/**
 * open-meteo.ts — Live weather for all 64 districts, one request per part, shared across instances.
 * Current conditions: Open-Meteo updates them every 15 minutes, so they are refreshed every 15 minutes.
 * Daily forecast: model runs land a few times a day, so it is refreshed hourly.
 * Free-tier budget (10,000 calls/day; 64 districts = 64 calls per request): at most
 * 96 × 64 + 24 × 64 ≈ 7,700 calls/day. Failures are retried after a few minutes.
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { DISTRICTS } from '@/lib/domain/districts';
import { forecastUrl, parseCurrent, parseDaily, type CurrentConditions, type DailyForecast } from '@/lib/domain/weather';
import type { SourceResult } from './types';

const SOURCE = { source: 'Open-Meteo', url: 'https://open-meteo.com/' };
const KEYS = DISTRICTS.map((d) => d.slug);

export async function getCurrentConditions(): Promise<SourceResult<Record<string, CurrentConditions>>> {
  'use cache: remote';
  cacheTag('weather');
  const meta = { ...SOURCE, fetchedAt: new Date().toISOString() };

  try {
    const res = await fetch(forecastUrl(DISTRICTS, 'current'), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const data = parseCurrent(await res.json(), KEYS);
    if (!data) throw new Error('Open-Meteo current response did not match the expected shape');
    cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
    return { ok: true, data, meta };
  } catch (error) {
    console.error('Open-Meteo current conditions failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Current weather unavailable', meta };
  }
}

export async function getDailyForecasts(): Promise<SourceResult<Record<string, DailyForecast[]>>> {
  'use cache: remote';
  cacheTag('weather');
  const meta = { ...SOURCE, fetchedAt: new Date().toISOString() };

  try {
    const res = await fetch(forecastUrl(DISTRICTS, 'daily'), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const data = parseDaily(await res.json(), KEYS);
    if (!data) throw new Error('Open-Meteo daily response did not match the expected shape');
    cacheLife('hours');
    return { ok: true, data, meta };
  } catch (error) {
    console.error('Open-Meteo daily forecast failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Forecast unavailable', meta };
  }
}
