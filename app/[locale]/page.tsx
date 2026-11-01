import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AskButton } from '@/components/chat/AskButton';
import { DistrictMap } from '@/components/map/DistrictMap';
import { MarketSnapshot } from '@/components/markets/MarketSnapshot';
import { AlertsCard, AlertsCardSkeleton } from '@/components/national/AlertsCard';
import { KpiTiles } from '@/components/national/KpiTiles';
import { PageShell } from '@/components/shell/PageShell';
import { Card } from '@/components/ui/Card';
import { getDictionary } from '@/lib/dictionary';
import { CROP_PAGES } from '@/lib/domain/crops';
import { hasLocale, localePath } from '@/lib/i18n';
import { pageMetadata } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/', { title: t.home.metaTitle, description: t.home.metaDescription });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const h = t.home;

  const tools = [
    { href: localePath(locale, '/scan'), icon: '🔍', title: h.scanTitle, body: h.scanBody },
    { href: localePath(locale, '/climate'), icon: '🌦️', title: h.climateTitle, body: h.climateBody },
  ];

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <p className="text-sm font-medium text-brand">{h.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">{h.title}</h1>
            <p className="mt-4 max-w-xl text-lg text-fg-muted">{h.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={localePath(locale, '/districts')} className="inline-flex h-12 items-center rounded-full bg-brand px-6 font-medium text-on-brand hover:opacity-90">
                📍 {h.findDistrict}
              </Link>
              <AskButton className="inline-flex h-12 items-center rounded-full border border-line bg-surface px-6 font-medium text-fg hover:bg-surface-2">
                💬 {t.nav.ask}
              </AskButton>
              <Link href={localePath(locale, '/scan')} className="inline-flex h-12 items-center rounded-full border border-line bg-surface px-6 font-medium text-fg hover:bg-surface-2">
                🔍 {h.scanLeaf}
              </Link>
            </div>
          </div>
          <Card className="hidden lg:block">
            <DistrictMap locale={locale} title={t.districts.mapTitle} className="mx-auto h-80 w-auto" />
          </Card>
        </section>

        {/* National indicators (World Bank) — renders its own heading */}
        <KpiTiles locale={locale} t={t} />

        {/* Markets + live alerts */}
        <section className="grid items-start gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MarketSnapshot locale={locale} t={t} />
          </div>
          <Suspense fallback={<AlertsCardSkeleton />}>
            <AlertsCard locale={locale} t={t} />
          </Suspense>
        </section>

        {/* Districts */}
        <section className="reveal grid items-center gap-6 rounded-3xl border border-line bg-surface p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
          <div>
            <h2 className="text-2xl font-semibold">{h.districtsTitle}</h2>
            <p className="mt-2 max-w-xl text-fg-muted">{h.districtsBody}</p>
            <Link href={localePath(locale, '/districts')} className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-5 font-medium text-on-brand hover:opacity-90">
              {h.allDistricts} →
            </Link>
          </div>
          <DistrictMap locale={locale} title={t.districts.mapTitle} className="mx-auto h-64 w-auto lg:hidden" />
        </section>

        {/* Crops */}
        <section aria-labelledby="crops" className="reveal">
          <h2 id="crops" className="text-xl font-semibold">
            {h.cropsTitle}
          </h2>
          <p className="mt-1 text-fg-muted">{h.cropsBody}</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {CROP_PAGES.map((crop) => (
              <li key={crop.id}>
                <Link
                  href={localePath(locale, `/crops/${crop.id}`)}
                  className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
                >
                  <span aria-hidden className="text-3xl">
                    {crop.icon}
                  </span>
                  <span className="mt-2 font-semibold text-fg">{crop.name[locale]}</span>
                  <span className="mt-1 text-sm text-fg-muted">{crop.summary[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section aria-labelledby="tools" className="reveal">
          <h2 id="tools" className="mb-4 text-xl font-semibold">
            {h.toolsTitle}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand">
                <span aria-hidden className="text-2xl">
                  {tool.icon}
                </span>
                <h3 className="mt-2 font-semibold text-fg">{tool.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{tool.body}</p>
              </Link>
            ))}
            <AskButton className="rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:border-brand">
              <span aria-hidden className="text-2xl">
                💬
              </span>
              <span className="mt-2 block font-semibold text-fg">{h.askTitle}</span>
              <span className="mt-1 block text-sm text-fg-muted">{h.askBody}</span>
            </AskButton>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
