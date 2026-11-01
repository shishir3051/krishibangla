/**
 * MarketSnapshot — home-page card: latest national retail prices (WFP) for key staples,
 * with month-on-month change, a SourceTag and a link to /[locale]/markets.
 *
 * CONTRACT (used by app/[locale]/page.tsx): async server component, same props.
 * Data is cached for days ('use cache' in lib/sources/wfp.ts), so it renders into the static shell.
 */
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { Dictionary } from '@/lib/dictionary';
import { commodityName, KEY_STAPLES } from '@/lib/domain/commodities';
import { findCommodity, type CommodityPrices } from '@/lib/domain/prices';
import { localePath, type Locale } from '@/lib/i18n';
import { getWfpPrices } from '@/lib/sources/wfp';
import { formatMonth, formatTaka } from './format';
import { perUnit, PriceChange, PricesFooter, SourceOnly } from './parts';

const COUNT = 6;

export async function MarketSnapshot({ locale, t }: { locale: Locale; t: Dictionary }) {
  const result = await getWfpPrices();
  const m = t.markets;
  const staples = result.ok
    ? KEY_STAPLES.map((name) => findCommodity(result.data, name))
        .filter((c): c is CommodityPrices => c !== undefined)
        .slice(0, COUNT)
    : [];

  const action = (
    <Link href={localePath(locale, '/markets')} className="shrink-0 text-sm font-medium text-brand underline-offset-2 hover:underline">
      {m.viewAll} <span aria-hidden>→</span>
    </Link>
  );

  if (!result.ok || staples.length === 0) {
    return (
      <Card title={m.snapshotTitle} action={action} footer={<SourceOnly t={t} meta={result.meta} />}>
        <p className="text-fg-muted">{m.unavailable}</p>
      </Card>
    );
  }

  return (
    <Card
      title={m.snapshotTitle}
      action={action}
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
