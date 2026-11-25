import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import os from "node:os";
import path from "node:path";

const projectRoot = process.cwd();
const downloadsRoot = process.env.SWT_DOWNLOADS || path.join(os.homedir(), "Downloads");
const imageDirectory = path.join(projectRoot, "public/images/itineraries/swt");
const publicImageRoot = "/images/itineraries/swt";
const generatedAt = "2026-11-25T00:00:00.000Z";
const shouldDownload = process.argv.includes("--download-images");

const goldenDreamMountMeruImages = [
  {src: "/images/figma/6a496e48-5dd1-4dc8-8023-5c6bc0d6dfb4.png", alt: "Mount Meru rising above Arusha"},
  {src: "/images/team/chaina-driver-guide.webp", alt: "Golden Dream Safaris driver-guide and guests beside a company vehicle"},
  {src: "/images/team/safari-crew.jpg", alt: "Golden Dream Safaris guests and team with a company vehicle"},
];

const joiningRoot = "03-Serengeti-Wild-Tours-Joining-Group-Safaris-SAFE-RESTORE (3)/03-Joining-Group-Safaris-MOTHER-CARDS-STRUCTURED-DATA-FINAL/Individual-Package-ZIPs";
const privateRoot = "Serengeti_Wild_Tours_Private_and_Joining_Safaris_CORRECTED_Designer_Upload (3)/Serengeti_Wild_Tours_Private_and_Joining_Safaris_Corrected";
const migrationRoot = "04-Great-Migration-Safaris-FLAT-PACKAGE-URL-NO-MOTHER-FORM-FINAL/04-Great-Migration-Safaris-MOTHER-CARDS-STRUCTURED-DATA-FINAL/Individual-Package-ZIPs";
const meruRoot = "Serengeti_Wild_Tours_Mount_Meru_Corrected_Final_Upload (3)/Serengeti_Wild_Tours_Mount_Meru_Final_Upload/elementor-pages";

