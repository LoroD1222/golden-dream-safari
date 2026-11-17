import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {reviewInputSchema} from "../src/features/content/schema";
import {itineraryInputSchema} from "../src/features/itinerary/schema";

test("the deployment seed exposes every CMS-backed itinerary section", () => {
  const [item] = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
  void _id; void _createdAt; void _updatedAt;
  const parsed = itineraryInputSchema.safeParse(input);
  assert.equal(parsed.success, true, parsed.success ? undefined : JSON.stringify(parsed.error.issues));
  if (!parsed.success) return;
  assert.ok(parsed.data.galleryImages?.length);
  assert.ok(parsed.data.routeStops?.length);
  assert.ok(parsed.data.priceTiers?.length);
  assert.ok(parsed.data.faqs?.length);
  assert.ok(parsed.data.days.every(day => day.narrative && day.driveTime && day.distance));
});

test("a review can belong to an expanding set of categories", () => {
  const categoryIds = Array.from({length: 45}, (_, index) => `category-${index + 1}`);
  const parsed = reviewInputSchema.safeParse({title: "Guest review", quote: "A thoughtful safari review.", rating: 5, author: "Guest", meta: "November 2026", source: "Direct", translated: false, categoryIds, tripSlugs: [], images: [], verified: true, featuredOnHomepage: false, featuredOnTripPages: false, status: "published", order: 10});
  assert.equal(parsed.success, true, parsed.success ? undefined : JSON.stringify(parsed.error.issues));
});
