/**
 * ClimateAnomalies — per-division temperature and rainfall compared with normal for the last
 * 12 months (NASA POWER): an explanation, small multiples on a shared scale, and the full numbers
 * in a table. Data is cached for weeks, so this is part of the prerendered shell.
 */
import { Card } from '@/components/ui/Card';
import { SourceTag } from '@/components/ui/SourceTag';
import { formatFixed, formatMonthYear, formatSigned, formatYear } from '@/components/national/format';
import { fill, type Dictionary } from '@/lib/dictionary';
import { DIVISION_CAPITALS, type MonthAnomaly } from '@/lib/domain/climate';
import { DIVISIONS } from '@/lib/domain/vocab';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { getClimateAnomalies, type DivisionClimate } from '@/lib/sources/nasa-power';
import { DivergingBars } from './DivergingBars';

type Props = { locale: Locale; t: Dictionary };

const TEMP_UP = 'fill-danger';
const TEMP_DOWN = 'fill-info';
const RAIN_UP = 'fill-info';
const RAIN_DOWN = 'fill-accent';
/** Rainfall bars show the difference from 100%, cut off at 0% and 200%. */
const RAIN_MAX = 100;

/** Shared temperature scale: the largest monthly difference, rounded up to 0.5 °C (at least ±1 °C). */
function temperatureScale(divisions: DivisionClimate[]): number {
  const largest = Math.max(0, ...divisions.flatMap((d) => d.months.map((m) => Math.abs(m.tempDiff ?? 0))));
  return Math.max(1, Math.ceil(largest * 2) / 2);
}

function Swatch({ className }: { className: string }) {
  return <span aria-hidden className={`inline-block size-3 shrink-0 rounded-sm ${className}`} />;
}

