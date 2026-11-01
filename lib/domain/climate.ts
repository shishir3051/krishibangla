/**
 * climate.ts — NASA POWER monthly temperature/rainfall and long-term climatology for the eight
 * division capitals, and the anomaly maths (difference from the long-term monthly average).
 * Pure (no fetching), unit-tested in climate.test.ts; the cached fetch lives in lib/sources/nasa-power.ts.
 *
 * Units, as published by POWER (checked against live responses):
 * - T2M: °C, monthly mean.
 * - PRECTOTCORR: mm/day, the monthly mean daily rate → × days in the month for a monthly total.
 * - Fill value -999 marks months not yet published.
 */
import { z } from 'zod';
import type { DivisionId } from './vocab';

const BASE = 'https://power.larc.nasa.gov/api/temporal';
const PARAMS = 'parameters=T2M,PRECTOTCORR&community=AG';

/** Division slug → the district slug of its capital (coordinates come from the district registry). */
export const DIVISION_CAPITALS: { division: DivisionId; district: string }[] = [
  { division: 'dhaka', district: 'dhaka' },
  { division: 'chattogram', district: 'chattogram' },
  { division: 'rajshahi', district: 'rajshahi' },
  { division: 'khulna', district: 'khulna' },
  { division: 'barishal', district: 'barishal' },
  { division: 'sylhet', district: 'sylhet' },
  { division: 'rangpur', district: 'rangpur' },
  { division: 'mymensingh', district: 'mymensingh' },
];

const coords = (lat: number, lon: number) => `latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`;

/** Monthly (and annual, month "13") values for whole calendar years. `end` may not be after the current year. */
export function monthlyUrl(lat: number, lon: number, startYear: number, endYear: number): string {
  return `${BASE}/monthly/point?${PARAMS}&${coords(lat, lon)}&start=${startYear}&end=${endYear}&format=JSON`;
}

/** Long-term monthly averages over POWER's fixed climatology period (stated in the response header). */
export function climatologyUrl(lat: number, lon: number): string {
  return `${BASE}/climatology/point?${PARAMS}&${coords(lat, lon)}&format=JSON`;
}

export const FILL_VALUE = -999;
const clean = (v: number) => (v <= FILL_VALUE + 0.5 || !Number.isFinite(v) ? null : v);

const unitsSchema = z.object({
  T2M: z.object({ units: z.string() }),
  PRECTOTCORR: z.object({ units: z.string() }),
});
const valuesSchema = z.record(z.string(), z.number());
const powerSchema = z.object({
  properties: z.object({ parameter: z.object({ T2M: valuesSchema, PRECTOTCORR: valuesSchema }) }),
  parameters: unitsSchema,
  header: z.object({ fill_value: z.number().optional(), range: z.string().optional() }).loose(),
  messages: z.array(z.string()).optional(),
});

/** True when the published rainfall unit is a daily rate we know how to convert. */
const isPerDay = (units: string) => /^mm\s*\/\s*day$/i.test(units.trim());
const isCelsius = (units: string) => /^(c|°c|degrees? c)$/i.test(units.trim());

export type MonthlyObs = {
  /** "YYYY-MM" → mean temperature, °C. */
  temp: Record<string, number>;
  /** "YYYY-MM" → mean daily rainfall, mm/day. */
  rainPerDay: Record<string, number>;
};

/** Parses a monthly response; drops fill values and the annual "13" pseudo-month. Null if malformed or units unexpected. */
export function parseMonthly(json: unknown): MonthlyObs | null {
  const parsed = powerSchema.safeParse(json);
  if (!parsed.success) return null;
  const { parameter } = parsed.data.properties;
  if (!isCelsius(parsed.data.parameters.T2M.units) || !isPerDay(parsed.data.parameters.PRECTOTCORR.units)) return null;

  const byMonth = (values: Record<string, number>) => {
    const out: Record<string, number> = {};
    for (const [key, raw] of Object.entries(values)) {
      const m = /^(\d{4})(\d{2})$/.exec(key);
      const value = clean(raw);
      if (!m || Number(m[2]) < 1 || Number(m[2]) > 12 || value == null) continue;
      out[`${m[1]}-${m[2]}`] = value;
    }
    return out;
  };
  return { temp: byMonth(parameter.T2M), rainPerDay: byMonth(parameter.PRECTOTCORR) };
}

export type Baseline = { startYear: number; endYear: number };

export type Climatology = {
  /** Index 0 = January. */
  temp: (number | null)[];
  rainPerDay: (number | null)[];
  baseline: Baseline | null;
};

