/**
 * chartUtils.js — Shared SVG chart path generation helpers.
 *
 * Imported by: DataCharts.js, GenericCropGuide.js
 */

/**
 * Generates a linear SVG polyline path string from data points.
 * Suitable for area/line charts where data has { value } objects.
 *
 * @param {{ value: number }[]} data
 * @param {number} width  - SVG viewBox width
 * @param {number} height - SVG viewBox height
 * @returns {string} SVG path d attribute
 */
export function generateLinearPath(data, width, height) {
  if (!data || data.length < 2) return '';
  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const range = maxVal - minVal || 1;

  return data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minVal) / range) * height;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
}

/**
 * Generates a closed fill path from an existing line path (adds bottom corners).
 *
 * @param {string} linePath - Output of generateLinearPath
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function generateFillPath(linePath, width, height) {
  if (!linePath) return '';
  return `${linePath} L${width},${height} L0,${height} Z`;
}

/**
 * Generates a smooth cubic-bezier SVG path from an array of raw Y values.
 * The X positions are evenly spaced at 100px intervals.
 * Suitable for sparkline/trend charts with pre-scaled Y values.
 *
 * @param {number[]} yValues - Array of Y coordinates (already scaled to viewBox)
 * @returns {string} SVG path d attribute
 */
export function generateSmoothPath(yValues) {
  if (!yValues || yValues.length < 2) return '';
  let d = `M 0 ${yValues[0]}`;
  for (let i = 1; i < yValues.length; i++) {
    const prevX = (i - 1) * 100;
    const currX = i * 100;
    const prevY = yValues[i - 1];
    const currY = yValues[i];
    const midX = (prevX + currX) / 2;
    d += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
  }
  return d;
}

/**
 * Scales an array of raw values (e.g. [90, 70, 40]) into SVG Y coordinates
 * within a given viewport height range, inverted so higher = lower Y.
 *
 * @param {number[]} values
 * @param {number} viewportHeight - Total height of the SVG viewBox
 * @param {{ top?: number, bottom?: number }} padding - Dead zone top/bottom
 * @returns {number[]}
 */
export function scaleToViewport(values, viewportHeight = 100, { top = 10, bottom = 10 } = {}) {
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const usable = viewportHeight - top - bottom;
  return values.map(v => viewportHeight - bottom - (((v - minVal) / range) * usable));
}
