# Visual QA

The Figma screens were compared during implementation at their native proportions, then the built site was inspected in the local browser at desktop, tablet and mobile widths.

## Route checklist

| Route | Desktop | Tablet | Mobile | Notes |
| --- | --- | --- | --- | --- |
| `/` | Pass | Pass | Pass | Hero, planner, bento grid, popular trips, booking, reviews and FAQ. |
| `/trips` | Pass | Pass | Pass | Responsive filters, grid accessory placement and no horizontal overflow. |
| `/trips/tarangire-serengeti-ngorongoro` | Pass | Pass | Pass | Hero card, sticky route content, day cards, price, reviews and mobile hero separation. |
| `/reviews` | Pass | Pass | Pass | Hero/rating-card overlap corrected at intermediate widths. |
| `/about` | Pass | Pass | Pass | Editorial sections and image grids collapse cleanly. |
| `/contact` | Pass | Pass | Pass | Contact hero, wizard and FAQ. |
| `/admin/itineraries` | Pass | Pass | Pass | Editor remains usable in a single-column mobile layout. |

## Viewports

Validated widths: 1440, 1024, 768 and 390 CSS pixels. Representative routes were checked for `scrollWidth > clientWidth`; no page-level horizontal overflow remained.

## Fixes made during QA

- Restored Urbanist on body text after a global form-control inheritance rule overrode it.
- Moved the trips “mix & match” card into the grid flow to remove card overlap and excess page height.
- Reflowed the homepage mobile planner instead of stacking it over the hero copy.
- Corrected the narrow Mount Meru tile width and clipped mobile trip sub-navigation.
- Prevented the large footer wordmark from creating horizontal overflow.
- Separated the mobile trip price card from the hero CTA.
- Repositioned the reviews rating card at 1024–1280 widths.
- Matched the Figma one-line 72px directory and review hero headings at desktop width.
- Matched the trip-detail hero heading to the Figma two-line 640×122px geometry and aligned its 340px price card.
- Corrected the guest-photo/review asset mapping and the home popular-trip/review selections.
- Corrected the contact method card, column balance and default quote selections to the Figma source.
- Converted fixed responsive gallery imagery to sized `next/image` fill containers, removing recurring aspect-ratio warnings.

## Content and accessibility checks

- All controls remain keyboard-native buttons, links, fields, selects or details/summary disclosures.
- Decorative imagery is ignored by assistive technology; meaningful imagery has alt text.
- Visible focus styles, reduced-motion handling and labelled navigation regions are included.
- Public copy contains no bracket placeholders, fake social profile links or links to unpublished trip-detail routes.

## Icon, SVG and brand-graphics audit

Audit date: 2026-11-16. Source of truth: Figma file `nXKD3sKPSaGsIsXLoPc0lA`. The audit used node-level design context rather than visual approximations. Sixty-five original SVG exports are stored in `public/icons/figma/` and exposed through the typed `FigmaIcon` component. No icon-library substitutions are used.

### Complete implemented inventory

| Category | Figma reference | Implemented assets and locations |
| --- | --- | --- |
| Section markers | Home/header node `134:1600` | Exact 6px `orange-dot.svg` in every reusable section pill and image-label marker. |
| Header and primary CTAs | `134:1606`, `126:1636`, `128:1914` | `arrow-header.svg`, `arrow-hero.svg`, `arrow-footer.svg`; header, mobile navigation, shared buttons, footer CTA and 404 CTA. |
| Homepage hero contact | `134:1600` | `whatsapp-hero.svg`; hero WhatsApp link. |
| Homepage planner | `134:1600` | `form-globe.svg`, `form-calendar.svg`, `form-user.svg`, `form-chevron.svg`; planner fields and select treatment. |
| Homepage highlight CTA | `134:1635` | `arrow-highlight.svg`; orange price highlight. |
| Destination/bento cards | Home trip grid and review node `116:1644` | `arrow-up-right.svg`; destination cards and TripAdvisor external CTA. |
| Popular trip card facts | Card node `63:2107` | `pin-card.svg`, `clock-card.svg`, `people-card.svg`, `house-card.svg`, `chevron-card.svg`, `arrow-card.svg`; location, selectors and itinerary links. |
| Booking timeline | `135:1600` | `booking-chat.svg`, `booking-dates.svg`, `booking-plan.svg`, `booking-pickup.svg`; image chip, three step headings and WhatsApp action. |
| About/brand credentials | Hero node `138:1620`; values node `138:1668` | `graduation-cap.svg`, `value-local.svg`, `value-service.svg`, `value-recommended.svg`, `value-honesty.svg`; Mweka badge and all four brand-value cards. |
| Review stars | Home reviews `116:1618`; reviews page `137:1600`; trip reviews `128:1754` | `stars-rating.svg` and `stars-review.svg`; every rating summary and review card. No Unicode stars remain. |
| Contact methods | `139:1629` | `contact-whatsapp.svg`, `contact-mail.svg`, `contact-pin.svg`, exact arrow asset; all contact cards. |
| FAQ | `139:1747` | `faq-whatsapp.svg`, `faq-plus.svg`, `faq-minus.svg`; help CTA and native details/summary state switching. |
| Footer contacts/socials | `139:1770` | `footer-whatsapp-contact.svg`, `footer-mail.svg`, `footer-pin.svg`, `footer-tripadvisor.svg`, `footer-whatsapp.svg`; contact rows and verified functional social/contact links. |
| Trip-detail hero and nav | `126:1638`, `129:1600` | `detail-whatsapp.svg`, `download.svg`, exact rating stars and button arrows; hero contact, rating block and PDF download. |
| Trip overview | `127:1627` | `check.svg`; all five highlight rows. |
| Route help | `129:1641` | `book.svg`, `detail-whatsapp.svg`; plan card label and WhatsApp action. |
| Day/accommodation cards | `129:1659` | `bed.svg`, `meal.svg`, `info.svg`, `package-camping.svg`, `package-lodge.svg`, `package-luxury.svg`; accommodation heading, meal plan and package tiers. |
| Included/request/excluded lists | `128:1618` | `included-check.svg`, `on-request.svg`, `excluded.svg`; every list row. |
| Quote wizard | `145:1737`–`145:1975` | `quote-calendar.svg`, `quote-back.svg`, `quote-arrow.svg`, `quote-chevron.svg`, `quote-success.svg`, `tier-radio.svg`, `tier-radio-selected.svg`; navigation, dates, country, comfort selection and sent state. |
| Planner increment controls | FAQ plus/minus reference | Exact Figma `faq-plus.svg` and `faq-minus.svg`, reused at the matching 14px control scale with accessible button labels. |

