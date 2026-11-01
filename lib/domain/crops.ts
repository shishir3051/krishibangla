/**
 * crops.ts — Crop pages registry. Content lives in data/crops.json (every text field in English and Bangla).
 *
 * CONTRACT (used by the home page grid): keep `CROP_PAGES` with at least these fields.
 * Guide content (stages, seasons, steps, notes) is general practice, not measured data — the crop
 * pages label it as such. Do not add statistics here without a cited source.
 */
import content from '@/data/crops.json';
import type { Bilingual } from './vocab';

export type CropPage = {
  id: string;
  name: Bilingual;
  icon: string;
  summary: Bilingual;
  /** WFP commodity name for price data, when WFP tracks it. */
  wfpCommodity?: string;
};

/** Calendar months, 1 = January. A range may wrap the year end: [12, 5] = December–May. */
export type MonthRange = [start: number, end: number];

export type CropStage = {
  icon: string;
  name: Bilingual;
  /** When it happens, in words ("About 30 days after planting", "March–April"). */
  timing: Bilingual;
  action: Bilingual;
  /** Set when the stage falls in fixed months, so it can be drawn on the calendar. */
  range?: MonthRange;
};

export type RiceSeason = {
  id: string;
  name: Bilingual;
  type: Bilingual;
  months: Bilingual;
  range: MonthRange;
  description: Bilingual;
};

export type GuideStep = { title: Bilingual; text: Bilingual };
export type GuideNote = { title: Bilingual; points: Bilingual[] };

export type CropContent = CropPage & {
  /** Which office farmers should confirm advice with. */
  adviceOffice: 'agriculture' | 'fisheries';
  description: Bilingual;
  lifecycleTitle?: Bilingual;
  lifecycle: CropStage[];
  seasons?: RiceSeason[];
  steps?: GuideStep[];
  notes?: GuideNote[];
};

export const CROPS_CONTENT = content.crops as CropContent[];

export const CROP_PAGES: CropPage[] = CROPS_CONTENT.map(({ id, name, icon, summary, wfpCommodity }) => ({ id, name, icon, summary, wfpCommodity }));

export const getCropPage = (id: string) => CROP_PAGES.find((c) => c.id === id);

/** Full guide content for a crop page; undefined for unknown ids. */
export const getCrop = (id: string) => CROPS_CONTENT.find((c) => c.id === id);