export async function ClimateAnomalies({ locale, t }: Props) {
  const result = await getClimateAnomalies();
  const c = t.climate.anomalies;
  const titleId = 'climate-anomalies-title';

  if (!result.ok) {
    return (
      <section aria-labelledby={titleId}>
        <h2 id={titleId} className="text-2xl font-semibold text-fg">
          {c.title}
        </h2>
        <Card className="mt-4" footer={<SourceTag locale={locale} labels={t.source} source={result.meta.source} url={result.meta.url} />}>
          <p className="text-fg-muted">{c.unavailable}</p>
        </Card>
      </section>
    );
  }

  const { divisions, baseline, latestMonth } = result.data;
  const months = divisions[0].months.map((m) => m.month);
  const from = formatMonthYear(locale, months[0]);
  const to = formatMonthYear(locale, latestMonth);
  const tempMax = temperatureScale(divisions);
  const missing = DIVISION_CAPITALS.filter((cap) => !divisions.some((d) => d.division === cap.division)).map((cap) => DIVISIONS[cap.division][locale]);

  const n0 = (v: number) => formatNumber(locale, v, 0);
  const f1 = (v: number) => formatFixed(locale, v, 1);
  const s1 = (v: number) => formatSigned(locale, v, 1);

  const tempBar = (m: MonthAnomaly) => {
    const month = formatMonthYear(locale, m.month);
    return {
      value: m.tempDiff,
      title:
        m.temp != null && m.tempNormal != null && m.tempDiff != null
          ? fill(c.barTemp, { month, temp: f1(m.temp), normal: f1(m.tempNormal), diff: s1(m.tempDiff) })
          : fill(c.noData, { month }),
    };
  };
  const rainBar = (m: MonthAnomaly) => {
    const month = formatMonthYear(locale, m.month);
    return {
      value: m.rainPct == null ? null : m.rainPct - 100,
      title:
        m.rain != null && m.rainNormal != null && m.rainPct != null
          ? fill(c.barRain, { month, rain: n0(m.rain), normal: n0(m.rainNormal), pct: n0(m.rainPct) })
          : fill(c.noData, { month }),
    };
  };

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="text-2xl font-semibold text-fg">
        {c.title}
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-fg-muted">{fill(c.period, { from, to })}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title={c.whatTitle}>
          <p className="text-sm text-fg">{c.whatBody}</p>
          <p className="mt-2 text-sm text-fg-muted">{c.dryNote}</p>
        </Card>
        <Card title={c.legendTitle}>
          <p className="text-sm font-medium text-fg">
            {baseline ? fill(c.baseline, { start: formatYear(locale, baseline.startYear), end: formatYear(locale, baseline.endYear) }) : c.baselineUnknown}
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-fg sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Swatch className="bg-danger" />
              {c.warmer}
            </li>
            <li className="flex items-center gap-2">
              <Swatch className="bg-info" />
              {c.cooler}
            </li>
            <li className="flex items-center gap-2">
              <Swatch className="bg-accent" />
              {c.drier}
            </li>
            <li className="flex items-center gap-2">
              <Swatch className="bg-info" />
              {c.wetter}
            </li>
          </ul>
          <p className="mt-3 text-sm text-fg-muted">{fill(c.scaleNote, { max: f1(tempMax) })}</p>
        </Card>
      </div>

      {missing.length > 0 && <p className="mt-4 text-sm text-warning">{fill(c.missingDivisions, { names: missing.join(', ') })}</p>}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {divisions.map((d) => {
          const name = DIVISIONS[d.division][locale];
          const { tempDiff, rainPct } = d.summary;
          return (
            <li key={d.division} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
              <h3 className="font-semibold text-fg">{name}</h3>

              <div className="mt-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="text-xs text-fg-muted">{c.temperature}</p>
                  {tempDiff != null && <p className="text-sm font-medium text-fg">{fill(c.tempSummary, { value: s1(tempDiff) })}</p>}
                </div>
                <DivergingBars
                  bars={d.months.map(tempBar)}
                  max={tempMax}
                  upClass={TEMP_UP}
                  downClass={TEMP_DOWN}
                  label={fill(c.chartTemp, { division: name, from, to, value: tempDiff != null ? s1(tempDiff) : '–' })}
                />
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="text-xs text-fg-muted">{c.rainfall}</p>
                  {rainPct != null && <p className="text-sm font-medium text-fg">{fill(c.rainSummary, { value: n0(rainPct) })}</p>}
                </div>
                <DivergingBars
                  bars={d.months.map(rainBar)}
                  max={RAIN_MAX}
                  upClass={RAIN_UP}
                  downClass={RAIN_DOWN}
                  label={fill(c.chartRain, { division: name, from, to, value: rainPct != null ? n0(rainPct) : '–' })}
                />
              </div>

              <p aria-hidden className="mt-1 flex justify-between gap-2 text-xs text-fg-muted">
                <span>{from}</span>
                <span>{to}</span>
              </p>
            </li>
          );
        })}
      </ul>

      <details className="mt-6 rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-medium text-fg">{c.showTable}</summary>
        <NumbersTable
          caption={c.tableTemp}
          monthLabel={c.month}
          summaryLabel={c.average}
          locale={locale}
          months={months}
          divisions={divisions}
          cell={(m) => (m.temp != null && m.tempDiff != null ? `${f1(m.temp)} (${s1(m.tempDiff)})` : '–')}
          summary={(d) => (d.summary.tempDiff != null ? `(${s1(d.summary.tempDiff)})` : '–')}
        />
        <NumbersTable
          caption={c.tableRain}
          monthLabel={c.month}
          summaryLabel={c.total}
          locale={locale}
          months={months}
          divisions={divisions}
          cell={(m) => (m.rain != null && m.rainPct != null ? `${n0(m.rain)} (${n0(m.rainPct)}%)` : '–')}
          summary={(d) => (d.summary.rain != null && d.summary.rainPct != null ? `${n0(d.summary.rain)} (${n0(d.summary.rainPct)}%)` : '–')}
        />
      </details>

      <div className="mt-4">
        <SourceTag
          locale={locale}
          labels={t.source}
          note={fill(c.sourceNote, { month: to })}
          source={result.meta.source}
          url={result.meta.url}
        />
      </div>
    </section>
  );
}

type TableProps = {
  caption: string;
  monthLabel: string;
  summaryLabel: string;
  locale: Locale;
  months: string[];
  divisions: DivisionClimate[];
  cell: (m: MonthAnomaly) => string;
  summary: (d: DivisionClimate) => string;
};

function NumbersTable({ caption, monthLabel, summaryLabel, locale, months, divisions, cell, summary }: TableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[44rem] text-sm">
        <caption className="mb-2 text-left font-medium text-fg">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-fg-muted">
            <th scope="col" className="py-1.5 pr-3 text-left font-medium">
              {monthLabel}
            </th>
            {divisions.map((d) => (
              <th key={d.division} scope="col" className="px-2 py-1.5 text-right font-medium">
                {DIVISIONS[d.division][locale]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {months.map((month, i) => (
            <tr key={month} className="border-b border-line/60">
              <th scope="row" className="whitespace-nowrap py-1.5 pr-3 text-left font-normal text-fg">
                {formatMonthYear(locale, month)}
              </th>
              {divisions.map((d) => (
                <td key={d.division} className="whitespace-nowrap px-2 py-1.5 text-right text-fg">
                  {cell(d.months[i])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="font-medium">
            <th scope="row" className="whitespace-nowrap py-1.5 pr-3 text-left text-fg">
              {summaryLabel}
            </th>
            {divisions.map((d) => (
              <td key={d.division} className="whitespace-nowrap px-2 py-1.5 text-right text-fg">
                {summary(d)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
