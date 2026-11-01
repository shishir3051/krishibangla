/**
 * parts.tsx — Small server-rendered pieces shared by the markets cards, table and page.
 */
import { SourceTag } from '@/components/ui/SourceTag';
import { fill, type Dictionary } from '@/lib/dictionary';
import { commodityName, unitName } from '@/lib/domain/commodities';
import type { CommodityPrices } from '@/lib/domain/prices';
import type { SourceMeta } from '@/lib/sources/types';
import type { Locale } from '@/lib/i18n';
import { formatMonth, formatPct, formatTaka } from './format';

type Labels = Dictionary['markets'];

/** "per kg" / "প্রতি কেজি" */
export function perUnit(locale: Locale, t: Dictionary, unit: string): string {
  return fill(t.markets.perUnit, { unit: unitName(unit, locale) });
}

/** Screen-reader summary of a sparkline: first and last point of the series. */
export function trendLabel(locale: Locale, t: Dictionary, c: CommodityPrices): string {
  const first = c.series[0];
  const last = c.series.at(-1)!;
  return fill(t.markets.trendLabel, {
    name: commodityName(c.commodity, locale),
    from: formatTaka(locale, first.price),
    start: formatMonth(locale, first.month),
    to: formatTaka(locale, last.price),
    end: formatMonth(locale, last.month),
  });
}

/**
 * Month-on-month change: arrow + percentage, then "vs Jun 2026". Colours are neutral on purpose
 * (a rise is bad for shoppers but good for farmers selling), so direction is carried by the arrow and text.
 */
export function PriceChange({ locale, labels, change, compact = false }: { locale: Locale; labels: Labels; change: CommodityPrices['change']; compact?: boolean }) {
  if (!change) return <span className="text-xs text-fg-muted">{labels.noComparison}</span>;
  return <ChangeFigure locale={locale} labels={labels} pct={change.pct} since={fill(labels.vsMonth, { month: formatMonth(locale, change.since) })} compact={compact} />;
}

/** Arrow + percentage, then what it is compared with (`since`, e.g. "vs Jun 2026" or "1 Oct"). Colours as PriceChange. */
export function ChangeFigure({ locale, labels, pct: change, since, compact = false }: { locale: Locale; labels: Labels; pct: number; since: string; compact?: boolean }) {
  const pct = formatPct(locale, change);
  const rounded = Math.round(change * 10) / 10;
  const [arrow, text, tone] =
    rounded > 0
      ? ['▲', fill(labels.changeUp, { pct }), 'text-accent']
      : rounded < 0
        ? ['▼', fill(labels.changeDown, { pct }), 'text-info']
        : ['→', labels.changeSame, 'text-fg-muted'];

  return (
    <span className={compact ? 'inline-flex flex-wrap items-baseline gap-x-1.5 text-sm' : 'text-sm'}>
      <span className={`font-medium tabular-nums ${tone}`}>
        <span aria-hidden>
          {arrow} {rounded === 0 ? formatPct(locale, 0) : pct}
        </span>
        <span className="sr-only">{text}</span>
      </span>
      <span className={`text-xs text-fg-muted ${compact ? '' : 'block'}`}>{since}</span>
    </span>
  );
}

/** Footer for every price block: what the figure is, the data month, and the source link. */
export function PricesFooter({ locale, t, meta, latestMonth }: { locale: Locale; t: Dictionary; meta: SourceMeta; latestMonth: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-fg-muted">
        {t.markets.footnote} · {fill(t.markets.latestMonth, { month: formatMonth(locale, latestMonth) })}
      </p>
      <SourceTag locale={locale} labels={t.source} source={meta.source} url={meta.url} fetchedAt={meta.fetchedAt} />
    </div>
  );
}

/** Source line when the fetch failed: names the source without claiming an update time. */
export function SourceOnly({ t, meta }: { t: Dictionary; meta: SourceMeta }) {
  return (
    <p className="text-xs text-fg-muted">
      {t.source.label}:{' '}
      <a href={meta.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-fg">
        {meta.source}
      </a>
    </p>
  );
}
