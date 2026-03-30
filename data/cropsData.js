/**
 * cropsData.js — Single source of truth for crop data.
 * Imported by: CropExplorer.js, GenericCropGuide.js
 */

export const cropsData = {
  rice: {
    id: "rice",
    en: "Rice", bn: "ধান",
    icon: "🌾",
    color: "emerald",
    cardColor: "from-emerald-500/20 to-emerald-900/40",
    cardBorder: "hover:border-emerald-500/50",
    production: "38.1M MT",
    desc_en: "The staple of 170M+ people, driving 13% of GDP.",
    desc_bn: "১৭ কোটির বেশি মানুষের প্রধান খাদ্য, জিডিপির ১৩%।",
    // Guide-level detail
    subtitle: "Bangladesh's Agricultural Backbone",
    subtitle_bn: "বাংলাদেশের কৃষির মেরুদণ্ড",
    desc: "Bangladesh has tripled rice output since 1971 through BRRI high-yield varieties. Boro, Aman, and Aus seasons provide year-round production security.",
    desc_bn_long: "বিআরআরআই-র উচ্চফলনশীল জাতের মাধ্যমে ১৯৭১ সালের তুলনায় ধান উৎপাদন তিনগুণ বেড়েছে। বোরো, আমন ও আউশ মৌসুমে সারাবছর উৎপাদন নিশ্চিত হয়।",
    stats: [
      { label: "Annual Output", bn: "বার্ষিক উৎপাদন", value: "38.1M MT", trend: "+3.2% YoY" },
      { label: "Top Region", bn: "শীর্ষ অঞ্চল", value: "Boro Belt", trend: "Nationwide" },
      { label: "Global Rank", bn: "বৈশ্বিক অবস্থান", value: "3rd", trend: "Top 5" }
    ],
    lifecycle: [
      { phase: "Nursery", phase_bn: "বীজতলা", duration: "25-30 Days", action: "Seedbed prep with BRRI certified seeds", icon: "🌱" },
      { phase: "Transplanting", phase_bn: "চারা রোপণ", duration: "30-35 Days", action: "Line transplanting, 2-3 seedlings per hill", icon: "🌿" },
      { phase: "Tillering", phase_bn: "কুশি পর্যায়", duration: "40-50 Days", action: "Urea top-dressing, weed control", icon: "🌾" },
      { phase: "Harvest", phase_bn: "ফসল তোলা", duration: "90-120 Days", action: "Combine harvesting at 80% grain maturity", icon: "🚜" }
    ],
    marketData: { trend: [80, 75, 82, 70, 60], vol: "200K", demand: "Stable", demand_bn: "স্থিতিশীল" }
  },

  fisheries: {
    id: "fisheries",
    en: "Fisheries", bn: "মৎস্য",
    icon: "🐟",
    color: "blue",
    cardColor: "from-blue-500/20 to-blue-900/40",
    cardBorder: "hover:border-blue-500/50",
    production: "4.7M MT",
    desc_en: "World's 3rd largest inland fisheries producer.",
    desc_bn: "অভ্যন্তরীণ মৎস্য উৎপাদনে বিশ্বের ৩য় বৃহত্তম।",
    subtitle: "Protein Security & Livelihoods",
    subtitle_bn: "প্রোটিন নিরাপত্তা ও জীবিকা",
    desc: "Bangladesh is a global leader in inland capture fisheries and aquaculture. Hilsa, catfish, and prawn dominate both domestic consumption and export.",
    desc_bn_long: "বাংলাদেশ অভ্যন্তরীণ মৎস্য ধরা ও মৎস্য চাষে বিশ্বনেতা। ইলিশ, কই, পাঙ্গাশ এবং চিংড়ি দেশীয় ভোগ ও রপ্তানি উভয়ে শীর্ষে।",
    stats: [
      { label: "Annual Output", bn: "বার্ষিক উৎপাদন", value: "4.7M MT", trend: "+6.1% YoY" },
      { label: "Top Species", bn: "প্রধান প্রজাতি", value: "Hilsa", trend: "National Fish" },
      { label: "Global Rank", bn: "বৈশ্বিক অবস্থান", value: "3rd", trend: "Inland" }
    ],
    lifecycle: [
      { phase: "Pond Prep", phase_bn: "পুকুর প্রস্তুতি", duration: "15 Days", action: "Lime treatment, net installation", icon: "💧" },
      { phase: "Stocking", phase_bn: "পোনা ছাড়া", duration: "Season Start", action: "Certified fingerlings at optimal density", icon: "🐟" },
      { phase: "Management", phase_bn: "পরিচর্যা", duration: "3-6 Months", action: "Feed management, water quality monitoring", icon: "⚗️" },
      { phase: "Harvest", phase_bn: "আহরণ", duration: "Ongoing", action: "Net harvest, grading for market", icon: "🧺" }
    ],
    marketData: { trend: [65, 70, 75, 80, 85], vol: "90K", demand: "Rising", demand_bn: "ঊর্ধ্বমুখী" }
  },

  potato: {
    id: "potato",
    en: "Potato", bn: "আলু",
    icon: "🥔",
    color: "amber",
    cardColor: "from-amber-500/20 to-amber-900/40",
    cardBorder: "hover:border-amber-500/50",
    production: "10.4M MT",
    desc_en: "7th largest producer globally, key export item.",
    desc_bn: "বিশ্বের ৭ম বৃহত্তম উৎপাদনকারী, প্রধান রপ্তানি পণ্য।",
    subtitle: "Major Staple & Export Heavyweight",
    subtitle_bn: "প্রধান বিকল্প খাদ্য ও রপ্তানি পণ্য",
    desc: "Yielding over 10M metric tons annually, potato is a crucial crop for Bangladesh. Expanding cold storage networks and disease-resistant seeds (like BARI Alu varieties) are stabilizing prices and driving exports to Asian markets.",
    desc_bn_long: "বার্ষিক ১ কোটি মেট্রিক টনের বেশি ফলন নিয়ে আলু বাংলাদেশের একটি গুরুত্বপূর্ণ ফসল। কোল্ড স্টোরেজ বৃদ্ধি এবং রোগ-প্রতিরোধী জাতের কারণে দাম স্থিতিশীল হচ্ছে এবং রপ্তানি বাড়ছে।",
    stats: [
      { label: "Annual Output", bn: "বার্ষিক উৎপাদন", value: "10.4M MT", trend: "+1.2% YoY" },
      { label: "Top Region", bn: "শীর্ষ অঞ্চল", value: "Munshiganj", trend: "Central Hub" },
      { label: "Global Rank", bn: "বৈশ্বিক অবস্থান", value: "7th", trend: "Top 10" }
    ],
    lifecycle: [
      { phase: "Planting", phase_bn: "বপন", duration: "Mid-Nov", action: "Use certified whole tubers", icon: "🥔" },
      { phase: "Earthing Up", phase_bn: "মাটি তোলা", duration: "30 Days", action: "Top dressing urea & potash", icon: "⛏️" },
      { phase: "Bulking", phase_bn: "আকার বৃদ্ধি", duration: "45-60 Days", action: "Prevent late blight with fungicides", icon: "🛡️" },
      { phase: "Harvest", phase_bn: "ফসল তোলা", duration: "85-100 Days", action: "Curing before cold storage", icon: "📦" }
    ],
    marketData: { trend: [40, 50, 45, 30, 20], vol: "120K", demand: "Stabilizing", demand_bn: "স্থিতিশীল" }
  },

  tomato: {
    id: "tomato",
    en: "Tomato", bn: "টমেটো",
    icon: "🍅",
    color: "red",
    cardColor: "from-red-500/20 to-red-900/40",
    cardBorder: "hover:border-red-500/50",
    production: "0.41M MT",
    desc_en: "High-value winter crop shifting to year-round yield.",
    desc_bn: "উচ্চমূল্যের শীতকালীন ফসল যা এখন সারাবছর উৎপাদিত হচ্ছে।",
    subtitle: "High-Value Year-Round Yield",
    subtitle_bn: "উচ্চমূল্যের বছরব্যাপী ফলন",
    desc: "Bangladesh's tomato production has shifted from purely winter-based to year-round due to high-temperature tolerant varieties introduced by BARI. It presents massive economic opportunities despite high post-harvest losses.",
    desc_bn_long: "বারি-উদ্ভাবিত উচ্চ তাপমাত্রা সহনশীল জাতের কারণে বাংলাদেশের টমেটো এখন বছরব্যাপী চাষ হচ্ছে। ফসল তোলার পর সংরক্ষণজনিত ক্ষতি থাকলেও এর অর্থনৈতিক সম্ভাবনা প্রচুর।",
    stats: [
      { label: "Annual Output", bn: "বার্ষিক উৎপাদন", value: "410,000 MT", trend: "+5% YoY" },
      { label: "Top Region", bn: "শীর্ষ অঞ্চল", value: "Rajshahi", trend: "Market Hub" },
      { label: "Avg. Price", bn: "গড় বাজারদর", value: "৳45/kg", trend: "Volatile" }
    ],
    lifecycle: [
      { phase: "Nursery", phase_bn: "বীজতলা", duration: "25-30 Days", action: "Seedbed prep, Net house cover", icon: "🌱" },
      { phase: "Vegetative", phase_bn: "বাড়ন্ত পর্যায়", duration: "30-40 Days", action: "Staking, Weeding, NPK application", icon: "🌿" },
      { phase: "Flowering", phase_bn: "ফুল ও ফল", duration: "45-60 Days", action: "Micro-nutrient spray", icon: "🌼" },
      { phase: "Harvest", phase_bn: "ফসল তোলা", duration: "70-90+ Days", action: "Plucking at turning stage", icon: "🍅" }
    ],
    marketData: { trend: [90, 70, 80, 50, 20], vol: "15K", demand: "High", demand_bn: "উচ্চ" }
  },

  jute: {
    id: "jute",
    en: "Jute", bn: "পাট",
    icon: "🪢",
    color: "emerald",
    cardColor: "from-yellow-500/20 to-yellow-900/40",
    cardBorder: "hover:border-yellow-500/50",
    production: "1.3M MT",
    desc_en: "The Golden Fiber, top global exporter ($1.1B/yr).",
    desc_bn: "সোনালী আঁশ, বিশ্বের শীর্ষ রপ্তানিকারক ($১.১ বিলিয়ন/বছর)।",
    subtitle: "World's Top Jute Exporter",
    subtitle_bn: "বিশ্বের শীর্ষ পাট রপ্তানিকারক",
    desc: "Jute is intrinsically linked to Bangladesh's heritage. The shift away from synthetic fibers globally has revitalized demand for our eco-friendly raw jute and jute goods.",
    desc_bn_long: "পাট বাংলাদেশের ঐতিহ্যের সাথে মিশে আছে। বিশ্বজুড়ে প্লাস্টিকের বিকল্প হিসেবে পরিবেশবান্ধব পাট ও পাটজাত পণ্যের চাহিদা আবার বাড়ছে।",
    stats: [
      { label: "Export Value", bn: "রপ্তানি আয়", value: "$1.1B", trend: "Stable" },
      { label: "Top Region", bn: "শীর্ষ অঞ্চল", value: "Faridpur", trend: "Core" },
      { label: "Global Status", bn: "বৈশ্বিক অবস্থান", value: "Leader", trend: "#1 Exporter" }
    ],
    lifecycle: [
      { phase: "Sowing", phase_bn: "বপন", duration: "Mar-Apr", action: "Line sowing for better yield", icon: "🌱" },
      { phase: "Weeding", phase_bn: "আগাছা দমন", duration: "20-40 Days", action: "Crucial for fiber quality", icon: "🌿" },
      { phase: "Harvest", phase_bn: "ফসল কাটা", duration: "100-120 Days", action: "Cut at 50% flowering stage", icon: "✂️" },
      { phase: "Retting", phase_bn: "জাগ দেওয়া", duration: "15-20 Days", action: "Clean flowing water is best", icon: "💧" }
    ],
    marketData: { trend: [60, 70, 50, 60, 40], vol: "8K", demand: "Rising", demand_bn: "ঊর্ধ্বমুখী" }
  },

  mango: {
    id: "mango",
    en: "Mango", bn: "আম",
    icon: "🥭",
    color: "orange",
    cardColor: "from-orange-500/20 to-orange-900/40",
    cardBorder: "hover:border-orange-500/50",
    production: "1.2M MT",
    desc_en: "Strategic horticultural export from Rajshahi/Chapainawabganj.",
    desc_bn: "রাজশাহী/চাঁপাইনবাবগঞ্জের কৌশলগত উদ্যানতাত্ত্বিক রপ্তানি পণ্য।",
    subtitle: "Horticulture Excellence",
    subtitle_bn: "উদ্যানতাত্ত্বিক শ্রেষ্ঠত্ব (আম)",
    desc: "Rajshahi and Chapainawabganj lead the nation in producing geographical indication (GI) protected mango varieties. Strategic export initiatives to the Middle East and Europe are rapidly expanding.",
    desc_bn_long: "রাজশাহী ও চাঁপাইনবাবগঞ্জ জিআই (GI) নিবন্ধিত আম উৎপাদনে দেশকে নেতৃত্ব দিচ্ছে। মধ্যপ্রাচ্য ও ইউরোপে আমাদের কৌশলগত রপ্তানি দ্রুত বাড়ছে।",
    stats: [
      { label: "Annual Output", bn: "বার্ষিক উৎপাদন", value: "1.2M MT", trend: "+3.4% YoY" },
      { label: "Top Region", bn: "শীর্ষ অঞ্চল", value: "Rajshahi", trend: "Northwest" },
      { label: "Key Varietal", bn: "প্রধান জাত", value: "Himsagar", trend: "GI Tagged" }
    ],
    lifecycle: [
      { phase: "Pruning", phase_bn: "ডালপালা ছাঁটাই", duration: "Post-Harvest", action: "Canopy management", icon: "✂️" },
      { phase: "Flowering", phase_bn: "মুকুল আসা", duration: "Jan-Feb", action: "Pest control (Hopper)", icon: "🌼" },
      { phase: "Fruit Setting", phase_bn: "গুটি বাঁধা", duration: "Mar-Apr", action: "Irrigation & Bagging", icon: "🥭" },
      { phase: "Harvest", phase_bn: "ফল সংগ্রহ", duration: "May-Jul", action: "Careful plucking with stalk", icon: "🧺" }
    ],
    marketData: { trend: [90, 80, 35, 15, 5], vol: "25K", demand: "Surging", demand_bn: "দ্রুত বাড়ছে" }
  }
};

