import {readFileSync, writeFileSync} from "node:fs";

const generatedAt = "2026-11-25T00:00:00.000Z";
const imageRoot = "/images/itineraries/swt";

const packages = [
  {
    slug: "3-days-zanzibar-stone-town-nakupenda-holiday",
    title: "3 Days Zanzibar Stone Town & Nakupenda Holiday",
    price: 480,
    summary: "A compact Stone Town escape combining two of Zanzibar’s best-known ocean days with an easy arrival evening.",
    image: "zanzibar-stone-town7.jpg",
    days: [
      ["Arrival & easy Stone Town evening", "Meet your driver at Zanzibar Airport for the short transfer to Tembo House Hotel. Settle in, rest after your flight and enjoy the waterfront at your own pace.", "Stone Town", "Tembo House Hotel"],
      ["Safari Blue", "Spend the day on the water with a traditional dhow experience from Fumba, including snorkeling, swimming, a sandbank stop and seafood lunch before returning to Stone Town.", "Fumba", "Tembo House Hotel"],
      ["Prison Island, Nakupenda & departure", "Travel by boat to Prison Island, then continue to Nakupenda Sandbank for swimming, beach time and seafood lunch. Return to Stone Town afterward for your onward airport transfer. This short route works best with a later departure, and we can adjust the order around your flight time.", "Nakupenda Sandbank", "Departure"],
    ],
  },
  {
    slug: "4-days-zanzibar-stone-town-matemwe-holiday",
    title: "4 Days Zanzibar Stone Town & Matemwe Holiday",
    price: 690,
    summary: "A short island holiday balancing Safari Blue, Zanzibar culture and a slower finish on the Matemwe coast.",
    image: "zanzibar-tropical-island-aerial.jpg",
    days: [
      ["Arrival in Stone Town", "Airport pickup and transfer to Tembo House Hotel. Keep the rest of the day free for rest, the waterfront or an easy evening walk.", "Stone Town", "Tembo House Hotel"],
      ["Safari Blue", "Leave for Fumba for a full-day dhow experience in Menai Bay with snorkeling, swimming, a sandbank stop and seafood lunch. Return to Stone Town in the late afternoon.", "Fumba", "Tembo House Hotel"],
      ["Stone Town, Spice Farm & Matemwe", "Explore Stone Town with a local guide, visit a working spice farm, then continue to Zanzibar Queen Hotel on the northeast coast. The rest of the afternoon is free for the beach and hotel.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Relaxed morning & departure", "Enjoy breakfast and unhurried hotel time before your transfer to Zanzibar Airport.", "Zanzibar Airport", "Departure"],
    ],
  },
  {
    slug: "5-days-zanzibar-mnemba-beach-holiday",
    title: "5 Days Zanzibar Mnemba & Beach Holiday",
    price: 985,
    summary: "A five-day route combining Zanzibar’s classic dhow day, island culture and a Mnemba marine experience with a slower northeast-coast finish.",
    image: "zanzibar-indian-ocean-coastline.jpg",
    days: [
      ["Arrival in Stone Town", "Meet your driver at Zanzibar Airport and transfer to Tembo House Hotel. The rest of the day is free for the waterfront, a slow dinner and rest.", "Stone Town", "Tembo House Hotel"],
      ["Safari Blue", "Travel to Fumba for a full-day dhow excursion in Menai Bay with snorkeling, swimming, sandbank time and seafood lunch. Return to Stone Town later in the afternoon.", "Fumba", "Tembo House Hotel"],
      ["Stone Town, Spice Farm & Matemwe", "Explore Stone Town with a guide, visit a working spice farm and continue to Zanzibar Queen Hotel on the northeast coast. Settle in and enjoy a relaxed afternoon.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Mnemba marine day", "Enjoy snorkeling around the Mnemba area, a dolphin-focused boat route and the turtle aquarium visit. Return to Zanzibar Queen after the excursion.", "Mnemba", "Zanzibar Queen Hotel"],
      ["Relaxed morning & departure", "Breakfast and free time at the hotel depending on your flight schedule, followed by transfer to Zanzibar Airport.", "Zanzibar Airport", "Departure"],
    ],
  },
  {
    slug: "6-days-zanzibar-stone-town-mnemba-beach-holiday",
    title: "6 Days Zanzibar Stone Town & Mnemba Holiday",
    price: 1170,
    summary: "A balanced six-day Zanzibar itinerary with Safari Blue, culture, Mnemba and a protected full day to enjoy Matemwe.",
    image: "zanzibar-prison-island.jpg",
    days: [
      ["Arrival & relaxed Stone Town evening", "Airport pickup and transfer to Tembo House Hotel. The rest of the day is free.", "Stone Town", "Tembo House Hotel"],
      ["Safari Blue", "Travel to Fumba for a full-day dhow experience in Menai Bay with snorkeling, swimming, a sandbank stop and seafood lunch. Return to Stone Town afterward.", "Fumba", "Tembo House Hotel"],
      ["Stone Town, Spice Farm & Matemwe", "Explore Stone Town with a local guide, visit a working spice farm, then continue to Zanzibar Queen Hotel. Keep the late afternoon free for the pool and beach.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Mnemba, dolphins & turtle aquarium", "Enjoy the Mnemba snorkeling route, look for dolphins along the way and visit the turtle aquarium before returning to your hotel.", "Mnemba", "Zanzibar Queen Hotel"],
      ["Full relaxation day", "A complete day with no scheduled tour. Enjoy Zanzibar Queen and the Matemwe coast at your own pace.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Departure", "Relaxed breakfast and airport transfer according to your onward flight.", "Zanzibar Airport", "Departure"],
    ],
  },
  {
    slug: "7-days-zanzibar-nungwi-seawalk-holiday",
    title: "7 Days Zanzibar Nungwi & SeaWalk Holiday",
    price: 1195,
    summary: "A north-coast Zanzibar holiday combining Safari Blue and SeaWalk with two full days left open for Nungwi.",
    image: "zanzibar-nungwi-beach-overwater-restaurant.jpeg",
    days: [
      ["Arrival in Stone Town", "Airport pickup and transfer to Tembo House Hotel. Rest after your journey and enjoy the waterfront at your own pace.", "Stone Town", "Tembo House Hotel"],
      ["Safari Blue", "Leave for Fumba for a full-day dhow experience in Menai Bay with snorkeling, swimming, a sandbank stop and seafood lunch. Return to Stone Town later in the day.", "Fumba", "Tembo House Hotel"],
      ["Stone Town, Spice Farm & Nungwi", "Enjoy a guided Stone Town and spice farm experience, then continue north to Nungwi Dreams by Mantis.", "Nungwi", "Nungwi Dreams by Mantis"],
      ["SeaWalk & easy Nungwi afternoon", "Experience SeaWalk in Nungwi, then keep the rest of the day open for swimming, beach time and sunset.", "Nungwi", "Nungwi Dreams by Mantis"],
      ["Full Nungwi relaxation day", "No scheduled excursion. Enjoy the hotel, pool and beach at your own pace.", "Nungwi", "Nungwi Dreams by Mantis"],
      ["Second full beach day", "Keep another full day open. If you want more activity, Mnemba snorkeling, a sunset dhow or another island experience can be added.", "Nungwi", "Nungwi Dreams by Mantis"],
      ["Departure", "Breakfast and transfer to Zanzibar Airport according to your flight schedule.", "Zanzibar Airport", "Departure"],
    ],
  },
  {
    slug: "8-days-zanzibar-island-highlights-holiday",
    title: "8 Days Zanzibar Island Highlights Holiday",
    price: 1520,
    summary: "A slower three-base island holiday with culture, Safari Blue and three easy beach-focused days.",
    image: "zanzibar-safari-blue.jpg",
    days: [
      ["Arrival in Stone Town", "Airport pickup and transfer to Tembo House Hotel. The rest of the day is completely free.", "Stone Town", "Tembo House Hotel"],
      ["Prison Island & Nakupenda", "Boat excursion to Prison Island and Nakupenda Sandbank with swimming and an included seafood lunch.", "Nakupenda Sandbank", "Tembo House Hotel"],
      ["Stone Town, Spice Farm & southeast coast", "Take the guided Stone Town and spice farm tour, then transfer to Kaskazi Hotel in Jambiani for dinner and overnight.", "Jambiani", "Kaskazi Hotel Zanzibar"],
      ["Safari Blue", "Full-day Safari Blue experience with dhow sailing, snorkeling, sandbanks and seafood lunch, then return to Kaskazi.", "Fumba", "Kaskazi Hotel Zanzibar"],
      ["Full Kaskazi relaxation day", "No excursion today. Enjoy the pools, beach, spa, sea views and half-board stay at your own pace.", "Jambiani", "Kaskazi Hotel Zanzibar"],
      ["Matemwe transfer & slow beach afternoon", "After breakfast, transfer to Zanzibar Queen Hotel. The afternoon is deliberately left free for the hotel and beach.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Full Zanzibar Queen relaxation day", "Keep the final full day completely open. Mnemba snorkeling, Jozani Forest or The Rock can be added if you prefer another excursion.", "Matemwe", "Zanzibar Queen Hotel"],
      ["Departure", "Breakfast and airport transfer according to your flight time.", "Zanzibar Airport", "Departure"],
    ],
  },
];

