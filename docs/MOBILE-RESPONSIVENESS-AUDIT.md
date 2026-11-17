# Mobile responsiveness audit

Audit date: 2026-11-17. Source of truth: the current Figma file `nXKD3sKPSaGsIsXLoPc0lA`, including homepage frame `63:1883`, homepage top frame `134:1600`, safari-detail frame `126:1618`, directory frame `136:1600`, reviews frame `137:1600`, about frame `138:1600`, contact frame `139:1600`, quote states `145:1982`, and mobile offer state `52:340`.

## Scope inspected

- `/`: header, hero, three highlights, destination bento grid, local-team section, popular safaris, booking timeline, interactive included-experience panel, host, reviews, FAQ and footer.
- `/trips`: image hero, category filters, sort control, safari cards, trek/Zanzibar cards and footer.
- `/trips/tarangire-serengeti-ngorongoro`: hero and price summary, fact rail, sticky section navigation, overview gallery, interactive route map, day cards, accommodation choices, included lists, pricing, reviews, related trips, FAQ and footer.
- `/about`: editorial hero, Victor image, story, values, team, number cards and footer.
- `/reviews`: image hero, rating summary, filters, guest-photo grid, masonry cards and footer.
- `/contact`: contact methods, four-step quote wizard, validation layout, FAQ and footer.
- Shared navigation, buttons, cards, accordions, form controls and image containers.

## Issues found

- A later Figma revision reintroduced compact orange-dot section labels across the public routes, conflicting with the client-approved direction to avoid the repeated generic capsule treatment.
- Several late CSS overrides competed with the earlier mobile rules, especially on the homepage and safari-detail hero.
- The safari-detail hero used a fixed 1000px mobile height and an absolutely positioned price card, creating unnecessary height and fragile overlap behavior.
- Sticky trip navigation attempted to retain desktop actions on narrow screens.
- Day headers, experience media, meal-plan labels and accommodation options retained desktop column assumptions.
- Some card headings, reviews and contact values had no shared narrow-screen guard for long text.
- At 320px the destination grid, hero actions and footer columns needed dedicated behavior rather than a compressed 390px layout.

## Fixes implemented

- Removed the shared capsule-and-dot treatment from every public route and replaced it with a plain editorial eyebrow. The client direction intentionally overrides this one Figma motif while retaining the Figma typography, spacing, copy and button system.
- Added one shared mobile cascade for route gutters, touch targets, overflow containment and responsive typography.
- Rebuilt the trip-detail mobile hero as a natural document flow: copy first, then the pricing card, with no absolute overlap or fixed 1000px height.
- Converted mobile trip navigation into a compact horizontally scrollable section rail and hid duplicated desktop-only download/quote actions from that sticky bar.
- Stacked trip overview, day experience, accommodation, included, pricing, review and related-trip grids at mobile widths.
- Added mobile wrapping rules for day titles, meal-plan labels and long contact values.
- Refined homepage hero cropping and typography independently at 320–430px.
- Reduced mobile card padding and section heights without shrinking touch targets below 44px.
- Changed the team and footer to a single column at the narrowest viewport.
- Preserved existing interactive behavior, Sanity-compatible itinerary data, local itinerary storage, quote flow, filters, FAQs and PDF generation.

## Image quality and cropping

- Existing local Figma exports and `next/image` call sites were retained; no stock-photo substitutions or remote runtime Figma URLs were introduced.
- Hero and destination crops use explicit mobile `object-position` values so the acacia, wildlife and guest subjects remain visible.
- Existing responsive `sizes`, priority loading for hero images, intrinsic dimensions and fill containers were preserved to prevent layout shift.
- Rounded corners and aspect ratios were checked in the rendered 390px route comparison.

## Viewports tested

Homepage screenshots were rendered at 320, 360, 375, 390, 414 and 430 CSS pixels. All primary public routes were rendered at 390×844. The final mobile comparison showed no clipped headings, page-level horizontal overflow or overlapping hero panels.

The established 768, 1024 and 1440 desktop/tablet layouts remain covered by the existing visual QA checklist and production build.

## Remaining limitations

- Figma supplies dedicated 390px frames for the interactive offer panel, but not complete mobile frames for every route. Where a mobile frame was absent, the layout follows the current desktop design system and the audit brief’s mobile-first requirements.
- The Next.js development overlay can appear in local screenshots; it is not part of production rendering.
- Production-only Resend delivery and deployed Lighthouse/WebPageTest checks still require the final environment and domain.
