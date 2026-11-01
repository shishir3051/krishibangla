import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/shell/PageShell';
import { Card } from '@/components/ui/Card';
import { getDictionary } from '@/lib/dictionary';
import { hasLocale } from '@/lib/i18n';

const SOURCE_URLS = {
  openMeteo: 'https://open-meteo.com/',
  wfp: 'https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh',
  worldBank: 'https://data.worldbank.org/country/bangladesh',
  nasa: 'https://power.larc.nasa.gov/',
  gdacs: 'https://www.gdacs.org/',
  geoBoundaries: 'https://www.geoboundaries.org/',
} as const;

export async function generateMetadata({ params }: PageProps<'/[locale]/about/data'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: t.about.metaTitle };
}

export default async function DataSourcesPage({ params }: PageProps<'/[locale]/about/data'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const a = t.about;

  return (
    <PageShell locale={locale} t={t}>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{a.title}</h1>
        <p className="mt-3 text-lg text-fg-muted">{a.intro}</p>

        <div className="mt-8 grid gap-4">
          {(Object.keys(SOURCE_URLS) as (keyof typeof SOURCE_URLS)[]).map((key) => {
            const s = a.sources[key];
            return (
              <Card key={key} title={s.name}>
                <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <dt className="text-fg-muted">{a.usedFor}</dt>
                  <dd>{s.usedFor}</dd>
                  <dt className="text-fg-muted">{a.frequency}</dt>
                  <dd>{s.frequency}</dd>
                  <dt className="text-fg-muted">{a.terms}</dt>
                  <dd>{s.terms}</dd>
                </dl>
                <a href={SOURCE_URLS[key]} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-brand underline underline-offset-2">
                  {a.visit} ↗
                </a>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title={a.aiTitle}>
            <p className="text-sm">{a.aiBody}</p>
          </Card>
          <Card title={a.curatedTitle}>
            <p className="text-sm">{a.curatedBody}</p>
          </Card>
        </div>
      </main>
    </PageShell>
  );
}