const sources = [
  {file: `${joiningRoot}/3-days-serengeti-ngorongoro-joining-safari/3-days-serengeti-ngorongoro-joining-safari.html`, routeFamily: "Joining Safari", startingPrice: 650, priceBasis: "Published group-camping price per person", accommodation: "Group camping", routePlaces: ["Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${joiningRoot}/4-days-northern-tanzania-joining-safari/4-days-northern-tanzania-joining-safari.html`, routeFamily: "Joining Safari", startingPrice: 800, priceBasis: "Published group-camping price per person", accommodation: "Group camping", routePlaces: ["Tarangire National Park", "Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${joiningRoot}/5-days-northern-tanzania-joining-safari/5-days-northern-tanzania-joining-safari.html`, routeFamily: "Joining Safari", startingPrice: 975, priceBasis: "Published group-camping price per person", accommodation: "Group camping", routePlaces: ["Tarangire National Park", "Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater", "Lake Manyara National Park"]},
  {file: `${migrationRoot}/5-days-northern-serengeti-river-crossing-safari/5-days-northern-serengeti-river-crossing-safari.html`, routeFamily: "Great Migration North", startingPrice: 2260, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Central Serengeti", "Northern Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${migrationRoot}/7-days-northern-serengeti-river-crossing-safari/7-days-northern-serengeti-river-crossing-safari.html`, routeFamily: "Great Migration North", startingPrice: 3300, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Central Serengeti", "Northern Serengeti", "Mara River", "Northern Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${migrationRoot}/9-days-northern-serengeti-river-crossing-safari/9-days-northern-serengeti-river-crossing-safari.html`, routeFamily: "Great Migration North", startingPrice: 4595, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Central Serengeti", "Central Serengeti", "Northern Serengeti", "Mara River", "Northern Serengeti", "Northern Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${migrationRoot}/4-days-ndutu-calving-safari/4-days-ndutu-calving-safari.html`, routeFamily: "Ndutu Calving Safari", startingPrice: 1745, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Ndutu", "Ndutu", "Ngorongoro Crater"]},
  {file: `${migrationRoot}/5-days-ndutu-calving-safari/5-days-ndutu-calving-safari.html`, routeFamily: "Ndutu Calving Safari", startingPrice: 2195, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Ndutu", "Ndutu", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${migrationRoot}/7-days-ndutu-calving-safari/7-days-ndutu-calving-safari.html`, routeFamily: "Ndutu Calving Safari", startingPrice: 3190, priceBasis: "Per person for two travellers", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Ndutu", "Ndutu", "Ndutu", "Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${privateRoot}/3-day-serengeti-ngorongoro-private-safari.html`, routeFamily: "Private Safari", startingPrice: 1475, priceBasis: "Per person for two travellers in the published lodge package", accommodation: "Mid-range lodge", routePlaces: ["Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${privateRoot}/5-day-tarangire-serengeti-ngorongoro-private-safari.html`, routeFamily: "Private Safari", startingPrice: 2305, priceBasis: "Per person for two travellers in the published lodge package", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Central Serengeti", "Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${privateRoot}/7-day-northern-tanzania-private-safari.html`, routeFamily: "Private Safari", startingPrice: 3210, priceBasis: "Per person for two travellers in the published lodge package", accommodation: "Mid-range lodge", routePlaces: ["Tarangire National Park", "Lake Manyara National Park", "Central Serengeti", "Central Serengeti", "Central Serengeti", "Ngorongoro Crater", "Ngorongoro Crater"]},
  {file: `${meruRoot}/3-day-mount-meru-climb.html`, routeFamily: "Mount Meru", startingPrice: 813, priceBasis: "Published private-climb starting price per person", accommodation: "Other", tripType: "Mount Meru trek", routePlaces: ["Miriakamba Hut", "Saddle Hut", "Socialist Peak"]},
  {file: `${meruRoot}/4-day-mount-meru-climb.html`, routeFamily: "Mount Meru", startingPrice: 1034, priceBasis: "Published private-climb starting price per person", accommodation: "Other", tripType: "Mount Meru trek", routePlaces: ["Miriakamba Hut", "Saddle Hut", "Socialist Peak", "Momella Gate"]},
];

const knownDestinations = [
  "Northern Serengeti", "Central Serengeti", "Serengeti National Park", "Serengeti", "Mara River", "Kogatende",
  "Ngorongoro Crater", "Ngorongoro", "Tarangire National Park", "Tarangire", "Lake Manyara National Park", "Lake Manyara",
  "Ndutu", "Karatu", "Arusha National Park", "Arusha", "Momella Gate", "Miriakamba Hut", "Saddle Hut", "Little Meru", "Socialist Peak",
];

const coordinates = {
  "Arusha": {lat: -3.3869, lng: 36.683},
  "Tarangire National Park": {lat: -3.8333, lng: 36},
  "Lake Manyara National Park": {lat: -3.475, lng: 35.817},
  "Serengeti National Park": {lat: -2.3333, lng: 34.8333},
  "Central Serengeti": {lat: -2.442, lng: 34.821},
  "Northern Serengeti": {lat: -1.616, lng: 34.755},
  "Mara River": {lat: -1.56, lng: 34.72},
  "Kogatende": {lat: -1.555, lng: 34.807},
  "Ngorongoro Crater": {lat: -3.1618, lng: 35.5877},
  "Ndutu": {lat: -3.019, lng: 34.996},
  "Karatu": {lat: -3.341, lng: 35.669},
  "Arusha National Park": {lat: -3.25, lng: 36.833},
  "Momella Gate": {lat: -3.237, lng: 36.829},
  "Miriakamba Hut": {lat: -3.237, lng: 36.787},
  "Saddle Hut": {lat: -3.239, lng: 36.765},
  "Little Meru": {lat: -3.222, lng: 36.764},
  "Socialist Peak": {lat: -3.246, lng: 36.75},
};

function text(value = "") {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&middot;/g, "·")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugFromUrl(url) {
  return new URL(url).pathname.split("/").filter(Boolean).at(-1);
}

function jsonLdGraph(html) {
  const scripts = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.flatMap(match => {
    try {
      const value = JSON.parse(match[1]);
      return value["@graph"] || [value];
    } catch {
      return [];
    }
  });
}

function imageUrls(html) {
  return [...new Set([...html.matchAll(/https?:[^"'<> ]+\.(?:jpe?g|png|webp)/gi)]
    .map(match => match[0].replaceAll("\\/", "/"))
    .filter(url => url.includes("serengetiwildtours.com/wp-content/uploads/")))];
}

function localImage(url) {
  const basename = decodeURIComponent(new URL(url).pathname.split("/").at(-1)).replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${publicImageRoot}/${basename}`;
}

function downloadableUrl(url) {
  const value = new URL(url);
  value.hostname = "www.serengetiwildtours.com";
  return value.toString();
}

function placeFor(value) {
  const match = knownDestinations.find(place => value.toLowerCase().includes(place.toLowerCase()));
  if (!match) return "Arusha";
  if (match === "Serengeti") return "Serengeti National Park";
  if (match === "Tarangire") return "Tarangire National Park";
  if (match === "Lake Manyara") return "Lake Manyara National Park";
  if (match === "Ngorongoro") return "Ngorongoro Crater";
  return match;
}

function destinationsFor(items, isMeru) {
  if (isMeru) return ["Mount Meru", "Arusha National Park", "Socialist Peak"];
  const values = items.flatMap(item => knownDestinations.filter(place => `${item.name} ${item.description}`.includes(place)));
  return [...new Set(values.map(place => placeFor(place)).filter(place => place !== "Arusha" && place !== "Karatu"))];
}

function extractList(html, heading) {
  const pattern = new RegExp(`<h3[^>]*>${heading}<\\/h3>[\\s\\S]*?<ul[^>]*>([\\s\\S]*?)<\\/ul>`, "i");
  const block = html.match(pattern)?.[1] || "";
  return [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(match => text(match[1])).filter(Boolean);
}

function priceTiers(source, html) {
  const published = [...html.matchAll(/swt-price-card[^>]*data-size="(\d+)"[^>]*>[\s\S]*?<strong>\$([0-9,]+)/g)].map(match => ({size: Number(match[1]), price: match[2]}));
  if (published.length) {
    return published.map(item => ({
      name: `${item.size} travellers`,
      price: `$${item.price}`,
      suffix: "/pp",
      description: item.size === 2 ? `${source.priceBasis}.` : "Published per-person rate for this group size.",
    }));
  }
  return [{name: "Starting package", price: `$${source.startingPrice.toLocaleString("en-US")}`, suffix: "/pp", description: `${source.priceBasis}.`}];
}

function makeItinerary(source) {
  const absolutePath = path.join(downloadsRoot, source.file);
  if (!existsSync(absolutePath)) throw new Error(`Missing SWT source: ${absolutePath}`);
  const html = readFileSync(absolutePath, "utf8");
  const graph = jsonLdGraph(html);
  const trip = graph.find(item => item["@type"] === "TouristTrip");
  if (!trip) throw new Error(`TouristTrip JSON-LD is missing from ${absolutePath}`);
  const faq = graph.find(item => item["@type"] === "FAQPage");
  const isMeru = source.tripType === "Mount Meru trek";
  const allItems = trip.itinerary?.itemListElement || [];
  const itineraryItems = isMeru ? allItems.filter(item => /^Day \d+:/i.test(item.name)) : allItems;
  const slug = slugFromUrl(trip.url);
  const urls = imageUrls(html);
  const images = urls.map((url, index) => ({src: localImage(url), alt: index === 0 ? trip.name : `${source.routeFamily} experience ${index + 1}`}));
  const arrival = allItems.find(item => /^Arrival:/i.test(item.name));
  const departure = allItems.find(item => /^Departure:/i.test(item.name));
  const days = itineraryItems.map((item, index) => {
    const title = item.name.replace(/^Day \d+:\s*/i, "");
    const place = placeFor(`${title} ${item.description}`);
    const image = images[index % Math.max(images.length, 1)]?.src;
    const finalDay = index === itineraryItems.length - 1;
    return {
      id: `${slug}-day-${index + 1}`,
      dayNumber: index + 1,
      title,
      summary: item.description.split(/(?<=\.)\s+/)[0],
      narrative: item.description,
      habitat: isMeru ? (index === 0 ? "Montane forest" : index === itineraryItems.length - 1 ? "Alpine summit ridge" : "Heather and moorland") : "Northern Tanzania wildlife country",
      activityLevel: isMeru ? (finalDay ? "Challenging summit day" : "Guided mountain trek") : "Private game-drive day",
      meals: finalDay ? ["Breakfast", "Lunch"] : ["Breakfast", "Lunch", "Dinner"],
      activities: [{id: `${slug}-activity-${index + 1}`, title: isMeru ? "Guided Mount Meru trek" : "Guided safari game drive", description: item.description, location: place}],
      ...(!finalDay ? {accommodation: isMeru ? {name: title.includes("Saddle") ? "Saddle Hut" : "Miriakamba Hut", category: "Other", location: place, description: "Shared mountain hut accommodation inside Arusha National Park."} : {name: source.accommodation === "Group camping" ? "Campsite or lodge" : "Safari lodge or tented camp", category: source.accommodation, location: place, description: "The confirmed property is listed in the final quotation and depends on availability."}} : {}),
      ...(image ? {image, imageAlt: `${title} on the ${source.routeFamily} itinerary`} : {}),
      ...(finalDay ? {dropOffNote: departure?.description || "Return to your accommodation in Arusha after the final activity."} : {}),
    };
  });
  const destinations = destinationsFor(itineraryItems, isMeru);
  if (source.routePlaces.length !== days.length) throw new Error(`Route stop count does not match day count for ${slug}`);
  const routeStops = days.map(day => {
    const name = source.routePlaces[day.dayNumber - 1];
    return {name, label: `Day ${day.dayNumber}`, description: day.summary, dayNumber: day.dayNumber, coordinates: coordinates[name] || coordinates.Arusha};
  });
  const inclusions = extractList(html, "Included");
  const exclusions = extractList(html, "Not included");
  const sharedInclusions = isMeru
    ? ["Private Mount Meru climb", "Park fees and ranger support", "Mountain guide and crew", "Hut accommodation", "Meals on the mountain", "Transfers from Arusha or Moshi"]
    : ["Safari vehicle and professional driver-guide", "Park and conservation fees", "Accommodation shown in the confirmed package", "Meals on safari", "Drinking water", "Pick-up and drop-off in Arusha"];
  const sharedExclusions = ["International flights", "Tanzania visa", "Travel insurance", "Tips and personal expenses", "Optional activities not listed in the itinerary"];

  return {
    id: `swt-${slug}`,
    sourceId: `swt:${slug}`,
    sourcePath: source.file,
    sourceUrl: trip.url,
    tripType: source.tripType || "Wildlife safari",
    routeFamily: source.routeFamily,
    slug,
    title: trip.name,
    summary: trip.description,
    heroImage: images[0]?.src,
    overviewTitle: isMeru ? `Why choose the ${trip.name.replace(" in Tanzania", "")}?` : `About this ${source.routeFamily.toLowerCase()}`,
    overviewParagraphs: [trip.description, isMeru ? "Mount Meru is a quieter hut-based climb through Arusha National Park, finishing at Socialist Peak at 4,566 metres." : `This ${source.routeFamily.toLowerCase()} itinerary can be confirmed around your dates and preferred accommodation.`],
    highlights: isMeru ? ["Licensed guide and armed park ranger", "Hut accommodation on Mount Meru", "Socialist Peak at 4,566 metres", "Transfers from Arusha or Moshi"] : [destinations.slice(0, 2).join(" and "), source.routeFamily === "Joining Safari" ? "Shared safari departure with a published per-person price" : "Private 4x4 and professional driver-guide", "Park fees, meals and accommodation included", "Arusha pick-up and drop-off"],
    galleryImages: images,
    routeStops,
    durationDays: days.length,
    destinations,
    startingPrice: source.startingPrice,
    currency: "USD",
    status: "published",
    days,
    inclusions: inclusions.length ? inclusions : sharedInclusions,
    exclusions: exclusions.length ? exclusions : sharedExclusions,
    onRequestItems: isMeru ? ["Private departure dates", "Equipment rental", "Kilimanjaro climb or safari extension", "Zanzibar extension"] : ["Airport transfers", "Arusha hotel nights", "Accommodation upgrades", "Balloon safari where available", "Zanzibar extension"],
    priceIntroduction: `${source.priceBasis}. The final quotation confirms availability, inclusions and any seasonal supplements.`,
    priceTiers: priceTiers(source, html),
    optionalExperiences: isMeru ? [{name: "Safari extension", price: "Tailored quote", note: "Add Tarangire, Serengeti or Ngorongoro after the climb."}] : [{name: "Private vehicle", price: source.routeFamily === "Joining Safari" ? "On request" : "Included", note: "Confirmed according to the published package."}, {name: "Serengeti balloon safari", price: "On request", note: "Subject to route, season and availability."}],
    travelStyle: isMeru ? "Private guided Mount Meru hut climb" : source.routeFamily === "Joining Safari" ? "Shared northern Tanzania safari" : "Private northern Tanzania safari",
    practicalInformation: isMeru ? [arrival?.description || "Meet your driver in Arusha or Moshi for the pre-climb briefing.", "The summit day begins after midnight and is physically demanding.", "Travel insurance must cover trekking up to 4,600 metres, evacuation and repatriation."] : ["The safari starts and ends at your accommodation in Arusha.", "Driving times vary with road, weather and wildlife conditions.", "Tell us about dietary requirements, mobility needs and celebrations before arrival.", "Travel with comprehensive insurance and the correct Tanzania entry documents."],
    packingNotes: isMeru ? ["Bring broken-in hiking boots, warm summit layers, waterproof outerwear and a head torch.", "Carry sun protection, water, personal medication and a small day pack."] : ["Pack light neutral clothing, a warm layer for early mornings, sun protection and insect repellent.", "Use a soft-sided bag and keep documents, medication and camera equipment in your day bag."],
    bookingConditions: ["Accommodation and final routing remain subject to availability until confirmed in writing.", "Wildlife sightings and migration crossings cannot be guaranteed.", "Your final quotation states the deposit, payment schedule, cancellation terms and any seasonal supplements."],
    faqs: (faq?.mainEntity || []).map(item => ({question: item.name, answer: item.acceptedAnswer?.text || ""})).filter(item => item.question && item.answer),
    relatedTripSlugs: [],
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

function useGoldenDreamMountMeruImages(itinerary) {
  if (itinerary.tripType !== "Mount Meru trek") return itinerary;

  return {
    ...itinerary,
    heroImage: goldenDreamMountMeruImages[0].src,
    galleryImages: goldenDreamMountMeruImages,
    days: itinerary.days.map((day, index) => {
      const image = goldenDreamMountMeruImages[index % goldenDreamMountMeruImages.length];
      return {...day, image: image.src, imageAlt: image.alt};
    }),
  };
}

async function downloadImages(itineraries) {
  mkdirSync(imageDirectory, {recursive: true});
  const urls = new Map();
  for (const source of sources) {
    const html = readFileSync(path.join(downloadsRoot, source.file), "utf8");
    for (const url of imageUrls(html)) urls.set(localImage(url), url);
  }
  for (const [localPath, url] of urls) {
    const destination = path.join(projectRoot, "public", localPath);
    if (existsSync(destination)) continue;
    let response;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        response = await fetch(downloadableUrl(url), {headers: {"user-agent": "Mozilla/5.0 Golden Dream SWT migration"}, signal: AbortSignal.timeout(60_000)});
        if (response.ok) break;
      } catch (error) {
        if (attempt === 3) throw error;
      }
    }
    if (!response.ok) throw new Error(`Could not download ${url}: ${response.status}`);
    writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
    console.log(`Downloaded ${localPath}`);
  }
  const referenced = new Set(itineraries.flatMap(item => (item.galleryImages || []).map(image => image.src)));
  console.log(`Prepared ${referenced.size} local SWT image references.`);
}

const generated = sources.map(makeItinerary).map(useGoldenDreamMountMeruImages);
for (const category of ["Joining Safari", "Great Migration North", "Ndutu Calving Safari", "Private Safari"]) {
  const count = generated.filter(item => item.routeFamily === category).length;
  if (count !== 3) throw new Error(`${category} must contain exactly three generated itineraries; found ${count}.`);
}
if (generated.filter(item => item.tripType === "Mount Meru trek").length !== 2) throw new Error("Mount Meru must contain exactly two generated itineraries.");

const outputFiles = ["data/itineraries.json", "data/seed-itineraries.json"];
for (const outputFile of outputFiles) {
  const outputPath = path.join(projectRoot, outputFile);
  const current = JSON.parse(readFileSync(outputPath, "utf8"));
  const generatedSlugs = new Set(generated.map(item => item.slug));
  const merged = [...current.filter(item => !generatedSlugs.has(item.slug)), ...generated];
  writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Wrote ${generated.length} SWT itineraries to ${outputFile} (${merged.length} total).`);
}

if (shouldDownload) await downloadImages(generated);
