import { describe, expect, it } from 'vitest';
import currentFixture from '@/test/fixtures/open-meteo-current.json';
import dailyFixture from '@/test/fixtures/open-meteo-daily.json';
import { dhakaLocalToIso, forecastUrl, parseCurrent, parseDaily, weatherCodeInfo } from './weather';

const points = [
  { lat: 23.81, lon: 90.41 },
  { lat: 24.45, lon: 89.71 },
];

describe('forecastUrl', () => {
  it('requests every point in one call, in Dhaka time', () => {
    const url = forecastUrl(points, 'current');
    expect(url).toContain('latitude=23.81,24.45&longitude=90.41,89.71');
    expect(url).toContain('timezone=Asia%2FDhaka');
  });

  it('asks only for the part it is for, with at most 10 variables (one Open-Meteo call per location)', () => {
    const current = new URL(forecastUrl(points, 'current')).searchParams;
    const daily = new URL(forecastUrl(points, 'daily')).searchParams;
    expect(current.get('current')).toContain('is_day');
    expect(current.get('current')).toContain('soil_moisture_3_to_9cm');
    expect(current.has('daily')).toBe(false);
    expect(daily.get('daily')).toContain('et0_fao_evapotranspiration');
    expect(daily.has('current')).toBe(false);
    expect(current.get('current')!.split(',').length).toBeLessThanOrEqual(10);
    expect(daily.get('daily')!.split(',').length).toBeLessThanOrEqual(10);
  });
});

describe('parseCurrent', () => {
  it('parses a real Open-Meteo multi-location response', () => {
    const parsed = parseCurrent(currentFixture, ['dhaka', 'sirajganj']);
    expect(Object.keys(parsed!)).toEqual(['dhaka', 'sirajganj']);
    const dhaka = parsed!.dhaka;
    expect(dhaka.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(typeof dhaka.temperature).toBe('number');
    expect(typeof dhaka.isDay).toBe('boolean');
  });

  it('returns null when the location count or shape is wrong', () => {
    expect(parseCurrent(currentFixture, ['only-one'])).toBeNull();
    expect(parseCurrent(dailyFixture, ['dhaka', 'sirajganj'])).toBeNull();
    expect(parseCurrent({ error: true, reason: 'nope' }, ['dhaka'])).toBeNull();
  });
});

describe('parseDaily', () => {
  it('parses a real Open-Meteo multi-location response', () => {
    const parsed = parseDaily(dailyFixture, ['dhaka', 'sirajganj']);
    expect(parsed!.dhaka).toHaveLength(7);
    expect(parsed!.sirajganj[0]).toEqual(
      expect.objectContaining({ date: expect.any(String), et0: expect.any(Number), rain: expect.any(Number) })
    );
  });

  it('returns null when the shape is wrong', () => {
    expect(parseDaily(currentFixture, ['dhaka', 'sirajganj'])).toBeNull();
  });
});

describe('dhakaLocalToIso', () => {
  it('adds the fixed UTC+6 offset', () => {
    expect(new Date(dhakaLocalToIso('2026-11-01T20:15')).toISOString()).toBe('2026-11-01T14:15:00.000Z');
  });
});

describe('weatherCodeInfo', () => {
  it('labels WMO codes in both languages', () => {
    expect(weatherCodeInfo(0)).toMatchObject({ en: 'Clear sky', bn: 'পরিষ্কার আকাশ' });
    expect(weatherCodeInfo(95).en).toBe('Thunderstorm');
    expect(weatherCodeInfo(1234).en).toBe('Unknown');
  });

  it('never shows the sun at night', () => {
    expect(weatherCodeInfo(0, false)).toMatchObject({ en: 'Clear sky', icon: '🌙' });
    for (const code of [0, 1, 2, 3, 45, 51, 61, 63, 80, 95]) {
      expect(weatherCodeInfo(code, false).icon).not.toMatch(/[☀🌤⛅🌦]/u);
    }
  });
});
