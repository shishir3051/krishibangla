# KrishiBangla (কৃষিবাংলা)

A bilingual (Bangla-first, with English) agriculture website for Bangladesh. It brings together live public data — weather, market prices, national statistics, climate and disaster alerts — with practical crop guides and an AI assistant, so farmers and extension workers can make decisions on real numbers.

Every figure on the site shows its source and when it was updated. Nothing is invented: if a source is unavailable, the page says so.

## Features

- **District desk** for all 64 districts: live weather, a 7-day forecast and irrigation advice from the forecast water balance (evapotranspiration, rain and soil moisture), plus a curated farming profile. Find your district on the map, by search or with "use my location".
- **Market prices**: monthly national retail prices for staple foods with month-on-month changes and trends, and the latest prices by district.
- **Agriculture in numbers**: World Bank indicators — agriculture's share of GDP and employment, cereal production and yield, fisheries (aquaculture vs capture), agricultural land.
- **Climate and alerts**: monthly temperature and rainfall for each division compared with the long-term normal, and live cyclone, flood and drought alerts.
- **Crop guides** for rice, fisheries, potato, tomato, jute and mango: growing calendars, practical steps and prices where tracked.
- **Disease scan**: photograph a leaf and the AI suggests the likely problem and next steps (with a clear "AI can be wrong" warning and the Krishi Call Center number).
- **AI assistant** on every page, aware of the crop you are reading about; replies in the language you write in.
- Light and dark themes, mobile tab bar, printable district pages, Bangla digits and Dhaka time throughout.

## Data sources

| Source | Used for | Refreshed |
|---|---|---|
| [Open-Meteo](https://open-meteo.com/) | Weather, forecast, evapotranspiration, soil moisture | Hourly |
| [WFP via HDX](https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh) | Retail food prices | Daily check (data is monthly) |
| [World Bank WDI](https://data.worldbank.org/country/bangladesh) | National agriculture indicators | Weekly check (data is yearly) |
| [NASA POWER](https://power.larc.nasa.gov/) | Temperature and rainfall vs normal | Weekly check (data is monthly) |
| [GDACS](https://www.gdacs.org/) | Disaster alerts | About every 15 minutes |
| [geoBoundaries](https://www.geoboundaries.org/) | District boundaries (static) | — |
| Google Gemini | AI assistant and disease scan | — |

Details, licences and caveats: [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) (also shown on the site at `/about/data`).

## Tech stack

- [Next.js 16](https://nextjs.org) App Router with **Cache Components** (`'use cache'`, `cacheLife`), React 19, TypeScript (strict)
- Tailwind CSS v4 with light/dark design tokens; Inter and Hind Siliguri via `next/font`
- zod for validating every upstream response; Vitest for unit tests
- `@google/genai` (Gemini) for AI; optional Upstash Redis for rate limiting
- Map paths pre-built with mapshaper and d3-geo (`scripts/build-map.mjs`); no chart library — charts are hand-written SVG

## Getting started

Requires Node.js 20.9 or newer (CI uses Node 24).

```bash
npm ci
```

```bash
cp .env.example .env.local
```

Add your `GEMINI_API_KEY` to `.env.local` (only the AI chat and disease scan need it; all other data sources are keyless). Then:

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/bn` (Bangla). Use the language button for `/en`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Vitest unit tests |
| `npm run build:map` | Regenerate `data/map/district-paths.json` from the GeoJSON source |
| `npm run check:map` | Fail if the committed map paths are out of date (used in CI) |

## How data stays fresh

Pages are prerendered as a static shell and each data source is cached for as long as it makes sense, then regenerated in the background — data is never frozen at build time.

| Section | Rendering | Lifetime |
|---|---|---|
| District weather, irrigation | Streamed per request (`'use cache: remote'`) | 1 hour |
| Disaster alerts | Streamed per request (`'use cache: remote'`) | ~15 minutes |
| Market prices | Static shell, background regeneration | 1 day |
| World Bank, NASA POWER | Static shell, background regeneration | 1 week |

Each adapter in `lib/sources/` returns its data together with source metadata, never throws, and retries after a few minutes if an upstream fails; that section then shows "temporarily unavailable" while the rest of the page works.

## Project structure

```
app/[locale]/          Pages (bn | en): home, districts, markets, climate, crops, scan, about/data
app/api/               chat (streaming Gemini) and detect (disease scan), both rate limited
proxy.ts               Locale redirects (/ → /bn or your saved choice), old /crop/* URLs
lib/sources/           One adapter per upstream (Open-Meteo, WFP, World Bank, NASA POWER, GDACS)
lib/domain/            Pure, unit-tested logic: parsing, prices, irrigation, climate, alerts, districts
data/                  districts.json (64 districts), crops.json, map paths and source GeoJSON
messages/              UI text: <feature>.en.json / <feature>.bn.json (same keys, enforced by tests)
components/            UI by feature; components/ui holds the design-system primitives
scripts/               build-map.mjs
```

## Deployment

Designed for Vercel. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for environment variables and setup.

## Security

See [SECURITY.md](SECURITY.md). Never commit `.env.local` or real API keys.
