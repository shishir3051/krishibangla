/**
 * geo.ts — Nearest-district lookup for "Use my location". Pure; safe for client components.
 */
import { DISTRICTS, type District } from './districts';

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Closest district centre to a point, or null when the point is clearly outside Bangladesh
 * (more than `maxKm` from every district centre).
 */
export function nearestDistrict(lat: number, lon: number, maxKm = 150): District | null {
  let best: District | null = null;
  let bestKm = Infinity;
  for (const d of DISTRICTS) {
    const km = distanceKm({ lat, lon }, d);
    if (km < bestKm) {
      best = d;
      bestKm = km;
    }
  }
  return bestKm <= maxKm ? best : null;
}
