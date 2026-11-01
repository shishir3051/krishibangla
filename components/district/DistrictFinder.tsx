'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DISTRICTS } from '@/lib/domain/districts';
import { nearestDistrict } from '@/lib/domain/geo';
import { DIVISIONS, type DivisionId } from '@/lib/domain/vocab';
import { localePath, type Locale } from '@/lib/i18n';

type Labels = {
  search: string;
  searchPlaceholder: string;
  noResults: string;
  useLocation: string;
  locating: string;
  locationDenied: string;
  locationOutside: string;
  locationUnavailable: string;
  division: string; // "{name} Division"
};

/** Search + "use my location" + list grouped by division (the keyboard-friendly alternative to the map). */
export function DistrictFinder({ locale, labels }: { locale: Locale; labels: Labels }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const matches = DISTRICTS.filter(
    (d) => !q || d.name.en.toLowerCase().includes(q) || d.name.bn.includes(query.trim()) || d.aliases.some((a) => a.toLowerCase().includes(q))
  );
  const groups = (Object.keys(DIVISIONS) as DivisionId[])
    .map((division) => ({ division, districts: matches.filter((d) => d.division === division) }))
    .filter((g) => g.districts.length > 0);

  const locate = () => {
    if (!navigator.geolocation) return setStatus(labels.locationUnavailable);
    setStatus(labels.locating);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const district = nearestDistrict(coords.latitude, coords.longitude);
        if (!district) return setStatus(labels.locationOutside);
        router.push(localePath(locale, `/districts/${district.slug}`));
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? labels.locationDenied : labels.locationUnavailable),
      { timeout: 10_000, maximumAge: 600_000 }
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{labels.search}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none"
          />
        </label>
        <button type="button" onClick={locate} className="h-11 rounded-xl bg-brand px-4 font-medium text-on-brand hover:opacity-90">
          📍 {labels.useLocation}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-fg-muted">
        {status}
      </p>

      {groups.length === 0 ? (
        <p className="mt-4 text-fg-muted">{labels.noResults}</p>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {groups.map(({ division, districts }) => (
            <section key={division}>
              <h2 className="mb-2 text-sm font-semibold text-fg-muted">{labels.division.replace('{name}', DIVISIONS[division][locale])}</h2>
              <ul className="flex flex-wrap gap-2">
                {districts.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={localePath(locale, `/districts/${d.slug}`)}
                      className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-fg hover:border-brand hover:text-brand"
                    >
                      {d.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
