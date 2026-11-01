import type { MetadataRoute } from 'next';
import { CROP_PAGES } from '@/lib/domain/crops';
import { DISTRICTS } from '@/lib/domain/districts';
import { locales, localePath } from '@/lib/i18n';
import { languageAlternates, siteUrl } from '@/lib/site';

const PATHS = [
  '/',
  '/districts',
  ...DISTRICTS.map((d) => `/districts/${d.slug}`),
  '/markets',
  '/climate',
  ...CROP_PAGES.map((c) => `/crops/${c.id}`),
  '/scan',
  '/about/data',
];

// Every page in both languages, each listing its other-language version.
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  const absolute = (path: string) => new URL(path, origin).toString();

  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(localePath(locale, path)),
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, absolute(href)])),
      },
    }))
  );
}
