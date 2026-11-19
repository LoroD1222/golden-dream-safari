import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("Pass the directory containing the downloaded quotation PDFs as the first argument.");
const generatedAt = "2026-11-19T12:30:00.000Z";

const downloads = {
  twoDay: "Copy of Quotation Golden Dream Safaris - CLIENT NAME.pdf",
  fourDay: "Copy of Quotation Golden Dream Safaris - CLIENT NAME (1).pdf",
  fiveDay: "Copy of Quotation Golden Dream Safaris - CLIENT NAME (2).pdf",
  sevenDay: "Copy of Quotation Golden Dream Safaris - CLIENT NAME (3).pdf",
  mixedRoutes: "Copy of Quotation Golden Dream Safaris - CLIENT NAME (4).pdf",
};

const images = {
  arusha: "/images/figma/c299246f-2033-43be-a3a4-eebbe6d23354.png",
  manyara: "/images/figma/279a986b-f6f3-4660-96c5-716505530be6.png",
  tarangire: "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png",
  serengeti: "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png",
  ngorongoro: "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png",
  shira: "/images/kilimanjaro-packages/7-days-lemosho-route-kilimanjaro-shira-plateau.jpg",
  mountainCamp: "/images/kilimanjaro-packages/kilimanjaro-high-camp-green-tents.jpg",
  barranco: "/images/kilimanjaro-packages/kilimanjaro-barranco-camp-yellow-tents.jpg",
  summit: "/images/kilimanjaro-packages/kilimanjaro-summit-sunrise-serengeti-wild-tours.jpg",
};

const coordinates = {
  "Arusha National Park": {lat: -3.2508, lng: 36.8299},
  "Lake Manyara National Park": {lat: -3.4714, lng: 35.8172},
  "Tarangire National Park": {lat: -3.8333, lng: 36.0},
  "Serengeti National Park": {lat: -2.3333, lng: 34.8333},
  "Ngorongoro Crater": {lat: -3.1618, lng: 35.5877},
  "River Camp": {lat: -3.081, lng: 37.277},
  "Shira Camp": {lat: -3.0952, lng: 37.3107},
  "Barranco Camp": {lat: -3.0966, lng: 37.3292},
  "Karanga Camp": {lat: -3.1111, lng: 37.3502},
  "Barafu Camp": {lat: -3.0991, lng: 37.3701},
  "Millennium Camp": {lat: -3.1562, lng: 37.3553},
  "Shira Gate": {lat: -3.1227, lng: 37.2098},
};

