# Data sources

Every number on KrishiBangla comes from a public source and is shown with its source and update time (`components/ui/SourceTag.tsx`). This page explains where each dataset comes from, how it is processed, how often it refreshes and what its limits are. The same information, in plain language and in both languages, is on the site at `/about/data`.

Each source has one adapter in `lib/sources/` (fetching and caching) and pure, unit-tested processing in `lib/domain/`. Adapters never throw: on failure they return `{ ok: false }`, retry after a few minutes, and the page shows "temporarily unavailable" for that section only.

## Open-Meteo — weather, forecast and irrigation advice

- **Adapter:** `lib/sources/open-meteo.ts`; parsing in `lib/domain/weather.ts`.
- **Requests:** two calls to `api.open-meteo.com/v1/forecast`, each for all 64 district headquarters (comma-separated coordinates), `timezone=Asia/Dhaka`:
  - *Current conditions:* temperature, apparent temperature, humidity, precipitation, weather code, wind, soil moisture at 3–9 cm, and day/night (`is_day`, so clear nights show a moon). Open-Meteo updates these every 15 minutes; the card shows when they were measured.
  - *Daily forecast (7 days):* weather code, max/min temperature, precipitation sum and probability, FAO-56 reference evapotranspiration.
- **Caching:** `'use cache: remote'`, rendered per request inside `<Suspense>`. Current conditions are refreshed every 15 minutes, the forecast hourly.
- **Quota:** each request has at most 10 variables, so Open-Meteo counts it as one call per location: at most 96 × 64 + 24 × 64 ≈ 7,700 calls a day, within the free 10,000.
- **Irrigation advice** (`lib/domain/irrigation.ts`): over the next 3 days, crop water demand = sum of reference evapotranspiration (ET0); effective rain = 80% of each day's rain above 2 mm; deficit = demand − effective rain. Deficit ≤ 0 mm → none, ≤ 4 mm → low, ≤ 9 mm → medium, otherwise high. Wet topsoil (> 0.35 m³/m³) lowers the level one step; dry topsoil (< 0.15 m³/m³) raises it one step, unless rain already covers demand. The page shows the numbers behind the advice. It is general guidance for upland crops and vegetables, not a crop model; flooded rice follows the AWD water-level rule.
- **Terms:** data CC BY 4.0. The free API is for non-commercial use.

## TCB — today's retail prices in Dhaka

