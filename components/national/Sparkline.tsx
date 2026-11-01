/**
 * Sparkline — tiny server-rendered SVG trend line for a stat tile. The line is in the de-emphasis
 * colour (text-fg-muted), the latest value is a brand-coloured dot, and every point has a native
 * tooltip (<title>) with its exact value.
 */
import type { YearValue } from '@/lib/domain/indicators';

const W = 160;
const H = 28;
const PAD = 4;

type Props = {
  points: YearValue[];
  /** Accessible summary of the whole line. */
  label: string;
  /** Tooltip text per point, same order as `points`. */
  pointLabels: string[];
  className?: string;
};

export function Sparkline({ points, label, pointLabels, className = '' }: Props) {
  if (points.length < 2) return null;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const x = (i: number) => PAD + (i / (points.length - 1)) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - ((v - min) / range) * (H - 2 * PAD);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
  const last = points.length - 1;
  const slot = (W - 2 * PAD) / (points.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className={`block h-auto w-full overflow-visible ${className}`}>
      <path d={d} fill="none" className="stroke-fg-muted" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={x(last)} cy={y(points[last].value)} r={3} className="fill-brand stroke-surface" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => (
        <rect key={p.year} x={x(i) - slot / 2} y={0} width={slot} height={H} fill="transparent">
          <title>{pointLabels[i]}</title>
        </rect>
      ))}
    </svg>
  );
}
