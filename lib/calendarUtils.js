/**
 * calendarUtils.js — Helper for parsing district crop calendar strings.
 *
 * Calendar string format used throughout the project:
 *   "Planting: Nov-Dec; Harvest: Apr-May"
 *   "Pruning: Dec-Feb; Plucking: Mar-Nov"
 *
 * Imported by: FarmerSuccessHub.js
 */

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
