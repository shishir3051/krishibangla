import paths from '@/data/map/district-paths.json';
import { getDistrict } from '@/lib/domain/districts';
import { localePath, type Locale } from '@/lib/i18n';

type DistrictMapProps = {
  locale: Locale;
  title: string;
  /** District to highlight (e.g. on its own page). */
  highlight?: string;
  className?: string;
};

/**
 * Server-rendered SVG map; each district is a plain link to its desk, so it works without JavaScript.
 * Paths come from data/map/district-paths.json (scripts/build-map.mjs).
 */
export function DistrictMap({ locale, title, highlight, className = '' }: DistrictMapProps) {
  return (
    <svg viewBox={paths.viewBox} role="img" aria-label={title} className={className}>
      <title>{title}</title>
      {paths.districts.map(({ slug, d }) => {
        const name = getDistrict(slug)?.name[locale] ?? slug;
        const active = slug === highlight;
        return (
          <a key={slug} href={localePath(locale, `/districts/${slug}`)} aria-label={name} data-district-name={name} className="group outline-none">
            <path
              d={d}
              className={`stroke-surface transition-colors ${active ? 'fill-brand' : 'fill-brand/25 group-hover:fill-brand group-focus-visible:fill-brand'}`}
              strokeWidth={0.8}
            >
              <title>{name}</title>
            </path>
          </a>
        );
      })}
    </svg>
  );
}
