import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DhakaTodayPrices, DhakaTodayPricesSkeleton } from '@/components/markets/DhakaTodayPrices';
import { DistrictPrices } from '@/components/markets/DistrictPrices';
import { formatMonth } from '@/components/markets/format';
import { NationalPriceTable } from '@/components/markets/NationalPriceTable';
import { SourceOnly } from '@/components/markets/parts';
import { PageShell } from '@/components/shell/PageShell';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { fill, getDictionary } from '@/lib/dictionary';
import { MAX_GAP_MONTHS, MIN_DISTRICTS } from '@/lib/domain/prices';
import { formatNumber } from '@/lib/format';
import { hasLocale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/site';
import { getWfpPrices } from '@/lib/sources/wfp';

export async function generateMetadata({ params }: PageProps<'/[locale]/markets'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/markets', { title: `${t.markets.title} — ${t.nav.brand}`, description: t.markets.subtitle });
}

// TCB's daily Dhaka prices stream in per request (refreshed hourly); the monthly WFP data is cached for
// days (lib/sources/wfp.ts), so the rest of the page is part of the static shell.
export default async function MarketsPage({ params }: PageProps<'/[locale]/markets'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const m = t.markets;
  const result = await getWfpPrices();
  const n = (v: number) => formatNumber(locale, v);

  const note = (
    <Card title={m.noteTitle} footer={<SourceOnly t={t} meta={result.meta} />}>
      <div className="space-y-3 text-sm text-fg">
        <p>{m.note1}</p>
        <p>{fill(m.note2, { n: n(MIN_DISTRICTS) })}</p>
        <p>{fill(m.note3, { gap: n(MAX_GAP_MONTHS) })}</p>
        <p>{m.note4}</p>
      </div>
    </Card>
  );

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{m.title}</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">{m.subtitle}</p>

        <div className="mt-6">
          <Suspense fallback={<DhakaTodayPricesSkeleton />}>
            <DhakaTodayPrices locale={locale} t={t} />
          </Suspense>
        </div>

        <h2 className="mt-10 text-xl font-semibold">{m.monthlyTitle}</h2>
        {result.ok ? (
          <>
            <div className="mt-3">
              <Badge tone="info">{fill(m.dataUpTo, { month: formatMonth(locale, result.data.latestMonth) })}</Badge>
            </div>
            <div className="mt-4">
              <NationalPriceTable locale={locale} t={t} data={result.data} meta={result.meta} />
            </div>
            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <DistrictPrices locale={locale} t={t} data={result.data} />
              {note}
            </div>
          </>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Card title={m.nationalTitle}>
              <p className="text-fg-muted">{m.unavailable}</p>
            </Card>
            {note}
          </div>
        )}
      </main>
    </PageShell>
  );
}
