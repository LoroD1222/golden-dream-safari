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

const daySchema = z.object({
  id: z.string().min(1).max(100),
  dayNumber: z.number().int().min(1).max(60),
  title: z.string().trim().min(1).max(180),
  summary: text,
  habitat: z.string().trim().max(160).optional(),
  meals: z.array(z.string().trim().min(1).max(80)).max(6),
  activities: z.array(activitySchema).max(20),
  accommodation: accommodationSchema.optional(),
});

export const itineraryInputSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  title: z.string().trim().min(2).max(180),
  summary: text,
  heroImage: z.string().trim().max(500).optional(),
  durationDays: z.number().int().min(1).max(60),
  destinations: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
  startingPrice: z.number().nonnegative().optional(),
  currency: z.string().trim().length(3),
  status: z.enum(["draft", "published"]),
  days: z.array(daySchema).min(1).max(60),
  inclusions: z.array(z.string().trim().min(1).max(240)).max(40),
  exclusions: z.array(z.string().trim().min(1).max(240)).max(40),
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
