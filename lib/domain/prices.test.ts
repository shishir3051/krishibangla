import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { commodityName, unitName } from './commodities';
import { addMonths, aggregatePrices, findCommodity, monthsBetween, parseWfpCsv, type PriceRow } from './prices';

// 99 real rows copied unchanged from wfp_food_prices_bgd.csv (HDX, Oct 2026 release).
const csv = readFileSync(new URL('../../test/fixtures/wfp-sample.csv', import.meta.url), 'utf8');
const rows = parseWfpCsv(csv)!;
const only = (commodity: string, keep: (r: PriceRow) => boolean = () => true) =>
  rows.filter((r) => r.commodity === commodity && keep(r));

describe('months', () => {
  it('counts and shifts calendar months across years', () => {
    expect(monthsBetween('2025-12', '2026-02')).toBe(2);
    expect(addMonths('2026-09', -23)).toBe('2024-10');
    expect(addMonths('2025-11', 2)).toBe('2026-01');
  });
});

describe('parseWfpCsv', () => {
  it('keeps market-level retail food prices only', () => {
    // Drops: 2 Wholesale rows, 4 "… Division" averages, 2 non-food rows (fuel).
    expect(rows).toHaveLength(99 - 2 - 4 - 2);
    expect(rows.every((r) => r.category !== 'non-food')).toBe(true);
    expect(rows.some((r) => r.commodity === 'Wheat' || r.unit === '100 KG')).toBe(false);
    expect(rows[0]).toEqual({
      month: '2025-10',
      admin2: 'Bagerhat',
      marketId: '4020',
      category: 'vegetables and fruits',
      commodity: 'Chili (green)',
      unit: 'KG',
      price: 164.75,
    });
  });

  it('handles quoted fields with commas and doubled quotes', () => {
    expect(rows.some((r) => r.commodity === 'Fish (dry, belt 10-12")' && r.category === 'meat, fish and eggs')).toBe(true);
  });

  it('skips HXL tag rows, CRLF line ends and malformed rows', () => {
    const [header, ...lines] = csv.trim().split('\n');
    const hxl = '#date,#adm1+name,#adm2+name,#loc+market+name,#loc+market+code,#geo+lat,#geo+lon,#item+type,#item+name,#item+code,#item+unit,#item+price+flag,#item+price+type,#currency,#value,#value+usd';
    const broken = '2026-07-15,Dhaka,Dhaka,Dhaka Sadar,4083,23.73,90.38,cereals and tubers,Rice (coarse),60,KG,actual,Retail,BDT,n/a,0.4';
    const parsed = parseWfpCsv([header, hxl, broken, ...lines].join('\r\n'));
    expect(parsed).toEqual(rows);
  });

  it('returns null when required columns are missing', () => {
    expect(parseWfpCsv('date,market,price\n2026-07-15,Dhaka,50')).toBeNull();
    expect(parseWfpCsv('')).toBeNull();
  });
});