### TripAdvisor and rating corrections

- Preserved the original supplied TripAdvisor logo raster assets at their Figma-specific sizes and corner radii: homepage highlight, homepage rating bar, reviews hero, trip-detail price card and trip-review chip.
- Replaced every `★★★★★`/`★`/`☆` implementation with the Figma five-star SVG groups. The 116×20 rating summary and 104×20 review-card variants remain separate because their spacing differs in Figma.
- Replaced the footer’s generic owl character with the exact Figma TripAdvisor social SVG.
- Kept rating content unchanged at `4.9` and `157 reviews`.

### Replacements and asset policy

- Replaced Unicode/emoji location, clock, people, accommodation, meal, book, phone, email, pin, download, check, plus/minus, social, star, crown/tier and arrow stand-ins.
- Replaced CSS-generated overview bullets and FAQ minus glyphs with original Figma exports.
- Replaced generic CSS comfort-tier radio circles with the Figma selected/unselected radio SVGs.
- Original Figma SVGs reused: 65.
- Custom SVGs created: 0. No visual needed to be guessed or redrawn.
- External icon packages added: 0.

### Deliberately unrendered reference assets

- The Figma footer includes Instagram and Facebook symbols. Exact exports are staged as `footer-instagram.svg` and `footer-facebook.svg`, but they are not rendered because no verified profile URLs were supplied. This preserves the production rule against fake social links.
- The Figma overview shows previous/next gallery controls. Exact `chevron-prev.svg` and `chevron-next.svg` exports are staged, but the current site has a static gallery rather than carousel behavior. Non-functional icon-only buttons were not introduced during this icon-only pass.
- The supplied content contains no confirmed direct TripAdvisor profile URL, so the existing branded TripAdvisor search link remains. This affects destination, not logo fidelity.

### Verification evidence

| Check | Evidence |
| --- | --- |
| Figma comparisons | Node-level contexts inspected for `134:1600`, `63:2107`, `116:1618`, `135:1600`, `126:1638`, `127:1627`, `129:1600`, `129:1641`, `129:1659`, `128:1618`, `138:1620`, `138:1668`, `139:1629`, `139:1747`, `139:1770` and `145:1982`. |
| Desktop browser QA | Homepage and itinerary page visually inspected at 1440px; exact TripAdvisor stars, planner marks, download, bed, meal, information and package icons visible. |
| Tablet browser QA | Homepage inspected at 768×1024; `scrollWidth` remained within the viewport and the 116×20 star group remained aligned. |
| Mobile browser QA | Homepage and itinerary inspected at 390×844; document `scrollWidth` was 375px with no page-level horizontal overflow. |
| Asset integrity | Browser check reported zero visible images/SVGs with `naturalWidth === 0`. |
| Placeholder scan | Source scan reported zero Unicode/emoji icon substitutes in rendered `.tsx` files. Route-direction arrows in itinerary copy remain textual content, not UI icons. |
| Runtime | Browser console contained zero warnings or errors during the responsive pass. |
| Static validation | `npm run typecheck`, `npm run lint`, and `npm run build` all passed. Next.js generated all 15 static pages and completed production optimization. |
