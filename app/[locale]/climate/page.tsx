import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AlertHistory, AlertHistorySkeleton } from '@/components/climate/AlertHistory';
import { ClimateAnomalies } from '@/components/climate/ClimateAnomalies';
import { PageShell } from '@/components/shell/PageShell';
import { getDictionary } from '@/lib/dictionary';
import { hasLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/climate'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: `${t.climate.metaTitle} — ${t.nav.brand}`, description: t.climate.subtitle };
}

export default async function ClimatePage({ params }: PageProps<'/[locale]/climate'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{t.climate.title}</h1>
        <p className="mt-2 max-w-3xl text-fg-muted">{t.climate.subtitle}</p>

        {/* NASA POWER monthly data — cached for weeks, part of the prerendered page. */}
        <div className="mt-8">
          <ClimateAnomalies locale={locale} t={t} />
        </div>

        {/* GDACS alerts — read per request (cached 15 minutes). */}
        <section id="alerts" aria-labelledby="alerts-title" className="mt-10 scroll-mt-20">
          <Suspense fallback={<AlertHistorySkeleton />}>
            <AlertHistory locale={locale} t={t} />
          </Suspense>
        </section>
      </main>
    </PageShell>
  );
}
