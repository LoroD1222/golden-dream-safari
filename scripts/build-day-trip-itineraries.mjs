import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("Pass the downloaded day-trip package directory as the first argument.");
const generatedAt = "2026-11-19T13:30:00.000Z";

const sharedInclusions = [
  "Private transport from the selected starting town",
  "Professional local guide or driver-guide",
  "Standard entry or activity fees for the confirmed day plan",
  "Lunch or picnic on the full-day programme",
  "Drinking water during the trip",
];

const sharedExclusions = [
  "Accommodation before or after the day trip",
  "Tips for guides and local staff",
  "Alcoholic drinks and personal purchases",
  "Travel insurance",
  "Optional activities or upgrades not listed in the confirmed quote",
];

const trips = [
  {
    sourceFile: "tarangire-national-park-day-safari-from-arusha-moshi.html",
    slug: "tarangire-national-park-day-safari",
    title: "Tarangire National Park Day Safari",
    summary: "Spend the day among Tarangire's baobab landscapes and elephant country on a private safari that works especially well from Arusha.",
    routeFamily: "Tarangire National Park",
    destinations: ["Tarangire National Park"],
    startingPrice: 280,
    heroImage: "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png",
    galleryImages: [
      {src: "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png", alt: "Elephants crossing Tarangire National Park"},
      {src: "/images/figma/4353112e-ba38-4c14-9336-9799369efbd9.png", alt: "Elephant herd in Tarangire National Park"},
      {src: "/images/figma/a07ee8d6-0894-40c4-b59e-afdee1f87036.png", alt: "Young elephants on a Tanzania safari"},
    ],
    coordinates: {lat: -3.8333, lng: 36.0},
    overviewTitle: "Why choose a Tarangire day safari?",
    overviewParagraphs: [
      "Tarangire is one of the strongest safari day trips from Arusha, combining baobab woodland, the Tarangire River and famous elephant country in one private game-drive day.",
      "The trip can also start in Moshi, with an earlier departure and a longer transfer. Final timing is confirmed around your hotel and travel date.",
    ],
    highlights: ["Private game drive in Tarangire National Park", "Baobab landscapes and elephant country", "Picnic lunch inside the park", "Private pickup from Arusha or Moshi"],
    habitat: "Baobab woodland, river valley and open savannah",
    activityLevel: "Easy private game-drive day",
    steps: [
      ["Morning pickup", "Leave Arusha or Moshi after an early breakfast and drive to Tarangire National Park."],
      ["Game drive", "Enter the park and explore riverine areas, open woodland and baobab country with your private driver-guide."],
      ["Picnic lunch", "Stop at a picnic site inside the park before continuing the safari."],
      ["Afternoon wildlife viewing", "Spend more time in the park before beginning the drive back."],
      ["Return", "Arrive at your hotel in the evening, depending on traffic and your pickup town."],
    ],
    priceTiers: [
      {name: "From Arusha", price: "$280", suffix: "/pp", description: "Private day trip with hotel pickup in Arusha."},
      {name: "From Moshi", price: "$320", suffix: "/pp", description: "Private day trip with the longer transfer from Moshi."},
    ],
    practicalInformation: ["Arusha is the more practical starting point for Tarangire.", "Bring sun protection, a light morning layer, comfortable clothes and binoculars if available.", "Share dietary requirements before the picnic lunch is confirmed."],
    faqs: [
      {question: "Is Tarangire best visited on a day safari from Arusha?", answer: "Yes. Arusha is the more practical starting point. A Moshi departure is also possible, but it involves a longer transfer and an earlier start."},
      {question: "What should I bring for a Tarangire day safari?", answer: "Bring sun protection, a light morning layer, comfortable clothes and a camera or binoculars if you have them. Keep personal medicine in your day bag."},
      {question: "Can Tarangire connect with an onward safari?", answer: "Yes. The route may connect with Mto wa Mbu, Karatu or another northern circuit plan when arranged in advance."},
    ],
  },
  {
    sourceFile: "ngorongoro-crater-day-trip-from-arusha-moshi.html",
    slug: "ngorongoro-crater-day-trip",
    title: "Ngorongoro Crater Day Trip",
    summary: "Descend into Ngorongoro Crater for a full private game drive in one of northern Tanzania's most concentrated wildlife areas, then return to your hotel the same day.",
    routeFamily: "Ngorongoro Crater",
    destinations: ["Ngorongoro Crater"],
    startingPrice: 380,
    heroImage: "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png",
    galleryImages: [
      {src: "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png", alt: "Guests looking across Ngorongoro Crater"},
      {src: "/images/figma/c709c3ab-d64a-4463-9049-a810508bb337.png", alt: "Golden Dream guests beside the crater picnic area"},
      {src: "/images/figma/guest-4.png", alt: "Safari guest overlooking the Ngorongoro landscape"},
    ],
    coordinates: {lat: -3.1618, lng: 35.5877},
    overviewTitle: "Why choose a Ngorongoro Crater day trip?",
    overviewParagraphs: [
      "Ngorongoro offers a full private crater-floor game drive in one of northern Tanzania's most concentrated wildlife areas.",
      "It is a long day that needs an early start, especially from Moshi. Your guide plans the descent, picnic and return around park rules, daylight and the location of your hotel.",
    ],
    highlights: ["Private game drive on the crater floor", "Wildlife across grassland, woodland and wetlands", "Picnic lunch at an approved site", "Private pickup from Arusha or Moshi"],
    habitat: "Crater grassland, woodland and wetlands",
    activityLevel: "Long private game-drive day",
    steps: [
      ["Very early pickup", "Leave Arusha or Moshi before sunrise so you can reach the Ngorongoro highlands with enough time for the crater."],
      ["Crater descent", "Complete entry formalities and descend to the crater floor with your driver-guide."],
      ["Game drive", "Explore different crater habitats, looking for buffalo, zebra, wildebeest, hippos, elephants, lions and other resident wildlife."],
      ["Picnic lunch", "Stop at an approved picnic area before continuing the game drive."],
      ["Return", "Ascend the crater wall and drive back to your hotel in the evening."],
    ],
    priceTiers: [
      {name: "From Arusha", price: "$380", suffix: "/pp", description: "Private crater day trip with hotel pickup in Arusha."},
      {name: "From Moshi", price: "$430", suffix: "/pp", description: "Private crater day trip with the longer transfer from Moshi."},
    ],
    practicalInformation: ["This is a long full day and requires a very early start.", "Bring a warm layer for the crater rim, sun protection and comfortable clothes.", "Driving distance, daylight and park rules limit how much the route can change."],
    faqs: [
      {question: "Is a Ngorongoro Crater day trip possible from Arusha?", answer: "Yes, but it is a long full day and needs an early start. Pickup from Moshi is also available with additional transfer time."},
      {question: "What should I bring for the crater day safari?", answer: "Bring a warm layer for the early morning and crater rim, sun protection, comfortable clothes and a camera or binoculars if available."},
      {question: "Can the Ngorongoro day trip be customised?", answer: "Pickup and meal details can be adjusted, but crater entry, driving distance, daylight and park rules limit how much the route can change."},
    ],
  },
  {
    sourceFile: "materuni-waterfalls-coffee-day-trip-from-moshi-arusha.html",
    slug: "materuni-waterfalls-coffee-day-trip",
    title: "Materuni Waterfalls & Coffee Day Trip",
    summary: "Walk through the green Kilimanjaro foothills to Materuni Waterfall, then learn how a local Chagga family grows, roasts and prepares coffee.",
    routeFamily: "Materuni Village · Kilimanjaro foothills",
    destinations: ["Materuni Village", "Materuni Waterfall"],
    startingPrice: 95,
    heroImage: "/images/figma/11ffad81-69bd-4121-89c9-46d4c84274a3.png",
    galleryImages: [
      {src: "/images/figma/11ffad81-69bd-4121-89c9-46d4c84274a3.png", alt: "Materuni Waterfall in the green Kilimanjaro foothills"},
      {src: "/images/figma/victor-host.png", alt: "Victor Costa guiding guests in northern Tanzania"},
    ],
    coordinates: {lat: -3.238, lng: 37.658},
    overviewTitle: "Why choose the Materuni waterfall and coffee day?",
    overviewParagraphs: [
      "Materuni combines a village walk, a waterfall trail, a hands-on Chagga coffee experience and a local lunch in the green foothills of Kilimanjaro.",
      "Moshi is the easiest starting point, while an Arusha pickup is also possible with an earlier departure and a longer drive.",
    ],
    highlights: ["Scenic walk through Materuni village and farmland", "Materuni Waterfall viewpoint", "Hands-on Chagga coffee experience from bean to cup", "Local lunch in the village", "Private pickup from Moshi or Arusha"],
    habitat: "Kilimanjaro foothill farms and montane forest",
    activityLevel: "Moderate walk on a sometimes muddy trail",
    steps: [
      ["Morning pickup", "Your guide collects you from your hotel in Moshi or Arusha and drives toward Materuni, a green Chagga village on the lower slopes of Kilimanjaro."],
      ["Walk to Materuni Waterfall", "Follow village paths through banana farms, coffee plants and lush vegetation before reaching the waterfall. The trail can be muddy and slippery after rain."],
      ["Coffee with a local Chagga family", "See how locally grown coffee moves from bean to cup, help roast and grind the beans, then enjoy freshly prepared coffee."],
      ["Local lunch", "Sit down for a simple local lunch and a slower moment in the village."],
      ["Return to your hotel", "Drive back to Moshi or Arusha in the afternoon, with timing adjusted to your hotel and onward plans."],
    ],
    priceTiers: [
      {name: "From Moshi", price: "$95", suffix: "/pp", description: "Private day trip from the most practical starting point."},
      {name: "From Arusha", price: "$110", suffix: "/pp", description: "Private day trip with the longer transfer from Arusha."},
    ],
    practicalInformation: ["Wear hiking shoes with good grip; the waterfall trail can be muddy and slippery after rain.", "Bring a light rain layer, sun protection and a small day bag.", "Spare socks or a light change of clothes can be useful."],
    faqs: [
      {question: "Is the Materuni day trip better from Moshi or Arusha?", answer: "Moshi is the more practical starting point. Pickup from Arusha is also available, but it involves a longer drive and an earlier start."},
      {question: "What should I wear for the Materuni waterfall trail?", answer: "Wear comfortable hiking shoes with good grip. A light rain layer and spare socks or a light change of clothes are useful after rain."},
      {question: "Can Materuni be combined with another experience?", answer: "Sometimes, when the day starts early and the road and daylight plan remain comfortable. We confirm what is practical for your hotel and date."},
    ],
  },
];

