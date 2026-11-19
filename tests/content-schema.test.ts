import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
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

test("every published itinerary has one canonical, auditable price record", () => {
  const items = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  assert.equal(new Set(items.map(item => item.slug)).size, items.length);

  for (const item of items) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
    void _id; void _createdAt; void _updatedAt;
    const parsed = itineraryInputSchema.safeParse(input);
    assert.equal(parsed.success, true, parsed.success ? undefined : `${String(item.slug)}: ${JSON.stringify(parsed.error.issues)}`);
    if (!parsed.success || parsed.data.status !== "published") continue;
    assert.ok(parsed.data.priceIntroduction, `${parsed.data.slug} is missing its price explanation`);
    if (parsed.data.startingPrice === undefined) {
      assert.match(parsed.data.priceIntroduction, /request|quote|confirm/i, `${parsed.data.slug} must not imply an unconfirmed numeric price`);
    }
  }

  const safari = items.find(item => item.slug === "tarangire-serengeti-ngorongoro");
  assert.equal(safari?.startingPrice, 180);
  assert.equal((safari?.priceTiers as Array<{price: string}> | undefined)?.[0]?.price, "$180");
});

test("a review can belong to an expanding set of categories", () => {
  const categoryIds = Array.from({length: 45}, (_, index) => `category-${index + 1}`);
  const parsed = reviewInputSchema.safeParse({title: "Guest review", quote: "A thoughtful safari review.", rating: 5, author: "Guest", meta: "November 2026", source: "Direct", translated: false, categoryIds, tripSlugs: [], images: [], verified: true, featuredOnHomepage: false, featuredOnTripPages: false, status: "published", order: 10});
  assert.equal(parsed.success, true, parsed.success ? undefined : JSON.stringify(parsed.error.issues));
});

test("every Elementor Kilimanjaro route maps to one complete local itinerary", () => {
  const items = JSON.parse(readFileSync("data/kilimanjaro-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  assert.equal(items.length, 12);
  assert.equal(new Set(items.map(item => item.slug)).size, items.length);
  assert.equal(new Set(items.map(item => item.sourceId)).size, items.length);

  for (const item of items) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
    void _id; void _createdAt; void _updatedAt;
    const parsed = itineraryInputSchema.safeParse(input);
    assert.equal(parsed.success, true, parsed.success ? undefined : `${String(item.slug)}: ${JSON.stringify(parsed.error.issues)}`);
    if (!parsed.success) continue;
    assert.equal(parsed.data.tripType, "Kilimanjaro trek");
    assert.equal(parsed.data.days.length, parsed.data.durationDays);
    assert.ok(parsed.data.days.every(day => day.accommodation || day.dropOffNote));
    for (const source of [parsed.data.heroImage, ...parsed.data.days.map(day => day.image)]) {
      assert.ok(source?.startsWith("/images/kilimanjaro-packages/"));
      assert.ok(existsSync(`public${source}`), `Missing local image: ${source}`);
    }
  }
});

test("the five downloaded quotations map to five unique, complete itineraries", () => {
  const items = JSON.parse(readFileSync("data/download-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  assert.equal(items.length, 5);
  assert.equal(new Set(items.map(item => item.slug)).size, items.length);
  assert.equal(new Set(items.map(item => item.sourceId)).size, items.length);
  assert.equal(items.filter(item => item.tripType === "Wildlife safari").length, 4);
  assert.equal(items.filter(item => item.tripType === "Kilimanjaro trek").length, 1);

  for (const item of items) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
    void _id; void _createdAt; void _updatedAt;
    const parsed = itineraryInputSchema.safeParse(input);
    assert.equal(parsed.success, true, parsed.success ? undefined : `${String(item.slug)}: ${JSON.stringify(parsed.error.issues)}`);
    if (!parsed.success) continue;
    assert.equal(parsed.data.days.length, parsed.data.durationDays);
    assert.ok(parsed.data.sourceId?.startsWith("download-pdf:"));
    assert.ok(parsed.data.sourcePath?.endsWith(".pdf"));
    for (const source of [parsed.data.heroImage, ...parsed.data.days.map(day => day.image)]) {
      assert.ok(source?.startsWith("/images/"));
      assert.ok(existsSync(`public${source}`), `Missing local image: ${source}`);
    }
  }
});

test("the supplied day-trip package exposes exactly three complete routes", () => {
  const items = JSON.parse(readFileSync("data/day-trip-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  assert.equal(items.length, 3);
  assert.equal(new Set(items.map(item => item.slug)).size, items.length);
  assert.equal(new Set(items.map(item => item.sourceId)).size, items.length);

  for (const item of items) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
    void _id; void _createdAt; void _updatedAt;
    const parsed = itineraryInputSchema.safeParse(input);
    assert.equal(parsed.success, true, parsed.success ? undefined : `${String(item.slug)}: ${JSON.stringify(parsed.error.issues)}`);
    if (!parsed.success) continue;
    assert.equal(parsed.data.tripType, "Day trip");
    assert.equal(parsed.data.durationDays, 1);
    assert.equal(parsed.data.days.length, 1);
    assert.equal(parsed.data.priceTiers?.length, 2);
    assert.ok(parsed.data.sourceId?.startsWith("download-html:"));
    for (const source of [parsed.data.heroImage, ...(parsed.data.galleryImages?.map(image => image.src) || [])]) {
      assert.ok(source?.startsWith("/images/"));
      assert.ok(existsSync(`public${source}`), `Missing local image: ${source}`);
    }
  }
});
