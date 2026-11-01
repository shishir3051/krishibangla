import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AskButton } from '@/components/chat/AskButton';
import { CropGuide } from '@/components/crops/CropGuide';
import { CropPrices } from '@/components/markets/CropPrices';
import { PageShell } from '@/components/shell/PageShell';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { fill, getDictionary } from '@/lib/dictionary';
import { CROP_PAGES, getCrop } from '@/lib/domain/crops';
import { hasLocale, localePath } from '@/lib/i18n';
import { pageMetadata } from '@/lib/site';

// Prerender every crop guide (for each locale from the layout); any other id is a 404.
export function generateStaticParams() {
  return CROP_PAGES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/crops/[id]'>): Promise<Metadata> {
  const { locale, id } = await params;
  const crop = getCrop(id);
  if (!hasLocale(locale) || !crop) return {};
  const t = await getDictionary(locale);
  return pageMetadata(locale, `/crops/${id}`, { title: `${crop.name[locale]} — ${t.crops.title} · ${t.nav.brand}`, description: crop.summary[locale] });
}

export default async function CropPage({ params }: PageProps<'/[locale]/crops/[id]'>) {
  const { locale, id } = await params;
  const crop = getCrop(id);
  if (!hasLocale(locale) || !crop) notFound();
  const t = await getDictionary(locale);
  const c = t.crops;
  const name = crop.name[locale];
  const askLabel = fill(c.ask, { crop: name });
  const others = CROP_PAGES.filter((p) => p.id !== crop.id);

  return (
    <PageShell locale={locale} t={t} chatCropId={crop.id}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link href={localePath(locale)} className="text-sm text-fg-muted hover:text-fg">
          ← {t.nav.home}
        </Link>

        <header className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-soft text-4xl">
              {crop.icon}
            </span>
            <div>
              <p className="text-sm text-fg-muted">{c.title}</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">{name}</h1>
              <p className="mt-2 max-w-2xl text-fg-muted">{crop.summary[locale]}</p>
            </div>
          </div>
          <AskButton className="h-11 shrink-0 self-start rounded-full bg-brand px-5 font-medium text-on-brand hover:opacity-90 md:self-auto">
            💬 {askLabel}
          </AskButton>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="grid content-start gap-4 lg:col-span-2">
            <Card title={c.about}>
              <p className="leading-relaxed text-fg">{crop.description[locale]}</p>
            </Card>
            <CropGuide crop={crop} locale={locale} t={t} />
          </div>

          <aside className="grid content-start gap-4">
            {crop.wfpCommodity && (
              <Suspense fallback={<Skeleton className="h-56" />}>
                <CropPrices locale={locale} t={t} commodity={crop.wfpCommodity} />
              </Suspense>
            )}

            <Card title={c.askTitle}>
              <p className="text-fg-muted">{c.askBody}</p>
              <AskButton className="mt-4 h-11 w-full rounded-xl bg-brand px-4 font-medium text-on-brand hover:opacity-90">💬 {askLabel}</AskButton>
              <p className="mt-2 text-xs text-fg-muted">{c.aiNote}</p>
            </Card>

            <Card title={c.scanTitle}>
              <p className="text-fg-muted">{c.scanBody}</p>
              <Link
                href={localePath(locale, '/scan')}
                className="mt-4 flex h-11 items-center justify-center rounded-xl border border-line px-4 font-medium text-fg hover:border-brand hover:text-brand"
              >
                🔍 {c.scanCta}
              </Link>
            </Card>

            <Card title={c.otherCrops}>
              <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={localePath(locale, `/crops/${other.id}`)}
                      className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 text-fg hover:border-brand hover:text-brand"
                    >
                      <span aria-hidden className="text-2xl">
                        {other.icon}
                      </span>
                      <span className="font-medium">{other.name[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
