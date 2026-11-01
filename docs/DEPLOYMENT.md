# Deploying KrishiBangla

The app is built for [Vercel](https://vercel.com): it relies on Next.js Cache Components, and on Vercel `'use cache: remote'` is backed by a shared cache automatically, so cached data (weather, prices, alerts) is shared across all server instances.

## 1. Create the project

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository. The framework (Next.js), build command (`next build`) and output are detected automatically.
3. Node.js: the project needs 20.9 or newer (`engines` in `package.json`); Vercel's current default is fine.

## 2. Environment variables

Set these in **Project → Settings → Environment Variables** (Production and Preview):

| Variable | Required? | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For AI features | AI chat and disease scan. Without it those two features return a clear error; everything else works. |
| `GEMINI_MODEL` | Optional | Gemini model id (default `gemini-2.5-flash`). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Recommended | Shared rate limits for `/api/chat` and `/api/detect`. Adding the Upstash integration from the Vercel Marketplace sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`, which also work. Without them, limits are per server instance only. |
| `NEXT_PUBLIC_SITE_URL` | Recommended with a custom domain | Public origin for canonical URLs, the sitemap and share cards, e.g. `https://krishibangla.example`. If unset, Vercel's production domain is used. |
| `WORLD_BANK_API_URL` | Optional | Override the World Bank API base URL. |

No other keys are needed: Open-Meteo, WFP/HDX, World Bank, NASA POWER and GDACS are public.

## 3. Deploy and check

After the first deployment:

- `/` should redirect to `/bn` (or `/en` once a visitor has switched language).
- A district page (e.g. `/bn/districts/rajshahi`) should show "Updated <date, time>" under the weather. Revisit after an hour: the time and values change without a redeploy.
- `/sitemap.xml` and `/robots.txt` should list the production domain.
- The build log should show the route table with revalidation times (home/markets/crops 1d, climate 1w).

Every push to a branch gets a preview deployment; merging to the production branch deploys the live site.

## 4. Housekeeping

- Older commits contained hardcoded Gemini and WeatherAPI keys. Revoke them at the providers if you have not already. WeatherAPI is no longer used at all.
- Open-Meteo's free API is for non-commercial use. If the site becomes commercial, switch to their paid plan (only the adapter configuration changes).
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, the map check and a production build on every pull request and on pushes to `master`.
