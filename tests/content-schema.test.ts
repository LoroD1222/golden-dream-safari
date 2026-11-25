import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import test from "node:test";
import {reviewInputSchema} from "../src/features/content/schema";
import {itineraryInputSchema} from "../src/features/itinerary/schema";
import {legacyRedirects} from "../src/data/legacy-redirects";

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
  assert.equal(safari?.startingPrice, 1795);
  assert.deepEqual((safari?.priceTiers as Array<{price: string}> | undefined)?.map(tier => tier.price), ["$1,795", "$1,460", "$1,350"]);

  for (const slug of ["tarangire-serengeti-ngorongoro", "tarangire-national-park-day-safari", "ngorongoro-crater-day-trip"]) {
    const featured = items.find(item => item.slug === slug);
    assert.equal(featured?.status, "published", `${slug} must remain published for the homepage`);
    assert.equal(typeof featured?.startingPrice, "number", `${slug} must have a confirmed homepage price`);
  }
});

test("every published itinerary has traceable source provenance", () => {
  const items = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  const allowedSourcePrefixes = /^(swt|elementor|download-pdf|download-html):/;

  for (const item of items) {
    if (item.status !== "published") continue;
    const slug = String(item.slug);
    const sourceId = String(item.sourceId || "");
    const sourceUrl = item.sourceUrl ? String(item.sourceUrl) : undefined;
    const sourcePath = item.sourcePath ? String(item.sourcePath) : undefined;

    assert.match(sourceId, allowedSourcePrefixes, `${slug} needs an approved source identifier`);
    assert.ok(sourceUrl || sourcePath, `${slug} needs a source URL or supplied source file`);

    if (sourceUrl) {
      const url = new URL(sourceUrl);
      assert.equal(url.protocol, "https:", `${slug} source URL must use HTTPS`);
      assert.match(url.hostname, /^(www\.)?serengetiwildtours\.com$/, `${slug} source URL must point to SWT`);
      assert.doesNotMatch(url.pathname, /^\/(kilimanjaro-packages|private-tanzania-safaris)\//, `${slug} uses an obsolete SWT source URL`);
    }
  }

  const featured = items.find(item => item.slug === "tarangire-serengeti-ngorongoro");
  assert.equal(featured?.sourceUrl, "https://www.serengetiwildtours.com/4-days-tarangire-serengeti-ngorongoro-private-safari/");
  assert.equal(featured?.startingPrice, 1795);
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

test("Mount Meru and Zanzibar are complete public itinerary collections", () => {
  const items = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  const mountMeru = items.filter(item => item.tripType === "Mount Meru trek");
  const zanzibar = items.filter(item => item.tripType === "Zanzibar stay");

  assert.equal(mountMeru.length, 2);
  assert.equal(zanzibar.length, 6);
  assert.deepEqual(zanzibar.map(item => item.durationDays).sort(), [3, 4, 5, 6, 7, 8]);

  for (const item of [...mountMeru, ...zanzibar]) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
    void _id; void _createdAt; void _updatedAt;
    const parsed = itineraryInputSchema.safeParse(input);
    assert.equal(parsed.success, true, parsed.success ? undefined : `${String(item.slug)}: ${JSON.stringify(parsed.error.issues)}`);
    if (!parsed.success) continue;
    assert.equal(parsed.data.days.length, parsed.data.durationDays);
    assert.ok(parsed.data.heroImage && existsSync(`public${parsed.data.heroImage}`));
  }
});

test("every published day has useful copy and a valid local image", () => {
  const items = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  let auditedDays = 0;

  for (const item of items) {
    if (item.status !== "published") continue;
    const slug = String(item.slug);
    const days = item.days as Array<{
      dayNumber: number;
      summary: string;
      narrative?: string;
      habitat?: string;
      activityLevel?: string;
      meals: string[];
      image?: string;
      imageAlt?: string;
    }>;

    assert.equal(days.length, item.durationDays, `${slug} must contain one record for every day`);
    for (const day of days) {
      auditedDays += 1;
      assert.ok(day.summary.trim().length >= 18, `${slug} day ${day.dayNumber} needs a useful summary`);
      assert.ok((day.narrative || "").trim().length >= 60, `${slug} day ${day.dayNumber} needs a useful narrative`);
      assert.ok(day.habitat, `${slug} day ${day.dayNumber} needs habitat or setting context`);
      assert.ok(day.activityLevel, `${slug} day ${day.dayNumber} needs an activity level`);
      assert.ok(day.meals.length > 0, `${slug} day ${day.dayNumber} needs meal information`);
      assert.ok(day.image?.startsWith("/images/"), `${slug} day ${day.dayNumber} needs a local image`);
      assert.ok(day.imageAlt?.trim(), `${slug} day ${day.dayNumber} needs descriptive image alt text`);
      assert.ok(existsSync(`public${day.image}`), `${slug} day ${day.dayNumber} image is missing: ${day.image}`);
    }
  }

  assert.equal(auditedDays, 218);
});

test("the 8 Days Lemosho route matches the current published SWT itinerary", () => {
  const items = JSON.parse(readFileSync("data/seed-itineraries.json", "utf8")) as Array<Record<string, unknown>>;
  const lemosho = items.find(item => item.slug === "8-days-lemosho-route") as Record<string, unknown> | undefined;
  assert.equal(lemosho?.title, "8 Days Lemosho Route Kilimanjaro");
  assert.equal(lemosho?.sourceUrl, "https://www.serengetiwildtours.com/8-days-lemosho-route-kilimanjaro/");
  assert.equal(lemosho?.startingPrice, 2120);
  assert.deepEqual((lemosho?.days as Array<{dayNumber: number; title: string}>).map(day => day.dayNumber), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal((lemosho?.days as Array<{title: string}>)[2].title, "Shira 1 Camp to Shira 2 Camp");
  assert.equal((lemosho?.priceTiers as Array<unknown>).length, 3);
});

test("legacy SWT paths permanently redirect to one canonical Golden Dream route", () => {
  assert.equal(new Set(legacyRedirects.map(item => item.source)).size, legacyRedirects.length);
  assert.ok(legacyRedirects.every(item => item.permanent));
  assert.deepEqual(legacyRedirects.find(item => item.source === "/8-days-lemosho-route-kilimanjaro"), {
    source: "/8-days-lemosho-route-kilimanjaro",
    destination: "/trips/8-days-lemosho-route",
    permanent: true,
  });
  assert.equal(legacyRedirects.find(item => item.source === "/mount-meru-tanzania")?.destination, "/trips?category=mount-meru");
  assert.equal(legacyRedirects.find(item => item.source === "/zanzibar")?.destination, "/trips?category=zanzibar");
  assert.equal(legacyRedirects.find(item => item.source === "/kilimanjaro-trekking")?.destination, "/kilimanjaro");
  assert.equal(legacyRedirects.find(item => item.source === "/request-a-quote")?.destination, "/contact#quote");
});
