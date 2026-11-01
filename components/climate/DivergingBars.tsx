/**
 * DivergingBars — small server-rendered SVG column chart around a zero line, for monthly
 * anomalies. Bars above the line use `upClass`, below use `downClass`; values beyond ±`max`
 * are drawn to the edge. Each month has a native tooltip (<title>) with the exact numbers, and
 * the same numbers are in the table on the page.
 */

const W = 240;
const H = 64;
const MID = H / 2;
const BAR = 14; // ≤ 24px columns, the rest of each slot is air
const RADIUS = 3; // rounded data end, square at the baseline

export type Bar = { value: number | null; title: string };

type Props = {
  bars: Bar[];
  /** Value drawn at full half-height. Shared across small multiples so they compare. */
  max: number;
  upClass: string;
  downClass: string;
  label: string;
};

/** Column from the baseline to `end`, rounded only at the data end. */
function columnPath(x: number, end: number): string {
  const up = end < MID;
  const h = Math.abs(MID - end);
  const r = Math.min(RADIUS, h, BAR / 2);
  const tip = up ? end + r : end - r;
  return [
    `M${x},${MID}`,
    `V${tip}`,
    `Q${x},${end} ${x + r},${end}`,
    `H${x + BAR - r}`,
    `Q${x + BAR},${end} ${x + BAR},${tip}`,
    `V${MID}`,
    'Z',
  ].join(' ');
}

export function DivergingBars({ bars, max, upClass, downClass, label }: Props) {
  const slot = W / bars.length;
  const half = MID - 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full">
      <line x1={0} x2={W} y1={MID} y2={MID} className="stroke-fg-muted" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {bars.map((bar, i) => {
        const x = i * slot + (slot - BAR) / 2;
        const h = bar.value == null ? 0 : (Math.min(Math.abs(bar.value), max) / max) * half;
        return (
          <g key={i}>
            {h >= 0.5 && <path d={columnPath(x, bar.value! > 0 ? MID - h : MID + h)} className={bar.value! > 0 ? upClass : downClass} />}
            {bar.value == null && <circle cx={x + BAR / 2} cy={MID} r={1.5} className="fill-fg-muted" />}
            <rect x={i * slot} y={0} width={slot} height={H} fill="transparent">
              <title>{bar.title}</title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
}
