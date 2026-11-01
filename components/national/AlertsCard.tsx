/**
 * AlertsCard — home-page card: current/recent GDACS disaster alerts (cyclone, flood, drought)
 * affecting Bangladesh, or a clear "no active alerts" state with the most recent past event.
 *
 * CONTRACT (used by app/[locale]/page.tsx): async server component, same props. It reads data at
 * request time, so render it inside <Suspense fallback={<AlertsCardSkeleton />}>.
 */
import Link from 'next/link';
import { connection } from 'next/server';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SourceTag } from '@/components/ui/SourceTag';
import type { Dictionary } from '@/lib/dictionary';
import { localePath, type Locale } from '@/lib/i18n';
import { getBangladeshAlerts } from '@/lib/sources/gdacs';
import { AlertEvent } from './AlertEvent';

export async function AlertsCard({ locale, t }: { locale: Locale; t: Dictionary }) {
  await connection();
  const result = await getBangladeshAlerts();
  const a = t.climate.alerts;

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <SourceTag locale={locale} labels={t.source} source={result.meta.source} url={result.meta.url} fetchedAt={result.ok ? result.meta.fetchedAt : undefined} />
      <Link href={localePath(locale, '/climate#alerts')} className="text-sm font-medium text-brand underline underline-offset-2 hover:text-fg">
        {a.seeAll} →
      </Link>
    </div>
  );

  if (!result.ok) {
    return (
      <Card title={a.title} footer={footer}>
        <p className="text-fg-muted">{a.unavailable}</p>
      </Card>
    );
  }

  const { active, history } = result.data;
  const lastPast = history.find((e) => !active.some((x) => x.key === e.key));

  return (
    <Card title={a.title} footer={footer}>
      {active.length > 0 ? (
        <>
          <ul className="grid gap-3">
            {active.map((event) => (
              <li key={event.key} className="rounded-xl bg-surface-2 p-3">
                <AlertEvent event={event} locale={locale} t={t} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-fg-muted">
            {a.activeNote} {a.levelHelp}
          </p>
        </>
      ) : (
        <>
          <p className="flex items-center gap-2 font-medium text-fg">
            <span aria-hidden className="grid size-6 place-items-center rounded-full bg-brand-soft text-sm text-brand">
              ✓
            </span>
            {a.none}
          </p>
          {lastPast ? (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-fg-muted">{a.lastEvent}</h3>
              <div className="mt-2 rounded-xl bg-surface-2 p-3">
                <AlertEvent event={lastPast} locale={locale} t={t} />
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-fg-muted">{a.noneInYear}</p>
          )}
        </>
      )}
    </Card>
  );
}

export function AlertsCardSkeleton() {
  return <Skeleton className="h-56" />;
}
