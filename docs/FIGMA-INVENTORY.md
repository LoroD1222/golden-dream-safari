# Figma inventory

Source: `Golden Dreams Safari` (`nXKD3sKPSaGsIsXLoPc0lA`), inspected on 2026-11-17.

## Primary frames

| Figma node | Screen | Implemented route |
| --- | --- | --- |
| `63:1883` | Homepage | `/` |
| `126:1618` | Safari detail | `/trips/tarangire-serengeti-ngorongoro` |
| `136:1600` | Trips directory | `/trips` |
| `137:1600` | Reviews | `/reviews` |
| `138:1600` | About | `/about` |
| `139:1600` | Contact | `/contact` |
| `145:1982` | Quote flow states | `/contact#quote` |

## Shared visual system

- Urbanist variable font.
- Near-black navigation/footer surfaces, warm cream content surfaces and orange calls to action.
- Large editorial headings, rounded cards, soft neutral borders and generous section spacing. The latest frames use compact orange-dot section labels throughout the public pages.
- Shared header, mobile navigation, footer, buttons, FAQ, quote form and trip-card patterns.
- Image-led hero sections and asymmetrical grids on wide screens, collapsed into a single readable flow on mobile.

## Assets

The implementation exports and serves 212 exact Figma image assets from `public/images/figma`. No remote image hotlinks are required for the main visual experience. Decorative images use empty alt text; content-bearing images have descriptive alternatives.

## Functional interpretation

Figma states were turned into working product behavior:

- Directory category filters and sorting.
- Expandable review list and review filters.
- Native FAQ disclosures.
- Four-step quote wizard with flexible-date mode, counters and server submission.
- Mobile navigation.
- Reusable CMS-driven itinerary details and generated PDF.

## Intentional production adjustments

- The supplied design did not provide a verified Tripadvisor profile URL. Review CTAs use a branded Tripadvisor search rather than a generic or invented profile.
- Unspecified lodge/campsite names and mid-range pricing are shown as “confirmed in your proposal” or “on request”; placeholder brackets are not exposed publicly.
- Social profiles without confirmed URLs are omitted.
- Trip cards without a published itinerary route lead to the quote flow instead of a 404 page.
