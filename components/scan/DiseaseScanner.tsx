'use client';
/**
 * DiseaseScanner — pick, drop or take a photo, downscale it in the browser, POST it to /api/detect
 * and show the diagnosis. `notice` (the disclaimer) is rendered under the result.
 */
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode, type RefObject } from 'react';
import type { Dictionary } from '@/lib/dictionary';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import type { Diagnosis } from '@/lib/scan';
import { ACCEPTED_TYPES, downscaleImage, scanErrorKey } from './image';

type Labels = Dictionary['scan'];
type Phase = 'idle' | 'preparing' | 'ready' | 'scanning' | 'done';

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes('Files');

export function DiseaseScanner({ locale, labels, notice }: { locale: Locale; labels: Labels; notice?: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const pickerRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const busy = phase === 'preparing' || phase === 'scanning';

  // Stop an in-flight scan when the page is left (or hidden by navigation).
  useEffect(() => () => abortRef.current?.abort(), []);

  // Move focus to the answer so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (result) resultHeadingRef.current?.focus();
  }, [result]);

  async function loadFile(file: File | undefined) {
    if (!file || busy) return;
    setError(null);
    setResult(null);
    if (!file.type.startsWith('image/')) {
      setError(labels.badImage);
      return;
    }
    setPhase('preparing');
    try {
      setImage(await downscaleImage(file));
      setPhase('ready');
    } catch {
      setImage(null);
      setPhase('idle');
      setError(labels.badImage);
    }
  }

  async function scan() {
    if (!image || busy) return;
    setPhase('scanning');
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setError(labels[scanErrorKey(res.status)]);
        setPhase('ready');
        return;
      }
      const data = (await res.json()) as Diagnosis;
      if (typeof data?.detected !== 'boolean') throw new Error('Unexpected response');
      setResult(data);
      setPhase('done');
    } catch {
      if (!controller.signal.aborted) setError(labels.failed);
      setPhase('ready');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  const choose = () => pickerRef.current?.click();
  const fileInputProps = {
    type: 'file',
    accept: ACCEPTED_TYPES,
    hidden: true,
    tabIndex: -1,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      void loadFile(e.target.files?.[0]);
      e.target.value = ''; // so picking the same file again still fires
    },
  } as const;

  const primary = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-medium text-on-brand hover:opacity-90 disabled:opacity-50';
  const secondary = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 font-medium text-fg hover:border-brand hover:text-brand disabled:opacity-50';

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      {/* Photo */}
      <section
        aria-label={labels.choosePhoto}
        onDragEnter={(e) => {
          if (!hasFiles(e) || busy) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          if (!hasFiles(e) || busy) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void loadFile(e.dataTransfer.files[0]);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-4 transition-colors sm:p-5 ${
          dragging ? 'border-brand bg-brand-soft' : 'border-line bg-surface'
        }`}
      >
        <input ref={pickerRef} {...fileInputProps} />
        <input ref={cameraRef} {...fileInputProps} capture="environment" />

        {image ? (
          <div>
            <div className="relative overflow-hidden rounded-xl bg-surface-2">
              {/* A local data URL preview — next/image adds nothing here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={labels.previewAlt} className="mx-auto max-h-[26rem] w-full object-contain" />
              {phase === 'scanning' && (
                <div className="absolute inset-0 grid place-items-center bg-canvas/80">
                  <p className="flex items-center gap-3 font-medium text-fg">
                    <span aria-hidden className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    {labels.scanning}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {phase !== 'done' && (
                <button type="button" onClick={scan} disabled={busy} className={`${primary} flex-1`}>
                  🔍 {phase === 'scanning' ? labels.scanning : labels.scan}
                </button>
              )}
              <button type="button" onClick={choose} disabled={busy} className={`${phase === 'done' ? primary : secondary} flex-1`}>
                {phase === 'done' ? labels.scanAgain : labels.change}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
            <span aria-hidden className="grid size-16 place-items-center rounded-full bg-brand-soft text-3xl">
              📷
            </span>
            <p className="font-semibold text-fg">{dragging ? labels.dropActive : labels.dropTitle}</p>
            <p className="text-sm text-fg-muted">{labels.or}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" onClick={() => cameraRef.current?.click()} disabled={busy} className={`${primary} sm:hidden`}>
                📸 {labels.takePhoto}
              </button>
              <button type="button" onClick={choose} disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 font-medium text-fg hover:border-brand hover:text-brand disabled:opacity-50 sm:border-brand sm:bg-brand sm:text-on-brand sm:hover:text-on-brand sm:hover:opacity-90">
                🖼️ {labels.choosePhoto}
              </button>
            </div>
            <p className="text-xs text-fg-muted">{phase === 'preparing' ? labels.preparing : labels.fileHint}</p>
          </div>
        )}

        <div className="mt-5 rounded-xl bg-surface-2 p-4 text-sm">
          <h2 className="font-medium text-fg">{labels.tipsTitle}</h2>
          <ul className="mt-2 space-y-1 text-fg-muted">
            {labels.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span aria-hidden>•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Result */}
      <div className="grid gap-4">
        <section aria-live="polite" className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          {error && (
            <p role="alert" className="mb-4 flex gap-3 rounded-xl bg-danger-soft p-4 text-sm font-medium text-danger">
              <span aria-hidden>⚠️</span>
              {error}
            </p>
          )}
          {result ? <ResultView result={result} locale={locale} labels={labels} headingRef={resultHeadingRef} /> : <EmptyResult labels={labels} />}
        </section>
        {notice}
      </div>
    </div>
  );
}

function EmptyResult({ labels }: { labels: Labels }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
      <span aria-hidden className="text-4xl">
        🔬
      </span>
      <h2 className="font-semibold text-fg">{labels.emptyTitle}</h2>
      <p className="text-sm text-fg-muted">{labels.emptyBody}</p>
    </div>
  );
}

function ResultView({
  result,
  locale,
  labels,
  headingRef,
}: {
  result: Diagnosis;
  locale: Locale;
  labels: Labels;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  if (!result.detected) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
        <span aria-hidden className="text-4xl">
          🍃
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-fg outline-none">
          {labels.noDisease}
        </h2>
        <p className="max-w-md text-fg-muted">{locale === 'bn' ? result.message_bn : result.message_en}</p>
      </div>
    );
  }

  const bn = locale === 'bn';
  const crop = bn ? result.crop_bn : result.crop_en;
  const disease = bn ? result.disease_bn : result.disease_en;
  const description = bn ? result.description_bn : result.description_en;
  const treatment = bn ? result.treatment_bn : result.treatment_en;
  const percent = Math.round(result.confidence * 100);

  return (
    <div>
      <p className="text-sm font-medium text-brand">{labels.resultTitle}</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold text-fg outline-none">
        {disease}
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-surface-2 px-3 py-2">
          <dt className="text-fg-muted">{labels.crop}</dt>
          <dd className="font-medium text-fg">{crop}</dd>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2">
          <dt className="text-fg-muted">{labels.confidence}</dt>
          <dd className="font-medium tabular-nums text-fg">{formatNumber(locale, percent)}%</dd>
        </div>
      </dl>
      <div aria-hidden className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-fg-muted">{labels.confidenceNote}</p>

      {description && (
        <>
          <h3 className="mt-5 font-semibold text-fg">{labels.description}</h3>
          <p className="mt-1 leading-relaxed text-fg-muted">{description}</p>
        </>
      )}

      {treatment.length > 0 && (
        <>
          <h3 className="mt-5 font-semibold text-fg">{labels.treatment}</h3>
          <ol className="mt-2 space-y-2">
            {treatment.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-surface-2 p-3 text-sm text-fg">
                <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-on-brand">
                  {formatNumber(locale, i + 1)}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
