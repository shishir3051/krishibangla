/**
 * weather.ts — Open-Meteo request/parse for all districts, plus WMO weather-code labels.
 * Current conditions and the daily forecast are separate requests because they change at different
 * rates (every 15 minutes vs a few times a day) and are cached for different lifetimes.
 * Pure (no fetching), unit-tested in weather.test.ts; the cached fetches live in lib/sources/open-meteo.ts.
 */
import { z } from 'zod';
import type { Bilingual } from './vocab';

export type CurrentConditions = {
  time: string; // local ISO (YYYY-MM-DDTHH:mm, Asia/Dhaka) of the 15-minute measurement
  isDay: boolean;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number; // km/h
  soilMoisture: number | null; // m³/m³ at 3–9 cm
};

export type DailyForecast = {
  date: string; // YYYY-MM-DD, Asia/Dhaka
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rain: number; // mm
  rainChance: number | null; // %
  et0: number; // mm reference evapotranspiration (FAO-56)
};

// Each request stays at 10 variables or fewer, so Open-Meteo counts it as one call per location.
const CURRENT = 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,soil_moisture_3_to_9cm,is_day';
const DAILY = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration';
export const FORECAST_DAYS = 7;

/** One request for every location (Open-Meteo returns an array in the same order). */
export function forecastUrl(points: { lat: number; lon: number }[], part: 'current' | 'daily'): string {
  return (
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${points.map((p) => p.lat).join(',')}&longitude=${points.map((p) => p.lon).join(',')}` +
    (part === 'current' ? `&current=${CURRENT}` : `&daily=${DAILY}&forecast_days=${FORECAST_DAYS}`) +
    '&timezone=Asia%2FDhaka'
  );
}

const num = z.number();
const currentSchema = z.object({
  current: z.object({
    time: z.string(),
    is_day: num,
    temperature_2m: num,
    relative_humidity_2m: num,
    apparent_temperature: num,
    precipitation: num,
    weather_code: num,
    wind_speed_10m: num,
    soil_moisture_3_to_9cm: num.nullable(),
  }),
});
const dailySchema = z.object({
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(num),
    temperature_2m_max: z.array(num),
    temperature_2m_min: z.array(num),
    precipitation_sum: z.array(num),
    precipitation_probability_max: z.array(num.nullable()),
    et0_fao_evapotranspiration: z.array(num),
  }),
});

/** Validates a multi-location response (one entry per key, in request order); null if malformed. */
function parseLocations<S extends z.ZodType, T>(json: unknown, keys: string[], schema: S, map: (loc: z.infer<S>) => T) {
  const parsed = z.array(schema).length(keys.length).safeParse(Array.isArray(json) ? json : [json]);
  if (!parsed.success) return null;
  return Object.fromEntries(parsed.data.map((loc, i) => [keys[i], map(loc)])) as Record<string, T>;
}

export function parseCurrent(json: unknown, keys: string[]): Record<string, CurrentConditions> | null {
  return parseLocations(json, keys, currentSchema, ({ current: c }) => ({
    time: c.time,
    isDay: c.is_day === 1,
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    weatherCode: c.weather_code,
    windSpeed: c.wind_speed_10m,
    soilMoisture: c.soil_moisture_3_to_9cm,
  }));
}

export function parseDaily(json: unknown, keys: string[]): Record<string, DailyForecast[]> | null {
  return parseLocations(json, keys, dailySchema, ({ daily: d }) =>
    d.time.map((date, j) => ({
      date,
      weatherCode: d.weather_code[j],
      tempMax: d.temperature_2m_max[j],
      tempMin: d.temperature_2m_min[j],
      rain: d.precipitation_sum[j],
      rainChance: d.precipitation_probability_max[j],
      et0: d.et0_fao_evapotranspiration[j],
    }))
  );
}

/** Open-Meteo local times have no offset; Dhaka is UTC+6 all year (no daylight saving). */
export function dhakaLocalToIso(localTime: string): string {
  return `${localTime}:00+06:00`;
}

type CodeInfo = Bilingual & { icon: string };

const CODES: [number[], CodeInfo][] = [
  [[0], { en: 'Clear sky', bn: 'পরিষ্কার আকাশ', icon: '☀️' }],
  [[1], { en: 'Mainly clear', bn: 'প্রায় পরিষ্কার', icon: '🌤️' }],
  [[2], { en: 'Partly cloudy', bn: 'আংশিক মেঘলা', icon: '⛅' }],
  [[3], { en: 'Overcast', bn: 'মেঘাচ্ছন্ন', icon: '☁️' }],
  [[45, 48], { en: 'Fog', bn: 'কুয়াশা', icon: '🌫️' }],
  [[51, 53, 55, 56, 57], { en: 'Drizzle', bn: 'গুঁড়ি গুঁড়ি বৃষ্টি', icon: '🌦️' }],
  [[61, 66], { en: 'Light rain', bn: 'হালকা বৃষ্টি', icon: '🌦️' }],
  [[63], { en: 'Rain', bn: 'বৃষ্টি', icon: '🌧️' }],
  [[65, 67], { en: 'Heavy rain', bn: 'ভারী বৃষ্টি', icon: '🌧️' }],
  [[71, 73, 75, 77, 85, 86], { en: 'Snow', bn: 'তুষারপাত', icon: '❄️' }],
  [[80], { en: 'Light showers', bn: 'হালকা ঝরো বৃষ্টি', icon: '🌦️' }],
  [[81], { en: 'Showers', bn: 'ঝরো বৃষ্টি', icon: '🌧️' }],
  [[82], { en: 'Heavy showers', bn: 'প্রবল ঝরো বৃষ্টি', icon: '⛈️' }],
  [[95], { en: 'Thunderstorm', bn: 'বজ্রঝড়', icon: '⛈️' }],
  [[96, 99], { en: 'Thunderstorm with hail', bn: 'শিলাবৃষ্টিসহ বজ্রঝড়', icon: '⛈️' }],
];

// Icons that show the sun, swapped for night-time ones.
const NIGHT_ICONS: Record<string, string> = { '☀️': '🌙', '🌤️': '🌙', '⛅': '☁️', '🌦️': '🌧️' };

/** Plain-language label and icon for a WMO weather code; pass isDay=false for the night-time icon. */
export function weatherCodeInfo(code: number, isDay = true): CodeInfo {
  const info = CODES.find(([codes]) => codes.includes(code))?.[1] ?? { en: 'Unknown', bn: 'অজানা', icon: '🌡️' };
  return isDay ? info : { ...info, icon: NIGHT_ICONS[info.icon] ?? info.icon };
}
