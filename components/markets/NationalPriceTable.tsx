import { fill, type Dictionary } from '@/lib/dictionary';
import { commodityName } from '@/lib/domain/commodities';
import { SERIES_MONTHS, type PriceAggregate } from '@/lib/domain/prices';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import type { SourceMeta } from '@/lib/sources/types';
import { formatMonth, formatTaka } from './format';
import { perUnit, PriceChange, PricesFooter, trendLabel } from './parts';
import { Sparkline } from './Sparkline';

type Props = { locale: Locale; t: Dictionary; data: PriceAggregate; meta: SourceMeta };

/** Every commodity with a recent national figure: price, change, data month and a 24-month sparkline. */
export function NationalPriceTable({ locale, t, data, meta }: Props) {
  const m = t.markets;
  const other: Locale = locale === 'bn' ? 'en' : 'bn';
  const n = (v: number) => formatNumber(locale, v);
  const th = 'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-fg-muted';

  return (
    <section aria-labelledby="national-prices" className="rounded-2xl border border-line bg-surface shadow-sm">
      <header className="px-4 pt-5 sm:px-5">
        <h2 id="national-prices" className="text-base font-semibold text-fg">
          {m.nationalTitle}
        </h2>
      </header>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{fill(m.nationalCaption, { n: n(SERIES_MONTHS) })}</caption>
          <thead className="border-y border-line bg-surface-2">
            <tr>
              <th scope="col" className={`${th} pl-4 sm:pl-5`}>
                {m.colItem}
              </th>
              <th scope="col" className={`${th} text-right`}>
                {m.colPrice}
              </th>
              <th scope="col" className={th}>
                {m.colChange}
              </th>
              <th scope="col" className={`${th} hidden md:table-cell`}>
                {m.colMonth}
              </th>
              <th scope="col" className={`${th} hidden pr-4 sm:table-cell sm:pr-5`}>
                {fill(m.colTrend, { n: n(SERIES_MONTHS) })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.commodities.map((c) => {
              const markets = fill(m.marketsDistricts, { markets: n(c.latest.markets), districts: n(c.latest.districts) });
              const month = <time dateTime={c.latest.month}>{formatMonth(locale, c.latest.month)}</time>;
              return (
                <tr key={`${c.commodity}|${c.unit}`} className="align-top">
                  <th scope="row" className="py-3 pl-4 pr-3 text-left font-normal sm:pl-5">
                    <span className="block font-medium text-fg">{commodityName(c.commodity, locale)}</span>
                    <span className="block text-xs text-fg-muted" lang={other}>
                      {commodityName(c.commodity, other)}
                    </span>
                    <span className="mt-1 block text-xs text-fg-muted md:hidden">
                      {month} · {markets}
                    </span>
                  </th>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <span className="block font-semibold tabular-nums text-fg">{formatTaka(locale, c.latest.price)}</span>
                    <span className="block text-xs text-fg-muted">{perUnit(locale, t, c.unit)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <PriceChange locale={locale} labels={m} change={c.change} />
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell">
                    <span className="block whitespace-nowrap text-fg">{month}</span>
                    <span className="block text-xs text-fg-muted">{markets}</span>
                  </td>
                  <td className="hidden py-3 pl-3 pr-4 sm:table-cell sm:pr-5">
                    <Sparkline
                      points={c.series}
                      start={data.seriesStart}
                      months={SERIES_MONTHS}
                      label={trendLabel(locale, t, c)}
                      className="h-7 w-24 text-brand"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="border-t border-line px-4 py-3 sm:px-5">
        <PricesFooter locale={locale} t={t} meta={meta} latestMonth={data.latestMonth} />
      </footer>
    </section>
  );
}
