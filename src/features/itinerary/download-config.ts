import type {Itinerary, ItineraryDownloadConfig} from "@/features/itinerary/model";

export const defaultItineraryDownloadConfig: ItineraryDownloadConfig = {
  enabled: true,
  buttonLabel: "Download itinerary",
  mobileTitle: "Download itinerary",
  mobileDescription: "Free PDF with the complete day-by-day safari plan.",
  lockedMessage: "Complete and submit this form to unlock your downloadable PDF itinerary.",
  successMessage: "Thank you. Your itinerary is ready to download.",
  errorMessage: "We could not send your enquiry. Please try again.",
  companyName: "Golden Dream Safaris",
  companyDescription: "A local safari company in Arusha, Tanzania, planning thoughtful wildlife journeys with the guides who lead them.",
  companyLogo: "/images/figma/brand-mark.png",
  contactEmail: "info@golden-dream-safaris.com",
  contactPhone: "+255 763 571 646",
  contactLocation: "Arusha, Tanzania",
  contactWebsite: "www.golden-dream-safaris.com",
  contactWhatsApp: "+255 763 571 646",
};

export function getItineraryDownloadConfig(itinerary: Pick<Itinerary, "download">) {
  return {...defaultItineraryDownloadConfig, ...itinerary.download};
}
