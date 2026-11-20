import type {SiteSettings} from "@/features/content/model";

export const defaultSiteSettings: SiteSettings = {
  id: "site-settings",
  company: {
    name: "Golden Dream Safaris",
    description: "A local safari company in Arusha, Tanzania, planning thoughtful wildlife journeys with the guides who lead them.",
    logo: "/images/figma/brand-mark.png",
    email: "info@golden-dream-safaris.com",
    phone: "+255 763 571 646",
    whatsapp: "https://wa.me/255763571646",
    website: "https://www.golden-dream-safaris.com/",
    location: "Arusha, Tanzania",
  },
  tripDefaults: {
    startEnd: "Your hotel in Arusha",
    groupStyle: "Join a group or private",
    bestFor: "A first safari",
    priceNote: "The displayed amount is this itinerary's published starting price. Your exact quote depends on dates, group size and accommodation.",
    maximumPriceLabel: "Route-specific quote",
  },
  reviews: {
    pageTitle: "What our guests say",
    pageIntroduction: "All reviews below are from Tripadvisor, written by guests who travelled with us.",
    heroImage: "/images/figma/reviews-hero-figma.png",
    sourceName: "Tripadvisor",
    sourceUrl: "https://www.tripadvisor.com/Search?q=Golden%20Dream%20Safaris%20Tanzania",
    aggregateRating: 4.9,
    aggregateCount: 157,
  },
  updatedAt: "2026-11-17T00:00:00.000Z",
};
