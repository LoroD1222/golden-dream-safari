import {readFileSync, readdirSync, writeFileSync} from "node:fs";
import path from "node:path";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) {
  throw new Error("Pass the Elementor export directory as the first argument.");
}

const projectRoot = process.cwd();
const imageRoot = "/images/kilimanjaro-packages";
const generatedAt = "2026-11-19T00:00:00.000Z";

const routeImageBySource = {
  "5-days-marangu-route-kilimanjaro.html": "5-days-marangu-route-kilimanjaro-budget-package.jpg",
  "6-days-machame-route-kilimanjaro.html": "6-days-machame-route-kilimanjaro-private-climb.jpg",
  "6-days-marangu-route-kilimanjaro.html": "6-days-marangu-route-kilimanjaro-hut-climb.jpg",
  "6-days-rongai-route-kilimanjaro.html": "6-days-rongai-route-kilimanjaro-private-trek.jpg",
  "6-days-umbwe-route-kilimanjaro.html": "6-days-umbwe-route-kilimanjaro-steep-trail.jpg",
  "7-days-lemosho-route-kilimanjaro.html": "7-days-lemosho-route-kilimanjaro-shira-plateau.jpg",
  "7-days-machame-route-kilimanjaro.html": "7-days-machame-route-kilimanjaro-climbing-package.jpg",
  "7-days-rongai-route-kilimanjaro.html": "7-days-rongai-route-kilimanjaro-northern-approach.jpg",
  "7-days-umbwe-route-kilimanjaro.html": "7-days-umbwe-route-kilimanjaro-challenging-climb.jpg",
  "8-days-lemosho-route-kilimanjaro.html": "8-days-lemosho-route-kilimanjaro-scenic-climb.jpg",
  "8-days-northern-circuit-route-kilimanjaro.html": "8-days-northern-circuit-route-kilimanjaro-trek.jpg",
  "9-days-northern-circuit-route-kilimanjaro.html": "9-days-northern-circuit-route-kilimanjaro-quiet-trail.jpg",
};

const galleryPool = [
  ["kilimanjaro-climbing-packages-serengeti-wild-tours.jpg", "Climbers on Mount Kilimanjaro"],
  ["kilimanjaro-local-mountain-guides-serengeti-wild-tours.jpg", "Local Kilimanjaro mountain guides"],
  ["kilimanjaro-mawenzi-sunset-above-clouds.jpg", "Mawenzi at sunset above the clouds"],
  ["kilimanjaro-mountain-camp-orange-tents.jpg", "Mountain camp on Kilimanjaro"],
  ["kilimanjaro-summit-sunrise-serengeti-wild-tours.jpg", "Sunrise near the summit of Kilimanjaro"],
  ["kilimanjaro-summit-view-mawenzi-serengeti-wild-tours.jpg", "Kilimanjaro summit view towards Mawenzi"],
];

const stopCoordinates = {
  Moshi: [-3.3349, 37.3404],
  "Marangu Gate": [-3.2142, 37.5168],
  "Mandara Hut": [-3.1748, 37.5126],
  "Horombo Hut": [-3.1408, 37.4559],
  "Kibo Hut": [-3.0764, 37.3887],
  "Machame Gate": [-3.1684, 37.2374],
  "Machame Camp": [-3.1068, 37.2827],
  "Shira Camp": [-3.0952, 37.3107],
  "Shira 1 Camp": [-3.0738, 37.2964],
  "Shira 2 Camp": [-3.0909, 37.3244],
  "Lava Tower": [-3.0678, 37.3398],
  "Barranco Camp": [-3.0966, 37.3292],
  "Karanga Camp": [-3.1111, 37.3502],
  "Barafu Camp": [-3.0991, 37.3701],
  "Mweka Camp": [-3.1641, 37.3491],
  "Mweka Gate": [-3.2216, 37.3409],
  "Lemosho Gate": [-3.1611, 37.1916],
  "Londorossi Gate": [-3.1102, 37.1717],
  "Mti Mkubwa Camp": [-3.0869, 37.2423],
  "Moir Hut": [-3.0448, 37.3325],
  "Buffalo Camp": [-3.0217, 37.3632],
  "Third Cave Camp": [-3.0321, 37.4079],
  "School Hut": [-3.0719, 37.3975],
  "Rongai Gate": [-2.9912, 37.5374],
  "Simba Camp": [-3.0145, 37.5091],
  "Second Cave Camp": [-3.0265, 37.4736],
  "Kikelewa Camp": [-3.0443, 37.4472],
  "Mawenzi Tarn": [-3.0583, 37.4457],
  "Umbwe Gate": [-3.2448, 37.2691],
  "Umbwe Cave Camp": [-3.175, 37.3002],
  "Uhuru Peak": [-3.0758, 37.3533],
};

