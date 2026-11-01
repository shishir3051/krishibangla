import { describe, expect, it } from 'vitest';
import { effectiveRain, irrigationAdvice, soilState } from './irrigation';
import type { DailyForecast } from './weather';

const day = (et0: number, rain: number): DailyForecast => ({
  date: '2026-11-01',
  weatherCode: 0,
  tempMax: 30,
  tempMin: 20,
  rain,
  rainChance: null,
  et0,
});
const days = (et0: number, rain: number) => [day(et0, rain), day(et0, rain), day(et0, rain), day(99, 99)];

describe('effectiveRain', () => {
  it('ignores light showers and counts 80% of the rest', () => {
    expect(effectiveRain(1.5)).toBe(0);
    expect(effectiveRain(12)).toBe(8);
  });
});

describe('soilState', () => {
  it.each([
    [null, null],
    [0.09, 'dry'],
    [0.25, 'moist'],
    [0.39, 'wet'],
  ] as const)('%s → %s', (moisture, state) => expect(soilState(moisture)).toBe(state));
});

describe('irrigationAdvice', () => {
  it('only looks at the next 3 days', () => {
    const advice = irrigationAdvice(days(4, 0), 0.25);
    expect(advice).toMatchObject({ days: 3, demand: 12, rain: 0, effectiveRain: 0, deficit: 12, level: 'high', soilState: 'moist' });
  });

  it.each([
    [4, 12, 'none'], // 12 mm demand, 3×8 = 24 mm effective rain
    [1.2, 0, 'low'], // 3.6 mm deficit
    [2.5, 0, 'medium'], // 7.5 mm deficit
    [3.5, 0, 'high'], // 10.5 mm deficit
  ] as const)('ET0 %s mm/day with %s mm rain/day → %s', (et0, rain, level) => {
    expect(irrigationAdvice(days(et0, rain), 0.25).level).toBe(level);
  });

  it('wet soil lowers and dry soil raises the level', () => {
    expect(irrigationAdvice(days(2.5, 0), 0.4).level).toBe('low');
    expect(irrigationAdvice(days(2.5, 0), 0.1).level).toBe('high');
  });

  it('dry soil does not override rain that covers demand', () => {
    expect(irrigationAdvice(days(3, 12), 0.08).level).toBe('none');
  });
});
