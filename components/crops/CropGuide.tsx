/**
 * CropGuide — the general-practice sections of a crop page (stages, rice seasons, step guide, notes).
 * Every section carries the "general practice" label and the office to confirm with.
 */
import { Card } from '@/components/ui/Card';
import { SourceTag } from '@/components/ui/SourceTag';
import { fill, type Dictionary } from '@/lib/dictionary';
import type { CropContent } from '@/lib/domain/crops';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { CropCalendar } from './CropCalendar';

type Props = { crop: CropContent; locale: Locale; t: Dictionary };

function GuideFooter({ crop, locale, t }: Props) {
  const confirm = crop.adviceOffice === 'fisheries' ? t.crops.confirmFisheries : t.crops.confirmAgriculture;
  return (
    <>
      <SourceTag locale={locale} labels={t.source} source={t.nav.brand} curated />
      <p className="mt-1 text-xs text-fg-muted">
        {t.crops.guideNote} {confirm}
      </p>
    </>
  );
}

export function CropGuide({ crop, locale, t }: Props) {
  const c = t.crops;
  const footer = <GuideFooter crop={crop} locale={locale} t={t} />;
  const stageCalendar = crop.lifecycle.flatMap((s) => (s.range ? [{ label: s.name[locale], when: s.timing[locale], range: s.range }] : []));

  return (
    <>
      {crop.seasons && (
        <Card title={c.seasons} footer={footer}>
          <CropCalendar
            rows={crop.seasons.map((s) => ({ label: s.name[locale], when: s.months[locale], range: s.range }))}
            monthInitials={c.monthInitials}
            note={c.calendarNote}
          />
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {crop.seasons.map((s) => (
              <li key={s.id} className="rounded-xl border border-line p-4">
                <h3 className="text-lg font-semibold text-fg">{s.name[locale]}</h3>
                <p className="text-sm text-brand">{s.type[locale]}</p>
                <p className="mt-2 text-sm text-fg-muted">{s.description[locale]}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title={crop.lifecycleTitle?.[locale] ?? c.lifecycle} footer={footer}>
        {stageCalendar.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-fg-muted">{c.calendar}</h3>
            <CropCalendar rows={stageCalendar} monthInitials={c.monthInitials} note={c.calendarNote} />
          </div>
        )}
        <ol className="space-y-5">
          {crop.lifecycle.map((stage) => (
            <li
              key={stage.name.en}
              className="relative flex gap-4 not-last:after:absolute not-last:after:top-12 not-last:after:-bottom-4 not-last:after:left-5 not-last:after:w-px not-last:after:bg-line"
            >
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-xl">
                {stage.icon}
              </span>
              <div>
                <h3 className="font-semibold text-fg">{stage.name[locale]}</h3>
                <p className="text-sm text-brand">{stage.timing[locale]}</p>
                <p className="mt-1 text-fg-muted">{stage.action[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {crop.steps && (
        <Card title={fill(c.steps, { n: formatNumber(locale, crop.steps.length) })} footer={footer}>
          <ol className="grid gap-3 md:grid-cols-2">
            {crop.steps.map((step, i) => (
              <li key={step.title.en} className="flex gap-3 rounded-xl bg-surface-2 p-4">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold tabular-nums text-on-brand">
                  {formatNumber(locale, i + 1)}
                </span>
                <div>
                  <h3 className="font-medium text-fg">{step.title[locale]}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{step.text[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {crop.notes?.map((note) => (
        <Card key={note.title.en} title={note.title[locale]} footer={footer}>
          <ul className="space-y-2">
            {note.points.map((point) => (
              <li key={point.en} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                <span className="text-fg">{point[locale]}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </>
  );
}
