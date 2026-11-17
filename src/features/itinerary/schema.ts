import {z} from "zod";

const text = z.string().trim().min(1).max(4000);
const activitySchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(160),
  description: text,
  time: z.string().trim().max(40).optional(),
  location: z.string().trim().max(160).optional(),
});

const accommodationSchema = z.object({
  name: z.string().trim().min(1).max(160),
  category: z.enum(["Group camping", "Mid-range lodge", "Private luxury", "Other"]),
  location: z.string().trim().min(1).max(160),
  description: text,
  image: z.string().trim().max(500).optional(),
});

const itineraryImageSchema = z.object({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(240),
  caption: z.string().trim().max(500).optional(),
});

const routeStopSchema = z.object({
  name: z.string().trim().min(1).max(160),
  label: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  dayNumber: z.number().int().min(1).max(60),
  coordinates: z.object({lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180)}),
});

const priceTierSchema = z.object({
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(100),
  suffix: z.string().trim().max(60).optional(),
  description: z.string().trim().min(1).max(500),
});

const optionalExperienceSchema = z.object({
  name: z.string().trim().min(1).max(160),
  price: z.string().trim().min(1).max(100),
  note: z.string().trim().min(1).max(500),
});

const faqSchema = z.object({
  question: z.string().trim().min(1).max(240),
  answer: z.string().trim().min(1).max(2000),
});

const downloadConfigSchema = z.object({
  enabled: z.boolean(),
  buttonLabel: z.string().trim().min(1).max(80),
  mobileTitle: z.string().trim().min(1).max(80),
  mobileDescription: z.string().trim().min(1).max(240),
  lockedMessage: z.string().trim().min(1).max(240),
  successMessage: z.string().trim().min(1).max(240),
  errorMessage: z.string().trim().min(1).max(240),
  companyName: z.string().trim().min(1).max(120),
  companyDescription: z.string().trim().min(1).max(500),
  companyLogo: z.string().trim().max(500).optional(),
  contactEmail: z.email().max(254),
  contactPhone: z.string().trim().min(1).max(60),
  contactLocation: z.string().trim().min(1).max(120),
  contactWebsite: z.string().trim().max(180).optional(),
  contactWhatsApp: z.string().trim().max(60).optional(),
});

const daySchema = z.object({
  id: z.string().min(1).max(100),
  dayNumber: z.number().int().min(1).max(60),
  title: z.string().trim().min(1).max(180),
  summary: text,
  narrative: text.optional(),
  habitat: z.string().trim().max(160).optional(),
  driveTime: z.string().trim().max(120).optional(),
  distance: z.string().trim().max(120).optional(),
  activityLevel: z.string().trim().max(120).optional(),
  meals: z.array(z.string().trim().min(1).max(80)).max(6),
  activities: z.array(activitySchema).max(20),
  accommodation: accommodationSchema.optional(),
  accommodationIds: z.array(z.string().trim().min(1).max(100)).max(12).optional(),
  image: z.string().trim().max(500).optional(),
  imageAlt: z.string().trim().max(240).optional(),
  dropOffNote: z.string().trim().max(500).optional(),
});

export const itineraryInputSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  title: z.string().trim().min(2).max(180),
  summary: text,
  heroImage: z.string().trim().max(500).optional(),
  overviewTitle: z.string().trim().max(180).optional(),
  overviewParagraphs: z.array(text).max(8).optional(),
  highlights: z.array(z.string().trim().min(1).max(300)).max(20).optional(),
  galleryImages: z.array(itineraryImageSchema).max(20).optional(),
  routeStops: z.array(routeStopSchema).max(30).optional(),
  durationDays: z.number().int().min(1).max(60),
  destinations: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
  startingPrice: z.number().nonnegative().optional(),
  currency: z.string().trim().length(3),
  status: z.enum(["draft", "published"]),
  days: z.array(daySchema).min(1).max(60),
  inclusions: z.array(z.string().trim().min(1).max(240)).max(40),
  exclusions: z.array(z.string().trim().min(1).max(240)).max(40),
  onRequestItems: z.array(z.string().trim().min(1).max(240)).max(40).optional(),
  priceIntroduction: text.optional(),
  priceTiers: z.array(priceTierSchema).max(12).optional(),
  optionalExperiences: z.array(optionalExperienceSchema).max(20).optional(),
  travelStyle: z.string().trim().max(120).optional(),
  practicalInformation: z.array(z.string().trim().min(1).max(500)).max(30).optional(),
  packingNotes: z.array(z.string().trim().min(1).max(500)).max(30).optional(),
  bookingConditions: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  faqs: z.array(faqSchema).max(30).optional(),
  relatedTripSlugs: z.array(z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120)).max(12).optional(),
  download: downloadConfigSchema.optional(),
}).superRefine((itinerary, context) => {
  if (itinerary.durationDays !== itinerary.days.length) {
    context.addIssue({code: "custom", path: ["durationDays"], message: "Duration must match the number of itinerary days."});
  }

  const dayIds = new Set<string>();
  itinerary.days.forEach((day, dayIndex) => {
    if (day.dayNumber !== dayIndex + 1) {
      context.addIssue({code: "custom", path: ["days", dayIndex, "dayNumber"], message: "Day numbers must be consecutive and in order."});
    }
    if (dayIds.has(day.id)) {
      context.addIssue({code: "custom", path: ["days", dayIndex, "id"], message: "Each day must have a unique ID."});
    }
    dayIds.add(day.id);

    const activityIds = new Set<string>();
    day.activities.forEach((activity, activityIndex) => {
      if (activityIds.has(activity.id)) {
        context.addIssue({code: "custom", path: ["days", dayIndex, "activities", activityIndex, "id"], message: "Each activity in a day must have a unique ID."});
      }
      activityIds.add(activity.id);
    });
  });
});

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
