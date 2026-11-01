import { connection } from 'next/server';
import { Badge, type Tone } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SourceTag } from '@/components/ui/SourceTag';
import { fill, type Dictionary } from '@/lib/dictionary';
import { irrigationAdvice, type IrrigationLevel } from '@/lib/domain/irrigation';
import { weatherCodeInfo } from '@/lib/domain/weather';
import { formatDayMonth, formatNumber, formatWeekday } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { getDistrictForecasts } from '@/lib/sources/open-meteo';

type Props = { locale: Locale; slug: string; t: Dictionary };

const LEVEL_TONE: Record<IrrigationLevel, Tone> = { none: 'brand', low: 'info', medium: 'warning', high: 'danger' };

/** Live section of the district desk — rendered per request inside <Suspense>. */
export async function LiveWeather({ locale, slug, t }: Props) {
  await connection();
  const result = await getDistrictForecasts();
  const weather = result.ok ? result.data[slug] : undefined;
  const n = (v: number, digits = 0) => formatNumber(locale, v, digits);
  const sourceTag = (
    <SourceTag locale={locale} labels={t.source} source={result.meta.source} url={result.meta.url} fetchedAt={result.ok ? result.meta.fetchedAt : undefined} />
  );

  if (!weather) {
    return (
      <Card title={t.desk.weatherNow} className="md:col-span-2" footer={sourceTag}>
        <p className="text-fg-muted">{t.desk.weatherUnavailable}</p>
      </Card>
    );
  }

  const now = weather.current;
  const code = weatherCodeInfo(now.weatherCode);
  const advice = irrigationAdvice(weather.daily, now.soilMoisture);

  return (
    <>
      <Card title={t.desk.weatherNow} footer={sourceTag}>
        <div className="flex items-center gap-4">
          <span aria-hidden className="text-5xl">
            {code.icon}
          </span>
          <div>
            <p className="text-4xl font-semibold tabular-nums text-fg">{n(now.temperature, 1)}°C</p>
            <p className="text-fg-muted">{code[locale]}</p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {[
            [t.desk.feelsLike, `${n(now.apparentTemperature, 1)}°C`],
            [t.desk.humidity, `${n(now.humidity)}%`],
            [t.desk.wind, `${n(now.windSpeed)} km/h`],
            [t.desk.rainNow, `${n(now.precipitation, 1)} mm`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface-2 px-3 py-2">
              <dt className="text-fg-muted">{label}</dt>
              <dd className="font-medium tabular-nums text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title={t.desk.irrigation} footer={<p className="text-xs text-fg-muted">{t.desk.irrigationNote}</p>}>
        <Badge tone={LEVEL_TONE[advice.level]}>{t.desk.irrigationLevels[advice.level]}</Badge>
        <p className="mt-3 text-sm text-fg">
          {fill(t.desk.irrigationDetail, {
            days: n(advice.days),
            demand: n(advice.demand, 1),
            rain: n(advice.rain, 1),
            effective: n(advice.effectiveRain, 1),
          })}
        </p>
        {advice.soilState && advice.soilMoisture != null && (
          <p className="mt-2 text-sm text-fg">
            {fill(t.desk.soilDetail, { state: t.desk.soilStates[advice.soilState], value: n(advice.soilMoisture, 2) })}
          </p>
        )}
      </Card>

      <Card title={t.desk.forecast} className="md:col-span-2" footer={sourceTag}>
        <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {weather.daily.map((day) => {
            const info = weatherCodeInfo(day.weatherCode);
            return (
              <li key={day.date} className="rounded-xl bg-surface-2 p-2 text-center text-sm">
                <p className="font-medium text-fg">{formatWeekday(locale, day.date)}</p>
                <p className="text-xs text-fg-muted">{formatDayMonth(locale, day.date)}</p>
                <p aria-label={info[locale]} title={info[locale]} className="my-1 text-2xl">
                  {info.icon}
                </p>
                <p className="tabular-nums text-fg">
                  {n(day.tempMax)}° <span className="text-fg-muted">{n(day.tempMin)}°</span>
                </p>
                <p className="mt-1 text-xs tabular-nums text-info">
                  {n(day.rain, 1)} mm
                  {day.rainChance != null && <span className="block text-fg-muted" title={t.desk.rainChance}>{n(day.rainChance)}%</span>}
                </p>
              </li>
            );
          })}
        </ol>
      </Card>
    </>
  );
}

export function LiveWeatherSkeleton() {
  return (
    <>
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48 md:col-span-2" />
    </>
  );
}
