import { describe, expect, it } from 'vitest';
import { hasLocale, localePath, switchLocalePath } from './i18n';

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
