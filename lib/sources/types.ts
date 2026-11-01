/** Every data adapter returns its data together with where and when it came from. */
export type SourceMeta = {
  source: string; // e.g. "Open-Meteo"
  url: string; // human-facing page about the source
  fetchedAt: string; // ISO time the upstream was last fetched
};

export type SourceResult<T> = { ok: true; data: T; meta: SourceMeta } | { ok: false; error: string; meta: SourceMeta };