describe('aggregatePrices', () => {
  const agg = aggregatePrices(rows)!;

  it('reports the dataset month and a 24-month window', () => {
    expect(agg.latestMonth).toBe('2026-09');
    expect(agg.seriesStart).toBe('2024-10');
  });

  it('uses the median across markets and a same-market month-on-month change', () => {
    const rice = findCommodity(agg, 'Rice (coarse)')!;
    expect(rice.unit).toBe('KG');
    expect(rice.latest).toEqual({ month: '2026-07', price: 48.6, markets: 7, districts: 7 });
    expect(rice.change).toEqual({ pct: 2.97, since: '2026-06', markets: 7 }); // 48.6 / 47.2
    expect(rice.series.map((p) => p.month)).toEqual(['2026-06', '2026-07']);
  });

  it('is not pulled up by single-market entry errors', () => {
    // Aug 2026: two markets report ৳182.5 and ৳189.9 for wheat flour, the other 13 ৳52.5–62.5.
    const flour = findCommodity(agg, 'Wheat flour')!;
    expect(flour.latest).toMatchObject({ month: '2026-08', price: 60, markets: 15 });
    expect(flour.change).toEqual({ pct: 4.35, since: '2026-07', markets: 15 }); // 60 / 57.5
  });

  it('gives no change when the two months share no markets', () => {
    // Sep 2026 palm oil comes from 9 upazila markets that did not report in July.
    const palm = findCommodity(agg, 'Oil (palm)')!;
    expect(palm.latest).toEqual({ month: '2026-09', price: 169, markets: 9, districts: 8 });
    expect(palm.change).toBeNull();
    expect(palm.series.map((p) => p.month)).toEqual(['2026-07', '2026-09']);
  });

  it('does not treat months reported from one area as national', () => {
    // Tomatoes and brown eggs here come from Cox's Bazar / Dhaka only.
    expect(findCommodity(agg, 'Tomatoes (red)')).toBeUndefined();
    expect(findCommodity(agg, 'Eggs (brown)')).toBeUndefined();

    // Nov 2025 and Jan 2026 chilli prices come only from the four Cox's Bazar camp-area markets.
    const chili = findCommodity(aggregatePrices(only('Chili (green)'))!, 'Chili (green)')!;
    expect(chili.series.map((p) => p.month)).toEqual(['2025-10', '2025-12', '2026-02']);
    expect(chili.latest).toMatchObject({ month: '2026-02', price: 122.8, markets: 6 });
    expect(chili.change).toEqual({ pct: 106.15, since: '2025-12', markets: 6 });
  });

  it('only reports a change against a month at most two months earlier', () => {
    const chili = aggregatePrices(only('Chili (green)', (r) => r.month !== '2025-12'))!.commodities[0];
    expect(chili.latest.month).toBe('2026-02');
    expect(chili.change).toBeNull(); // previous national month is Oct 2025
  });

  it('drops commodities whose latest national figure is more than six months old', () => {
    // Chilli's last national month in the sample is Feb 2026; the dataset runs to Sep 2026.
    expect(findCommodity(agg, 'Chili (green)')).toBeUndefined();
  });

  it('gives each district its latest median with the national figure for that month', () => {
    expect(agg.districts.dhaka).toEqual([
      { commodity: 'Wheat flour', unit: 'KG', month: '2026-08', price: 60, markets: 3, national: 60 },
      { commodity: 'Eggs (brown)', unit: '1 piece', month: '2026-07', price: 11.1, markets: 1, national: null },
    ]);
    expect(agg.districts.joypurhat).toEqual([
      { commodity: 'Wheat flour', unit: 'KG', month: '2026-08', price: 189.9, markets: 1, national: 60 },
    ]);
    expect(agg.districts['coxs-bazar'].map((p) => p.commodity)).toEqual(['Oil (palm)', 'Chili (green)', 'Tomatoes (red)']);
    expect(Object.keys(agg.districts)).not.toContain('barisal-division');
  });

  it('ignores rows dated after "now"', () => {
    expect(aggregatePrices(rows, { now: '2026-08' })!.latestMonth).toBe('2026-08');
    expect(aggregatePrices([], {})).toBeNull();
  });
});

describe('commodity names', () => {
  it('names every commodity in the sample in Bangla, and falls back to the WFP name', () => {
    for (const r of rows) expect(commodityName(r.commodity, 'bn'), r.commodity).not.toBe(r.commodity);
    expect(commodityName('Rice (coarse)', 'bn')).toBe('মোটা চাল');
    expect(commodityName('Something new', 'bn')).toBe('Something new');
  });

  it('names units in Bangla', () => {
    expect(unitName('KG', 'bn')).toBe('কেজি');
    expect(unitName('L', 'bn')).toBe('লিটার');
    expect(unitName('1 piece', 'bn')).toBe('পিস');
    expect(unitName('KG', 'en')).toBe('kg');
  });
});

// The full HDX file (~4.5 MB). Run with WFP_CSV=/path/to/wfp_food_prices_bgd.csv to check it.
const fullCsv = process.env.WFP_CSV;
describe.skipIf(!fullCsv || !existsSync(fullCsv))('full WFP file', () => {
  it('aggregates to a compact, fully named result', () => {
    const all = parseWfpCsv(readFileSync(fullCsv!, 'utf8'))!;
    const agg = aggregatePrices(all, { now: '2026-11' })!;
    expect(JSON.stringify(agg).length).toBeLessThan(500_000);
    expect(agg.commodities.length).toBeGreaterThanOrEqual(12);
    expect(Object.keys(agg.districts).length).toBeGreaterThanOrEqual(60);
    for (const c of agg.commodities) expect(commodityName(c.commodity, 'bn'), c.commodity).not.toBe(c.commodity);
    for (const list of Object.values(agg.districts))
      for (const p of list) expect(commodityName(p.commodity, 'bn'), p.commodity).not.toBe(p.commodity);
  });
});
