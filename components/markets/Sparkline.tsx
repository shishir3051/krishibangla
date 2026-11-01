import { MAX_GAP_MONTHS, monthsBetween } from '@/lib/domain/prices';

type Props = {
  points: { month: string; price: number }[];
  /** First month of the shared time axis, and its length in months. */
  start: string;
  months: number;
  /** Accessible summary, e.g. "Rice: ৳51 in Oct 2024, ৳49 in Jul 2026". */
  label: string;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Price trend on a calendar-month axis. Months without a national figure leave a gap
 * (the line breaks when consecutive points are more than MAX_GAP_MONTHS apart).
 */
export function Sparkline({ points, start, months, label, width = 96, height = 28, className = '' }: Props) {
  if (points.length === 0) return null;

  const pad = 3;
  const values = points.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (month: string) => pad + (monthsBetween(start, month) / Math.max(months - 1, 1)) * (width - 2 * pad);
  const y = (price: number) => (max === min ? height / 2 : pad + (1 - (price - min) / (max - min)) * (height - 2 * pad));

  // Split into runs of nearby months; single-point runs are drawn as dots.
  const runs: (typeof points)[] = [];
  points.forEach((p, i) => {
    if (i === 0 || monthsBetween(points[i - 1].month, p.month) > MAX_GAP_MONTHS) runs.push([p]);
    else runs.at(-1)!.push(p);
  });
  const last = points.at(-1)!;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={className}>
      {runs.map((run) =>
        run.length === 1 ? (
          <circle key={run[0].month} cx={x(run[0].month)} cy={y(run[0].price)} r={1.5} fill="currentColor" />
        ) : (
          <path
            key={run[0].month}
            d={run.map((p, i) => `${i ? 'L' : 'M'}${x(p.month).toFixed(1)},${y(p.price).toFixed(1)}`).join('')}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      )}
      <circle cx={x(last.month)} cy={y(last.price)} r={2.75} fill="currentColor" />
    </svg>
  );
}