function buildItinerary(trip) {
  const sourcePath = path.join(sourceDirectory, trip.sourceFile);
  readFileSync(sourcePath);
  const narrative = trip.steps.map(([title, description]) => `${title}: ${description}`).join(" ");
  return {
    id: `day-trip-${trip.slug}`,
    sourceId: `download-html:${trip.sourceFile}`,
    sourcePath: trip.sourceFile,
    tripType: "Day trip",
    routeFamily: trip.routeFamily,
    slug: trip.slug,
    title: trip.title,
    summary: trip.summary,
    heroImage: trip.heroImage,
    overviewTitle: trip.overviewTitle,
    overviewParagraphs: trip.overviewParagraphs,
    highlights: trip.highlights,
    galleryImages: trip.galleryImages,
    routeStops: [{name: trip.destinations[0], label: "Day trip", description: trip.summary, dayNumber: 1, coordinates: trip.coordinates}],
    durationDays: 1,
    destinations: trip.destinations,
    startingPrice: trip.startingPrice,
    currency: "USD",
    status: "published",
    days: [{
      id: `${trip.slug}-day-1`,
      dayNumber: 1,
      title: trip.title,
      summary: trip.summary,
      narrative,
      habitat: trip.habitat,
      activityLevel: trip.activityLevel,
      meals: ["Lunch"],
      activities: trip.steps.map(([title, description], index) => ({id: `${trip.slug}-activity-${index + 1}`, title, description, location: trip.destinations[0]})),
      image: trip.heroImage,
      imageAlt: trip.galleryImages[0].alt,
      dropOffNote: "Return to your hotel in Arusha or Moshi after the day's programme. Exact timing depends on the pickup town, traffic and local conditions.",
    }],
    inclusions: sharedInclusions,
    exclusions: sharedExclusions,
    onRequestItems: ["Alternative pickup location", "Airport transfer connection", "Dietary arrangements", "Connection with a safari or Kilimanjaro programme"],
    priceIntroduction: "Starting prices are per person for a private day trip. Your final quote depends on group size, travel date, pickup hotel and any optional additions.",
    priceTiers: trip.priceTiers,
    optionalExperiences: [{name: "Custom pickup or onward connection", price: "On request", note: "Tell us your hotel, flight or next destination so the route can be planned realistically."}],
    travelStyle: "Private full-day experience",
    practicalInformation: trip.practicalInformation,
    bookingConditions: ["Final timing, availability and price are confirmed in writing for your travel date and pickup hotel.", "Wildlife sightings, trail conditions and driving times can change with weather, traffic and local conditions."],
    faqs: trip.faqs,
    relatedTripSlugs: trips.filter(item => item.slug !== trip.slug).map(item => item.slug),
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

const itineraries = trips.map(buildItinerary);
const generatedIds = new Set(itineraries.map(item => item.id));
const generatedSlugs = new Set(itineraries.map(item => item.slug));
const withoutGenerated = items => items.filter(item => !generatedIds.has(item.id) && !generatedSlugs.has(item.slug));
const seedPath = path.join(projectRoot, "data/seed-itineraries.json");
const storePath = path.join(projectRoot, "data/itineraries.json");
const existingSeed = JSON.parse(readFileSync(seedPath, "utf8"));
const existingStore = JSON.parse(readFileSync(storePath, "utf8"));

writeFileSync(path.join(projectRoot, "data/day-trip-itineraries.json"), `${JSON.stringify(itineraries, null, 2)}\n`);
writeFileSync(seedPath, `${JSON.stringify([...withoutGenerated(existingSeed), ...itineraries], null, 2)}\n`);
writeFileSync(storePath, `${JSON.stringify([...withoutGenerated(existingStore), ...itineraries], null, 2)}\n`);
writeFileSync(path.join(projectRoot, "data/day-trip-itinerary-report.json"), `${JSON.stringify({
  sourceDirectory: path.basename(sourceDirectory),
  itineraryCount: itineraries.length,
  routes: itineraries.map(item => ({sourceId: item.sourceId, slug: item.slug, price: item.startingPrice, tripType: item.tripType})),
  validation: {
    sourceDocumentsPresent: true,
    onlyThreeSelected: itineraries.length === 3,
    slugsUnique: new Set(itineraries.map(item => item.slug)).size === itineraries.length,
    sourceIdsUnique: new Set(itineraries.map(item => item.sourceId)).size === itineraries.length,
    dayCountsMatch: itineraries.every(item => item.days.length === item.durationDays),
  },
}, null, 2)}\n`);

process.stdout.write(`Built ${itineraries.length} day-trip itineraries from the supplied HTML package.\n`);
