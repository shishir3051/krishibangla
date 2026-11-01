/**
 * vocab.ts — Bilingual vocabularies for curated district profiles (data/districts.json).
 */

export type Bilingual = { en: string; bn: string };

export const CROPS = {
  rice: { en: 'Rice', bn: 'ধান', icon: '🌾' },
  'boro-rice': { en: 'Boro rice', bn: 'বোরো ধান', icon: '🌾' },
  'aromatic-rice': { en: 'Aromatic rice', bn: 'সুগন্ধি ধান', icon: '🌾' },
  vegetables: { en: 'Vegetables', bn: 'সবজি', icon: '🥬' },
  mustard: { en: 'Mustard', bn: 'সরিষা', icon: '🌼' },
  jackfruit: { en: 'Jackfruit', bn: 'কাঁঠাল', icon: '🍈' },
  pineapple: { en: 'Pineapple', bn: 'আনারস', icon: '🍍' },
  banana: { en: 'Banana', bn: 'কলা', icon: '🍌' },
  potato: { en: 'Potato', bn: 'আলু', icon: '🥔' },
  fish: { en: 'Fish', bn: 'মাছ', icon: '🐟' },
  tobacco: { en: 'Tobacco', bn: 'তামাক', icon: '🌿' },
  jute: { en: 'Jute', bn: 'পাট', icon: '🪢' },
  mango: { en: 'Mango', bn: 'আম', icon: '🥭' },
  silk: { en: 'Silk', bn: 'রেশম', icon: '🧵' },
  litchi: { en: 'Litchi', bn: 'লিচু', icon: '🍒' },
  sugarcane: { en: 'Sugarcane', bn: 'আখ', icon: '🎋' },
  spices: { en: 'Spices', bn: 'মসলা', icon: '🌶️' },
  dairy: { en: 'Dairy', bn: 'দুগ্ধ', icon: '🥛' },
  ginger: { en: 'Ginger', bn: 'আদা', icon: '🫚' },
  tea: { en: 'Tea', bn: 'চা', icon: '🍵' },
  maize: { en: 'Maize', bn: 'ভুট্টা', icon: '🌽' },
  orange: { en: 'Orange', bn: 'কমলা', icon: '🍊' },
  watermelon: { en: 'Watermelon', bn: 'তরমুজ', icon: '🍉' },
  salt: { en: 'Salt', bn: 'লবণ', icon: '🧂' },
  'betel-leaf': { en: 'Betel leaf', bn: 'পান', icon: '🍃' },
  'dry-fish': { en: 'Dried fish', bn: 'শুঁটকি', icon: '🐟' },
  coconut: { en: 'Coconut', bn: 'নারকেল', icon: '🥥' },
  soybean: { en: 'Soybean', bn: 'সয়াবিন', icon: '🫘' },
  'betel-nut': { en: 'Betel nut', bn: 'সুপারি', icon: '🌰' },
  hilsa: { en: 'Hilsa', bn: 'ইলিশ', icon: '🐟' },
  turmeric: { en: 'Turmeric', bn: 'হলুদ', icon: '🟡' },
  cashew: { en: 'Cashew', bn: 'কাজুবাদাম', icon: '🥜' },
  coffee: { en: 'Coffee', bn: 'কফি', icon: '☕' },
  shrimp: { en: 'Shrimp', bn: 'চিংড়ি', icon: '🦐' },
  honey: { en: 'Honey', bn: 'মধু', icon: '🍯' },
  flowers: { en: 'Flowers', bn: 'ফুল', icon: '🌸' },
  guava: { en: 'Guava', bn: 'পেয়ারা', icon: '🍐' },
  'buffalo-milk': { en: 'Buffalo milk', bn: 'মহিষের দুধ', icon: '🥛' },
  'hog-plum': { en: 'Hog plum', bn: 'আমড়া', icon: '🫒' },
  duck: { en: 'Duck', bn: 'হাঁস', icon: '🦆' },
} as const satisfies Record<string, Bilingual & { icon: string }>;

export const HAZARDS = {
  flood: { en: 'Flood', bn: 'বন্যা' },
  'flash-flood': { en: 'Flash flood', bn: 'আকস্মিক বন্যা' },
  'river-erosion': { en: 'River erosion', bn: 'নদীভাঙন' },
  drought: { en: 'Drought', bn: 'খরা' },
  'water-scarcity': { en: 'Water scarcity', bn: 'পানির সংকট' },
  'cold-wave': { en: 'Cold wave', bn: 'শৈত্যপ্রবাহ' },
  monga: { en: 'Seasonal food insecurity (monga)', bn: 'মঙ্গা' },
  cyclone: { en: 'Cyclone', bn: 'ঘূর্ণিঝড়' },
  salinity: { en: 'Salinity', bn: 'লবণাক্ততা' },
  'coastal-flood': { en: 'Coastal flooding', bn: 'উপকূলীয় জলোচ্ছ্বাস' },
  landslide: { en: 'Landslide', bn: 'ভূমিধস' },
  waterlogging: { en: 'Waterlogging', bn: 'জলাবদ্ধতা' },
  'industrial-pollution': { en: 'Industrial pollution', bn: 'শিল্প দূষণ' },
} as const satisfies Record<string, Bilingual>;

export const DIVISIONS = {
  dhaka: { en: 'Dhaka', bn: 'ঢাকা' },
  chattogram: { en: 'Chattogram', bn: 'চট্টগ্রাম' },
  rajshahi: { en: 'Rajshahi', bn: 'রাজশাহী' },
  khulna: { en: 'Khulna', bn: 'খুলনা' },
  barishal: { en: 'Barishal', bn: 'বরিশাল' },
  sylhet: { en: 'Sylhet', bn: 'সিলেট' },
  rangpur: { en: 'Rangpur', bn: 'রংপুর' },
  mymensingh: { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
} as const satisfies Record<string, Bilingual>;

export type CropId = keyof typeof CROPS;
export type HazardId = keyof typeof HAZARDS;
export type DivisionId = keyof typeof DIVISIONS;
