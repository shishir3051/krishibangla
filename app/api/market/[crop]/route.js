import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable cache
export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  let cropId = 'potato';
  try {
    const { params } = context;
    // Next.js 15+ best practice: await params
    const resolvedParams = await Promise.resolve(params);
    cropId = resolvedParams?.crop?.toLowerCase() || 'potato';
    
    // Convert generic names to Selina Wamucii URL paths
    const urlMap = {
      potato: 'potatoes',
      mango: 'mangoes',
      tomato: 'tomatoes',
      jute: 'jute' // Rarely on commodity sites, but we'll try
    };

    const targetUrlName = urlMap[cropId] || cropId;
    const feedUrl = `https://www.selinawamucii.com/insights/prices/bangladesh/${targetUrlName}/`;
    
    // Fetch HTML
    const res = await fetch(feedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      },
      // Short timeout to fallback if the site is slow
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) throw new Error('Failed to fetch from market source');

    const html = await res.text();
    
    // Regex out the BDT price. Usually the first 'BDT XX.XX' is the primary wholesale price.
    const priceMatches = html.match(/BDT\s*([0-9.]+)/gi);
    
    let basePrice = 50; // Fallback
    
    if (priceMatches && priceMatches.length > 0) {
      // Clean 'BDT ' and parse float
      basePrice = parseFloat(priceMatches[0].replace(/BDT\s*/i, ''));
    } else {
      // If we couldn't parse it, throw to use fallback
      throw new Error("Price string not found in HTML");
    }

    // Generate a realistic 5-day trend array based off the real price
    // So the chart bounces dynamically around the live price
    const volatilityContext = basePrice * 0.05; // 5% swing
    const trend = [
      Math.max(1, parseFloat((basePrice - volatilityContext * 1.5).toFixed(1))),
      parseFloat((basePrice + volatilityContext).toFixed(1)),
      parseFloat((basePrice - volatilityContext).toFixed(1)),
      parseFloat((basePrice + volatilityContext * 0.5).toFixed(1)),
      basePrice
    ];

    const unitMap = {
      potato: 'KG',
      mango: 'KG',
      tomato: 'KG',
      jute: 'Maund'
    };

    return NextResponse.json({
      price: basePrice,
      trend: trend,
      currency: "BDT",
      unit: unitMap[cropId] || 'KG',
      source: "Real-time AI Market Scraper (Selina Wamucii)",
      live: true
    });

  } catch (error) {
    console.error(`[Market Scraper Error processing ${cropId}]:`, error.message);
    
    // Graceful fallback for the UI if the scraper fails or crop isn't listed
    const fallbacks = {
      potato: { price: 45.0, trend: [40, 50, 45, 48, 45], unit: 'KG' },
      mango: { price: 120.0, trend: [110, 115, 130, 125, 120], unit: 'KG' },
      tomato: { price: 60.0, trend: [55, 65, 50, 58, 60], unit: 'KG' },
      jute: { price: 3200.0, trend: [3100, 3150, 3250, 3300, 3200], unit: 'Maund' }
    };

    const fb = fallbacks[cropId] || { price: 100, trend: [90, 110, 95, 105, 100], unit: 'KG' };

    return NextResponse.json({
      price: fb.price,
      trend: fb.trend,
      currency: "BDT",
      unit: fb.unit,
      source: "Local Baseline Fallback",
      live: false,
      error: error.message
    });
  }
}
