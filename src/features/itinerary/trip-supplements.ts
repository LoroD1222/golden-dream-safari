export type StayOption = {
  tier: "Group camping" | "Mid-range lodge" | "Private luxury";
  property: string;
  location: string;
  images: Array<{src: string; alt: string}>;
};

export type DayTravelFact = {
  driveTime: string;
  distance: string;
  activityLevel: string;
};

export type TripSupplement = {
  staysByDay: Record<number, StayOption[]>;
  travelByDay: Record<number, DayTravelFact>;
  optionalExperiences: Array<{name: string; price: string; note: string}>;
  packingNotes: string[];
  bookingConditions: string[];
};

const northernCircuitStays: Record<number, StayOption[]> = {
  1: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Mto wa Mbu", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}, {src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "Safari tent accommodation interior"}]},
    {tier: "Mid-range lodge", property: "Nimali Tarangire", location: "Tarangire", images: [{src: "/images/accommodations/nimali-tarangire.webp", alt: "Nimali Tarangire lodge"}, {src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "Mid-range safari lodge room"}]},
    {tier: "Private luxury", property: "Nimali Tarangire", location: "Tarangire", images: [{src: "/images/accommodations/nimali-tarangire.webp", alt: "Nimali Tarangire luxury lodge"}, {src: "/images/accommodations/melia-serengeti-lodge.jpg", alt: "Luxury safari lodge accommodation"}]},
  ],
  2: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Serengeti", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}]},
    {tier: "Mid-range lodge", property: "Lake Masek Tented Lodge", location: "Serengeti", images: [{src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "Lake Masek Tented Lodge"}]},
    {tier: "Private luxury", property: "Melia Serengeti Lodge", location: "Serengeti", images: [{src: "/images/accommodations/melia-serengeti-lodge.jpg", alt: "Melia Serengeti Lodge"}]},
  ],
  3: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Ngorongoro", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}]},
    {tier: "Mid-range lodge", property: "Neptune Ngorongoro", location: "Ngorongoro", images: [{src: "/images/accommodations/neptune-ngorongoro.webp", alt: "Neptune Ngorongoro Luxury Lodge"}, {src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "Mid-range safari lodge room"}]},
    {tier: "Private luxury", property: "Lemala Kuria Hills", location: "Northern Serengeti", images: [{src: "/images/accommodations/lemala-kuria-hills.jpg", alt: "Lemala Kuria Hills Lodge"}]},
  ],
};

const northernCircuitSupplement: TripSupplement = {
  staysByDay: northernCircuitStays,
  travelByDay: {
    1: {driveTime: "Approx. 2.5-3 hours", distance: "Approx. 120 km", activityLevel: "Easy game-drive day"},
    2: {driveTime: "Approx. 5-6 hours with game viewing", distance: "Approx. 230 km", activityLevel: "Long scenic transfer"},
    3: {driveTime: "Approx. 3-4 hours with game viewing", distance: "Approx. 150 km", activityLevel: "Easy game-drive day"},
    4: {driveTime: "Approx. 4-5 hours to Arusha", distance: "Approx. 190 km", activityLevel: "Crater drive and transfer"},
  },
  optionalExperiences: [
    {name: "Private safari vehicle upgrade", price: "On request", note: "Your own vehicle and guide throughout the safari."},
    {name: "Serengeti balloon safari", price: "On request", note: "Subject to season, route and availability."},
    {name: "Extra night in Arusha", price: "Quoted separately", note: "Before or after your safari, with transfer options."},
    {name: "Zanzibar extension", price: "Tailored quote", note: "Flights, transfers and beach accommodation can be arranged."},
  ],
  packingNotes: [
    "Light neutral clothing, a warm layer for early mornings and the Ngorongoro highlands, and a light rain jacket.",
    "Closed walking shoes, sun hat, sunglasses, sunscreen, insect repellent and personal medication.",
    "Binoculars, camera, spare batteries and a soft-sided bag suitable for the safari vehicle.",
    "Tanzania uses UK-style Type G plugs. Keep valuables, documents and essential medication in your day bag.",
  ],
  bookingConditions: [
    "This itinerary is a proposal. Accommodation, room category and final routing remain subject to availability until confirmed in writing.",
    "Wildlife sightings cannot be guaranteed. Driving times and distances are estimates and may change with road, weather and park conditions.",
    "Your final quotation will state the deposit, payment schedule, cancellation terms and any seasonal supplements.",
    "Travellers are responsible for passports, visas, travel insurance, vaccinations and medical advice applicable to their journey.",
  ],
};

const genericSupplement: TripSupplement = {
  staysByDay: {},
  travelByDay: {},
  optionalExperiences: [{name: "Private vehicle and custom extensions", price: "On request", note: "Ask us to tailor the route around your dates and interests."}],
  packingNotes: northernCircuitSupplement.packingNotes,
  bookingConditions: northernCircuitSupplement.bookingConditions,
};

export function getTripSupplement(slug: string) {
  return slug === "tarangire-serengeti-ngorongoro" ? northernCircuitSupplement : genericSupplement;
}
