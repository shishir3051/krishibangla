/**
 * tcb.ts — TCB's daily retail prices for Dhaka city. TCB posts a new sheet every day (around 12:30 Dhaka
 * time) and links it from its daily price page, so the page is read first to find the newest sheet.
 * Cached for an hour and shared across instances; failures are retried after a few minutes.
 */
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { latestSheetUrl, parseTcbSheet, type TcbPrices } from '@/lib/domain/tcb';
import { readFirstSheet } from '@/lib/xlsx';
import { getText } from './tls';
import type { SourceResult } from './types';

const PAGE_URL = 'https://tcb.gov.bd/pages/daily-rmps';
const SOURCE = { source: 'TCB', url: PAGE_URL };
const MAX_SHEET_BYTES = 2 * 1024 * 1024; // the sheet is ~26 kB

export async function getTcbPrices(): Promise<SourceResult<TcbPrices>> {
  'use cache: remote';
  cacheTag('tcb-prices');
  const meta = { ...SOURCE, fetchedAt: new Date().toISOString() };

  try {
    // tcb.gov.bd sends an incomplete certificate chain, which fetch() rejects; see lib/sources/tls.ts.
    const sheetUrl = latestSheetUrl(await getText(PAGE_URL));
    if (!sheetUrl) throw new Error('TCB page links no price sheet');

    const sheet = await fetch(sheetUrl, { signal: AbortSignal.timeout(20_000) });
    if (!sheet.ok) throw new Error(`TCB sheet responded ${sheet.status}`);
    const bytes = new Uint8Array(await sheet.arrayBuffer());
    if (bytes.byteLength > MAX_SHEET_BYTES) throw new Error('TCB sheet is unexpectedly large');

    const data = parseTcbSheet(readFirstSheet(bytes));
    if (!data) throw new Error('TCB sheet did not match the expected layout');
    cacheLife('hours');
    return { ok: true, data, meta };
  } catch (error) {
    console.error('TCB prices failed:', error);
    cacheLife('minutes');
    return { ok: false, error: error instanceof Error ? error.message : 'Dhaka prices unavailable', meta };
  }
}
