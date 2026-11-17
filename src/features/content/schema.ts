import {z} from "zod";

const contentStatus = z.enum(["draft", "published", "archived"]);
const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const imageSchema = z.object({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(240),
  caption: z.string().trim().max(500).optional(),
});

export const reviewCategoryInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug,
  description: z.string().trim().max(500).optional(),
  status: contentStatus,
  order: z.number().int().min(0).max(10000),
});

export const reviewInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  quote: z.string().trim().min(1).max(6000),
  rating: z.number().min(1).max(5),
  author: z.string().trim().min(1).max(160),
  authorLocation: z.string().trim().max(180).optional(),
  meta: z.string().trim().min(1).max(240),
  travelDate: z.string().trim().max(40).optional(),
  publishedDate: z.string().trim().max(40).optional(),
  travelerType: z.string().trim().max(100).optional(),
  source: z.string().trim().min(1).max(100),
  sourceUrl: z.string().trim().max(500).optional(),
  sourceReviewId: z.string().trim().max(180).optional(),
  originalLanguage: z.string().trim().max(80).optional(),
  translated: z.boolean(),
  categoryIds: z.array(z.string().trim().min(1).max(100)).max(200),
  tripSlugs: z.array(slug).max(30),
  images: z.array(imageSchema).max(20),
  reply: z.string().trim().max(3000).optional(),
  replyAuthor: z.string().trim().max(120).optional(),
  replyDate: z.string().trim().max(40).optional(),
  verified: z.boolean(),
  featuredOnHomepage: z.boolean(),
  featuredOnTripPages: z.boolean(),
  status: contentStatus,
  order: z.number().int().min(0).max(100000),
});

export const accommodationInputSchema = z.object({
  name: z.string().trim().min(1).max(180),
  slug,
  category: z.enum(["Group camping", "Mid-range lodge", "Private luxury", "Other"]),
  location: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(4000),
  images: z.array(imageSchema).max(30),
  website: z.string().trim().max(500).optional(),
  availabilityNote: z.string().trim().max(500).optional(),
  status: contentStatus,
  order: z.number().int().min(0).max(10000),
});

export const siteSettingsInputSchema = z.object({
  company: z.object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(1000),
    logo: z.string().trim().min(1).max(500),
    email: z.email().max(254),
    phone: z.string().trim().min(1).max(80),
    whatsapp: z.string().trim().min(1).max(500),
    website: z.string().trim().min(1).max(500),
    location: z.string().trim().min(1).max(180),
  }),
  tripDefaults: z.object({
    startEnd: z.string().trim().min(1).max(180),
    groupStyle: z.string().trim().min(1).max(180),
    bestFor: z.string().trim().min(1).max(180),
    priceNote: z.string().trim().min(1).max(500),
    maximumPriceLabel: z.string().trim().min(1).max(180),
  }),
  reviews: z.object({
    pageTitle: z.string().trim().min(1).max(180),
    pageIntroduction: z.string().trim().min(1).max(500),
    heroImage: z.string().trim().min(1).max(500),
    sourceName: z.string().trim().min(1).max(100),
    sourceUrl: z.string().trim().min(1).max(500),
    aggregateRating: z.number().min(0).max(5),
    aggregateCount: z.number().int().min(0).max(1000000),
  }),
});