function text(value = "") {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function listItems(value = "") {
  return [...value.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(match => text(match[1]));
}

function paragraphItems(value = "") {
  return [...value.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map(match => text(match[1])).filter(Boolean);
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1] || "";
}

function routeSlug(url) {
  return new URL(url).pathname.split("/").filter(Boolean).at(-1);
}

function routeFamily(title) {
  return title.replace(/^\d+ Day /, "").replace(/ Kilimanjaro (Climb|Hut Climb)$/, "");
}

function accommodationFor(title, route) {
  const destination = title.split(/, then | to /).at(-1)?.trim() || "Mountain camp";
  const usesHuts = route.includes("Marangu") || /Hut/.test(destination);
  const finalDay = /Gate and Moshi/.test(title);
  if (finalDay) return undefined;
  return {
    name: usesHuts ? destination.replace(/^the /i, "") : destination.replace(/^the /i, ""),
    category: "Other",
    location: destination.replace(/ Camp| Hut/g, "").trim(),
    description: usesHuts
      ? "Shared mountain hut accommodation on the Marangu Route. Final arrangements are confirmed with your climb booking."
      : "Mountain camping with tents prepared by the crew. The exact camp follows the published route and park conditions.",
  };
}

function imageForDay(title) {
  if (/Uhuru|summit/i.test(title)) return "kilimanjaro-summit-sunrise-serengeti-wild-tours.jpg";
  if (/Mawenzi|Kibo|School Hut|Third Cave/i.test(title)) return "kilimanjaro-mawenzi-sunset-above-clouds.jpg";
  if (/Barranco/i.test(title)) return "kilimanjaro-barranco-camp-yellow-tents.jpg";
  if (/Barafu|Karanga|Shira|Moir|Buffalo/i.test(title)) return "kilimanjaro-high-camp-green-tents.jpg";
  if (/Gate|Mti Mkubwa|Machame Camp|Mandara/i.test(title)) return "kilimanjaro-mountain-camp-orange-tents.jpg";
  return "kilimanjaro-summit-view-mawenzi-serengeti-wild-tours.jpg";
}

function habitatFor(title, description) {
  const value = `${title} ${description}`;
  if (/rainforest|forest|Gate|Mti Mkubwa|Mandara/i.test(value)) return "Montane rainforest";
  if (/heath|moorland|Shira|Horombo/i.test(value)) return "Heath and moorland";
  if (/summit|Uhuru|Stella|Gilman/i.test(value)) return "Arctic summit zone";
  return "Alpine desert";
}

function destinationFromTitle(title) {
  const candidates = Object.keys(stopCoordinates)
    .filter(candidate => title.includes(candidate))
    .sort((a, b) => title.lastIndexOf(b) - title.lastIndexOf(a) || b.length - a.length);
  return candidates[0] || "Moshi";
}

function sourceGraph(html) {
  const raw = firstMatch(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const parsed = JSON.parse(raw);
  return parsed["@graph"] || [parsed];
}

function makeItinerary(filename) {
  const html = readFileSync(path.join(sourceDirectory, filename), "utf8");
  const graph = sourceGraph(html);
  const touristTrip = graph.find(item => item["@type"] === "TouristTrip");
  const faqPage = graph.find(item => item["@type"] === "FAQPage");
  if (!touristTrip) throw new Error(`TouristTrip JSON-LD is missing from ${filename}`);

  const slug = routeSlug(touristTrip.url);
  const family = routeFamily(touristTrip.name);
  const mountainDays = touristTrip.itinerary.itemListElement.filter(item => /^Day \d+:/.test(item.name));
  const arrival = touristTrip.itinerary.itemListElement.find(item => item.name.startsWith("Arrival:"));
  const departure = touristTrip.itinerary.itemListElement.find(item => item.name.startsWith("Departure:"));
  const overviewCard = firstMatch(html, /<div class="swt-copy-card">([\s\S]*?)<\/div>/);
  const overviewParagraphs = paragraphItems(overviewCard).filter(item => item !== "Route overview");
  const inclusions = listItems(firstMatch(html, /<div class="swt-list-card"><h3>Included<\/h3><ul[^>]*>([\s\S]*?)<\/ul>/));
  const exclusions = listItems(firstMatch(html, /<div class="swt-list-card"><h3>Not included<\/h3><ul[^>]*>([\s\S]*?)<\/ul>/));
  const isHutRoute = /Marangu/.test(touristTrip.name);
  const days = mountainDays.map((item, index) => {
    const title = item.name.replace(/^Day \d+:\s*/, "");
    const walkingTime = item.description.match(/Walking time is about ([^.]+)\./i)?.[1];
    const accommodation = accommodationFor(title, family);
    return {
      id: `${slug}-day-${index + 1}`,
      dayNumber: index + 1,
      title,
      summary: item.description.split(/(?<=\.)\s+/)[0],
      narrative: item.description,
      habitat: habitatFor(title, item.description),
      ...(walkingTime ? {driveTime: `${walkingTime} walking`} : {}),
      activityLevel: /Uhuru|summit/i.test(title) ? "Very challenging summit day" : "Mountain trekking",
      meals: index === mountainDays.length - 1 ? ["Breakfast", "Lunch"] : ["Breakfast", "Lunch", "Dinner"],
      activities: [{
        id: `${slug}-activity-${index + 1}`,
        title: index + 1 === mountainDays.length ? "Mountain descent" : "Guided mountain trek",
        description: item.description,
        location: destinationFromTitle(title),
      }],
      ...(accommodation ? {accommodation} : {}),
      image: `${imageRoot}/${imageForDay(title)}`,
      imageAlt: `${title} on the ${family}`,
      ...(index + 1 === mountainDays.length ? {dropOffNote: departure?.description || "Return to Moshi after park checkout."} : {}),
    };
  });

  const routeStops = days.map(day => {
    const name = destinationFromTitle(day.title);
    const [lat, lng] = stopCoordinates[name];
    return {name, label: `Day ${day.dayNumber}`, description: day.summary, dayNumber: day.dayNumber, coordinates: {lat, lng}};
  });

  return {
    id: `kilimanjaro-${slug}`,
    sourceId: `elementor:${filename}`,
    sourcePath: filename,
    sourceUrl: touristTrip.url,
    tripType: "Kilimanjaro trek",
    routeFamily: family,
    slug,
    title: touristTrip.name,
    summary: touristTrip.description,
    heroImage: `${imageRoot}/${routeImageBySource[filename]}`,
    overviewTitle: text(firstMatch(overviewCard, /<h2[^>]*>([\s\S]*?)<\/h2>/)) || `Why choose the ${family}?`,
    overviewParagraphs,
    highlights: [
      `${mountainDays.length} mountain days with a licensed local guide team`,
      isHutRoute ? "Shared mountain huts along the Marangu Route" : "Full-service mountain camping with a cook and porters",
      "Daily health checks and emergency oxygen support",
      "Airport transfers and Moshi hotel nights included",
    ],
    galleryImages: [
      {src: `${imageRoot}/${routeImageBySource[filename]}`, alt: touristTrip.name},
      ...galleryPool.slice(0, 5).map(([image, alt]) => ({src: `${imageRoot}/${image}`, alt})),
    ],
    routeStops,
    durationDays: mountainDays.length,
    destinations: [family, "Uhuru Peak", "Mount Kilimanjaro"],
    startingPrice: Number(touristTrip.offers?.price),
    currency: touristTrip.offers?.priceCurrency || "USD",
    status: "published",
    days,
    inclusions,
    exclusions,
    onRequestItems: ["Private climb dates", "Sleeping bag and trekking equipment rental", "Portable private toilet on camping routes", "Safari or Zanzibar extension"],
    priceIntroduction: touristTrip.offers?.description || "The final climb price depends on group size and confirmed travel arrangements.",
    priceTiers: [
      {name: "Route package", price: `From USD ${Number(touristTrip.offers?.price).toLocaleString("en-US")}`, description: "Per person starting price for the published route and services."},
      {name: "Private climb", price: "On request", description: "Your own departure date and a climb planned around your group."},
      {name: "Safari extension", price: "Tailored quote", description: "Add a northern Tanzania safari or Zanzibar after the mountain."},
    ],
    optionalExperiences: [
      {name: "Private climb", price: "On request", note: "Choose your preferred dates for your own group."},
      {name: "Tanzania safari", price: "Tailored quote", note: "Continue to Tarangire, Serengeti or Ngorongoro after the climb."},
      {name: "Zanzibar extension", price: "Tailored quote", note: "Add flights, transfers and a beach stay."},
    ],
    travelStyle: isHutRoute ? "Guided Kilimanjaro hut climb" : "Guided Kilimanjaro camping trek",
    practicalInformation: [
      arrival?.description || "Meet your driver at Kilimanjaro International Airport and transfer to Moshi.",
      "Train for consecutive trekking days and follow your guide’s slow, steady acclimatization pace.",
      "Travel insurance must cover trekking up to 6,000 metres, treatment, evacuation and repatriation.",
      departure?.description || "Return to Moshi, transfer to the airport or continue with a Tanzania extension.",
    ],
    packingNotes: [
      "Bring broken-in trekking boots, layered mountain clothing, waterproof outerwear and warm summit gear.",
      "Carry a day pack, water bottles or hydration bladder, sun protection, head torch and personal medication.",
      "A detailed equipment checklist is reviewed with your guide before the climb.",
    ],
    bookingConditions: [
      "A 10 percent deposit secures the booking after route, dates and availability are confirmed.",
      "Mountain conditions, individual health and park instructions may require the guide to adjust the route or descent plan.",
      "Summit success cannot be guaranteed. The lead guide’s safety decision is final.",
    ],
    faqs: (faqPage?.mainEntity || []).map(item => ({question: item.name, answer: item.acceptedAnswer.text})),
    relatedTripSlugs: [],
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

const filenames = readdirSync(sourceDirectory)
  .filter(filename => routeImageBySource[filename])
  .sort((a, b) => a.localeCompare(b, "en", {numeric: true}));
const itineraries = filenames.map(makeItinerary);

for (const itinerary of itineraries) {
  itinerary.relatedTripSlugs = itineraries
    .filter(candidate => candidate.slug !== itinerary.slug)
    .sort((a, b) => {
      const sameFamilyA = a.routeFamily === itinerary.routeFamily ? 0 : 1;
      const sameFamilyB = b.routeFamily === itinerary.routeFamily ? 0 : 1;
      return sameFamilyA - sameFamilyB || Math.abs(a.durationDays - itinerary.durationDays) - Math.abs(b.durationDays - itinerary.durationDays);
    })
    .slice(0, 3)
    .map(candidate => candidate.slug);
}

const existingSeed = JSON.parse(readFileSync(path.join(projectRoot, "data/seed-itineraries.json"), "utf8"));
const existingStore = JSON.parse(readFileSync(path.join(projectRoot, "data/itineraries.json"), "utf8"));
const kilimanjaroIds = new Set(itineraries.map(item => item.id));
const kilimanjaroSlugs = new Set(itineraries.map(item => item.slug));
const withoutKilimanjaro = items => items.filter(item => !kilimanjaroIds.has(item.id) && !kilimanjaroSlugs.has(item.slug));

writeFileSync(path.join(projectRoot, "data/kilimanjaro-itineraries.json"), `${JSON.stringify(itineraries, null, 2)}\n`);
writeFileSync(path.join(projectRoot, "data/seed-itineraries.json"), `${JSON.stringify([...withoutKilimanjaro(existingSeed), ...itineraries], null, 2)}\n`);
writeFileSync(path.join(projectRoot, "data/itineraries.json"), `${JSON.stringify([...withoutKilimanjaro(existingStore), ...itineraries], null, 2)}\n`);

const report = {
  sourceDirectory: path.basename(sourceDirectory),
  routeCount: itineraries.length,
  uniqueSlugCount: new Set(itineraries.map(item => item.slug)).size,
  routeCoverage: itineraries.map(item => ({sourceId: item.sourceId, slug: item.slug, days: item.durationDays, image: item.heroImage})),
  validation: {
    routeCountMatchesExport: itineraries.length === filenames.length,
    slugsUnique: new Set(itineraries.map(item => item.slug)).size === itineraries.length,
    dayCountsMatch: itineraries.every(item => item.days.length === item.durationDays),
    oneItineraryPerSource: new Set(itineraries.map(item => item.sourceId)).size === itineraries.length,
  },
};
writeFileSync(path.join(projectRoot, "data/kilimanjaro-migration-report.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`Built ${itineraries.length} Kilimanjaro itineraries from ${sourceDirectory}.\n`);
