import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DistrictFinder } from '@/components/district/DistrictFinder';
import { DistrictMap } from '@/components/map/DistrictMap';
import { MapExplorer } from '@/components/map/MapExplorer';
import { PageShell } from '@/components/shell/PageShell';
import { Card } from '@/components/ui/Card';
import { getDictionary } from '@/lib/dictionary';
import { hasLocale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[locale]/districts'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/districts', { title: `${t.districts.title} — ${t.nav.brand}`, description: t.districts.subtitle });
}

export default async function DistrictsPage({ params }: PageProps<'/[locale]/districts'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{t.districts.title}</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">{t.districts.subtitle}</p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Card>
            <MapExplorer idle={t.districts.mapIdle} open={t.districts.mapOpen}>
              <DistrictMap locale={locale} title={t.districts.mapTitle} className="mx-auto h-auto w-full max-w-md" />
            </MapExplorer>
          </Card>
          <DistrictFinder
            locale={locale}
            labels={{
              search: t.districts.search,
              searchPlaceholder: t.districts.searchPlaceholder,
              noResults: t.districts.noResults,
              useLocation: t.districts.useLocation,
              locating: t.districts.locating,
              locationDenied: t.districts.locationDenied,
              locationOutside: t.districts.locationOutside,
              locationUnavailable: t.districts.locationUnavailable,
              division: t.districts.division,
            }}
          />
        </div>
      </main>
    </PageShell>
  );
}
