import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LiveWeather, LiveWeatherSkeleton } from '@/components/district/LiveWeather';
import { PrintButton } from '@/components/district/PrintButton';
import { ProfileCard } from '@/components/district/ProfileCard';
import { DistrictMap } from '@/components/map/DistrictMap';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { Card } from '@/components/ui/Card';
import { fill, getDictionary } from '@/lib/dictionary';
import { DISTRICTS, getDistrict } from '@/lib/domain/districts';
import { DIVISIONS } from '@/lib/domain/vocab';
import { hasLocale, localePath } from '@/lib/i18n';

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/districts/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const district = getDistrict(slug);
  if (!hasLocale(locale) || !district) return {};
  const t = await getDictionary(locale);
  return { title: `${district.name[locale]} — ${t.districts.title} · ${t.nav.brand}`, description: t.districts.subtitle };
}

export default async function DistrictPage({ params }: PageProps<'/[locale]/districts/[slug]'>) {
  const { locale, slug } = await params;
  const district = getDistrict(slug);
  if (!hasLocale(locale) || !district) notFound();
  const t = await getDictionary(locale);
  const otherName = district.name[locale === 'bn' ? 'en' : 'bn'];

  return (
    <div className="min-h-screen bg-canvas font-ui text-fg">
      <SiteHeader locale={locale} nav={t.nav} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link href={localePath(locale, '/districts')} className="no-print text-sm text-fg-muted hover:text-fg">
          ← {t.desk.allDistricts}
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-fg-muted">{fill(t.districts.division, { name: DIVISIONS[district.division][locale] })}</p>
            <h1 className="text-4xl font-semibold">{district.name[locale]}</h1>
            <p className="text-fg-muted">{otherName}</p>
          </div>
          <PrintButton label={t.desk.print} />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="grid content-start gap-4 md:grid-cols-2 lg:col-span-2">
            <Suspense fallback={<LiveWeatherSkeleton />}>
              <LiveWeather locale={locale} slug={slug} t={t} />
            </Suspense>
          </div>
          <div className="grid content-start gap-4">
            <ProfileCard district={district} locale={locale} t={t} />
            <Card title={t.desk.location}>
              <DistrictMap locale={locale} title={t.districts.mapTitle} highlight={slug} className="mx-auto h-64 w-auto" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
