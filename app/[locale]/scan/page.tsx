import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiseaseScanner } from '@/components/scan/DiseaseScanner';
import { PageShell } from '@/components/shell/PageShell';
import { getDictionary } from '@/lib/dictionary';
import { hasLocale } from '@/lib/i18n';

// Krishi Call Center (short code 16123, 8 am–8 pm except Fri, Sat and government holidays), as published
// by the Agriculture Information Service, Ministry of Agriculture — checked 2026-11-01.
const CALL_CENTER_TEL = '16123';
const CALL_CENTER_SOURCE = 'https://ais.gov.bd/pages/static-pages/6922df5e933eb65569e21833';

export async function generateMetadata({ params }: PageProps<'/[locale]/scan'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: `${t.scan.metaTitle} · ${t.nav.brand}`, description: t.scan.metaDescription };
}

export default async function ScanPage({ params }: PageProps<'/[locale]/scan'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const s = t.scan;
  const [beforeNumber, afterNumber] = s.callCenter.split('{number}');

  const notice = (
    <aside aria-labelledby="scan-disclaimer" className="rounded-2xl border border-warning/30 bg-warning-soft p-5">
      <h2 id="scan-disclaimer" className="flex items-center gap-2 font-semibold text-warning">
        <span aria-hidden>⚠️</span>
        {s.disclaimerTitle}
      </h2>
      <p className="mt-2 text-fg">{s.disclaimer}</p>
      <p className="mt-2 text-fg">
        {beforeNumber}
        <a href={`tel:${CALL_CENTER_TEL}`} className="font-semibold text-fg underline underline-offset-2">
          {s.callCenterNumber}
        </a>
        {afterNumber}
      </p>
      <p className="mt-3 text-xs text-fg-muted">
        {t.source.label}:{' '}
        <a href={CALL_CENTER_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
          {s.callCenterSource}
        </a>
      </p>
      <p className="mt-3 border-t border-warning/20 pt-3 text-xs text-fg-muted">{s.privacy}</p>
    </aside>
  );

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">{s.title}</h1>
          <p className="mt-2 text-fg-muted">{s.subtitle}</p>
        </header>
        <div className="mt-8">
          <DiseaseScanner locale={locale} labels={s} notice={notice} />
        </div>
      </main>
    </PageShell>
  );
}
