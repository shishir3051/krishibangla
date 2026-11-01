import { describe, expect, it } from 'vitest';
import fixture from '@/test/fixtures/open-meteo-forecast.json';
import { forecastUrl, parseForecast, weatherCodeInfo } from './weather';

describe('forecastUrl', () => {
  it('requests every point in one call, in Dhaka time', () => {
    const url = forecastUrl([
      { lat: 23.81, lon: 90.41 },
      { lat: 24.45, lon: 89.71 },
    ]);
    expect(url).toContain('latitude=23.81,24.45&longitude=90.41,89.71');
    expect(url).toContain('timezone=Asia%2FDhaka');
    expect(url).toContain('et0_fao_evapotranspiration');
    expect(url).toContain('soil_moisture_3_to_9cm');
  });
});

describe('parseForecast', () => {
  it('parses a real Open-Meteo multi-location response', () => {
    const parsed = parseForecast(fixture, ['dhaka', 'sirajganj']);
    expect(Object.keys(parsed!)).toEqual(['dhaka', 'sirajganj']);
    const dhaka = parsed!.dhaka;
    expect(dhaka.daily).toHaveLength(7);
    expect(dhaka.current.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(typeof dhaka.current.temperature).toBe('number');
    expect(dhaka.daily[0]).toEqual(
      expect.objectContaining({ date: expect.any(String), et0: expect.any(Number), rain: expect.any(Number) })
    );
  });

  it('returns null when the location count or shape is wrong', () => {
    expect(parseForecast(fixture, ['only-one'])).toBeNull();
    expect(parseForecast({ error: true, reason: 'nope' }, ['dhaka'])).toBeNull();
  });
});

describe('weatherCodeInfo', () => {
  it('labels WMO codes in both languages', () => {
    expect(weatherCodeInfo(0)).toMatchObject({ en: 'Clear sky', bn: 'পরিষ্কার আকাশ' });
    expect(weatherCodeInfo(95).en).toBe('Thunderstorm');
    expect(weatherCodeInfo(1234).en).toBe('Unknown');
  });
});
