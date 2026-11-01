'use client';
import { useState, type ReactNode, type SyntheticEvent } from 'react';

type MapExplorerProps = {
  /** Shown when no district is pointed at, e.g. "Point at a district to see its name". */
  idle: string;
  /** Shown after the district name, e.g. "click to open →". */
  open: string;
  /** A server-rendered <DistrictMap>; its district links carry data-district-name. */
  children: ReactNode;
};

/**
 * Wraps the map and shows, underneath it, the district under the pointer or keyboard focus — so it is clear
 * the map is clickable and what a click will open. Visual only: each district link has its own accessible name.
 */
export function MapExplorer({ idle, open, children }: MapExplorerProps) {
  const [name, setName] = useState<string | null>(null);
  const track = (event: SyntheticEvent) => setName((event.target as Element).closest('[data-district-name]')?.getAttribute('data-district-name') ?? null);
  const clear = () => setName(null);

  return (
    <div>
      {/* pointermove, not pointerover: it also catches a pointer that comes back onto the district it left. */}
      <div onPointerMove={track} onPointerLeave={clear} onFocus={track} onBlur={clear}>
        {children}
      </div>
      <p aria-hidden className="mt-3 flex h-6 items-center justify-center gap-2 text-sm">
        {name ? (
          <>
            <span className="font-semibold text-brand">📍 {name}</span>
            <span className="text-fg-muted">· {open}</span>
          </>
        ) : (
          <span className="text-fg-muted">{idle}</span>
        )}
      </p>
    </div>
  );
}