- **Adapter:** `lib/sources/tcb.ts`; parsing in `lib/domain/tcb.ts`; spreadsheet reading in `lib/xlsx.ts` (Node's built-in zlib, no dependency).
- **Source:** the Trading Corporation of Bangladesh publishes *ঢাকা মহানগরীর নিত্য প্রয়োজনীয় পণ্যের দৈনিক খুচরা বাজার দর* every day (around 12:30 Dhaka time) as an Excel sheet linked from `tcb.gov.bd/pages/daily-rmps`. The adapter reads that page, takes the newest sheet (only from TCB's own storage hosts) and parses it.
- **Content:** about 50 food items from 7 Dhaka city markets (Mirpur-6, Mohammadpur Town Hall, Malibag, Rampura, Mohakhali, Hatirpool, West Agargaon), each with a lowest–highest retail price for the day, a week earlier, a month earlier and a year earlier. A price of 0 means the item was not on sale (e.g. hilsa during the fishing ban) and is shown as "not in the market". Writing paper, steel rods and branded milk powder are left out.
- **Processing:** item and unit names are matched to a bilingual catalog in `lib/domain/tcb.ts` (spacing and Unicode forms are normalised); items TCB adds later still appear, under their Bangla name. Changes compare the **midpoints** of the two price ranges, which is how TCB computes its own percentages.
- **Caching:** `'use cache: remote'`, refreshed hourly; rendered per request inside `<Suspense>` on the markets page and the home page. If the sheet cannot be read, the home page falls back to the WFP monthly prices.
- **Caveats:** Dhaka city only, and retail (not wholesale or farm-gate). For prices by district, see WFP below. The Department of Agricultural Marketing (DAM) also publishes divisional and district prices, but only as occasional PDFs or through a web form, which cannot be read reliably.
- **Terms:** public information from a Government of Bangladesh agency; no specific licence is stated. TCB is credited as the source on every price block.

## WFP food prices (via the Humanitarian Data Exchange)

- **Adapter:** `lib/sources/wfp.ts`; parsing and aggregation in `lib/domain/prices.ts`; names in `lib/domain/commodities.ts`.
- **Source file:** `wfp_food_prices_bgd.csv` from the HDX dataset *WFP Food Prices for Bangladesh* (about 4.5 MB). It is fetched with `cache: 'no-store'` (too large for Next's fetch cache) and only the compact aggregate (~110 KB) is cached.
- **Caching:** `'use cache'`, `cacheLife('days')` — part of the prerendered page, regenerated daily. The data itself is monthly and published with a lag.
- **Processing:**
  - Retail prices in BDT only; non-food items and WFP's "… Division" pseudo-markets are dropped. Rows flagged `actual` and `aggregate` are both used (from 2020 to Aug 2024 the data is aggregate-only).
  - **National price** for a month = the **median** across reporting markets (medians resist the occasional data-entry error), and only when markets in at least 5 districts reported.
  - **Month-on-month change** compares the **same markets** in both months (WFP doubled its market sample in May 2026, so all-market comparisons would mix price change with sample change). It is shown only when the previous national month is at most 2 months earlier and at least 5 markets reported in both.
  - A commodity appears nationally only if its latest national month is at most 6 months old; district views show each district's latest price within the last 12 months, next to that month's national price.
- **Caveats:** these are retail prices in WFP-monitored markets, not wholesale or farm-gate prices. Some items (e.g. tomatoes) are priced in only a few markets and therefore have no national figure.
- **Licence:** CC BY-IGO.

## World Bank — World Development Indicators

- **Adapter:** `lib/sources/world-bank.ts`; parsing in `lib/domain/indicators.ts`.
- **Indicators (Bangladesh, `BGD`):** `NV.AGR.TOTL.ZS` agriculture, forestry & fishing value added (% of GDP); `SL.AGR.EMPL.ZS` employment in agriculture (% of total, modelled ILO estimate); `AG.PRD.CREL.MT` cereal production (t); `AG.YLD.CREL.KG` cereal yield (kg/ha); `ER.FSH.PROD.MT` total fisheries production; `ER.FSH.AQUA.MT` aquaculture; `ER.FSH.CAPT.MT` capture fisheries; `AG.LND.AGRI.ZS` agricultural land (% of land area).
- **Shown:** the latest non-empty value with its year and a ~20-year trend. "Cereal production" is labelled as such — it is not rice alone.
- **Caching:** `'use cache'`, `cacheLife('weeks')` (shorter if some indicators fail). The base URL can be overridden with `WORLD_BANK_API_URL`.
- **Licence:** CC BY 4.0.

## NASA POWER — temperature and rainfall compared with normal

- **Adapter:** `lib/sources/nasa-power.ts`; maths in `lib/domain/climate.ts`.
- **Points:** the eight division headquarters (Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, Mymensingh), coordinates from `data/districts.json`.
- **Data:** monthly `T2M` (°C) and `PRECTOTCORR` (mm/day, converted to monthly totals using the number of days in each month) from the monthly endpoint, and the long-term climatology from the climatology endpoint. The baseline period is read from the response (currently 2001–2025) and shown on the page. Fill values (−999) are treated as missing.
- **Shown:** for the 12 most recent complete months, the temperature difference from normal (°C) and rainfall as a percentage of normal, for each division.
- **Caveats:** satellite- and model-based estimates for a point, not weather-station readings. Dry-season rainfall percentages swing a lot because normals are small.
- **Caching:** `'use cache'`, `cacheLife('weeks')`.
- **Terms:** free to use with acknowledgement of the NASA Langley Research Center POWER Project.

## GDACS — disaster alerts

- **Adapter:** `lib/sources/gdacs.ts`; filtering in `lib/domain/alerts.ts`.
- **Request:** the GDACS event list API for tropical cyclones, floods and droughts (`eventlist=TC,FL,DR`, all alert levels, `country=Bangladesh`) over the last 12 months. Events are kept when Bangladesh is the event country or among the affected countries.
- **Shown:** "active" alerts (ongoing, or ended within the last 7 days) with their level (Red / Orange / Green = GDACS's estimate of humanitarian impact), and the 12-month history on the climate page.
- **Caching:** `'use cache: remote'`, refreshed about every 15 minutes; rendered per request inside `<Suspense>`.
- **Caveat:** automatic global estimates for awareness. Official warnings come from the Bangladesh Meteorological Department and the Department of Disaster Management.

## District boundaries — geoBoundaries

- **Files:** `data/map/source/geoboundaries-bgd-adm2.geojson` (geoBoundaries gbOpen `BGD-ADM2-16705992`; original data from the Bangladesh Bureau of Statistics and OCHA ROAP), simplified into `data/map/district-paths.json` by `scripts/build-map.mjs` (pinned mapshaper; `npm run check:map` verifies the output in CI).
- **Licence:** CC BY 3.0 IGO.

## District registry and editorial content

- `data/districts.json` lists all 64 districts (Bangla and English names, division, coordinates, older spellings) and a curated profile (main crops, soil, climate hazards, a few advisories). The profiles were migrated from the earlier version of the site; invented metrics were removed and the rest is marked on the site as editorial content pending source review. Five districts have no profile yet and say so.
- `data/crops.json` holds the crop guides (calendars, steps, seasons). They are general practice, labelled as such, and contain no unsourced statistics.

## AI (Google Gemini)

The chat assistant (`/api/chat`) and disease scan (`/api/detect`) use Gemini (`GEMINI_MODEL`, default `gemini-2.5-flash`). The assistant is instructed not to invent figures and to refer users to the Upazila agriculture or fisheries office or the Krishi Call Center (16123). AI answers can be wrong; the site says so wherever they appear.

## Not yet included

- **Flood signal from river discharge** (Open-Meteo Flood API / GloFAS). A forecast is only meaningful compared with the same river point's own history; building that baseline needs more API calls than the free daily allowance, so it is planned as a one-off script for the districts that sit on major rivers.
