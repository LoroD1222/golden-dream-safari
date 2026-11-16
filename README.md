# Golden Dream Safaris

A complete Next.js implementation of the supplied Golden Dream Safaris Figma file. The public site follows the Figma layouts and content hierarchy, while the itinerary editor and public trip pages use a shared local JSON repository.

## What is included

- Home, trip directory, reusable trip detail, reviews, about, contact, legal, 404, sitemap and robots routes.
- Responsive layouts for desktop, tablet and mobile.
- Four-step quote request form with validation, honeypot, rate limiting, duplicate protection and Resend delivery.
- Local itinerary editor with create, read, update and delete support.
- Runtime-generated itinerary PDF downloads.
- Local JSON itinerary storage behind a repository interface.
- Canonical metadata, Open Graph data and schema.org JSON-LD.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The itinerary editor is available at [http://localhost:3000/admin/itineraries](http://localhost:3000/admin/itineraries) in local development.

### Sanity Studio

The standalone Studio in `studio/` is connected to the **golden dream safaris** Sanity project (`iir1avhf`) and its `production` dataset. It is intentionally separate from the Next.js app, so the local itinerary editor continues to work without Sanity credentials.

Hosted Studio: [golden-dream-safaris.sanity.studio](https://golden-dream-safaris.sanity.studio/)

```bash
cd studio
npm install
npm run dev
```

To validate and deploy Studio changes:

```bash
npm run schema:extract
npm run build
npm run schema:deploy
```

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
| `ITINERARY_ADMIN_USER` | HTTP Basic Auth username for the editor and itinerary APIs. |
| `ITINERARY_ADMIN_PASSWORD` | HTTP Basic Auth password for the editor and itinerary APIs. |

Do not expose `RESEND_API_KEY` or admin credentials through `NEXT_PUBLIC_` variables.

## Quote delivery

`POST /api/quote` validates every payload on the server. Without all three Resend variables, the API intentionally returns `503` with a clear email/WhatsApp fallback; it never pretends that a request was sent. In production, configure a verified sender domain in Resend before setting `RESEND_FROM_EMAIL`.

## Itinerary storage and editor

The public detail route, PDF route, API and editor all use the `ItineraryRepository` contract in `src/features/itinerary/model.ts`. It reads and writes `data/itineraries.json` using a serialized mutation queue and atomic file replacement. The seed lives in `data/seed-itineraries.json`.

The local store is suitable for local development and any persistent Node filesystem. Vercel filesystems are ephemeral, so write operations return `503` there rather than pretending an edit will persist. On hosted Vercel environments, the editor returns `404` unless both Basic Auth variables are configured.

## Deployment

1. Push the project to a Git provider and import it in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Add the Resend variables.
4. Add `ITINERARY_ADMIN_USER` and a strong `ITINERARY_ADMIN_PASSWORD` if the editor will run on a host with a persistent filesystem.
5. Deploy and verify `/sitemap.xml`, `/robots.txt`, a quote request and a PDF download. Verify itinerary saves only on a persistent Node host.

## Project map

```text
src/app/                         App Router pages and route handlers
src/components/                  Shared marketing and interactive UI
src/data/site.ts                 Public trip cards, reviews and site copy
src/features/itinerary/          Domain model, validation, editor and repositories
data/seed-itineraries.json       Versioned local seed
public/images/figma/             Exact exported Figma assets
studio/                          Standalone Sanity Studio and itinerary schema
docs/                            Design inventory and QA handoff
```

## Handoff documents

- `docs/FIGMA-INVENTORY.md`
- `docs/VISUAL-QA.md`
- `docs/FUNCTIONAL-TESTING.md`
- `docs/PRODUCTION-AUDIT.md`
