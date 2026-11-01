/**
 * alerts.ts — GDACS (Global Disaster Alert and Coordination System) events affecting Bangladesh:
 * request URL, GeoJSON parsing, the Bangladesh filter and active/past classification.
 * Pure (no fetching), unit-tested in alerts.test.ts; the cached fetch lives in lib/sources/gdacs.ts.
 */
import { z } from 'zod';

export const EVENT_TYPES = ['TC', 'FL', 'DR'] as const; // tropical cyclone, flood, drought
export type EventType = (typeof EVENT_TYPES)[number];

export const ALERT_LEVELS = ['Red', 'Orange', 'Green'] as const;
export type AlertLevel = (typeof ALERT_LEVELS)[number];

export type GdacsEvent = {
  key: string; // e.g. "TC-1001064"
  type: EventType;
  eventId: number;
  episodeId: number;
  /** GDACS's own (English) title, e.g. "Tropical Cyclone REMAL-24". */
  name: string;
  /** Storm name for cyclones, e.g. "REMAL-24"; empty for floods. */
  eventName: string;
  level: AlertLevel;
  from: string; // ISO UTC
  to: string; // ISO UTC
  reportUrl: string;
  countries: string[]; // ISO3 codes of affected countries
  severity: string | null; // GDACS's severity text, English
};

export const BANGLADESH_ISO3 = 'BGD';
/** GDACS's `country` filter matches on the country name (an ISO3 code returns nothing). */
const COUNTRY_FILTER = 'Bangladesh';

/**
 * Cyclones, floods and droughts touching Bangladesh between two dates (YYYY-MM-DD).
 * All alert levels are requested — by default GDACS leaves out Green.
 */
export function eventListUrl(fromDate: string, toDate: string): string {
  return (
    'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH' +
    `?eventlist=${EVENT_TYPES.join(';')}&alertlevel=${ALERT_LEVELS.slice().reverse().join(';')}` +
    `&country=${COUNTRY_FILTER}&fromDate=${fromDate}&toDate=${toDate}&pageSize=100`
  );
}

const featureSchema = z.object({
  properties: z.object({
    eventtype: z.string(),
    eventid: z.number(),
    episodeid: z.number(),
    name: z.string(),
    eventname: z.string().nullish(),
    alertlevel: z.string(),
    fromdate: z.string(),
    todate: z.string(),
    iso3: z.string().nullish(),
    affectedcountries: z.array(z.object({ iso3: z.string().nullish() })).nullish(),
    url: z.object({ report: z.string().nullish() }).nullish(),
    severitydata: z.object({ severitytext: z.string().nullish() }).nullish(),
  }),
});
const collectionSchema = z.object({ features: z.array(z.unknown()) });

/** GDACS times have no zone designator and are UTC. */
function toIso(value: string): string | null {
  const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`;
  const ms = Date.parse(withZone);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

const isEventType = (v: string): v is EventType => (EVENT_TYPES as readonly string[]).includes(v);
const isLevel = (v: string): v is AlertLevel => (ALERT_LEVELS as readonly string[]).includes(v);

/**
 * Parses a GDACS event list and keeps only cyclone/flood/drought events whose affected countries
 * include Bangladesh. Malformed features are skipped; a malformed payload returns null.
 * One entry per event (the latest episode), newest end date first.
 */
export function parseEvents(json: unknown): GdacsEvent[] | null {
  const collection = collectionSchema.safeParse(json);
  if (!collection.success) return null;

  const byKey = new Map<string, GdacsEvent>();
  for (const raw of collection.data.features) {
    const parsed = featureSchema.safeParse(raw);
    if (!parsed.success) continue;
    const p = parsed.data.properties;
    const countries = (p.affectedcountries ?? []).flatMap((c) => (c.iso3 ? [c.iso3] : []));
    const affectsBangladesh = p.iso3 === BANGLADESH_ISO3 || countries.includes(BANGLADESH_ISO3);
    const from = toIso(p.fromdate);
    const to = toIso(p.todate);
    if (!affectsBangladesh || !isEventType(p.eventtype) || !isLevel(p.alertlevel) || !from || !to) continue;

    const event: GdacsEvent = {
      key: `${p.eventtype}-${p.eventid}`,
      type: p.eventtype,
      eventId: p.eventid,
      episodeId: p.episodeid,
      name: p.name,
      eventName: p.eventname ?? '',
      level: p.alertlevel,
      from,
      to,
      reportUrl:
        p.url?.report && /^https:\/\/www\.gdacs\.org\//.test(p.url.report)
          ? p.url.report
          : `https://www.gdacs.org/report.aspx?eventid=${p.eventid}&episodeid=${p.episodeid}&eventtype=${p.eventtype}`,
      countries: countries.length ? countries : [BANGLADESH_ISO3],
      severity: p.severitydata?.severitytext?.trim() || null,
    };
    const existing = byKey.get(event.key);
    if (!existing || event.episodeId > existing.episodeId) byKey.set(event.key, event);
  }
  return [...byKey.values()].sort((a, b) => b.to.localeCompare(a.to) || b.from.localeCompare(a.from));
}

const DAY = 24 * 60 * 60 * 1000;
/** An event counts as active while its end date is less than this long ago (or in the future). */
export const ACTIVE_DAYS = 7;
export const HISTORY_DAYS = 365;

export type ClassifiedEvents = {
  /** Ended within the last 7 days or still ongoing. */
  active: GdacsEvent[];
  /** Every event in the last 12 months (active ones included), newest first. */
  history: GdacsEvent[];
};

export function classifyEvents(events: GdacsEvent[], now: Date): ClassifiedEvents {
  const t = now.getTime();
  const history = events.filter((e) => Date.parse(e.to) >= t - HISTORY_DAYS * DAY);
  return { active: history.filter((e) => Date.parse(e.to) >= t - ACTIVE_DAYS * DAY), history };
}

/** "YYYY-MM-DD" in UTC, for the GDACS query string. */
export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Query window: a year back (plus a day of slack) to tomorrow, so nothing on either edge is missed. */
export function queryWindow(now: Date): { fromDate: string; toDate: string } {
  return { fromDate: isoDay(new Date(now.getTime() - (HISTORY_DAYS + 1) * DAY)), toDate: isoDay(new Date(now.getTime() + DAY)) };
}