const parkProfiles = {
  arusha: {
    destination: "Arusha National Park",
    title: "Arusha National Park",
    summary: "A scenic first game drive beneath Mount Meru.",
    narrative: "Travel to Arusha National Park for a morning game drive through its varied landscapes. Look for black-and-white colobus monkeys, buffaloes, zebras, giraffes, hippos and elephants, with a picnic lunch inside the park before returning to Arusha.",
    habitat: "Montane forest, lakes and open grassland",
    activityLevel: "Easy game-drive day",
    meals: ["Lunch"],
    accommodation: {name: "Arusha hotel (not included)", category: "Other", location: "Arusha", description: "Dinner and overnight accommodation in Arusha are booked independently."},
    image: images.arusha,
  },
  manyara: {
    destination: "Lake Manyara National Park",
    title: "Lake Manyara National Park",
    summary: "Game drives beside the Rift Valley escarpment and alkaline lake.",
    narrative: "After breakfast, drive to Lake Manyara National Park for game drives. The park is known for tree-climbing lions and seasonal flamingos, and also supports elephants, giraffes, hippos, buffaloes, zebras, wildebeest and monkeys. Enjoy a picnic lunch in the park.",
    habitat: "Groundwater forest, lake shore and woodland",
    activityLevel: "Easy game-drive day",
    meals: ["Breakfast", "Lunch", "Dinner"],
    accommodation: {name: "Campsite, tented lodge or lodge", category: "Other", location: "Mto wa Mbu", description: "The quotation suggests Kizumba Campsite, Fanaka Lodge or Lake Manyara Wildlife Lodge, subject to the selected comfort level and availability."},
    image: images.manyara,
  },
  tarangire: {
    destination: "Tarangire National Park",
    title: "Tarangire National Park",
    summary: "Baobab woodland, the Tarangire River and large elephant herds.",
    narrative: "Leave Arusha after breakfast for a game drive in Tarangire National Park. The river attracts wildlife during the dry season, while the park's baobabs frame sightings of elephants, giraffes, hippos, buffaloes, zebras, wildebeest, lions and hyenas. Picnic lunch is served inside the park.",
    habitat: "Baobab woodland and river valley",
    activityLevel: "Easy game-drive day",
    meals: ["Lunch", "Dinner"],
    accommodation: {name: "Campsite, tented lodge or lodge", category: "Other", location: "Mto wa Mbu", description: "The quotation suggests Kizumba Campsite, Fanaka Lodge or Lake Manyara Wildlife Lodge, subject to the selected comfort level and availability."},
    image: images.tarangire,
  },
  serengetiEntry: {
    destination: "Serengeti National Park",
    title: "Serengeti National Park",
    summary: "Cross the Ngorongoro Highlands into the Serengeti's open plains.",
    narrative: "Drive through the Ngorongoro Highlands to Serengeti National Park. The Serengeti's diverse habitats support wildebeest, lions, zebras, warthogs, leopards, giraffes, gazelles, buffaloes, impalas, hyenas, cheetahs, elephants and hippos. Enjoy lunch and afternoon game drives inside the park.",
    habitat: "Open plains and rocky kopjes",
    activityLevel: "Scenic transfer and game drive",
    meals: ["Breakfast", "Lunch", "Dinner"],
    accommodation: {name: "Campsite, tented lodge or lodge", category: "Other", location: "Central Serengeti", description: "The quotation suggests Seronera Campsite, Seronera Tented Lodge or Seronera Wildlife Lodge, subject to the selected comfort level and availability."},
    image: images.serengeti,
  },
  serengetiFull: {
    destination: "Serengeti National Park",
    title: "Full day in Serengeti National Park",
    summary: "A full day of game drives with time to follow wildlife movements.",
    narrative: "Spend the day exploring the Serengeti on private game drives. Your guide plans the route around current wildlife movements and will look for the great migration when its herds are in the accessible part of the ecosystem.",
    habitat: "Open plains and rocky kopjes",
    activityLevel: "Full-day game drive",
    meals: ["Breakfast", "Lunch", "Dinner"],
    accommodation: {name: "Campsite, tented lodge or lodge", category: "Other", location: "Central Serengeti", description: "The quotation suggests Seronera Campsite, Seronera Tented Lodge or Seronera Wildlife Lodge, subject to the selected comfort level and availability."},
    image: images.serengeti,
  },
  serengetiExit: {
    destination: "Serengeti National Park",
    title: "Serengeti to Ngorongoro",
    summary: "Morning game drives followed by the journey to Ngorongoro.",
    narrative: "Enjoy a final Serengeti game drive and picnic lunch while travelling towards Ngorongoro. On a private safari, an optional Olduvai Gorge visit can be added before continuing to the overnight stop near the crater.",
    habitat: "Serengeti plains and Ngorongoro highlands",
    activityLevel: "Game drive and scenic transfer",
    meals: ["Breakfast", "Lunch", "Dinner"],
    accommodation: {name: "Campsite, tented camp or lodge", category: "Other", location: "Ngorongoro Conservation Area", description: "The quotation suggests Simba Campsite, Ngorongoro Wild Tented Camp or Ngorongoro Rhino Lodge, subject to the selected comfort level and availability."},
    image: images.ngorongoro,
  },
  ngorongoro: {
    destination: "Ngorongoro Crater",
    title: "Ngorongoro Crater to Arusha",
    summary: "Descend to the crater floor, then return to Arusha.",
    narrative: "After an early breakfast, descend into Ngorongoro Crater for game drives among lions, buffaloes, hippos, flamingos, wildebeest, zebras, gazelles, leopards, rhinos, hyenas and elephants. Lunch is served at the hippo pool picnic site before the afternoon drive back to Arusha.",
    habitat: "Crater grassland, woodland and wetlands",
    activityLevel: "Crater game drive and transfer",
    meals: ["Breakfast", "Lunch"],
    image: images.ngorongoro,
    dropOffNote: "Return to your Arusha accommodation at approximately 5-6 pm. Accommodation in Arusha is booked independently.",
  },
};

