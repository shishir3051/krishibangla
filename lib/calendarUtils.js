/**
 * calendarUtils.js — Shared helpers for parsing district crop calendar strings.
 * 
 * Calendar string format used throughout the project:
 *   "Planting: Nov-Dec; Harvest: Apr-May"
 *   "Pruning: Dec-Feb; Plucking: Mar-Nov"
 * 
 * Imported by: FarmerSuccessHub.js, DistrictReportModal.js
 */

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Parses a calendar string into an array of { action, time } phase objects.
 * Used by FarmerSuccessHub to render the timeline.
 *
 * @param {string} calendarStr - e.g. "Planting: Nov-Dec; Harvest: Apr-May"
 * @returns {{ action: string, time: string }[]}
 */
export function parseCalendarPhases(calendarStr) {
  if (!calendarStr) return [{ action: 'Planting', time: 'Nov-Dec' }, { action: 'Harvest', time: 'Apr-May' }];
  return calendarStr.split(';').map(part => {
    const [action, time] = part.split(':').map(s => s.trim());
    return { action: action || 'Phase', time: time || '—' };
  });
}

/**
 * Parses a calendar string to extract the harvest/plucking months as a Set.
 * Supports wrap-around ranges (e.g. "Dec-Feb" → Dec, Jan, Feb).
 * Used by DistrictReportModal to highlight the 12-month calendar grid.
 *
 * @param {string} calendarStr - e.g. "Planting: Nov-Dec; Harvest: Apr-May"
 * @returns {string[]} Array of month abbreviations that are harvest months, e.g. ['Apr', 'May']
 */
export function parseHarvestMonths(calendarStr) {
  if (!calendarStr) return [];

  const harvestSet = new Set();

  // Try to find a Harvest or Plucking segment; fall back to the whole string
  const harvestMatch = calendarStr.match(/(?:Harvest|Plucking)\s*:\s*([^;]+)/i);
  const targetStr = harvestMatch ? harvestMatch[1] : calendarStr;

  // Capitalise first letter of each word to match MONTH_ORDER entries
  const targetStrCamel = targetStr.replace(/\b\w/g, c => c.toUpperCase());
  const monthsFound = targetStrCamel.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g);

  if (monthsFound && monthsFound.length === 2 && targetStr.includes('-')) {
    const startIdx = MONTH_ORDER.indexOf(monthsFound[0]);
    const endIdx   = MONTH_ORDER.indexOf(monthsFound[1]);
    if (startIdx !== -1 && endIdx !== -1) {
      let curr = startIdx;
      while (true) {
        harvestSet.add(MONTH_ORDER[curr]);
        if (curr === endIdx) break;
        curr = (curr + 1) % 12; // wrap Dec → Jan
      }
    }
  } else if (monthsFound) {
    monthsFound.forEach(m => harvestSet.add(m));
  }

  return Array.from(harvestSet);
}

/** The canonical 12-month list used for calendar grid rendering. */
export const MONTHS = [
  { key: 'J', name: 'Jan' }, { key: 'F', name: 'Feb' }, { key: 'M', name: 'Mar' },
  { key: 'A', name: 'Apr' }, { key: 'M', name: 'May' }, { key: 'J', name: 'Jun' },
  { key: 'J', name: 'Jul' }, { key: 'A', name: 'Aug' }, { key: 'S', name: 'Sep' },
  { key: 'O', name: 'Oct' }, { key: 'N', name: 'Nov' }, { key: 'D', name: 'Dec' },
];