const MONTH_KEYS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** Reads the averaging period from POWER's header, e.g. "… (January 2001 - December 2025)". */
export function parseBaseline(text: string | undefined): Baseline | null {
  const m = /([A-Za-z]+)\s+(\d{4})\s*[-–]\s*([A-Za-z]+)\s+(\d{4})/.exec(text ?? '');
  if (!m) return null;
  const startYear = Number(m[2]);
  const endYear = Number(m[4]);
  return endYear >= startYear ? { startYear, endYear } : null;
}

export function parseClimatology(json: unknown): Climatology | null {
  const parsed = powerSchema.safeParse(json);
  if (!parsed.success) return null;
  const { parameter } = parsed.data.properties;
  if (!isCelsius(parsed.data.parameters.T2M.units) || !isPerDay(parsed.data.parameters.PRECTOTCORR.units)) return null;

  const months = (values: Record<string, number>) => MONTH_KEYS.map((k) => (k in values ? clean(values[k]) : null));
  const { header, messages } = parsed.data;
  return {
    temp: months(parameter.T2M),
    rainPerDay: months(parameter.PRECTOTCORR),
    baseline: parseBaseline(header.range) ?? parseBaseline(messages?.join(' ')),
  };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** The calendar month in Dhaka as "YYYY-MM" (servers run in UTC). */
export function dhakaYearMonth(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit' }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}`;
}

/** "2026-03" shifted by n months. */
export function addMonths(yearMonth: string, n: number): string {
  const [y, m] = yearMonth.split('-').map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}

export type MonthAnomaly = {
  month: string; // YYYY-MM
  temp: number | null; // °C, monthly mean
  tempNormal: number | null; // °C, long-term mean for that calendar month
  tempDiff: number | null; // °C, temp − normal
  rain: number | null; // mm, monthly total
  rainNormal: number | null; // mm, long-term average total for that calendar month
  rainPct: number | null; // % of normal (100 = normal)
};

/**
 * Anomalies for the `count` consecutive months ending at the latest *complete* month (before
 * `currentMonth`) that has both temperature and rainfall published. Months inside that window with
 * a missing value keep nulls rather than being skipped, so the window is always `count` calendar months.
 */
export function recentAnomalies(obs: MonthlyObs, clim: Climatology, currentMonth: string, count = 12): MonthAnomaly[] {
  const complete = Object.keys(obs.temp)
    .filter((m) => m < currentMonth && m in obs.rainPerDay)
    .sort();
  const last = complete.at(-1);
  if (!last) return [];

  return Array.from({ length: count }, (_, i) => {
    const month = addMonths(last, i - count + 1);
    const [year, mon] = month.split('-').map(Number);
    const days = daysInMonth(year, mon);

    const temp = obs.temp[month] ?? null;
    const tempNormal = clim.temp[mon - 1];
    const rain = obs.rainPerDay[month] != null ? obs.rainPerDay[month] * days : null;
    const rainNormal = clim.rainPerDay[mon - 1] != null ? clim.rainPerDay[mon - 1]! * days : null;
    return {
      month,
      temp,
      tempNormal,
      tempDiff: temp != null && tempNormal != null ? temp - tempNormal : null,
      rain,
      rainNormal,
      rainPct: rain != null && rainNormal != null && rainNormal > 0 ? (rain / rainNormal) * 100 : null,
    };
  });
}

export type AnomalySummary = {
  /** Mean of the monthly temperature differences, °C. */
  tempDiff: number | null;
  /** Total rainfall over the window as % of the normal total for the same months. */
  rainPct: number | null;
  rain: number | null; // mm
  rainNormal: number | null; // mm
  months: number; // months that had both values
};

export function summarise(months: MonthAnomaly[]): AnomalySummary {
  const diffs = months.map((m) => m.tempDiff).filter((d): d is number => d != null);
  const paired = months.filter((m) => m.rain != null && m.rainNormal != null);
  const rain = paired.reduce((s, m) => s + m.rain!, 0);
  const rainNormal = paired.reduce((s, m) => s + m.rainNormal!, 0);
  return {
    tempDiff: diffs.length ? diffs.reduce((s, d) => s + d, 0) / diffs.length : null,
    rainPct: paired.length && rainNormal > 0 ? (rain / rainNormal) * 100 : null,
    rain: paired.length ? rain : null,
    rainNormal: paired.length ? rainNormal : null,
    months: months.filter((m) => m.tempDiff != null && m.rainPct != null).length,
  };
}
