/**
 * KpiTiles — home-page row of national indicators from the World Bank (agriculture share of GDP,
 * employment, cereal production and yield, fisheries with its aquaculture/capture split,
 * agricultural land), each with its data year, a 20-year sparkline and its source.
 *
 * CONTRACT (used by app/[locale]/page.tsx): async server component, same props.
 * Data is cached for weeks ('use cache'), so this is part of the prerendered shell.
 */
import type { ReactNode } from 'react';
import { SourceTag } from '@/components/ui/SourceTag';
import { fill, type Dictionary } from '@/lib/dictionary';
import { INDICATORS, fisheriesSplit, indicatorPageUrl, scaleTonnes, type IndicatorData, type IndicatorKey } from '@/lib/domain/indicators';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { getNationalIndicators } from '@/lib/sources/world-bank';
import { formatYear } from './format';
import { Sparkline } from './Sparkline';

const TILES = ['agriGdp', 'agriEmployment', 'cerealProduction', 'cerealYield', 'fisheries', 'agriLand'] as const satisfies readonly IndicatorKey[];
type TileKey = (typeof TILES)[number];

type Units = Dictionary['climate']['kpi']['units'];

/** The unit template and the number to put in it, e.g. ("{n} million t", "66.3"). */
function valueParts(locale: Locale, units: Units, key: IndicatorKey, value: number): { template: string; n: string } {
  switch (INDICATORS[key].unit) {
    case 'percent':
      return { template: units.percent, n: formatNumber(locale, value, 1) };
    case 'kgPerHa':
      return { template: units.kgPerHa, n: formatNumber(locale, value, 0) };
    case 'tonnes': {
      const s = scaleTonnes(locale, value);
      return { template: s.scale === 'large' ? units.tonnesLarge : s.scale === 'medium' ? units.tonnesMedium : units.tonnes, n: formatNumber(locale, s.value, s.digits) };
    }
  }
}

const formatValue = (locale: Locale, units: Units, key: IndicatorKey, value: number) => {
  const { template, n } = valueParts(locale, units, key, value);
  return fill(template, { n });
};

/** Big number, smaller unit: "{n} million t" → <big>66.3</big> million t. */
function Value({ template, n }: { template: string; n: string }) {
  const [before, after = ''] = template.split('{n}');
  return (
    <p className="mt-3 text-fg">
      {before && <span className="text-sm text-fg-muted">{before}</span>}
      <span className="text-3xl font-semibold leading-none">{n}</span>
      {after && <span className="text-sm text-fg-muted">{after}</span>}
    </p>
  );
}

function FisheriesSplitBar({ locale, t, aquaculture, capture }: { locale: Locale; t: Dictionary; aquaculture?: IndicatorData; capture?: IndicatorData }) {
  const split = fisheriesSplit(aquaculture, capture);
  if (!split) return null;
  const k = t.climate.kpi;
  // Whole percentages that add up to 100.
  const aquaPct = Math.round(split.aquacultureShare * 100);
  const capturePct = 100 - aquaPct;
  const pct = (v: number) => fill(k.units.percent, { n: formatNumber(locale, v) });
  const label = fill(k.splitLabel, { year: formatYear(locale, split.year), aqua: formatNumber(locale, aquaPct), capture: formatNumber(locale, capturePct) });

  return (
    <div className="mt-3">
      <div role="img" aria-label={label} title={label} className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
        <span className="rounded-l-full bg-brand" style={{ width: `${split.aquacultureShare * 100}%` }} />
        <span className="flex-1 rounded-r-full bg-info" />
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-fg-muted" aria-hidden>
        <li className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-brand" />
          {k.aquaculture} {pct(aquaPct)}
        </li>
        <li className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-info" />
          {k.capture} {pct(capturePct)} · {formatYear(locale, split.year)}
        </li>
      </ul>
    </div>
  );
}

function Tile({ locale, t, tileKey, data, extra }: { locale: Locale; t: Dictionary; tileKey: TileKey; data: IndicatorData; extra?: ReactNode }) {
  const k = t.climate.kpi;
  const label = k.labels[tileKey];
  const first = data.series[0];
  const last = data.series.at(-1)!;
  const year = (y: number) => formatYear(locale, y);
  const value = (v: number) => formatValue(locale, k.units, tileKey, v);

  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-fg">{label}</h3>
      <p className="text-xs text-fg-muted">{k.notes[tileKey]}</p>
      <Value {...valueParts(locale, k.units, tileKey, data.latest.value)} />
      {extra}
      {data.series.length >= 2 && (
        <div className="mt-4">
          <Sparkline
            points={data.series}
            label={fill(k.trendLabel, { label, from: year(first.year), to: year(last.year), first: value(first.value), last: value(last.value) })}
            pointLabels={data.series.map((p) => fill(k.point, { year: year(p.year), value: value(p.value) }))}
          />
          {/* The line is scaled to its own range, so state where it started. */}
          <p aria-hidden className="mt-1 flex justify-between gap-2 text-xs text-fg-muted">
            <span>{fill(k.point, { year: year(first.year), value: value(first.value) })}</span>
            <span>{year(last.year)}</span>
          </p>
        </div>
      )}
      <div className="mt-auto pt-3">
        <SourceTag
          locale={locale}
          labels={t.source}
          note={k.annual}
          source={fill(k.sourceYear, { year: year(data.latest.year) })}
          url={indicatorPageUrl(data.id)}
        />
      </div>
    </li>
  );
}

export async function KpiTiles({ locale, t }: { locale: Locale; t: Dictionary }) {
  const result = await getNationalIndicators();
  const k = t.climate.kpi;
  const tiles = result.ok ? TILES.filter((key) => result.data[key]) : [];

  return (
    <section aria-labelledby="national-kpis-title">
      <h2 id="national-kpis-title" className="text-xl font-semibold text-fg">
        {k.title}
      </h2>
      <p className="mt-1 text-sm text-fg-muted">{k.subtitle}</p>

      {result.ok && tiles.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
          {tiles.map((key) => (
            <Tile
              key={key}
              locale={locale}
              t={t}
              tileKey={key}
              data={result.data[key]!}
              extra={key === 'fisheries' ? <FisheriesSplitBar locale={locale} t={t} aquaculture={result.data.aquaculture} capture={result.data.capture} /> : undefined}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <p className="text-fg-muted">{k.unavailable}</p>
          <div className="mt-3">
            <SourceTag locale={locale} labels={t.source} source={result.meta.source} url={result.meta.url} fetchedAt={result.meta.fetchedAt} />
          </div>
        </div>
      )}
    </section>
  );
}
