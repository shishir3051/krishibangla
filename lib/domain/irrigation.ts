/**
 * irrigation.ts — Short-term irrigation guidance from the forecast water balance.
 *
 * Rule (simple and shown to users, not a crop model):
 *   demand  = reference evapotranspiration (ET0, FAO-56) over the next 3 days
 *   supply  = effective rain: 80% of each day's rain above 2 mm (light showers mostly evaporate)
 *   deficit = demand − supply → none / low / medium / high
 * Topsoil moisture (3–9 cm) nudges the level one step: wet soil lowers it, dry soil raises it.
 * Meant for upland crops and vegetables; flooded rice follows its own water-level (AWD) rule.
 */
import type { DailyForecast } from './weather';

export type IrrigationLevel = 'none' | 'low' | 'medium' | 'high';
export type SoilState = 'dry' | 'moist' | 'wet';

export type IrrigationAdvice = {
  level: IrrigationLevel;
  days: number;
  demand: number; // mm
  rain: number; // mm forecast
  effectiveRain: number; // mm
  deficit: number; // mm (negative = rain exceeds demand)
  soilMoisture: number | null; // m³/m³
  soilState: SoilState | null;
};

export const WINDOW_DAYS = 3;
const LEVELS: IrrigationLevel[] = ['none', 'low', 'medium', 'high'];
// Deficit (mm over 3 days) at or below each bound maps to none / low / medium; above → high.
const DEFICIT_BOUNDS = [0, 4, 9];
// Approximate volumetric thresholds for loam-to-clay soils common in Bangladesh.
const DRY_BELOW = 0.15;
const WET_ABOVE = 0.35;

export const effectiveRain = (mm: number) => Math.max(0, mm - 2) * 0.8;

export function soilState(moisture: number | null): SoilState | null {
  if (moisture == null) return null;
  if (moisture < DRY_BELOW) return 'dry';
  if (moisture > WET_ABOVE) return 'wet';
  return 'moist';
}

const round1 = (v: number) => Math.round(v * 10) / 10;

export function irrigationAdvice(daily: DailyForecast[], soilMoisture: number | null): IrrigationAdvice {
  const window = daily.slice(0, WINDOW_DAYS);
  const demand = window.reduce((sum, d) => sum + d.et0, 0);
  const rain = window.reduce((sum, d) => sum + d.rain, 0);
  const effective = window.reduce((sum, d) => sum + effectiveRain(d.rain), 0);
  const deficit = demand - effective;
  const state = soilState(soilMoisture);

  let index = DEFICIT_BOUNDS.findIndex((bound) => deficit <= bound);
  if (index === -1) index = LEVELS.length - 1;
  if (state === 'wet') index = Math.max(0, index - 1);
  // Dry topsoil raises the level only when crops actually lack water; rain that covers demand still wins.
  if (state === 'dry' && index > 0) index = Math.min(LEVELS.length - 1, index + 1);

  return {
    level: LEVELS[index],
    days: window.length,
    demand: round1(demand),
    rain: round1(rain),
    effectiveRain: round1(effective),
    deficit: round1(deficit),
    soilMoisture,
    soilState: state,
  };
}
