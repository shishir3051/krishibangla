/**
 * MarketSnapshot — home-page card: today's retail prices in Dhaka (TCB) for key staples, with the change
 * from a month earlier, a SourceTag and a link to /[locale]/markets. If TCB's sheet cannot be read, it shows
 * the latest national monthly prices (WFP) instead.
 *
 * CONTRACT (used by app/[locale]/page.tsx): async server component, same props. TCB is refreshed hourly,
 * so it renders per request: put it inside <Suspense fallback={<MarketSnapshotSkeleton />}>.
 */
import Link from 'next/link';
import { connection } from 'next/server';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SourceTag } from '@/components/ui/SourceTag';
import type { Dictionary } from '@/lib/dictionary';
import { commodityName, KEY_STAPLES } from '@/lib/domain/commodities';
import { findCommodity, type CommodityPrices } from '@/lib/domain/prices';
import { findTcbItem, rangeChange, TCB_STAPLES, type TcbItem } from '@/lib/domain/tcb';
import { formatDate, formatDayMonth } from '@/lib/format';
import { localePath, type Locale } from '@/lib/i18n';
import { getTcbPrices } from '@/lib/sources/tcb';
import { getWfpPrices } from '@/lib/sources/wfp';
import { formatMonth, formatTaka, formatTakaRange } from './format';
import { ChangeFigure, perUnit, PriceChange, PricesFooter, SourceOnly } from './parts';

const COUNT = 6;

export async function MarketSnapshot({ locale, t }: { locale: Locale; t: Dictionary }) {
  await connection();
  const result = await getTcbPrices();
  const m = t.markets;
  const staples = result.ok
    ? TCB_STAPLES.map((id) => findTcbItem(result.data, id)).filter((item): item is TcbItem => item?.prices.today != null)
    : [];
  if (!result.ok || staples.length < 3) return <WfpSnapshot locale={locale} t={t} />;

  const { data, meta } = result;
  const since = data.dates.month ? formatDayMonth(locale, data.dates.month) : '';

  return (
    <Card
      title={m.snapshotTitle}
      action={<ViewAll locale={locale} t={t} />}
      footer={
        <div className="space-y-1">
          <p className="text-xs text-fg-muted">
            {m.todayFootnote} · <time dateTime={data.date}>{formatDate(locale, data.date)}</time>
          </p>
          <SourceTag locale={locale} labels={t.source} source={meta.source} url={meta.url} fetchedAt={meta.fetchedAt} />
        </div>
      }
    >
      <p className="-mt-2 mb-4 text-sm text-fg-muted">{m.snapshotSubtitleToday}</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {staples.map((item) => {
          const change = rangeChange(item.prices.today, item.prices.month);
          return (
            <li key={item.key} className="flex flex-col rounded-xl bg-surface-2 p-3">
              <p className="text-sm font-medium leading-snug text-fg">{item.name[locale]}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-fg">{formatTakaRange(locale, item.prices.today!)}</p>
              <p className="text-xs text-fg-muted">{item.unit[locale]}</p>
              <div className="mt-auto pt-2">
                {change == null ? (
                  <span className="text-xs text-fg-muted">{m.noComparison}</span>
                ) : (
                  <ChangeFigure locale={locale} labels={m} pct={change} since={since} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/** The national monthly prices (WFP): the fallback when TCB's daily sheet is unavailable. */
async function WfpSnapshot({ locale, t }: { locale: Locale; t: Dictionary }) {
  const result = await getWfpPrices();
  const m = t.markets;
  const staples = result.ok
    ? KEY_STAPLES.map((name) => findCommodity(result.data, name))
        .filter((c): c is CommodityPrices => c !== undefined)
        .slice(0, COUNT)
    : [];

  if (!result.ok || staples.length === 0) {
    return (
      <Card title={m.snapshotTitle} action={<ViewAll locale={locale} t={t} />} footer={<SourceOnly t={t} meta={result.meta} />}>
        <p className="text-fg-muted">{m.unavailable}</p>
      </Card>
    );
  }

  return (
    <Card
      title={m.snapshotTitle}
      action={<ViewAll locale={locale} t={t} />}
      footer={<PricesFooter locale={locale} t={t} meta={result.meta} latestMonth={result.data.latestMonth} />}
    >
      <p className="-mt-2 mb-4 text-sm text-fg-muted">{m.snapshotSubtitle}</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {staples.map((c) => (
          <li key={`${c.commodity}|${c.unit}`} className="flex flex-col rounded-xl bg-surface-2 p-3">
            <p className="text-sm font-medium leading-snug text-fg">{commodityName(c.commodity, locale)}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-fg">{formatTaka(locale, c.latest.price)}</p>
            <p className="text-xs text-fg-muted">{perUnit(locale, t, c.unit)}</p>
            <div className="mt-2">
              <PriceChange locale={locale} labels={m} change={c.change} />
            </div>
            <p className="mt-auto pt-2 text-xs text-fg-muted">
              <time dateTime={c.latest.month}>{formatMonth(locale, c.latest.month)}</time>
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ViewAll({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <Link href={localePath(locale, '/markets')} className="shrink-0 text-sm font-medium text-brand underline-offset-2 hover:underline">
      {t.markets.viewAll} <span aria-hidden>→</span>
    </Link>
  );
}

export function MarketSnapshotSkeleton() {
  return <Skeleton className="h-80" />;
}
