export type Activity = {
  id: string;
  title: string;
  description: string;
  time?: string;
  location?: string;
};

export type Accommodation = {
  name: string;
  category: "Group camping" | "Mid-range lodge" | "Private luxury" | "Other";
  location: string;
  description: string;
  image?: string;
};

export type ItineraryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ItineraryRouteStop = {
  name: string;
  label: string;
  description: string;
  dayNumber: number;
  coordinates: {lat: number; lng: number};
};

export type ItineraryPriceTier = {
  name: string;
  price: string;
  suffix?: string;
  description: string;
};

export type OptionalExperience = {
  name: string;
  price: string;
  note: string;
};

export type ItineraryFaq = {
  question: string;
  answer: string;
};

export type ItineraryDay = {
  id: string;
  dayNumber: number;
  title: string;
  summary: string;
  narrative?: string;
  habitat?: string;
  driveTime?: string;
  distance?: string;
  activityLevel?: string;
  meals: string[];
  activities: Activity[];
  accommodation?: Accommodation;
  accommodationIds?: string[];
  image?: string;
  imageAlt?: string;
  dropOffNote?: string;
};

export type ItineraryDownloadConfig = {
  enabled: boolean;
  buttonLabel: string;
  mobileTitle: string;
  mobileDescription: string;
  lockedMessage: string;
  successMessage: string;
  errorMessage: string;
  companyName: string;
  companyDescription: string;
  companyLogo?: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  contactWebsite?: string;
  contactWhatsApp?: string;
};

export type Itinerary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  heroImage?: string;
  overviewTitle?: string;
  overviewParagraphs?: string[];
  highlights?: string[];
  galleryImages?: ItineraryImage[];
  routeStops?: ItineraryRouteStop[];
  durationDays: number;
  destinations: string[];
  startingPrice?: number;
  currency: string;
  status: "draft" | "published";
  days: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  onRequestItems?: string[];
  priceIntroduction?: string;
  priceTiers?: ItineraryPriceTier[];
  optionalExperiences?: OptionalExperience[];
  travelStyle?: string;
  practicalInformation?: string[];
  packingNotes?: string[];
  bookingConditions?: string[];
  faqs?: ItineraryFaq[];
  relatedTripSlugs?: string[];
  download?: ItineraryDownloadConfig;
  createdAt: string;
  updatedAt: string;
};

export type ItineraryInput = Omit<Itinerary, "id" | "createdAt" | "updatedAt">;

export interface ItineraryRepository {
  list(): Promise<Itinerary[]>;
  get(idOrSlug: string): Promise<Itinerary | null>;
  create(input: ItineraryInput): Promise<Itinerary>;
  update(id: string, input: ItineraryInput): Promise<Itinerary | null>;
  remove(id: string): Promise<boolean>;
}
