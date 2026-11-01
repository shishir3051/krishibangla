'use client';
import { useId, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { formatTaka } from './format';

/** [item index, price ৳, month index, markets, national price ৳ that month (or null)] */
export type DistrictRow = [item: number, price: number, month: number, markets: number, national: number | null];

export type DistrictPickerLabels = {
  title: string;
  hint: string; // already filled
  label: string;
  placeholder: string;
  showing: string; // "{district}: {n} items"
  caption: string; // "Latest prices in {district}"
  colItem: string;
  colPrice: string;
  colMonth: string;
  colNational: string;
  markets: string; // "{n} markets"
  far: string;
};

type Props = {
  locale: Locale;
  labels: DistrictPickerLabels;
  /** Commodity display name and "per kg" text, referenced by index from rows. */
  items: { name: string; unit: string }[];
  /** Month value (YYYY-MM) and display label, referenced by index from rows. */
  months: { value: string; label: string }[];
  groups: { label: string; districts: { slug: string; name: string }[] }[];
  rows: Record<string, DistrictRow[]>;
};

// lib/dictionary.ts is server-only, so this mirrors its fill().
const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);

/** A district's own price this far from the national one is worth a second look (often a data-entry error). */
const isFar = (price: number, national: number | null) => national !== null && (price >= national * 2 || price <= national / 2);

/** District select → that district's latest WFP prices. All data arrives as props (no request-time APIs). */
export function DistrictPicker({ locale, labels, items, months, groups, rows }: Props) {
  const [slug, setSlug] = useState('');
  const selectId = useId();
  const selected = groups.flatMap((g) => g.districts).find((d) => d.slug === slug);
  const list = (slug && rows[slug]) || [];
  const n = (v: number) => formatNumber(locale, v);
  const th = 'px-3 py-2 text-left text-xs font-medium text-fg-muted';

  return (
    <Card title={labels.title}>
      <p className="-mt-2 text-sm text-fg-muted">{labels.hint}</p>
      <label htmlFor={selectId} className="mt-4 block text-sm font-medium text-fg">
        {labels.label}
      </label>
      <select
        id={selectId}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <option value="">{labels.placeholder}</option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <p aria-live="polite" className="mt-3 text-sm text-fg-muted">
        {selected && fill(labels.showing, { district: selected.name, n: n(list.length) })}
      </p>

      {selected && list.length > 0 && (
        <div className="-mx-5 mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{fill(labels.caption, { district: selected.name })}</caption>
            <thead className="border-y border-line bg-surface-2">
              <tr>
                <th scope="col" className={`${th} pl-5`}>
                  {labels.colItem}
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {labels.colPrice}
                </th>
                <th scope="col" className={`${th} hidden sm:table-cell`}>
                  {labels.colMonth}
                </th>
                <th scope="col" className={`${th} pr-5 text-right`}>
                  {labels.colNational}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map(([item, price, month, markets, national]) => {
                const when = (
                  <>
                    <time dateTime={months[month].value}>{months[month].label}</time> · {fill(labels.markets, { n: n(markets) })}
                  </>
                );
                return (
                  <tr key={item} className="align-top">
                    <th scope="row" className="py-2.5 pl-5 pr-3 text-left font-normal">
                      <span className="block font-medium text-fg">{items[item].name}</span>
                      <span className="block text-xs text-fg-muted sm:hidden">{when}</span>
                    </th>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <span className="block font-semibold tabular-nums text-fg">{formatTaka(locale, price)}</span>
                      <span className="block text-xs text-fg-muted">{items[item].unit}</span>
                      {isFar(price, national) && <span className="mt-1 block whitespace-normal text-xs text-warning">{labels.far}</span>}
                    </td>
                    <td className="hidden px-3 py-2.5 text-xs text-fg-muted sm:table-cell">{when}</td>
                    <td className="whitespace-nowrap py-2.5 pl-3 pr-5 text-right tabular-nums text-fg-muted">
                      {national === null ? <span aria-hidden>—</span> : formatTaka(locale, national)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
