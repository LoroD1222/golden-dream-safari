# Production audit

Audit completed: 2026-11-16.

## Outcome

The supplied implementation was audited against the Figma file, source content, public routes, itinerary editor, PDF output and production-mode behavior. The high-risk correctness and deployment issues found during the audit were fixed. The remaining items require external production configuration or a product decision and are listed below without being represented as complete.

## Resolved findings

### High priority

- Draft itineraries were reachable by public detail/PDF paths. Public reads now require `status: published`; draft and deleted records return `404` and stay out of the sitemap.
- Itinerary route handlers depended too heavily on middleware for protection. Every editor API handler now enforces constant-time Basic Auth itself, with middleware retained as defense in depth.
- Local JSON edits could race and a Vercel write could appear successful even though the filesystem is ephemeral. Mutations are serialized and atomically replaced locally; Vercel local-storage mutations fail clearly with `503`.
- The editor did not expose the full itinerary model. Activity time/location and accommodation add/edit/remove controls are now present and persist through the API.

### Medium priority

- Sanity array keys and token roles did not cleanly match the shared model. The adapter now normalizes `_key`, supports a separate read token, rejects duplicate slugs and reports missing deletes.
- Quote requests lacked several production checks. Server and client validation now cover date ordering, reply-method requirements, body size, honeypot, bounded counters, rate limiting and duplicate suppression. Plain-text email is included alongside HTML.
- The homepage planner dropped most values when it opened the quote wizard. Trip type, destination, dates and traveller count now carry through.
- PDF layout could overflow on long content. Text uses font-aware wrapping, guarded page breaks, continuation headers, metadata and numbered footers. The canonical itinerary rendered cleanly across two pages.
- Responsive fixed-size images generated aspect-ratio warnings. Gallery, guest-photo and review/related-card imagery now uses explicit responsive containers and appropriate `sizes` hints.

### Design fidelity

- Desktop trips and reviews introductions now use the Figma 72px single-line title geometry.
- The trip-detail title now matches the Figma two-line 640×122px geometry; the price card is 340px wide.
- Review photos, selected homepage reviews, popular trips and contact-page details were reconciled to their Figma nodes.
- Public and editor routes were checked at 390, 768, 1024 and 1440px without page-level horizontal overflow.

## Verified behavior

- `npm run typecheck`, `npm run lint` and `npm run build` pass.
- `npm audit --omit=dev` reports zero production vulnerabilities.
- Public, legal, sitemap and robots routes return expected statuses and metadata; the unknown-route check returns `404`.
- Full local itinerary create/read/update/publish/delete behavior, public visibility, sitemap visibility and PDF generation passed using a disposable record that was removed afterward.
- Production Basic Auth and Vercel failure modes were exercised on temporary local production servers.
- Quote wizard navigation, planner handoff, validation, review filters/expansion, FAQ disclosures, trip filters/sorting and mobile navigation passed in the browser.

## Remaining external checks

1. **Resend delivery:** configure a verified production sender and recipient, then send one real request and confirm inbox delivery plus duplicate suppression after a successful send.
2. **Sanity production adapter:** add the real project/dataset/tokens and repeat CRUD in a non-production dataset before cutover.
3. **Final origin:** set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain, redeploy and verify canonical, Open Graph, sitemap and robots URLs.
4. **Deployed performance:** run Lighthouse/WebPageTest on the Vercel preview. Local development-server timing is intentionally not presented as production evidence.
5. **Asset-retention decision:** `public/images/figma` contains 212 exports and the public directory is about 161 MiB, while 64 Figma paths are referenced by current source/data. The unused exports were preserved because they may belong to the requested reusable asset bundle. Prune or archive them only after confirming that retention requirement.
