import { describe, expect, it } from 'vitest';
import { hasLocale, isActivePath, localePath, switchLocalePath } from './i18n';

describe('hasLocale', () => {
  it('accepts only supported locales', () => {
    expect(hasLocale('bn')).toBe(true);
    expect(hasLocale('en')).toBe(true);
    expect(hasLocale('fr')).toBe(false);
    expect(hasLocale(undefined)).toBe(false);
  });
});

describe('localePath', () => {
  it.each([
    ['bn', undefined, '/bn'],
    ['en', '/', '/en'],
    ['bn', '/crops/rice', '/bn/crops/rice'],
    ['en', '/#map', '/en#map'],
    ['bn', '/crops/rice#market', '/bn/crops/rice#market'],
  ] as const)('(%s, %s) → %s', (locale, path, expected) => {
    expect(localePath(locale, path)).toBe(expected);
  });
});

describe('switchLocalePath', () => {
  it.each([
    ['/bn', 'en', '/en'],
    ['/bn/crops/rice', 'en', '/en/crops/rice'],
    ['/en/crops/potato', 'bn', '/bn/crops/potato'],
    ['/', 'en', '/en'],
    ['/crops/rice', 'bn', '/bn/crops/rice'],
  ] as const)('%s → %s gives %s', (pathname, to, expected) => {
    expect(switchLocalePath(pathname, to)).toBe(expected);
  });
});

describe('isActivePath', () => {
  it('matches home only on the home page itself', () => {
    expect(isActivePath('/bn', '/bn')).toBe(true);
    expect(isActivePath('/bn/markets', '/bn')).toBe(false);
  });

  it('matches a section and its sub-pages', () => {
    expect(isActivePath('/bn/districts', '/bn/districts')).toBe(true);
    expect(isActivePath('/bn/districts/rajshahi', '/bn/districts')).toBe(true);
    expect(isActivePath('/en/markets', '/en/markets')).toBe(true);
  });

  it('does not match look-alike paths, other sections or the other language', () => {
    expect(isActivePath('/bn/districtsx', '/bn/districts')).toBe(false);
    expect(isActivePath('/bn/climate', '/bn/markets')).toBe(false);
    expect(isActivePath('/en/markets', '/bn/markets')).toBe(false);
  });
});
