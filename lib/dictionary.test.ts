import { describe, expect, it } from 'vitest';
import bn from '@/messages/bn.json';
import en from '@/messages/en.json';
import { fill } from './dictionary';
import { formatNumber, formatTime, formatWeekday } from './format';

// Every key path, e.g. "desk.irrigationLevels.high"
const keys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

describe('dictionaries', () => {
  it('have the same keys in Bangla and English', () => {
    expect(keys(bn).sort()).toEqual(keys(en).sort());
  });

  it('use the same placeholders in both languages', () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    const get = (obj: object, path: string) => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj) as string;
    for (const key of keys(en)) expect(placeholders(get(bn, key)), key).toEqual(placeholders(get(en, key)));
  });

  it('fill replaces known placeholders only', () => {
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
