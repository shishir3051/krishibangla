import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readFirstSheet } from '@/lib/xlsx';
import { findTcbItem, latestSheetUrl, parseTcbSheet, rangeChange } from './tcb';

const rows = readFirstSheet(readFileSync(new URL('../../test/fixtures/tcb-2026-11-01.xlsx', import.meta.url)));
const page = readFileSync(new URL('../../test/fixtures/tcb-daily-rmps.html', import.meta.url), 'utf8');

describe('parseTcbSheet (TCB sheet for 1 Nov 2026)', () => {
  const data = parseTcbSheet(rows)!;

  it('reads the date and the comparison dates from the sheet', () => {
    expect(data.date).toBe('2026-11-01');
    expect(data.dates).toEqual({ today: '2026-11-01', week: '2026-10-25', month: '2026-10-01', year: '2025-11-01' });
    expect(data.markets).toContain('মিরপুর-৬');
  });

  it('reads lowest–highest prices for each period', () => {
    expect(findTcbItem(data, 'rice-coarse')).toMatchObject({
      name: { en: 'Coarse rice (Swarna/China IRRI)' },
      unit: { en: 'per kg', bn: 'প্রতি কেজি' },
      group: 'rice',
      prices: { today: { min: 50, max: 55 }, week: { min: 50, max: 55 }, month: { min: 50, max: 55 }, year: { min: 55, max: 60 } },
    });
    expect(findTcbItem(data, 'eggs')).toMatchObject({ unit: { en: 'per 4 (hali)' }, prices: { today: { min: 45, max: 50 } } });
  });

  it('treats 0 as not on sale (hilsa during the fishing ban)', () => {
    expect(findTcbItem(data, 'hilsa')!.prices).toMatchObject({ today: null, month: { min: 800, max: 1800 } });
  });

  it('keeps each pack size of the same item, with readable units', () => {
    const bottled = data.items.filter((item) => item.id === 'soybean-bottle');
    expect(bottled.map((item) => item.unit)).toEqual([
      { en: '5 litres', bn: '৫ লিটার' },
      { en: '2 litres', bn: '২ লিটার' },
      { en: '1 litre', bn: '১ লিটার' },
    ]);
    expect(new Set(data.items.map((item) => item.key)).size).toBe(data.items.length);
  });

  it('knows every food item on the sheet and leaves out paper, steel rods and branded milk powder', () => {
    expect(data.items.filter((item) => item.id === null)).toEqual([]);
    const names = data.items.map((item) => item.name.bn).join(' ');
    expect(names).not.toMatch(/কাগজ|রড|ডানো|মার্কস/);
    expect(data.items.length).toBeGreaterThan(50);
  });

  it('orders items by group', () => {
    const groups = data.items.map((item) => item.group);
    expect(groups.slice(0, 5)).toEqual(['rice', 'rice', 'rice', 'rice', 'rice']);
    expect(groups.at(-1)).toBe('other');
  });

  it('rejects something that is not a TCB sheet', () => {
    expect(parseTcbSheet([])).toBeNull();
    expect(parseTcbSheet(rows.slice(0, 12))).toBeNull(); // too few items to be a full sheet
  });
});

describe('rangeChange', () => {
  it("compares midpoints, matching TCB's own monthly change", () => {
    // Fine rice: 70–90 today vs 72–85 a month ago; TCB prints 1.91%.
    expect(rangeChange({ min: 70, max: 90 }, { min: 72, max: 85 })).toBeCloseTo(1.91, 2);
    expect(rangeChange({ min: 50, max: 55 }, null)).toBeNull();
  });
});

describe('latestSheetUrl', () => {
  it('picks the newest sheet on the daily price page', () => {
    expect(latestSheetUrl(page)).toBe(
      'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-tcb/2026/10/cba80358-9e31-431b-9804-180ffe85e040.xlsx'
    );
  });

  it('ignores links to other hosts', () => {
    expect(latestSheetUrl('<a href="https://evil.example.com/prices.xlsx">x</a>')).toBeNull();
    expect(latestSheetUrl('<p>no links</p>')).toBeNull();
  });
});
