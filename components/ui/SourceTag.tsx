import { formatTime } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

type SourceTagProps = {
  locale: Locale;
  labels: { label: string; updated: string; curated: string };
  source: string;
  url?: string;
  /** ISO time the upstream was fetched; omit for curated/editorial content. */
  fetchedAt?: string;
};

/** "Source: Open-Meteo · Updated 17:05" — every number on the page says where it came from. */
export function SourceTag({ locale, labels, source, url, fetchedAt }: SourceTagProps) {
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
      {fetchedAt ? (
        <>
          {' · '}
          {labels.updated} <time dateTime={fetchedAt}>{formatTime(locale, fetchedAt)}</time>
        </>
      ) : (
        <> · {labels.curated}</>
      )}
    </p>
  );
}