const coordinates = {
  "Stone Town": {lat: -6.1659, lng: 39.2026}, Fumba: {lat: -6.3258, lng: 39.2864},
  "Nakupenda Sandbank": {lat: -6.1288, lng: 39.1519}, Matemwe: {lat: -5.8745, lng: 39.3534},
  Mnemba: {lat: -5.819, lng: 39.384}, Nungwi: {lat: -5.726, lng: 39.299},
  Jambiani: {lat: -6.32, lng: 39.55}, "Zanzibar Airport": {lat: -6.222, lng: 39.225},
};

const imageGallery = packages.map(item => ({src: `${imageRoot}/${item.image}`, alt: item.title}));

function makePackage(item) {
  const days = item.days.map(([title, narrative, place, overnight], index) => ({
    id: `${item.slug}-day-${index + 1}`,
    dayNumber: index + 1,
    title,
    summary: narrative.split(/(?<=\.)\s+/)[0],
    narrative,
    habitat: place === "Stone Town" ? "Historic island city" : place === "Zanzibar Airport" ? "Zanzibar" : "Indian Ocean coast",
    driveTime: "Confirmed around the day’s route and tide conditions",
    activityLevel: title.toLowerCase().includes("relax") || title.toLowerCase().includes("free") ? "Relaxed" : "Easy island touring",
    meals: title.toLowerCase().includes("safari blue") || title.toLowerCase().includes("nakupenda") ? ["Breakfast", "Lunch"] : ["Breakfast"],
    activities: [{id: `${item.slug}-activity-${index + 1}`, title, description: narrative, location: place}],
    ...(overnight !== "Departure" ? {accommodation: {name: overnight, category: "Mid-range lodge", location: place, description: "The listed hotel is used for this published sample route, subject to availability for your dates."}} : {dropOffNote: "Transfer to Zanzibar Airport according to your onward flight."}),
    image: `${imageRoot}/${item.image}`,
    imageAlt: `${title} during the ${item.title}`,
  }));
  const destinations = [...new Set(item.days.map(day => day[2]).filter(place => place !== "Zanzibar Airport"))];
  return {
    id: `swt-${item.slug}`,
    sourceId: `swt:zanzibar:${item.slug}`,
    sourcePath: `zanzibar/${item.slug}/`,
    sourceUrl: `https://www.serengetiwildtours.com/zanzibar/${item.slug}/`,
    tripType: "Zanzibar stay",
    routeFamily: "Zanzibar Holiday",
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    heroImage: `${imageRoot}/${item.image}`,
    overviewTitle: "Why this Zanzibar itinerary works",
    overviewParagraphs: [item.summary, "This is a private sample itinerary that can be adjusted around your flights, preferred hotels, room choice and pace."],
    highlights: [`${item.days.length} days on Zanzibar`, "Private airport and itinerary transfers", "Hotels and excursions arranged in a sensible island route", "Customisable around your dates and pace"],
    galleryImages: imageGallery,
    routeStops: days.map((day, index) => ({name: item.days[index][2], label: `Day ${day.dayNumber}`, description: day.summary, dayNumber: day.dayNumber, coordinates: coordinates[item.days[index][2]]})),
    durationDays: days.length,
    destinations: ["Zanzibar", ...destinations],
    startingPrice: item.price,
    currency: "USD",
    status: "published",
    days,
    inclusions: ["Accommodation shown in the itinerary", "Daily breakfast", "Zanzibar Airport transfers", "Private transport between listed areas", "Listed excursions, local guides and entrance fees", "Meals and refreshments specifically named in the itinerary"],
    exclusions: ["Flights to or from Zanzibar", "Travel insurance and visa costs", "Lunches and dinners not specifically listed", "Optional activities and hotel upgrades not listed", "Tips, laundry and personal expenses", "Hotel infrastructure taxes payable directly where applicable"],
    onRequestItems: ["Room or hotel upgrades", "Additional beach nights", "Safari or Kilimanjaro extension", "Private celebration arrangements"],
    priceIntroduction: `From USD ${item.price.toLocaleString("en-US")} per person, based on two guests sharing. The final quotation depends on travel dates, room choice and availability.`,
    priceTiers: [{name: "2 guests sharing", price: `USD ${item.price.toLocaleString("en-US")}`, suffix: "/pp", description: "Published starting price per person for two guests sharing."}],
    optionalExperiences: [{name: "Additional island excursion", price: "On request", note: "Add Mnemba snorkeling, Jozani Forest, The Rock, a sunset dhow or another suitable island experience."}],
    travelStyle: "Private Zanzibar island holiday",
    practicalInformation: ["The activity order can change around flight times, tides and sea conditions.", "Hotel and room availability is confirmed before booking.", "Tell us about dietary requirements and mobility needs before arrival."],
    packingNotes: ["Bring light clothing, swimwear, reef-safe sun protection and a light cover for cultural visits.", "Keep travel documents, medication and valuables in your hand luggage."],
    bookingConditions: ["The final route, hotels, room category and price are confirmed in writing before payment.", "Sea activities remain subject to weather, tide and safety conditions."],
    faqs: [
      {question: "Can this Zanzibar itinerary be customised?", answer: "Yes. We can add beach time, swap activities, change hotels, upgrade rooms or combine the island stay with a safari or Kilimanjaro climb."},
      {question: "What does the From price mean?", answer: "It is the starting price per person for two guests sharing. Your final quotation depends on travel dates, room choice and availability."},
      {question: "Are airport transfers included?", answer: "Yes. Zanzibar Airport transfers and the route transfers listed in the itinerary are included."},
    ],
    relatedTripSlugs: packages.filter(other => other.slug !== item.slug).map(other => other.slug),
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

const lemoshoDays = [
  ["Moshi to Lemosho Gate, trek to Mti Mkubwa Camp", "Drive to Lemosho Gate for registration and begin your trek through the montane forest. This first day is a gentle introduction to the mountain and a good time to settle into the climbing rhythm. Overnight at Mti Mkubwa Camp, around 2,650m. Approx. 3 to 4 hours."],
  ["Mti Mkubwa Camp to Shira 1 Camp", "The forest gradually opens into heather and moorland as you climb towards the Shira Plateau. The views become wider and the mountain begins to feel bigger. Overnight at Shira 1 Camp, around 3,610m. Approx. 5 to 6 hours."],
  ["Shira 1 Camp to Shira 2 Camp", "This shorter day across the plateau is one of the reasons the 8-day itinerary feels better paced than 7 Days Lemosho. You walk across open alpine scenery and have more time to adjust before the higher days ahead. Overnight at Shira 2 Camp, around 3,850m. Approx. 3 to 5 hours."],
  ["Shira 2 Camp to Barranco Camp via Lava Tower", "Climb towards Lava Tower, around 4,600m, then descend to Barranco Camp. This is an important acclimatization day because you climb high and sleep lower. The scenery is dramatic, with views of the southern side of Kilimanjaro. Approx. 6 to 7 hours."],
  ["Barranco Camp to Karanga Camp", "After breakfast, climb the Barranco Wall with steady guidance from your mountain team. The trail then crosses ridges and valleys towards Karanga Camp. This is a useful acclimatization day before moving to Barafu. Approx. 3 to 5 hours."],
  ["Karanga Camp to Barafu Camp", "Walk gradually into the alpine desert towards Barafu Camp. You will arrive, eat, rest and prepare your summit layers before sleeping early. The pace stays slow because the altitude is serious. Approx. 3 to 4 hours."],
  ["Barafu Camp to Uhuru Peak, descend to Mweka Camp", "Begin the summit attempt around midnight. Your guide will set a slow, steady pace to Stella Point and then Uhuru Peak at 5,895m. After the summit, descend to Barafu for a short rest and continue to Mweka Camp. Approx. 11 to 14 hours total."],
  ["Mweka Camp to Mweka Gate, return to Moshi", "Complete your final descent through rainforest to Mweka Gate. After signing out and receiving your certificate, drive back to Moshi for a hot shower, dinner and celebration."],
];

function updateLemosho(items) {
  return items.map(item => {
    if (item.slug !== "8-days-lemosho-route") return item;
    const days = item.days.map((day, index) => ({...day, title: lemoshoDays[index][0], summary: lemoshoDays[index][1].split(/(?<=\.)\s+/)[0], narrative: lemoshoDays[index][1], activities: day.activities.map(activity => ({...activity, description: lemoshoDays[index][1]}))}));
    return {
      ...item,
      sourcePath: "8-days-lemosho-route-kilimanjaro/",
      sourceUrl: "https://www.serengetiwildtours.com/8-days-lemosho-route-kilimanjaro/",
      title: "8 Days Lemosho Route Kilimanjaro",
      summary: "A beautifully paced western approach with rainforest, the Shira Plateau, Lava Tower and the Southern Circuit before summit night.",
      overviewTitle: "Why choose 8 Days Lemosho Route Kilimanjaro",
      overviewParagraphs: ["A beautifully paced western approach with rainforest, the Shira Plateau, Lava Tower and the Southern Circuit before summit night.", "The extra time lets the route build altitude gradually while still covering Kilimanjaro’s most varied landscapes."],
      days,
      routeStops: item.routeStops.map((stop, index) => ({...stop, description: days[index].summary})),
      startingPrice: 2120,
      priceIntroduction: "Prices are shown per person. Request a personalised quotation for your private climb or group.",
      priceTiers: [
        {name: "1 climber", price: "USD 2,120", suffix: "/pp", description: "Published private climb rate per person."},
        {name: "4 climbers", price: "USD 1,848", suffix: "/pp", description: "Published private climb rate per person for four climbers."},
        {name: "6 climbers", price: "USD 1,835", suffix: "/pp", description: "Published private climb rate per person for six climbers."},
      ],
      updatedAt: generatedAt,
    };
  });
}

const zanzibar = packages.map(makePackage);
for (const file of ["data/seed-itineraries.json", "data/itineraries.json"]) {
  const current = updateLemosho(JSON.parse(readFileSync(file, "utf8")));
  const slugs = new Set(zanzibar.map(item => item.slug));
  const merged = [...current.filter(item => !slugs.has(item.slug)), ...zanzibar];
  writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Wrote ${zanzibar.length} Zanzibar itineraries to ${file} (${merged.length} total).`);
}

const kilimanjaroFile = "data/kilimanjaro-itineraries.json";
writeFileSync(kilimanjaroFile, `${JSON.stringify(updateLemosho(JSON.parse(readFileSync(kilimanjaroFile, "utf8"))), null, 2)}\n`);
console.log("Updated the verified 8 Days Lemosho route in all local data sources.");
