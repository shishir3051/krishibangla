import { describe, expect, it } from 'vitest';
import climFixture from '@/test/fixtures/nasa-climatology-dhaka.json';
import monthlyFixture from '@/test/fixtures/nasa-monthly-dhaka.json';
import {
  addMonths,
  climatologyUrl,
  daysInMonth,
  dhakaYearMonth,
  monthlyUrl,
  parseBaseline,
  parseClimatology,
  parseMonthly,
  recentAnomalies,
  summarise,
  type Climatology,
  type MonthlyObs,
} from './climate';

describe('urls', () => {
  it('asks POWER for temperature and corrected rainfall at a point', () => {
    const url = monthlyUrl(23.8103, 90.4125, 2024, 2026);
    expect(url).toContain('/temporal/monthly/point?parameters=T2M,PRECTOTCORR&community=AG');
    expect(url).toContain('latitude=23.8103&longitude=90.4125&start=2024&end=2026&format=JSON');
    expect(climatologyUrl(22.3569, 91.7832)).toContain('/temporal/climatology/point?parameters=T2M,PRECTOTCORR');
  });
});

describe('parseMonthly', () => {
  const obs = parseMonthly(monthlyFixture)!;

  it('keys real monthly values by YYYY-MM and drops the annual pseudo-month', () => {
    expect(obs.temp['2026-09']).toBe(28.23);
    expect(obs.rainPerDay['2024-08']).toBe(20.33);
    expect(Object.keys(obs.temp).some((k) => k.endsWith('-13'))).toBe(false);
  });

  it('drops -999 fill values for months not yet published', () => {
    expect(obs.temp['2026-10']).toBeUndefined();
    expect(obs.rainPerDay['2026-11']).toBeUndefined();
  });

  it('refuses a rainfall unit it cannot convert', () => {
    const changed = structuredClone(monthlyFixture) as { parameters: { PRECTOTCORR: { units: string } } };
    changed.parameters.PRECTOTCORR.units = 'mm';
    expect(parseMonthly(changed)).toBeNull();
    expect(parseMonthly({ header: 'failed', messages: ['end date out of range'] })).toBeNull();
  });
});

describe('parseClimatology', () => {
  it('reads the 12 monthly normals and the baseline period from the header', () => {
    const clim = parseClimatology(climFixture)!;
    expect(clim.temp).toHaveLength(12);
    expect(clim.temp[0]).toBe(17.65); // January
    expect(clim.rainPerDay[6]).toBe(13.04); // July
    expect(clim.baseline).toEqual({ startYear: 2001, endYear: 2025 });
  });

  it('parses baseline wording variants', () => {
    expect(parseBaseline('pre-computed climatological period (January 1991 – December 2020)')).toEqual({ startYear: 1991, endYear: 2020 });
    expect(parseBaseline('no period here')).toBeNull();
    expect(parseBaseline(undefined)).toBeNull();
  });
});

describe('calendar helpers', () => {
  it('counts days, shifts months and reads the Dhaka month', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2026, 9)).toBe(30);
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(addMonths('2025-10', 11)).toBe('2026-09');
    // 19:00 UTC on 31 Oct is already 1 Nov in Dhaka (UTC+6).
    expect(dhakaYearMonth(new Date('2026-10-31T19:00:00Z'))).toBe('2026-11');
  });
});

describe('recentAnomalies', () => {
  const obs = parseMonthly(monthlyFixture)!;
  const clim = parseClimatology(climFixture)!;

  it('covers the 12 months up to the latest complete month with data', () => {
    const months = recentAnomalies(obs, clim, '2026-11');
    expect(months).toHaveLength(12);
    expect(months[0].month).toBe('2025-10');
    expect(months.at(-1)!.month).toBe('2026-09');
  });

  it('gives temperature in °C difference and rainfall as % of normal, using days in month', () => {
    const sep = recentAnomalies(obs, clim, '2026-11').at(-1)!;
    expect(sep.tempDiff).toBeCloseTo(28.23 - 27.79, 6);
    expect(sep.rain).toBeCloseTo(8.24 * 30, 6);
    expect(sep.rainNormal).toBeCloseTo(9.02 * 30, 6);
    expect(sep.rainPct).toBeCloseTo((8.24 / 9.02) * 100, 6);
  });

  it('never counts the current (incomplete) month', () => {
    expect(recentAnomalies(obs, clim, '2026-09').at(-1)!.month).toBe('2026-08');
  });

  it('keeps gaps as nulls and returns nothing when there is no data', () => {
    const gappy: MonthlyObs = { temp: { '2026-01': 18, '2026-03': 26 }, rainPerDay: { '2026-01': 0.1, '2026-03': 2 } };
    const months = recentAnomalies(gappy, clim, '2026-05', 3);
    expect(months.map((m) => m.month)).toEqual(['2026-01', '2026-02', '2026-03']);
    expect(months[1]).toMatchObject({ temp: null, tempDiff: null, rain: null, rainPct: null });
    expect(recentAnomalies({ temp: {}, rainPerDay: {} }, clim, '2026-05')).toEqual([]);
  });

  it('leaves rainfall % empty when the normal is zero', () => {
    const dry: Climatology = { ...clim, rainPerDay: clim.rainPerDay.map(() => 0) };
    expect(recentAnomalies(obs, dry, '2026-11')[0].rainPct).toBeNull();
  });
});

describe('summarise', () => {
  it('averages temperature differences and compares total rainfall with the normal total', () => {
    const summary = summarise([
      { month: '2026-01', temp: 18, tempNormal: 17, tempDiff: 1, rain: 10, rainNormal: 20, rainPct: 50 },
      { month: '2026-02', temp: 20, tempNormal: 21, tempDiff: -0.5, rain: 30, rainNormal: 20, rainPct: 150 },
      { month: '2026-03', temp: null, tempNormal: 26, tempDiff: null, rain: null, rainNormal: 50, rainPct: null },
    ]);
    expect(summary.tempDiff).toBeCloseTo(0.25, 6);
    expect(summary.rainPct).toBeCloseTo(100, 6); // 40 mm of 40 mm normal — the missing month is not counted
    expect(summary.months).toBe(2);
  });
});
