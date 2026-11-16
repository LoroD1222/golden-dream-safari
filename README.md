# Golden Dream Safaris

A complete Next.js implementation of the supplied Golden Dream Safaris Figma file. The public site follows the Figma layouts and content hierarchy, while the itinerary layer is repository-driven so it can run from local JSON today and move to Sanity later without rewriting the pages or editor.

## What is included

- Home, trip directory, reusable trip detail, reviews, about, contact, legal, 404, sitemap and robots routes.
- Responsive layouts for desktop, tablet and mobile.
- Four-step quote request form with validation, honeypot, rate limiting, duplicate protection and Resend delivery.
- Local itinerary editor with create, read, update and delete support.
- Runtime-generated itinerary PDF downloads.
- Local JSON and Sanity repository adapters behind one interface.
- Canonical metadata, Open Graph data and schema.org JSON-LD.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The itinerary editor is available at [http://localhost:3000/admin/itineraries](http://localhost:3000/admin/itineraries) in local development.

Run all repository checks:

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

## Environment variables

Copy `.env.example` to `.env.local` and set only the values needed for the selected features.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin used by canonical URLs, sitemap and JSON-LD. |
| `RESEND_API_KEY` | Server-only Resend API key for quote delivery. |
| `RESEND_FROM_EMAIL` | Verified Resend sender. |
| `RESEND_TO_EMAIL` | Inbox that receives quote requests. |
| `ITINERARY_STORAGE` | `local` (default) or `sanity`. |
| `ITINERARY_ADMIN_USER` | HTTP Basic Auth username for the editor and itinerary APIs. |
| `ITINERARY_ADMIN_PASSWORD` | HTTP Basic Auth password for the editor and itinerary APIs. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID when the Sanity adapter is selected. |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, normally `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Pinned Sanity API version. |
| `SANITY_API_READ_TOKEN` | Optional server-only read token for a private dataset. |
| `SANITY_API_WRITE_TOKEN` | Server-only token with document read/write access. |

Do not expose `RESEND_API_KEY`, admin credentials or Sanity tokens through `NEXT_PUBLIC_` variables.

## Quote delivery

`POST /api/quote` validates every payload on the server. Without all three Resend variables, the API intentionally returns `503` with a clear email/WhatsApp fallback; it never pretends that a request was sent. In production, configure a verified sender domain in Resend before setting `RESEND_FROM_EMAIL`.

## Itinerary storage and editor

The public detail route, PDF route, API and editor all use the `ItineraryRepository` contract in `src/features/itinerary/model.ts`.

- `ITINERARY_STORAGE=local`: reads and writes `data/itineraries.json` using a serialized mutation queue and atomic file replacement. The seed lives in `data/seed-itineraries.json`.
- `ITINERARY_STORAGE=sanity`: uses the adapter in `src/features/itinerary/storage/sanity.ts`.

The local store is suitable for local development and a persistent Node filesystem. Vercel filesystems are ephemeral, so write operations are refused with `503` on Vercel unless Sanity storage is selected. On hosted Vercel environments, the editor returns 404 unless both Basic Auth variables are configured.

See `docs/SANITY-INTEGRATION.md` for the matching schema and migration steps.

## Deployment

1. Push the project to a Git provider and import it in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Add the Resend variables.
4. Use `ITINERARY_STORAGE=sanity` for durable hosted editing and add the Sanity variables.
5. Add `ITINERARY_ADMIN_USER` and a strong `ITINERARY_ADMIN_PASSWORD` if the editor should be available.
6. Deploy and verify `/sitemap.xml`, `/robots.txt`, a quote request, an itinerary save and a PDF download.

## Project map

```text
src/app/                         App Router pages and route handlers
src/components/                  Shared marketing and interactive UI
src/data/site.ts                 Public trip cards, reviews and site copy
src/features/itinerary/          Domain model, validation, editor and repositories
data/seed-itineraries.json       Versioned local seed
public/images/figma/             Exact exported Figma assets
docs/                            Design inventory, CMS and QA handoff
```

## Handoff documents

- `docs/FIGMA-INVENTORY.md`
- `docs/SANITY-INTEGRATION.md`
- `docs/VISUAL-QA.md`
- `docs/FUNCTIONAL-TESTING.md`
- `docs/PRODUCTION-AUDIT.md`