const safariGallery = [
  {src: images.tarangire, alt: "Elephants in northern Tanzania"},
  {src: images.manyara, alt: "Lake Manyara safari landscape"},
  {src: images.serengeti, alt: "Wildlife on the Serengeti plains"},
  {src: images.ngorongoro, alt: "Wildlife in the Ngorongoro Conservation Area"},
  {src: "/images/figma/27096cab-2e77-46b5-9b4f-1aa9fbe1012c.png", alt: "Leopard resting in a tree"},
];

const safariInclusions = [
  "Accommodation and meals stated in the itinerary",
  "Breakfast, lunch and dinner while on safari unless noted otherwise",
  "National park and conservation fees",
  "Professional driver-guide",
  "Transport in a 4x4 safari vehicle",
  "Game drives described in the itinerary",
  "Drinking water during game drives",
  "Government taxes",
  "Pick-up and drop-off at your Arusha accommodation",
];

const safariExclusions = [
  "Tanzania visa",
  "International and domestic flights",
  "Travel insurance and vaccinations",
  "Personal items and alcoholic drinks",
  "Tips for the safari team",
  "Accommodation before and after the safari unless confirmed",
];

const safariFaqs = [
  {question: "Can this safari be private?", answer: "Yes. The route can be arranged as a private safari and adjusted around your dates, group and accommodation preference."},
  {question: "Which accommodation is included?", answer: "The quotation lists camping, tented lodge and lodge options. The final properties and room category are confirmed with your tailored quote."},
  {question: "Are park fees and meals included?", answer: "Park fees, the listed game drives, drinking water and meals shown in the itinerary are included."},
  {question: "Where does the safari start and finish?", answer: "Pick-up and drop-off are at your accommodation in Arusha unless another arrangement is confirmed."},
  {question: "Can I add airport transfers?", answer: "Yes. Transfers from Kilimanjaro International Airport or Arusha Airport can be quoted separately."},
];

function makeSafariDay(slug, profileKey, index, total) {
  const profile = parkProfiles[profileKey];
  const isLast = index + 1 === total;
  return {
    id: `${slug}-day-${index + 1}`,
    dayNumber: index + 1,
    title: profile.title,
    summary: profile.summary,
    narrative: profile.narrative,
    habitat: profile.habitat,
    activityLevel: profile.activityLevel,
    meals: profile.meals,
    activities: [{id: `${slug}-activity-${index + 1}`, title: `${profile.destination} experience`, description: profile.narrative, location: profile.destination}],
    ...(!isLast && profile.accommodation ? {accommodation: profile.accommodation} : {}),
    image: profile.image,
    imageAlt: `${profile.title} safari experience`,
    ...(profile.dropOffNote ? {dropOffNote: profile.dropOffNote} : {}),
  };
}

