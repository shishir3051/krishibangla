import { fill, type Dictionary } from '@/lib/dictionary';
import { commodityName } from '@/lib/domain/commodities';
import { getDistrict, type District } from '@/lib/domain/districts';
import type { PriceAggregate } from '@/lib/domain/prices';
import { DIVISIONS, type DivisionId } from '@/lib/domain/vocab';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { DistrictPicker, type DistrictRow } from './DistrictPicker';
import { formatMonth } from './format';
import { perUnit } from './parts';

/**
 * Server half of the district filter: turns the aggregate into compact, index-based props
 * (~25 kB for 63 districts) so the client component only switches between precomputed rows.
 */
export function DistrictPrices({ locale, t, data }: { locale: Locale; t: Dictionary; data: PriceAggregate }) {
  const m = t.markets;
  const items: { name: string; unit: string }[] = [];
  const itemIndex = new Map<string, number>();
  const months: { value: string; label: string }[] = [];
  const monthIndex = new Map<string, number>();
  const indexOf = <T,>(map: Map<string, number>, list: T[], key: string, make: () => T) => {
    if (!map.has(key)) map.set(key, list.push(make()) - 1);
    return map.get(key)!;
  };

  const rows: Record<string, DistrictRow[]> = {};
  const districts: District[] = [];
  for (const [slug, prices] of Object.entries(data.districts)) {
    const district = getDistrict(slug);
    if (!district || prices.length === 0) continue;
    districts.push(district);
    rows[slug] = prices.map((p) => [
      indexOf(itemIndex, items, `${p.commodity}|${p.unit}`, () => ({ name: commodityName(p.commodity, locale), unit: perUnit(locale, t, p.unit) })),
      p.price,
      indexOf(monthIndex, months, p.month, () => ({ value: p.month, label: formatMonth(locale, p.month) })),
      p.markets,
      p.national,
    ]);
  }

  const collator = new Intl.Collator(locale === 'bn' ? 'bn' : 'en');
  const groups = (Object.keys(DIVISIONS) as DivisionId[])
    .map((division) => ({
      label: fill(t.districts.division, { name: DIVISIONS[division][locale] }),
      districts: districts
        .filter((d) => d.division === division)
        .sort((a, b) => collator.compare(a.name[locale], b.name[locale]))
        .map((d) => ({ slug: d.slug, name: d.name[locale] })),
    }))
    .filter((g) => g.districts.length > 0);

  return (
    <DistrictPicker
      locale={locale}
      labels={{
        title: m.districtTitle,
        hint: fill(m.districtHint, { n: formatNumber(locale, districts.length) }),
        label: m.districtLabel,
        placeholder: m.districtPlaceholder,
        showing: m.districtShowing,
        caption: m.districtCaption,
        colItem: m.colItem,
        colPrice: m.colPrice,
        colMonth: m.colMonth,
        colNational: m.colNational,
        markets: m.markets,
        far: m.farFromNational,
      }}
      items={items}
      months={months}
      groups={groups}
      rows={rows}
    />
  );
}
