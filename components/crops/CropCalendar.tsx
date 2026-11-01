import type { MonthRange } from '@/lib/domain/crops';

export type CalendarRow = { label: string; /** The months in words — the bar below is decorative. */ when: string; range: MonthRange };

const inRange = (month: number, [start, end]: MonthRange) => (start <= end ? month >= start && month <= end : month >= start || month <= end);

/** Twelve-month strip per row (season or stage). The month range is also written out, so the bars are aria-hidden. */
export function CropCalendar({ rows, monthInitials, note }: { rows: CalendarRow[]; monthInitials: string[]; note?: string }) {
  return (
    <div>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-1.5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:items-center sm:gap-4">
            <p className="text-sm">
              <span className="font-medium text-fg">{row.label}</span> <span className="text-fg-muted">· {row.when}</span>
            </p>
            <div aria-hidden className="grid grid-cols-12 gap-0.5">
              {monthInitials.map((initial, i) => (
                <span
                  key={i}
                  className={`grid h-7 place-items-center rounded text-[11px] ${
                    inRange(i + 1, row.range) ? 'bg-brand font-semibold text-on-brand' : 'bg-surface-2 text-fg-muted'
                  }`}
                >
                  {initial}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-xs text-fg-muted">{note}</p>}
    </div>
  );
}
