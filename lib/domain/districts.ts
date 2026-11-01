/**
 * districts.ts — Typed access to the 64-district registry (data/districts.json), the single
 * source for map shapes, weather coordinates, market district names and curated profiles.
 */
import registry from '@/data/districts.json';
import type { Bilingual, CropId, DivisionId, HazardId } from './vocab';

export type DistrictProfile = {
  crops: CropId[];
  hazards: HazardId[];
  soil: Bilingual | null;
  advisory?: Bilingual;
};

export type District = {
  slug: string;
  name: Bilingual;
  aliases: string[];
  division: DivisionId;
  lat: number;
  lon: number;
  /** Editorial profile migrated from the earlier site; null where none was ever written. */
  profile: DistrictProfile | null;
};

export const DISTRICTS = registry.districts as District[];

const bySlug = new Map(DISTRICTS.map((d) => [d.slug, d]));
const byName = new Map(
  DISTRICTS.flatMap((d) => [d.name.en, ...d.aliases].map((n) => [n.toLowerCase(), d] as const))
);

export function getDistrict(slug: string): District | undefined {
  return bySlug.get(slug);
}

/** Resolves a district name in any known spelling ("Chittagong", "Cox'S Bazar", "Bogra"…). */
export function findDistrictByName(name: string): District | undefined {
  return byName.get(name.trim().toLowerCase());
}
