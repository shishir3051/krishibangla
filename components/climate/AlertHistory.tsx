/**
 * AlertHistory — GDACS cyclone, flood and drought events for Bangladesh over the last 12 months,
 * with counts by type. Reads data at request time: render inside <Suspense fallback={<AlertHistorySkeleton />}>.
 */
import { connection } from 'next/server';
import { AlertEvent, TYPE_ICON } from '@/components/national/AlertEvent';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SourceTag } from '@/components/ui/SourceTag';
import type { Dictionary } from '@/lib/dictionary';
import { EVENT_TYPES } from '@/lib/domain/alerts';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { getBangladeshAlerts } from '@/lib/sources/gdacs';

export async function AlertHistory({ locale, t }: { locale: Locale; t: Dictionary }) {
  await connection();
  const result = await getBangladeshAlerts();
  const a = t.climate.alerts;
  const footer = (
    <SourceTag locale={locale} labels={t.source} source={result.meta.source} url={result.meta.url} fetchedAt={result.ok ? result.meta.fetchedAt : undefined} />
  );

  return (
    <Card title={<span id="alerts-title">{a.historyTitle}</span>} footer={footer}>
      <p className="max-w-3xl text-sm text-fg-muted">{a.intro}</p>

      {!result.ok ? (
        <p className="mt-4 text-fg-muted">{a.unavailable}</p>
      ) : (
        <>
          <h3 className="mt-5 text-sm font-medium text-fg-muted">{a.byType}</h3>
          <dl className="mt-2 grid grid-cols-3 gap-2">
            {EVENT_TYPES.map((type) => (
              <div key={type} className="rounded-xl bg-surface-2 px-3 py-2">
                <dt className="text-sm text-fg-muted">
                  <span aria-hidden>{TYPE_ICON[type]}</span> {a.types[type]}
                </dt>
                <dd className="text-2xl font-semibold text-fg">{formatNumber(locale, result.data.history.filter((e) => e.type === type).length)}</dd>
              </div>
            ))}
          </dl>

          {result.data.history.length > 0 ? (
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {result.data.history.map((event) => (
                <li key={event.key} className="rounded-xl border border-line p-3">
                  <AlertEvent event={event} locale={locale} t={t} active={result.data.active.some((e) => e.key === event.key)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-fg">{a.noneInYear}</p>
          )}

          <p className="mt-4 text-xs text-fg-muted">
            {a.activeNote} {a.levelHelp}
          </p>
        </>
      )}
    </Card>
  );
}

export function AlertHistorySkeleton() {
  return <Skeleton className="h-80" />;
}
