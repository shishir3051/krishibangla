import { describe, expect, it } from 'vitest';
import fixture from '@/test/fixtures/worldbank-cereal-production.json';
import { fisheriesSplit, indicatorUrl, parseIndicator, scaleTonnes, type IndicatorData } from './indicators';

describe('indicatorUrl', () => {
  it('asks for Bangladesh as JSON with enough rows for a 20-year series', () => {
    expect(indicatorUrl('https://api.worldbank.org/v2/', 'AG.PRD.CREL.MT')).toBe(
      'https://api.worldbank.org/v2/country/BGD/indicator/AG.PRD.CREL.MT?format=json&per_page=60'
    );
  });
});

describe('parseIndicator', () => {
  it('takes the latest non-null value from a real World Bank response', () => {
    // The fixture's newest row (2025) is null; 2024 is the latest published year.
    const parsed = parseIndicator(fixture)!;
    expect(parsed.id).toBe('AG.PRD.CREL.MT');
    expect(parsed.name).toBe('Cereal production (metric tons)');
    expect(parsed.latest).toEqual({ year: 2024, value: 66347850.85 });
  });

  it('keeps a 20-year series, oldest first, without nulls', () => {
    const { series } = parseIndicator(fixture)!;
    expect(series).toHaveLength(20);
    expect(series[0].year).toBe(2005);
    expect(series.at(-1)!.year).toBe(2024);
    expect(series.every((p, i) => i === 0 || p.year > series[i - 1].year)).toBe(true);
  });

  it('returns null for the error payload and for all-null data', () => {
    expect(parseIndicator([{ message: [{ id: '120', key: 'Invalid value', value: 'The provided parameter value is not valid' }] }])).toBeNull();
    expect(parseIndicator([{ page: 1 }, [{ indicator: { id: 'X', value: 'X' }, date: '2024', value: null }]])).toBeNull();
    expect(parseIndicator(null)).toBeNull();
  });
});

const series = (id: string, points: [number, number][]): IndicatorData => ({
  id,
  name: id,
  latest: { year: points.at(-1)![0], value: points.at(-1)![1] },
  series: points.map(([year, value]) => ({ year, value })),
});

describe('fisheriesSplit', () => {
  it('computes the aquaculture share for the latest year both series have', () => {
    // Real 2024 values: aquaculture 2 978 650 t, capture 2 040 419 t.
    const aqua = series('ER.FSH.AQUA.MT', [
      [2023, 2900000],
      [2024, 2978650],
    ]);
    const capture = series('ER.FSH.CAPT.MT', [
      [2023, 2000000],
      [2024, 2040419],
    ]);
    const split = fisheriesSplit(aqua, capture)!;
    expect(split.year).toBe(2024);
    expect(split.aquacultureShare).toBeCloseTo(2978650 / 5019069, 6);
  });

  it('falls back to an earlier common year, or null when there is none', () => {
    const aqua = series('A', [
      [2022, 3],
      [2023, 3],
    ]);
    const capture = series('C', [[2022, 1]]);
    expect(fisheriesSplit(aqua, capture)).toMatchObject({ year: 2022, aquacultureShare: 0.75 });
    expect(fisheriesSplit(aqua, series('C', [[2010, 1]]))).toBeNull();
    expect(fisheriesSplit(aqua, undefined)).toBeNull();
  });
});

describe('scaleTonnes', () => {
  it('uses millions in English and crore/lakh in Bangla', () => {
    expect(scaleTonnes('en', 66347850)).toMatchObject({ scale: 'large', digits: 1 });
    expect(scaleTonnes('en', 66347850).value).toBeCloseTo(66.35, 2);
    expect(scaleTonnes('bn', 66347850)).toMatchObject({ scale: 'large', digits: 2 });
    expect(scaleTonnes('bn', 66347850).value).toBeCloseTo(6.635, 3);
    expect(scaleTonnes('bn', 5019069)).toMatchObject({ scale: 'medium' });
    expect(scaleTonnes('bn', 5019069).value).toBeCloseTo(50.19, 2);
    expect(scaleTonnes('en', 5019069).value).toBeCloseTo(5.019, 3);
    expect(scaleTonnes('en', 950)).toEqual({ value: 950, digits: 0, scale: 'plain' });
  });
});