function makeSafari({slug, title, summary, source, route, heroImage}) {
  const days = route.map((profile, index) => makeSafariDay(slug, profile, index, route.length));
  const destinations = [...new Set(route.map(profile => parkProfiles[profile].destination))];
  return {
    id: `download-${slug}`,
    sourceId: `download-pdf:${source}`,
    sourcePath: source,
    tripType: "Wildlife safari",
    routeFamily: destinations.join(" · "),
    slug,
    title,
    summary,
    heroImage,
    overviewTitle: `About this ${route.length}-day safari`,
    overviewParagraphs: [
      `This route combines ${destinations.join(", ")} in a private northern Tanzania safari based on the supplied Golden Dream quotation.`,
      "Accommodation can be camping, tented lodge or lodge. Final properties, travel dates and price are confirmed for your group before booking.",
    ],
    highlights: destinations.map(destination => `Game drives in ${destination}`),
    galleryImages: [{src: heroImage, alt: title}, ...safariGallery.filter(image => image.src !== heroImage)],
    routeStops: days.map(day => ({name: day.activities[0].location, label: `Day ${day.dayNumber}`, description: day.summary, dayNumber: day.dayNumber, coordinates: coordinates[day.activities[0].location]})),
    durationDays: days.length,
    destinations,
    currency: "USD",
    status: "published",
    days,
    inclusions: safariInclusions,
    exclusions: safariExclusions,
    onRequestItems: ["Airport transfers", "Private safari", "Accommodation upgrade", "Olduvai Gorge visit where the route allows", "Serengeti balloon safari"],
    priceIntroduction: "This source quotation does not publish a package rate. Request a tailored price for your dates, group size and accommodation choice.",
    priceTiers: [
      {name: "Camping", price: "On request", description: "A value-focused safari with campsite accommodation and the published park route."},
      {name: "Tented lodge", price: "On request", description: "A private safari using tented lodges selected for the route."},
      {name: "Lodge", price: "On request", description: "A private safari with upgraded lodge accommodation."},
    ],
    optionalExperiences: [
      {name: "Private safari", price: "On request", note: "Choose your dates and travel with a dedicated vehicle and guide."},
      {name: "Olduvai Gorge", price: "From $45/pp", note: "Available on compatible private itineraries and subject to confirmation."},
      {name: "Serengeti balloon safari", price: "On request", note: "Subject to route, season and availability."},
    ],
    travelStyle: "Private safari with camping, tented lodge or lodge options",
    practicalInformation: [
      "Driving times and wildlife viewing plans can change with road, weather and park conditions.",
      "Bring a valid passport, the appropriate visa and comprehensive travel insurance.",
      "Tell us about dietary requirements, allergies and mobility needs before the safari.",
    ],
    bookingConditions: [
      "This itinerary is a proposal based on the supplied quotation. Final accommodation, price and availability are confirmed in writing.",
      "Wildlife sightings cannot be guaranteed and the guide may adjust game-drive timing for current conditions.",
    ],
    faqs: safariFaqs,
    relatedTripSlugs: [],
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

function mountainDay(slug, dayNumber, title, destination, summary, distance, driveTime, image, finalDay = false) {
  return {
    id: `${slug}-day-${dayNumber}`,
    dayNumber,
    title,
    summary,
    narrative: summary,
    habitat: /Gate|River/i.test(title) ? "Montane forest" : /Uhuru|Barafu|Lava/i.test(title) ? "Alpine desert and summit zone" : "Heath and moorland",
    ...(driveTime ? {driveTime} : {}),
    ...(distance ? {distance} : {}),
    activityLevel: /Uhuru/i.test(title) ? "Very challenging summit day" : "Mountain trekking",
    meals: finalDay ? ["Breakfast", "Lunch"] : ["Breakfast", "Lunch", "Dinner"],
    activities: [{id: `${slug}-activity-${dayNumber}`, title: finalDay ? "Mountain descent" : "Guided mountain trek", description: summary, location: destination}],
    ...(!finalDay ? {accommodation: {name: destination, category: "Other", location: destination.replace(/ Camp/i, ""), description: "Mountain camping with tents prepared by the crew. Final arrangements are confirmed with your climb booking."}} : {}),
    image,
    imageAlt: `${title} on the Shira Route`,
    ...(finalDay ? {dropOffNote: "Descend to Shira Gate, complete park checkout and return to Arusha or Moshi."} : {}),
  };
}

function makeShiraRoute() {
  const slug = "7-days-shira-route";
  const source = downloads.mixedRoutes;
  const days = [
    mountainDay(slug, 1, "Arusha or Moshi to Londorossi Gate, then River Camp", "River Camp", "Drive to Londorossi Gate and begin the western approach through forest to River Camp at about 3,050 metres.", "7 km", "About 4 hours walking", images.mountainCamp),
    mountainDay(slug, 2, "River Camp to Shira Camp", "Shira Camp", "Cross onto the Shira Plateau and continue to Shira Camp at about 3,875 metres.", "12 km", "About 6-8 hours walking", images.shira),
    mountainDay(slug, 3, "Shira Camp to Lava Tower, then Barranco Camp", "Barranco Camp", "Climb to Lava Tower for acclimatization before descending to Barranco Camp at about 3,984 metres.", "10.3 km", "About 8 hours walking", images.barranco),
    mountainDay(slug, 4, "Barranco Camp to Karanga Camp", "Karanga Camp", "Climb the Barranco Wall and traverse the alpine valley to Karanga Camp.", "6 km", "About 6 hours walking", images.mountainCamp),
    mountainDay(slug, 5, "Karanga Camp to Barafu Camp", "Barafu Camp", "Continue to Barafu Camp at about 4,681 metres and prepare for the summit attempt.", "3.4 km", "About 4 hours walking", images.mountainCamp),
    mountainDay(slug, 6, "Barafu Camp to Uhuru Peak, then Millennium Camp", "Millennium Camp", "Climb through the night to Uhuru Peak at 5,895 metres, then descend to Millennium Camp.", "5 km ascent and 10.8 km descent", "About 13-15 hours walking", images.summit),
    mountainDay(slug, 7, "Millennium Camp to Shira Gate", "Shira Gate", "Descend through the forest to Shira Gate for certificates and the return transfer.", "20 km", "About 5 hours walking", images.mountainCamp, true),
  ];
  return {
    id: `download-${slug}`,
    sourceId: `download-pdf:${source}#shira-route-7-days`,
    sourcePath: source,
    tripType: "Kilimanjaro trek",
    routeFamily: "Shira Route",
    slug,
    title: "7 Day Shira Route Kilimanjaro Climb",
    summary: "A western Kilimanjaro camping route across the Shira Plateau, joining the southern circuit for Barranco, Karanga, Barafu and the summit.",
    heroImage: images.shira,
    overviewTitle: "Why choose the 7 Day Shira Route?",
    overviewParagraphs: [
      "The Shira Route begins on Kilimanjaro's western side and crosses the broad Shira Plateau before joining the southern circuit.",
      "The route uses mountain camps throughout and includes Lava Tower, Barranco Wall, Karanga, Barafu and a summit attempt from the east side of the mountain.",
    ],
    highlights: ["Western approach across the Shira Plateau", "Seven mountain days with a local guide team", "Full-service mountain camping", "Uhuru Peak summit attempt"],
    galleryImages: [
      {src: images.shira, alt: "Shira Plateau on Mount Kilimanjaro"},
      {src: images.mountainCamp, alt: "Mountain camp on Kilimanjaro"},
      {src: images.barranco, alt: "Barranco Camp on Kilimanjaro"},
      {src: images.summit, alt: "Sunrise near Uhuru Peak"},
    ],
    routeStops: days.map(day => ({name: day.activities[0].location, label: `Day ${day.dayNumber}`, description: day.summary, dayNumber: day.dayNumber, coordinates: coordinates[day.activities[0].location]})),
    durationDays: 7,
    destinations: ["Shira Route", "Uhuru Peak", "Mount Kilimanjaro"],
    currency: "USD",
    status: "published",
    days,
    inclusions: ["Licensed mountain guide team", "Cook and porters", "Mountain camping and meals", "Park, camping and rescue fees", "Drinking water on the mountain", "Emergency first aid support"],
    exclusions: ["International flights", "Tanzania visa", "Travel insurance", "Personal trekking equipment", "Tips for the mountain crew", "Hotel nights unless confirmed"],
    onRequestItems: ["Private climb dates", "Airport transfers", "Moshi or Arusha hotel nights", "Sleeping bag and equipment rental", "Safari extension"],
    priceIntroduction: "The source document does not publish a Shira Route package rate. Request a tailored quote for your date and group size.",
    priceTiers: [{name: "Shira Route package", price: "On request", description: "A seven-day guided camping climb on the published route."}, {name: "Private climb", price: "On request", description: "Choose your own dates for a dedicated group departure."}],
    travelStyle: "Guided Kilimanjaro camping trek",
    practicalInformation: ["Train for consecutive trekking days and follow the guide's acclimatization pace.", "Travel insurance must cover trekking up to 6,000 metres, evacuation and repatriation.", "A complete equipment list is reviewed before departure."],
    faqs: [
      {question: "Where does the Shira Route begin?", answer: "The climb approaches from the west through Londorossi Gate and crosses the Shira Plateau."},
      {question: "Does this route use huts?", answer: "No. The Shira Route uses mountain camps and the crew prepares the tents and meals."},
      {question: "Is the price published?", answer: "No package rate is shown in the source document. Golden Dream will prepare a quote for your dates and group."},
    ],
    relatedTripSlugs: ["7-days-lemosho-route", "7-days-machame-route", "8-days-lemosho-route"],
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

for (const source of Object.values(downloads)) {
  readFileSync(path.join(sourceDirectory, source));
}

const itineraries = [
  makeSafari({slug: "tarangire-ngorongoro-crater-2-days", title: "2 Day Tarangire & Ngorongoro Safari", summary: "Elephants and baobabs in Tarangire followed by a game drive on the floor of Ngorongoro Crater.", source: downloads.twoDay, route: ["tarangire", "ngorongoro"], heroImage: images.tarangire}),
  makeSafari({slug: "lake-manyara-serengeti-ngorongoro", title: "4 Day Lake Manyara, Serengeti & Ngorongoro Safari", summary: "Lake Manyara's forest and lake shore, two Serengeti game-drive days and Ngorongoro Crater.", source: downloads.fourDay, route: ["manyara", "serengetiEntry", "serengetiExit", "ngorongoro"], heroImage: images.manyara}),
  makeSafari({slug: "big-four-parks", title: "5 Day Lake Manyara, Tarangire, Serengeti & Ngorongoro Safari", summary: "Five days linking four of northern Tanzania's best-known wildlife areas in one private safari.", source: downloads.fiveDay, route: ["manyara", "tarangire", "serengetiEntry", "serengetiExit", "ngorongoro"], heroImage: "/images/figma/fcb78e89-1d4d-4e01-9c6c-fdaec6e228d9.png"}),
  makeSafari({slug: "seven-day-northern-parks-safari", title: "7 Day Arusha, Manyara, Tarangire, Serengeti & Ngorongoro Safari", summary: "A complete northern parks journey with three Serengeti days and time in Arusha, Lake Manyara, Tarangire and Ngorongoro.", source: downloads.sevenDay, route: ["arusha", "manyara", "tarangire", "serengetiEntry", "serengetiFull", "serengetiExit", "ngorongoro"], heroImage: images.serengeti}),
  makeShiraRoute(),
];

const safariSlugs = itineraries.filter(item => item.tripType === "Wildlife safari").map(item => item.slug);
for (const itinerary of itineraries) {
  if (itinerary.tripType === "Wildlife safari") {
    itinerary.relatedTripSlugs = safariSlugs.filter(slug => slug !== itinerary.slug).slice(0, 3);
  }
}

const generatedIds = new Set(itineraries.map(item => item.id));
const generatedSlugs = new Set(itineraries.map(item => item.slug));
const withoutGenerated = items => items.filter(item => !generatedIds.has(item.id) && !generatedSlugs.has(item.slug));
const seedPath = path.join(projectRoot, "data/seed-itineraries.json");
const storePath = path.join(projectRoot, "data/itineraries.json");
const existingSeed = JSON.parse(readFileSync(seedPath, "utf8"));
const existingStore = JSON.parse(readFileSync(storePath, "utf8"));

writeFileSync(path.join(projectRoot, "data/download-itineraries.json"), `${JSON.stringify(itineraries, null, 2)}\n`);
writeFileSync(seedPath, `${JSON.stringify([...withoutGenerated(existingSeed), ...itineraries], null, 2)}\n`);
writeFileSync(storePath, `${JSON.stringify([...withoutGenerated(existingStore), ...itineraries], null, 2)}\n`);
writeFileSync(path.join(projectRoot, "data/download-itinerary-report.json"), `${JSON.stringify({
  sourceDirectory: path.basename(sourceDirectory),
  sourceDocumentCount: Object.keys(downloads).length,
  itineraryCount: itineraries.length,
  routes: itineraries.map(item => ({sourceId: item.sourceId, slug: item.slug, tripType: item.tripType, days: item.durationDays})),
  validation: {
    sourceDocumentsPresent: true,
    slugsUnique: new Set(itineraries.map(item => item.slug)).size === itineraries.length,
    sourceIdsUnique: new Set(itineraries.map(item => item.sourceId)).size === itineraries.length,
    dayCountsMatch: itineraries.every(item => item.days.length === item.durationDays),
  },
}, null, 2)}\n`);

process.stdout.write(`Built ${itineraries.length} itineraries from ${Object.keys(downloads).length} PDF sources.\n`);
