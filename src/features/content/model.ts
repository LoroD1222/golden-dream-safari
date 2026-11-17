export type ContentStatus = "draft" | "published" | "archived";

export type CmsImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ReviewCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewCategoryInput = Omit<ReviewCategory, "id" | "createdAt" | "updatedAt">;

export type Review = {
  id: string;
  title: string;
  quote: string;
  rating: number;
  author: string;
  authorLocation?: string;
  meta: string;
  travelDate?: string;
  publishedDate?: string;
  travelerType?: string;
  source: string;
  sourceUrl?: string;
  sourceReviewId?: string;
  originalLanguage?: string;
  translated: boolean;
  categoryIds: string[];
  tripSlugs: string[];
  images: CmsImage[];
  reply?: string;
  replyAuthor?: string;
  replyDate?: string;
  verified: boolean;
  featuredOnHomepage: boolean;
  featuredOnTripPages: boolean;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewInput = Omit<Review, "id" | "createdAt" | "updatedAt">;

export type AccommodationRecord = {
  id: string;
  name: string;
  slug: string;
  category: "Group camping" | "Mid-range lodge" | "Private luxury" | "Other";
  location: string;
  description: string;
  images: CmsImage[];
  website?: string;
  availabilityNote?: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type AccommodationInput = Omit<AccommodationRecord, "id" | "createdAt" | "updatedAt">;

export type SiteSettings = {
  id: "site-settings";
  company: {
    name: string;
    description: string;
    logo: string;
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
    location: string;
  };
  tripDefaults: {
    startEnd: string;
    groupStyle: string;
    bestFor: string;
    priceNote: string;
    maximumPriceLabel: string;
  };
  reviews: {
    pageTitle: string;
    pageIntroduction: string;
    heroImage: string;
    sourceName: string;
    sourceUrl: string;
    aggregateRating: number;
    aggregateCount: number;
  };
  updatedAt: string;
};

export type SiteSettingsInput = Omit<SiteSettings, "id" | "updatedAt">;

export interface ContentRepository<T extends {id: string}, TInput> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: string, input: TInput): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}
