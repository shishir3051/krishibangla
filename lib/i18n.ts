/**
 * i18n.ts — Supported locales and locale-aware paths. Shared by proxy.ts, layouts and client components.
 */

export const locales = ['bn', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Farmers are the main audience, so Bangla is the default (browsers rarely send `bn` in Accept-Language). */
export const defaultLocale: Locale = 'bn';

/** Remembers an explicit language choice for paths without a locale prefix (e.g. `/`). */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function hasLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** Prefixes an app path with a locale: ('bn', '/crops/rice') → '/bn/crops/rice', ('en', '/#map') → '/en#map'. */
export function localePath(locale: Locale, path = '/'): string {
  const hashIndex = path.indexOf('#');
  const pathname = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : path.slice(hashIndex);
  return `/${locale}${pathname === '/' || pathname === '' ? '' : pathname}${hash}`;
}

/** Replaces (or adds) the locale segment of a pathname: ('/bn/crops/rice', 'en') → '/en/crops/rice'. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split('/');
  if (hasLocale(segments[1])) segments.splice(1, 1);
  return localePath(to, segments.join('/') || '/');
}
