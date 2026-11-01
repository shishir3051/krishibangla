import { describe, expect, it } from 'vitest';
import chatBn from '@/messages/chat.bn.json';
import chatEn from '@/messages/chat.en.json';
import { CROP_PAGES, CROPS_CONTENT, getCrop, type MonthRange } from './crops';

// Every { en, bn } pair anywhere in the content, with its path for readable failures.
function bilingualFields(value: unknown, path: string): [string, Record<string, unknown>][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => bilingualFields(v, `${path}[${i}]`));
  if (!value || typeof value !== 'object') return [];
  const obj = value as Record<string, unknown>;
  if ('en' in obj || 'bn' in obj) return [[path, obj]];
  return Object.entries(obj).flatMap(([k, v]) => bilingualFields(v, `${path}.${k}`));
}

const isMonth = (m: number) => Number.isInteger(m) && m >= 1 && m <= 12;

describe('crop content', () => {
  it('keeps the six home-page crops, in order, with unique ids', () => {
    expect(CROP_PAGES.map((c) => c.id)).toEqual(['rice', 'fisheries', 'potato', 'tomato', 'jute', 'mango']);
    expect(getCrop('rice')?.name.en).toBe('Rice');
    expect(getCrop('wheat')).toBeUndefined();
  });

  it('has every text field in both English and Bangla', () => {
    for (const crop of CROPS_CONTENT) {
      const fields = bilingualFields(crop, crop.id);
      expect(fields.length).toBeGreaterThan(10);
      for (const [path, field] of fields) {
        expect(Object.keys(field).sort(), path).toEqual(['bn', 'en']);
        expect(typeof field.en === 'string' && field.en.trim(), `${path}.en`).toBeTruthy();
        expect(typeof field.bn === 'string' && field.bn.trim(), `${path}.bn`).toBeTruthy();
        // Bangla text is actually Bangla, and English text has no Bangla script in it.
        expect(field.bn, `${path}.bn`).toMatch(/[ঀ-৿]/);
        expect(field.en, `${path}.en`).not.toMatch(/[ঀ-৿]/);
      }
    }
  });

  it('gives every crop a description and growing stages', () => {
    for (const crop of CROPS_CONTENT) {
      expect(crop.description.en.length, crop.id).toBeGreaterThan(40);
      expect(crop.lifecycle.length, crop.id).toBeGreaterThanOrEqual(3);
      expect(['agriculture', 'fisheries']).toContain(crop.adviceOffice);
    }
  });

  it('uses valid calendar months', () => {
    const ranges: MonthRange[] = CROPS_CONTENT.flatMap((c) => [
      ...c.lifecycle.flatMap((s) => (s.range ? [s.range] : [])),
      ...(c.seasons ?? []).map((s) => s.range),
    ]);
    expect(ranges.length).toBeGreaterThan(0);
    for (const range of ranges) {
      expect(range).toHaveLength(2);
      expect(range.every(isMonth), JSON.stringify(range)).toBe(true);
    }
  });

  it('has the rice guide: 12 steps and the Aus, Aman and Boro seasons', () => {
    const rice = getCrop('rice');
    expect(rice?.steps).toHaveLength(12);
    expect(rice?.seasons?.map((s) => s.id)).toEqual(['aus', 'aman', 'boro']);
  });

  it('has a crop-specific chat greeting and quick prompts for every crop, in both languages', () => {
    for (const chat of [chatEn, chatBn]) {
      expect(Object.keys(chat.crops).sort()).toEqual(CROP_PAGES.map((c) => c.id).sort());
      for (const { greeting, prompts } of Object.values(chat.crops)) {
        expect(greeting.trim()).toBeTruthy();
        expect(prompts.length).toBeGreaterThanOrEqual(3);
        for (const p of prompts) expect(p.label.trim() && p.prompt.trim()).toBeTruthy();
      }
    }
    for (const id of Object.keys(chatEn.crops) as (keyof typeof chatEn.crops)[]) {
      expect(chatBn.crops[id].prompts.length, id).toBe(chatEn.crops[id].prompts.length);
    }
  });

  it('carries no unsourced statistics (production figures, rankings, shares)', () => {
    const text = JSON.stringify(CROPS_CONTENT);
    expect(text).not.toMatch(/\bMT\b|\bYoY\b|\$\s?\d|\d\s?(?:M|B)\b|#\d|\b\d+(?:st|nd|rd|th)\b|GDP|জিডিপি/);
    // Percentages only as agronomic thresholds (grain ripeness, grain moisture).
    for (const match of text.matchAll(/[\d০-৯–-]+\s?%/g)) expect(['80–85%', '12%', '৮০–৮৫%', '১২%']).toContain(match[0]);
  });
});
