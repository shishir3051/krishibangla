/**
 * gdacs.ts — Cyclone, flood and drought alerts for Bangladesh from GDACS, shared across instances.
 * GDACS updates through the day, so this is read at request time (inside <Suspense>) and cached
 * remotely for 15 minutes; failures are retried after a minute.
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { classifyEvents, eventListUrl, parseEvents, queryWindow, type ClassifiedEvents } from '@/lib/domain/alerts';
import type { SourceResult } from './types';

const SOURCE = { source: 'GDACS', url: 'https://www.gdacs.org/' };

export async function getBangladeshAlerts(): Promise<SourceResult<ClassifiedEvents>> {
  'use cache: remote';
  cacheTag('gdacs');
  const now = new Date();
  const meta = { ...SOURCE, fetchedAt: now.toISOString() };

  try {
    const { fromDate, toDate } = queryWindow(now);
    const res = await fetch(eventListUrl(fromDate, toDate), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`GDACS responded ${res.status}`);
    // HTTP 204 with an empty body means no events in the window.
    const body = res.status === 204 ? '' : (await res.text()).trim();
    const events = body === '' ? [] : parseEvents(JSON.parse(body));
    if (!events) throw new Error('GDACS response did not match the expected shape');
    cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
    return { ok: true, data: classifyEvents(events, now), meta };
  } catch (error) {
    console.error('GDACS alerts failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Alerts unavailable', meta };
  }
}
