# Functional testing

Validation run: 2026-11-17.

## Automated checks

```text
npm run typecheck          pass
npm run lint               pass
npm run build              pass
npm audit --omit=dev       0 production vulnerabilities
```

## Browser flows

- Mobile navigation opens after hydration and exposes the route links.
- Trip category filtering reduces “Day trips” to the single matching card.
- A–Z sorting changes card order within both directory groups.
- Reviews render six cards initially, expand to nine and filter to the three reviews with photos.
- Quote wizard advances through all four steps.
- Flexible dates clear fixed dates and remain represented in the summary.
- Homepage planner values carry into the wizard: trip type, arrival, departure, traveller count and destination note.
- Children are represented in the final quote summary.
- WhatsApp is required only when it is the chosen reply method.
- Missing privacy consent produces an inline validation error.
- With Resend intentionally unconfigured, submission returns an honest delivery error and direct-contact fallback.
- FAQ disclosures open and reveal their answers.
- Responsive public routes and the editor show no page-level horizontal overflow at 320, 360, 375, 390, 414, 430, 768, 1024 and 1440 CSS pixels.
- Removal of the shared section-pill treatment does not remove real headings, breadcrumbs, navigation labels or interactive controls.
- Every public and legal route returns the expected status, one `h1`, one `main`, a description and canonical metadata; sitemap and robots routes return `200`, and an unknown route returns `404`.

## Itinerary API and persistence

A temporary record was created, updated, read back and removed through the local API:

```text
POST   /api/itineraries       201
PUT    /api/itineraries/:id   200
GET    /api/itineraries/:id   200
DELETE /api/itineraries/:id   204
```

The update persisted nested activity time/location data, accommodation data, the changed title, price, status and inclusion. A draft returned `404` from its public page and PDF route; after publication both returned `200` and the sitemap included the slug. The temporary record was removed after the test and disappeared from the API, public page and sitemap.

## Access and deployment guards

- A production-mode server returned `401` for missing/wrong editor credentials and `200` for correct Basic Auth.
- A simulated Vercel deployment without admin credentials returned `404` for the editor and itinerary API.
- A simulated Vercel deployment with credentials but local storage returned `503` for mutations rather than pretending an ephemeral write would persist.
- The quote endpoint rejected malformed preferred-contact data and the honeypot, enforced its request-size guard and returned `429` after repeated invalid requests.

## Generated PDF

`GET /api/trips/tarangire-serengeti-ngorongoro/pdf` returns:

```text
HTTP 200
Content-Type: application/pdf
Content-Disposition: attachment; filename="tarangire-serengeti-ngorongoro.pdf"
```

The PDF was rendered to PNG at 110 DPI. Both pages were visually checked for readable text, unclipped headings, clean page breaks and valid ASCII-safe glyphs.

## Production-only verification still required

- Send a real quote after Resend sender verification and production environment configuration.
- Repeat itinerary CRUD on the final host only if it provides a persistent writable filesystem.
- Verify final canonical URLs after the production domain is known.
- Run a production Lighthouse/WebPageTest pass against the deployed Vercel preview; development-server timings are not representative.
