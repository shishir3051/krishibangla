import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fill } from './dictionary';
import { formatNumber, formatTime, formatWeekday } from './format';

const dir = new URL('../messages/', import.meta.url);
const read = (file: string) => JSON.parse(readFileSync(new URL(file, dir), 'utf8'));
// en.json ↔ bn.json, home.en.json ↔ home.bn.json, …
const pairs = readdirSync(dir)
  .filter((f) => f.endsWith('en.json'))
  .map((en) => [en, en.replace(/en\.json$/, 'bn.json')] as const);

// Every key path, e.g. "desk.irrigationLevels.high"
const keys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
const get = (obj: object, path: string) => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj);
const placeholders = (s: unknown) => (typeof s === 'string' ? (s.match(/\{\w+\}/g) ?? []).sort() : []);

describe.each(pairs)('dictionaries %s ↔ %s', (enFile, bnFile) => {
  const en = read(enFile);
  const bn = read(bnFile);

  it('have the same keys in Bangla and English', () => {
    expect(keys(bn).sort()).toEqual(keys(en).sort());
  });

  it('use the same placeholders in both languages', () => {
    for (const key of keys(en)) expect(placeholders(get(bn, key)), key).toEqual(placeholders(get(en, key)));
  });
});

describe('fill', () => {
  it('replaces known placeholders only', () => {
    expect(fill('{n} districts in {name}', { n: 64 })).toBe('64 districts in {name}');
  });
});

describe('format', () => {
  it('uses Bengali digits for Bangla', () => {
    expect(formatNumber('bn', 31.5, 1)).toBe('৩১.৫');
    expect(formatNumber('en', 31.5, 1)).toBe('31.5');
  });

  it('formats times and weekdays in Dhaka time regardless of server time zone', () => {
    expect(formatTime('en', '2026-11-01T10:05:00Z')).toBe('16:05');
    expect(formatWeekday('en', '2026-11-02')).toBe('Mon');
  });
});
