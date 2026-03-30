import { NextResponse } from 'next/server';
import { districtsData } from '@/data/districtsData';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Seeded real-world Bengali wholesaler/buyer names
const buyerNames = [
  { en: 'Bhai Bhai Traders', bn: 'ভাই ভাই ট্রেডার্স' },
  { en: 'Siddique Agro', bn: 'সিদ্দিক এগ্রো' },
  { en: 'Mridha Syndicate', bn: 'মৃধা সিন্ডিকেট' },
  { en: 'Biswas Cold Storage', bn: 'বিশ্বাস কোল্ড স্টোরেজ' },
  { en: 'Rahman Arat', bn: 'রহমান আড়ত' },
  { en: 'Janata Enterprise', bn: 'জনতা এন্টারপ্রাইজ' },
  { en: 'Mollik Corporates', bn: 'মল্লিক কর্পোরেটস' },
  { en: 'Sikder Holdings', bn: 'শিকদার হোল্ডিংস' }
];

const buyerTypes = [
  { en: 'Wholesale Buyer (Aratdar)', bn: 'পাইকারি আড়তদার' },
  { en: 'Export Broker', bn: 'রপ্তানি ব্রোকার' },
  { en: 'Cold Storage Owner', bn: 'হিমাগার মালিক' },
  { en: 'Processing Mill', bn: 'প্রসেসিং মিল' }
];

const demands = [
  { en: 'High', bn: 'উচ্চ', color: 'emerald' },
  { en: 'Surging', bn: 'অত্যধিক', color: 'emerald' },
  { en: 'Moderate', bn: 'মাঝারি', color: 'amber' },
  { en: 'Stable', bn: 'স্থিতিশীল', color: 'blue' }
];

// Helper to seed pseudorandom data based on a string so it remains consistent per district per day
function pseudoRandomValue(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtKey = searchParams.get('district');
    
    if (!districtKey || !districtsData[districtKey]) {
      return NextResponse.json({ error: 'District not found' }, { status: 404 });
    }

    const district = districtsData[districtKey];
    const crops = district.crops;
    
    // 1. Generate Dynamic Buyers tied to the specific district and its crops
    const buyers = crops.slice(0, 3).map((crop, index) => {
      const seedName = buyerNames[pseudoRandomValue(districtKey + crop + index, buyerNames.length)];
      const seedType = buyerTypes[pseudoRandomValue(crop + districtKey, buyerTypes.length)];
      const seedDemand = demands[pseudoRandomValue(districtKey + index, demands.length)];
      
      // Generate a realistic looking Bangladesh phone number
      const phonePrefixes = ['017', '018', '019', '013', '016'];
      const prefix = phonePrefixes[pseudoRandomValue(districtKey + crop, phonePrefixes.length)];
      const randomSuffix = pseudoRandomValue(crop + index + districtKey, 899999) + 100000;
      
      return {
        name: seedName.en,
        bn: seedName.bn,
        type: seedType.en,
        type_bn: seedType.bn,
        crop: crop,
        demand: seedDemand.en,
        demand_bn: seedDemand.bn,
        demandColor: seedDemand.color,
        phone: `${prefix}${pseudoRandomValue(districtKey, 9)}${pseudoRandomValue(crop, 9)}-${randomSuffix}`
      };
    });

    // 2. Generate Dynamic Gov Schemes tied to the local district's risks and ecosystem
    const schemes = [];
    
    // Core National Scheme
    schemes.push({
      title: 'Krishi Batayon Hotline', bn: 'কৃষি বাতায়ন হেল্পলাইন',
      desc: `Direct agronomic counseling tailored for ${districtKey}'s ${crops[0]} farmers. Call 3331 for immediate assistance.`,
      desc_bn: `${districtKey}-এর ${crops[0]} চাষীদের জন্য সরাসরি কৃষি পরামর্শ। সহায়তার জন্য 3331 নম্বরে কল করুন।`,
      tag: 'Hotline', tag_bn: 'হেল্পলাইন', color: 'blue'
    });

    if (district.risk.includes('Flood') || district.risk.includes('Flash Flood')) {
      schemes.push({
        title: 'Haor/Flood Seed Relief', bn: 'বন্যা উপদ্রুত বীজ সহায়তা',
        desc: `Free distribution of submergence-tolerant BRRI dhan-51 & 52 for ${districtKey} wetlands. Apply at local Union Parishad.`,
        desc_bn: `${districtKey}-এর জন্য বন্যামুক্ত BRRI ধান-৫১ ও ৫২ বিনামূল্যে বিতরণ। স্থানীয় ইউনিয়ন পরিষদে আবেদন করুন।`,
        tag: 'Relief', tag_bn: 'তহবিল', color: 'amber'
      });
    }

    if (district.risk.includes('Drought') || district.waterTable.includes('Low')) {
      schemes.push({
        title: 'Deep Tube-Well Subsidy', bn: 'গভীর নলকূপ ভর্তুকি',
        desc: `60% mechanization subsidy for solar-powered irrigation in Barind/Drought zones like ${districtKey}. Valid until next month.`,
        desc_bn: `${districtKey}-এর মতো খরা প্রবণ এলাকায় সৌর-চালিত সেচের জন্য ৬০% ভর্তুকি। আগামী মাস পর্যন্ত বৈধ।`,
        tag: 'Subsidy', tag_bn: 'ভর্তুকি', color: 'emerald'
      });
    }

    // Generic fallback if less than 3 schemes generated
    if (schemes.length < 3) {
      schemes.push({
        title: 'Fertilizer Quota Unlock', bn: 'সার কোটা সুবিধা',
        desc: `New Urea and TSP fertilizer allocations approved for ${districtKey} upazilas based on the upcoming ${crops[1]} season.`,
        desc_bn: `আসন্ন ${crops[1]} মৌসুমের জন্য ${districtKey} উপজেলায় নতুন ইউরিয়া ও টিএসপি সার বরাদ্দ অনুমোদিত হয়েছে।`,
        tag: 'Active', tag_bn: 'সক্রিয়', color: 'emerald'
      });
    }

    return NextResponse.json({
      district: districtKey,
      buyers,
      schemes: schemes.slice(0, 3) // ensure max 3
    });

  } catch (error) {
    console.error("Farmer Success Generator Error:", error);
    return NextResponse.json({ error: "Failed to generate dynamic district data." }, { status: 500 });
  }
}
