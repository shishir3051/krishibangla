import { formatDateTime } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

type SourceTagProps = {
  locale: Locale;
  labels: { label: string; updated: string; curated: string };
  source: string;
  url?: string;
  /** ISO time the upstream was fetched — shown with its date, since cached data can be days old. */
  fetchedAt?: string;
  /** Short qualifier, e.g. "yearly data" or "monthly data to Sep 2026". */
  note?: string;
  /** Editorial content written by the KrishiBangla team. */
  curated?: boolean;
};

/** "Source: Open-Meteo · Updated 1 Nov, 17:05" — every number on the page says where it came from. */
export function SourceTag({ locale, labels, source, url, fetchedAt, note, curated }: SourceTagProps) {
  return (
    <p className="text-xs text-fg-muted">
      {labels.label}:{' '}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-fg">
          {source}
        </a>
      ) : (
        source
      )}
      {fetchedAt && (
        <>
          {' · '}
          {labels.updated} <time dateTime={fetchedAt}>{formatDateTime(locale, fetchedAt)}</time>
        </>
      )}
      {note && <> · {note}</>}
      {curated && <> · {labels.curated}</>}
    </p>
  );
}
