/**
 * weather.ts — Open-Meteo forecast request/parse for all districts, plus WMO weather-code labels.
 * Pure (no fetching), unit-tested in weather.test.ts; the cached fetch lives in lib/sources/open-meteo.ts.
 */
import { z } from 'zod';
import type { Bilingual } from './vocab';

export type DailyForecast = {
  date: string; // YYYY-MM-DD, Asia/Dhaka
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rain: number; // mm
  rainChance: number | null; // %
  et0: number; // mm reference evapotranspiration (FAO-56)
};

export type DistrictWeather = {
  current: {
    time: string; // local ISO, Asia/Dhaka
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number; // km/h
    soilMoisture: number | null; // m³/m³ at 3–9 cm
  };
  daily: DailyForecast[];
};

const CURRENT = 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,soil_moisture_3_to_9cm';
const DAILY = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration';
export const FORECAST_DAYS = 7;

/** One request for every location (Open-Meteo returns an array in the same order). */
export function forecastUrl(points: { lat: number; lon: number }[]): string {
  return (
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${points.map((p) => p.lat).join(',')}&longitude=${points.map((p) => p.lon).join(',')}` +
    `&current=${CURRENT}&daily=${DAILY}&forecast_days=${FORECAST_DAYS}&timezone=Asia%2FDhaka`
  );
}

const num = z.number();
const locationSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: num,
    relative_humidity_2m: num,
    apparent_temperature: num,
    precipitation: num,
    weather_code: num,
    wind_speed_10m: num,
    soil_moisture_3_to_9cm: num.nullable(),
  }),
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

/** Parses a multi-location response into weather per key (keys in request order); null if malformed. */
export function parseForecast(json: unknown, keys: string[]): Record<string, DistrictWeather> | null {
  const parsed = z.array(locationSchema).length(keys.length).safeParse(Array.isArray(json) ? json : [json]);
  if (!parsed.success) return null;

  return Object.fromEntries(
    parsed.data.map((loc, i) => {
      const { current: c, daily: d } = loc;
      return [
        keys[i],
        {
          current: {
            time: c.time,
            temperature: c.temperature_2m,
            apparentTemperature: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            precipitation: c.precipitation,
            weatherCode: c.weather_code,
            windSpeed: c.wind_speed_10m,
            soilMoisture: c.soil_moisture_3_to_9cm,
          },
          daily: d.time.map((date, j) => ({
            date,
            weatherCode: d.weather_code[j],
            tempMax: d.temperature_2m_max[j],
            tempMin: d.temperature_2m_min[j],
            rain: d.precipitation_sum[j],
            rainChance: d.precipitation_probability_max[j],
            et0: d.et0_fao_evapotranspiration[j],
          })),
        },
      ];
    })
  );
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

/** Plain-language label and icon for a WMO weather code. */
export function weatherCodeInfo(code: number): CodeInfo {
  return CODES.find(([codes]) => codes.includes(code))?.[1] ?? { en: 'Unknown', bn: 'অজানা', icon: '🌡️' };
}
