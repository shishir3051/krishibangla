/**
 * CropPrices — crop-page card: latest national retail price and recent trend for one WFP
 * commodity (e.g. "Rice (coarse)"). Renders nothing when the commodity has no recent national
 * WFP figure (e.g. "Tomatoes (red)", which WFP prices only in Cox's Bazar) or the source is down.
 *
 * CONTRACT (used by app/[locale]/crops/[id]/page.tsx): async server component, same props.
 */
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { fill, type Dictionary } from '@/lib/dictionary';
import { commodityName } from '@/lib/domain/commodities';
import { findCommodity, SERIES_MONTHS } from '@/lib/domain/prices';
import { formatNumber } from '@/lib/format';
import { localePath, type Locale } from '@/lib/i18n';
import { getWfpPrices } from '@/lib/sources/wfp';
import { formatMonth, formatTaka } from './format';
import { perUnit, PriceChange, PricesFooter, trendLabel } from './parts';
import { Sparkline } from './Sparkline';

export async function CropPrices({ locale, t, commodity }: { locale: Locale; t: Dictionary; commodity: string }) {
  const result = await getWfpPrices();
  if (!result.ok) return null;
  const c = findCommodity(result.data, commodity);
  if (!c) return null;

  const m = t.markets;
  const { latestMonth, seriesStart } = result.data;
  const prices = c.series.map((p) => p.price);

  return (
    <Card
      title={m.cropTitle}
      action={
        <Link href={localePath(locale, '/markets')} className="shrink-0 text-sm font-medium text-brand underline-offset-2 hover:underline">
          {m.viewAll} <span aria-hidden>→</span>
        </Link>
      }
      footer={<PricesFooter locale={locale} t={t} meta={result.meta} latestMonth={latestMonth} />}
    >
      <p className="-mt-2 text-sm text-fg-muted">{fill(m.cropSubtitle, { name: commodityName(c.commodity, locale) })}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-3xl font-semibold tabular-nums text-fg">{formatTaka(locale, c.latest.price)}</p>
        <p className="text-sm text-fg-muted">{perUnit(locale, t, c.unit)}</p>
        <PriceChange locale={locale} labels={m} change={c.change} compact />
      </div>
      <p className="mt-1 text-xs text-fg-muted">
        <time dateTime={c.latest.month}>{formatMonth(locale, c.latest.month)}</time> ·{' '}
        {fill(m.marketsDistricts, { markets: formatNumber(locale, c.latest.markets), districts: formatNumber(locale, c.latest.districts) })}
      </p>

      <Sparkline
        points={c.series}
        start={seriesStart}
        months={SERIES_MONTHS}
        width={320}
        height={72}
        label={trendLabel(locale, t, c)}
        className="mt-4 h-auto w-full text-brand"
      />
      <div className="mt-1 flex justify-between text-xs text-fg-muted">
        <span>{formatMonth(locale, seriesStart)}</span>
        <span>{formatMonth(locale, latestMonth)}</span>
      </div>
      <p className="mt-2 text-xs text-fg-muted">
        {fill(m.range, { low: formatTaka(locale, Math.min(...prices)), high: formatTaka(locale, Math.max(...prices)) })}
      </p>
    </Card>
  );
}
