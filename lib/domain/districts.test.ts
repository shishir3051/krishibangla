import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import paths from '@/data/map/district-paths.json';
import { DISTRICTS, findDistrictByName, getDistrict } from './districts';
import { nearestDistrict } from './geo';
import { CROPS, DIVISIONS, HAZARDS } from './vocab';

const geo = JSON.parse(readFileSync(new URL('../../data/map/source/geoboundaries-bgd-adm2.geojson', import.meta.url), 'utf8'));

describe('district registry', () => {
  it('has all 64 districts with unique slugs', () => {
    expect(DISTRICTS).toHaveLength(64);
    expect(new Set(DISTRICTS.map((d) => d.slug)).size).toBe(64);
  });

  it('places every district in one of the 8 divisions, inside Bangladesh', () => {
    for (const d of DISTRICTS) {
      expect(DIVISIONS).toHaveProperty(d.division);
      expect(d.lat).toBeGreaterThan(20.5);
      expect(d.lat).toBeLessThan(26.7);
      expect(d.lon).toBeGreaterThan(88);
      expect(d.lon).toBeLessThan(92.7);
    }
  });

  it('resolves every GeoJSON district shape to a registry district', () => {
    const unresolved = geo.features.map((f: { properties: { shapeName: string } }) => f.properties.shapeName).filter((n: string) => !findDistrictByName(n));
    expect(unresolved).toEqual([]);
  });

  it('resolves old spellings case-insensitively', () => {
    expect(findDistrictByName('Chittagong')?.slug).toBe('chattogram');
    expect(findDistrictByName('bogra')?.slug).toBe('bogura');
    expect(findDistrictByName("Cox's Bazar")?.slug).toBe('coxs-bazar');
    expect(findDistrictByName('Nishardi')).toBeUndefined();
  });

  it('only uses known crop and hazard ids in profiles', () => {
    for (const d of DISTRICTS) {
      for (const crop of d.profile?.crops ?? []) expect(CROPS).toHaveProperty(crop);
      for (const hazard of d.profile?.hazards ?? []) expect(HAZARDS).toHaveProperty(hazard);
    }
  });

  it('has a map path for every district', () => {
    expect(paths.districts.map((p) => p.slug).sort()).toEqual(DISTRICTS.map((d) => d.slug).sort());
    for (const p of paths.districts) expect(p.d).toMatch(/^M[\d.]+,[\d.]+/);
  });

  it('draws each district as a small shape, not an inverted (whole-map) polygon', () => {
    const [, , width, height] = paths.viewBox.split(' ').map(Number);
    for (const p of paths.districts) {
      const n = p.d.match(/-?[\d.]+/g)!.map(Number);
      const xs = n.filter((_, i) => i % 2 === 0);
      const ys = n.filter((_, i) => i % 2 === 1);
      const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
      expect(area, p.slug).toBeLessThan(width * height * 0.1);
    }
  });
});

describe('nearestDistrict', () => {
  it('finds the district for a point in its town', () => {
    expect(nearestDistrict(24.37, 88.6)?.slug).toBe('rajshahi');
    expect(nearestDistrict(22.36, 91.78)?.slug).toBe('chattogram');
    expect(getDistrict('dhaka')).toBe(nearestDistrict(23.78, 90.4));
  });

  it('returns null outside Bangladesh', () => {
    expect(nearestDistrict(28.6, 77.2)).toBeNull(); // New Delhi
  });
});
