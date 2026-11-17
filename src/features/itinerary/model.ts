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

export type ItineraryDay = {
  id: string;
  dayNumber: number;
  title: string;
  summary: string;
  habitat?: string;
  meals: string[];
  activities: Activity[];
  accommodation?: Accommodation;
  image?: string;
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
  durationDays: number;
  destinations: string[];
  startingPrice?: number;
  currency: string;
  status: "draft" | "published";
  days: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  travelStyle?: string;
  practicalInformation?: string[];
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
