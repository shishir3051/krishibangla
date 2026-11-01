import { describe, expect, it } from 'vitest';
import fixture from '@/test/fixtures/gdacs-events.json';
import { classifyEvents, eventListUrl, parseEvents, queryWindow } from './alerts';

// Real GDACS features: a current drought and a Sep 2026 flood (Bangladesh), Cyclone REMAL-24
// (May 2024; Bangladesh, India, Bhutan) and Cyclone MOCHA-23 (May 2023; Myanmar only).
type Feature = (typeof fixture.features)[number];
const remal = fixture.features.find((f) => f.properties.eventname === 'REMAL-24')!;
const withProps = (f: Feature, props: Partial<Feature['properties']>) => ({ ...f, properties: { ...f.properties, ...props } });

describe('eventListUrl', () => {
  it('asks for cyclones, floods and droughts at every alert level, filtered to Bangladesh', () => {
    const url = eventListUrl('2025-10-31', '2026-11-02');
    expect(url).toContain('eventlist=TC;FL;DR');
    expect(url).toContain('alertlevel=Green;Orange;Red');
    expect(url).toContain('country=Bangladesh');
    expect(url).toContain('fromDate=2025-10-31&toDate=2026-11-02');
  });
});

describe('parseEvents', () => {
  const events = parseEvents(fixture)!;

  it('keeps only events whose affected countries include Bangladesh, newest first', () => {
    expect(events.map((e) => e.key)).toEqual(['DR-1027462', 'FL-1104156', 'TC-1001064']);
  });

  it('reads Cyclone REMAL-24 correctly', () => {
    expect(events[2]).toEqual({
      key: 'TC-1001064',
      type: 'TC',
      eventId: 1001064,
      episodeId: 6,
      name: 'Tropical Cyclone REMAL-24',
      eventName: 'REMAL-24',
      level: 'Orange',
      from: '2024-05-25T12:00:00.000Z',
      to: '2024-05-26T18:00:00.000Z',
      reportUrl: 'https://www.gdacs.org/report.aspx?eventid=1001064&episodeid=6&eventtype=TC',
      countries: ['BGD', 'IND', 'BTN'],
      severity: 'Tropical Storm (maximum wind speed of 102 km/h)',
    });
  });

  it('matches Bangladesh as a secondary affected country too', () => {
    const parsed = parseEvents({ type: 'FeatureCollection', features: [withProps(remal, { iso3: 'IND' })] })!;
    expect(parsed).toHaveLength(1);
  });

  it('keeps one entry per event — the latest episode', () => {
    const parsed = parseEvents({ type: 'FeatureCollection', features: [remal, withProps(remal, { episodeid: 4, alertlevel: 'Green' })] })!;
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({ episodeId: 6, level: 'Orange' });
  });

  it('skips unknown event types and malformed features; rejects a malformed payload', () => {
    const parsed = parseEvents({ features: [withProps(remal, { eventtype: 'EQ' }), { properties: { name: 'broken' } }] });
    expect(parsed).toEqual([]);
    expect(parseEvents({ type: 'FeatureCollection', features: [] })).toEqual([]);
    expect(parseEvents('not json')).toBeNull();
  });
});

describe('classifyEvents', () => {
  const events = parseEvents(fixture)!;

  it('treats events that ended within 7 days as active and keeps 12 months of history', () => {
    const { active, history } = classifyEvents(events, new Date('2026-11-01T12:00:00Z'));
    expect(active.map((e) => e.key)).toEqual(['DR-1027462']); // ended 30 Oct 2026
    expect(history.map((e) => e.key)).toEqual(['DR-1027462', 'FL-1104156']); // REMAL-24 is older than a year
  });

  it('has nothing active a week after the last event ended', () => {
    expect(classifyEvents(events, new Date('2026-11-08T00:00:00Z')).active).toEqual([]);
  });
});

describe('queryWindow', () => {
  it('spans a year back to tomorrow', () => {
    expect(queryWindow(new Date('2026-11-01T12:00:00Z'))).toEqual({ fromDate: '2025-10-31', toDate: '2026-11-02' });
  });
});