/** Ordered list of crops for CropExplorer grid */
export const cropsList = [
  cropsData.rice,
  cropsData.fisheries,
  cropsData.potato,
  cropsData.tomato,
  cropsData.jute,
  cropsData.mango,
];

/** Fallback for unknown crop IDs in GenericCropGuide */
export function getFallbackCrop(cropId) {
  return {
    en: `${cropId.charAt(0).toUpperCase() + cropId.slice(1)} Cultivation`,
    bn: `${cropId} চাষাবাদ`,
    subtitle: "Specialized Intelligence Module",
    subtitle_bn: "বিশেষায়িত তথ্য মডিউল",
    desc: `Real-time analytics and cultivation framework for ${cropId}. Integration with AI diagnostics helps farmers maximize yield and mitigate climatic risks.`,
    desc_bn_long: `${cropId}-এর জন্য রিয়েল-টাইম বিশ্লেষণ এবং চাষাবাদ প্রক্রিয়া। এআই ডায়াগনস্টিকস এর সমন্বয় কৃষকদের ফলন বাড়াতে এবং জলবায়ু ঝুঁকি কমাতে সহায়তা করে।`,
    color: "emerald",
    stats: [
      { label: "Sector Trend", bn: "খাতের প্রবণতা", value: "Growing", trend: "Upward" },
      { label: "AI Coverage", bn: "এআই কভারেজ", value: "Active", trend: "100%" },
      { label: "Data Source", bn: "উপাত্তের উৎস", value: "Verified", trend: "Gov Data" }
    ],
    lifecycle: [
      { phase: "Preparation", phase_bn: "প্রস্তুতি", duration: "Start", action: "Soil testing & seed selection", icon: "🌱" },
      { phase: "Growth", phase_bn: "বাড়ন্ত", duration: "Mid", action: "Fertilizer & irrigation management", icon: "🌿" },
      { phase: "Protection", phase_bn: "সুরক্ষা", duration: "Ongoing", action: "Pest & disease monitoring", icon: "🛡️" },
      { phase: "Harvest", phase_bn: "ফলন", duration: "End", action: "Post-harvest processing", icon: "🧺" }
    ],
    marketData: { trend: [75, 55, 60, 45, 30], vol: "45K", demand: "High", demand_bn: "উচ্চ" }
  };
}
