/**
 * AlertEvent — one GDACS event (level badge, type in plain words, Dhaka dates, link to the GDACS
 * report). Shared by the home-page AlertsCard and the climate page's alert history.
 */
import { Badge, type Tone } from '@/components/ui/Badge';
import { fill, type Dictionary } from '@/lib/dictionary';
import type { AlertLevel, EventType, GdacsEvent } from '@/lib/domain/alerts';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { dhakaDate, formatDateRange } from './format';

export const LEVEL_TONE: Record<AlertLevel, Tone> = { Red: 'danger', Orange: 'warning', Green: 'info' };
export const TYPE_ICON: Record<EventType, string> = { TC: '🌀', FL: '🌊', DR: '☀️' };

/** "Cyclone REMAL-24" / "ঘূর্ণিঝড় REMAL-24"; floods and droughts have no storm name. */
export function eventTitle(event: GdacsEvent, t: Dictionary): string {
  const type = t.climate.alerts.types[event.type];
  return event.type === 'TC' && event.eventName ? `${type} ${event.eventName}` : type;
}

type Props = { event: GdacsEvent; locale: Locale; t: Dictionary; active?: boolean };

export function AlertEvent({ event, locale, t, active = false }: Props) {
  const a = t.climate.alerts;
  const title = eventTitle(event, t);
  return (
    <div className="flex gap-3">
      <span aria-hidden className="mt-0.5 text-2xl leading-none">
        {TYPE_ICON[event.type]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-fg">{title}</p>
          <Badge tone={LEVEL_TONE[event.level]}>{a.levels[event.level]}</Badge>
          {active && <Badge tone="neutral">{a.activeBadge}</Badge>}
        </div>
        <p className="mt-1 text-sm text-fg-muted">
          <time dateTime={dhakaDate(event.from)}>{formatDateRange(locale, event.from, event.to)}</time>
          {event.countries.length > 1 && <> · {fill(a.countries, { n: formatNumber(locale, event.countries.length) })}</>}
        </p>
        {/* GDACS's severity text is English-only. */}
        {locale === 'en' && event.severity && <p className="text-sm text-fg-muted">{event.severity}</p>}
        <a
          href={event.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fill(a.reportLabel, { name: title })}
          className="mt-1 inline-flex min-h-6 items-center text-sm font-medium text-brand underline underline-offset-2 hover:text-fg"
        >
          {a.report} <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
