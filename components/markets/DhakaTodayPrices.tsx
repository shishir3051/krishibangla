/**
 * DhakaTodayPrices — TCB's daily retail prices for Dhaka city (markets page): today's lowest–highest
 * price of each item, grouped, with the change from a week, a month and a year earlier.
 * Refreshed hourly (lib/sources/tcb.ts), so it renders per request: put it inside <Suspense>.
 */
import { connection } from 'next/server';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SourceTag } from '@/components/ui/SourceTag';
import { fill, type Dictionary } from '@/lib/dictionary';
import { rangeChange, TCB_GROUPS, type PriceRange, type TcbGroup, type TcbItem } from '@/lib/domain/tcb';
import { formatDate, formatDayMonth } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { getTcbPrices } from '@/lib/sources/tcb';
import { formatMonth, formatTakaRange } from './format';
import { ChangeFigure, SourceOnly } from './parts';

type Labels = Dictionary['markets'];

export async function DhakaTodayPrices({ locale, t }: { locale: Locale; t: Dictionary }) {
  await connection();
  const result = await getTcbPrices();
  const m = t.markets;

  if (!result.ok) {
    return (
      <Card title={m.todayTitle} footer={<SourceOnly t={t} meta={result.meta} />}>
        <p className="text-fg-muted">{m.todayUnavailable}</p>
      </Card>
    );
  }

  const { data, meta } = result;
  const other: Locale = locale === 'bn' ? 'en' : 'bn';
  const date = formatDate(locale, data.date);
  const since = {
    week: data.dates.week ? formatDayMonth(locale, data.dates.week) : '',
    month: data.dates.month ? formatDayMonth(locale, data.dates.month) : '',
    year: data.dates.year ? formatMonth(locale, data.dates.year.slice(0, 7)) : '',
  };
  const groups = new Map<TcbGroup, TcbItem[]>();
  for (const item of data.items) groups.set(item.group, [...(groups.get(item.group) ?? []), item]);
  const th = 'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-fg-muted';

  return (
    <section aria-labelledby="dhaka-today" className="rounded-2xl border border-line bg-surface shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 pt-5 sm:px-5">
        <div>
          <h2 id="dhaka-today" className="text-base font-semibold text-fg">
            {m.todayTitle}
          </h2>
          <p className="mt-1 text-sm text-fg-muted">{m.todaySubtitle}</p>
        </div>
        <Badge tone="brand">
          <time dateTime={data.date}>{fill(m.dailyData, { date })}</time>
        </Badge>
      </header>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{fill(m.todayCaption, { date })}</caption>
          <thead className="border-y border-line bg-surface-2">
            <tr>
              <th scope="col" className={`${th} pl-4 sm:pl-5`}>
                {m.colItem}
              </th>
              <th scope="col" className={`${th} text-right`}>
                {m.colToday}
              </th>
              <th scope="col" className={`${th} hidden sm:table-cell`}>
                {m.colVsWeek}
              </th>
              <th scope="col" className={th}>
                {m.colVsMonth}
              </th>
              <th scope="col" className={`${th} hidden pr-4 md:table-cell sm:pr-5`}>
                {m.colVsYear}
              </th>
            </tr>
          </thead>
          {[...groups].map(([group, items]) => (
            <tbody key={group} className="divide-y divide-line border-b border-line">
              <tr>
                <th scope="colgroup" colSpan={5} className="bg-surface-2/60 px-4 py-2 text-left text-xs font-semibold text-fg sm:px-5">
                  {TCB_GROUPS[group][locale]}
                </th>
              </tr>
              {items.map((item) => (
                <tr key={item.key} className="align-top">
                  <th scope="row" className="py-3 pl-4 pr-3 text-left font-normal sm:pl-5">
                    <span className="block font-medium text-fg">{item.name[locale]}</span>
                    {item.name[other] !== item.name[locale] && (
                      <span className="block text-xs text-fg-muted" lang={other}>
                        {item.name[other]}
                      </span>
                    )}
                  </th>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    {item.prices.today ? (
                      <span className="block font-semibold tabular-nums text-fg">{formatTakaRange(locale, item.prices.today)}</span>
                    ) : (
                      <span className="block text-fg-muted">{m.notOnSale}</span>
                    )}
                    <span className="block text-xs text-fg-muted">{item.unit[locale]}</span>
                  </td>
                  <td className="hidden px-3 py-3 sm:table-cell">
                    <Change locale={locale} labels={m} now={item.prices.today} before={item.prices.week} since={since.week} />
                  </td>
                  <td className="px-3 py-3">
                    <Change locale={locale} labels={m} now={item.prices.today} before={item.prices.month} since={since.month} />
                  </td>
                  <td className="hidden py-3 pl-3 pr-4 md:table-cell sm:pr-5">
                    <Change locale={locale} labels={m} now={item.prices.today} before={item.prices.year} since={since.year} />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <footer className="space-y-1 px-4 py-3 sm:px-5">
        <p className="text-xs text-fg-muted">{m.todayFootnote}</p>
        {data.markets && (
          <p className="text-xs text-fg-muted">
            {m.todayMarkets} <span lang="bn">{data.markets.replace(/[।.\s]+$/, '')}</span>
          </p>
        )}
        <SourceTag locale={locale} labels={t.source} source={meta.source} url={meta.url} fetchedAt={meta.fetchedAt} />
      </footer>
    </section>
  );
}

function Change({ locale, labels, now, before, since }: { locale: Locale; labels: Labels; now: PriceRange | null; before: PriceRange | null; since: string }) {
  const pct = rangeChange(now, before);
  if (pct == null) {
    return (
      <span className="text-xs text-fg-muted">
        <span aria-hidden>—</span>
        <span className="sr-only">{labels.noEarlierPrice}</span>
      </span>
    );
  }
  return <ChangeFigure locale={locale} labels={labels} pct={pct} since={since} />;
}

export function DhakaTodayPricesSkeleton() {
  return <Skeleton className="h-[32rem]" />;
}
