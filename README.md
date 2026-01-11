# Travel Planner

Travel Planner is an opinionated Next.js 16 demo that showcases an MVP travel planning workflow. It combines a marketing site with an authenticated dashboard, trip budgeting, visa guidance, and currency conversion. The backend now persists to a lightweight JSON datastore (`server/data/store.json`)—no external Supabase instance or native database dependency required for local development.

## Stack
- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind CSS, shadcn/ui, Radix UI primitives
- JSON file persistence (`server/data/store.json`)
- Zod + React Hook Form for validation
- Recharts for visualisations
- Resend + ExchangeRate API integrations (optional)

## Prerequisites
- Node.js 20.11 or newer (aligns with the React 19/Next 16 toolchain)
- npm 9+ (or pnpm/bun/yarn if you prefer—scripts reference npm)

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment variables and adjust as needed:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

The datastore file is created automatically at `server/data/store.json`. Delete that file if you want a clean slate.

## Environment variables
| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Base URL used for links and redirects. |
| `EXCHANGE_RATE_BASE_CURRENCY` | Three-letter code used for default trip budgets (e.g. `USD`). |
| `EXCHANGE_RATE_API_KEY` | Optional key for [ExchangeRate API](https://www.exchangerate-api.com/); enables live rate lookups. |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional credentials for transactional emails through [Resend](https://resend.com/). |
| `SUPPORT_EMAIL` | Optional support inbox destination for help form submissions. |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ENVIRONMENT` | Optional Sentry instrumentation settings. |

All of the integrations gracefully degrade when keys are absent, so you can run the project locally with only the defaults set.

## Useful scripts
- `npm run dev` — start the dev server (Turbopack by default on Next 16).
- `npm run build` — create an optimised production build.
- `npm run start` — run the compiled production bundle.
- `npm run lint` — run ESLint with the shared config.

## Project structure highlights
- `app/(marketing)` — public marketing pages.
- `app/(auth)` — login and registration flows.
- `app/(dashboard)` — authenticated application, guarded by server-side session checks.
- `app/api/*` — API routes backed by the JSON data layer (`server/db`).
- `components/` — colocated UI building blocks (dashboard, forms, marketing, ui).
- `server/db` — thin data access helpers wrapping the JSON datastore.

## Resetting the datastore
The datastore is auto-provisioned on first run. To reset:

```bash
rm server/data/store.json
npm run dev
```

This will recreate an empty store file with the latest structure.

## Deployment notes
- Ensure the `server/data` directory is writable wherever you deploy. Alternatively swap in your preferred database and adjust `server/db`.
- Provide the optional integration keys (ExchangeRate, Resend, Sentry) via environment variables when deploying.

Enjoy building out the remaining travel-planning features!
