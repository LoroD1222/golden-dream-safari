export const contactDetails = {
  phoneDisplay: "+255 763 571 646",
  phoneHref: "tel:+255763571646",
  email: "goldendreamsafaris@gmail.com",
  whatsapp: "https://wa.me/255763571646",
  location: "Arusha, Tanzania",
};

// The supplied design does not include a confirmed Tripadvisor profile URL.
// A branded search is more honest than sending visitors to the generic homepage.
export const tripadvisorUrl = "https://www.tripadvisor.com/Search?q=Golden%20Dream%20Safaris%20Tanzania";

export type TripCardData = {
  slug: string;
  title: string;
  category: "Wildlife safari" | "Day trip" | "Trek" | "Island";
  locations: string;
  duration: string;
  price: string;
  image: string;
};

export const wildlifeTrips: TripCardData[] = [
  {
    slug: "serengeti-ngorongoro-crater",
    title: "Serengeti & Ngorongoro Crater",
    category: "Wildlife safari",
    locations: "Serengeti · Ngorongoro",
    duration: "3 days · 2 nights",
    price: "from $180/pp/day",
    image: "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png",
  },
  {
    slug: "tarangire-serengeti-ngorongoro",
    title: "Tarangire, Serengeti & Ngorongoro",
    category: "Wildlife safari",
    locations: "Tarangire · Serengeti · Ngorongoro",
    duration: "4 days · 3 nights",
    price: "from $180/pp/day",
    image: "/images/figma/1a5404c8-be64-44f5-a5b7-387aa4da50b3.png",
  },
  {
    slug: "lake-manyara-serengeti-ngorongoro",
    title: "Lake Manyara, Serengeti & Ngorongoro",
    category: "Wildlife safari",
    locations: "Manyara · Serengeti · Ngorongoro",
    duration: "4 days · 3 nights",
    price: "from $180/pp/day",
    image: "/images/figma/279a986b-f6f3-4660-96c5-716505530be6.png",
  },
  {
    slug: "big-four-parks",
    title: "The Big Four Parks",
    category: "Wildlife safari",
    locations: "Manyara · Tarangire · Serengeti · Ngorongoro",
    duration: "5 days · 4 nights",
    price: "from $180/pp/day",
    image: "/images/figma/fcb78e89-1d4d-4e01-9c6c-fdaec6e228d9.png",
  },
  {
    slug: "lake-manyara-tarangire-ngorongoro",
    title: "Lake Manyara, Tarangire & Ngorongoro",
    category: "Wildlife safari",
    locations: "Manyara · Tarangire · Ngorongoro",
    duration: "3 days · 2 nights",
    price: "from $180/pp/day",
    image: "/images/figma/6223da51-8c90-4102-b46a-6f351f3eddd5.png",
  },
  {
    slug: "great-migration",
    title: "The Great Migration",
    category: "Wildlife safari",
    locations: "Serengeti · Ngorongoro",
    duration: "4 days · 3 nights",
    price: "Private tour · on request",
    image: "/images/figma/b1f2173a-0531-4720-8f9b-09e95ae2a30b.png",
  },
  {
    slug: "six-day-northern-parks-safari",
    title: "Six-day northern parks safari",
    category: "Wildlife safari",
    locations: "Tarangire · Serengeti · Ngorongoro · Manyara · Arusha NP",
    duration: "6 days · 5 nights",
    price: "from $180/pp/day",
    image: "/images/figma/973a96ad-e265-46ee-a318-89006e4d92f7.png",
  },
  {
    slug: "safari-day-trip",
    title: "Safari day trip",
    category: "Day trip",
    locations: "Arusha NP, Tarangire, Ngorongoro or Manyara",
    duration: "1 day",
    price: "Price on request",
    image: "/images/figma/c299246f-2033-43be-a3a4-eebbe6d23354.png",
  },
];

export const otherTrips: TripCardData[] = [
  {
    slug: "kilimanjaro-trek",
    title: "Kilimanjaro trek",
    category: "Trek",
    locations: "Machame, Lemosho and other routes",
    duration: "Flexible duration",
    price: "Price on request",
    image: "/images/figma/b908c94f-980e-459a-85ca-d25d7305c37d.png",
  },
  {
    slug: "mount-meru-trek",
    title: "Mount Meru trek",
    category: "Trek",
    locations: "Arusha National Park",
    duration: "Flexible duration",
    price: "Price on request",
    image: "/images/figma/8a7c9814-78b0-4886-bef0-bbd31d8e872a.png",
  },
  {
    slug: "zanzibar-beach-stay",
    title: "Zanzibar beach stay",
    category: "Island",
    locations: "Stone Town · beaches",
    duration: "Flexible duration",
    price: "Price on request",
    image: "/images/figma/37543361-a611-4b4f-9167-4a63269c4632.png",
  },
];

export const commonFaqs = [
  {
    question: "How much does a safari cost?",
    answer: "From $180 per person per day for a group camping safari, up to $550 for a private lodge safari. Group size, parks, season and comfort level all affect the price. Your quote is free.",
  },
  {question: "What's included?", answer: "Accommodation, meals on safari, transport, drinking water and park activities listed in your proposal are included."},
  {question: "Can I change the itinerary?", answer: "Yes. Every trip can be changed until it fits your dates, interests and preferred comfort level."},
  {question: "Private tour or join a group?", answer: "Both are possible. Tell us your preference and we will explain the options for your dates."},
  {question: "When is the best time to go?", answer: "Tanzania is a year-round destination. The best time depends on the parks, wildlife and activities you want to experience."},
  {question: "Can you arrange airport transfers and a hotel in Arusha?", answer: "Yes. Airport transfers and an Arusha hotel before or after your trip can be added on request."},
  {question: "I have dietary requirements. Is that OK?", answer: "Yes. Tell us about dietary requirements when you request your quote so the team can plan ahead."},
  {question: "How do I book?", answer: "Send your dates and group details. We will prepare an itinerary and price, then explain the next steps."},
];

export type ReviewData = {
  title: string;
  quote: string;
  author: string;
  meta: string;
  tag: string;
  image?: string;
  reply?: string;
};

export const reviews: ReviewData[] = [
  {
    title: "An unforgettable Tanzanian adventure",
    quote: "Victor spots animals as if it’s the easiest thing in the world! Thanks to his experience and sharp eye, we saw an incredible variety of wildlife and even managed to see the complete Big Five.",
    author: "Jonas D",
    meta: "Sep 2026 · Couples",
    tag: "4-day safari",
    reply: "It was truly a pleasure to be your driver and safari guide.",
  },
  {
    title: "Once in a lifetime experience",
    quote: "The communication with him was very quick and clear! We felt in very good hands. Thanks to him we saw the big 5.",
    author: "ri c",
    meta: "Oct 2025 · Couples",
    tag: "5-day safari",
    image: "/images/figma/cffa1660-4788-40e2-917b-adeeb0c5fa17.png",
  },
  {
    title: "The best safari company you will find in Tanzania",
    quote: "Best safari company ever!! Look no further. Our driver Adam was the best.",
    author: "Erika G",
    meta: "Oct 2026 · Couples",
    tag: "4-day safari",
  },
  {
    title: "4 Day Safari",
    quote: "Saw the big 5 animals several times. Stayed in a tent 2 nights. Elephants 20 meters from the camp and the zebra that went through the camp.",
    author: "Roar H",
    meta: "Jul 2026 · Couples · Translated from Norwegian",
    tag: "4-day safari",
  },
  {
    title: "Amazing trek in Kilimanjaro",
    quote: "We did the Kilimanjaro trek in 6 days with Golden Dream Safari. It was incredible. The organization was perfect and the team was amazing.",
    author: "Melodie P",
    meta: "Jan 2026 · Couples",
    tag: "Kilimanjaro · 6 days",
  },
  {
    title: "Once in a lifetime experience",
    quote: "Victor customised a safari to accommodate our desired itinerary. We would definitely book a safari with Victor again.",
    author: "Jas P",
    meta: "Aug 2025 · Friends",
    tag: "Custom safari",
    image: "/images/figma/7cc7b9ad-b19f-4bc2-a285-2e61a1e26038.png",
  },
  {
    title: "Machame 6 days hike",
    quote: "We had a great time with the crew hiking the Kilimanjaro. Organisation was perfect! Easy and smooth.",
    author: "Trail04140368927",
    meta: "Jan 2026 · Couples",
    tag: "Kilimanjaro · Machame 6 days",
  },
  {
    title: "Camping",
    quote: "Hearing lions roaring through the night was a cool experience. Our chef cooked fabulous meals and our guide was knowledgeable.",
    author: "Philippa H",
    meta: "Rivervale, Australia · Sep 2025",
    tag: "4-day camping safari",
    image: "/images/figma/25a10812-7694-4597-80d5-8bb9d6df15c6.png",
  },
  {
    title: "Safari",
    quote: "A super safari, everything went brilliant. The chef made great food, the best food in Tanzania.",
    author: "Tone K",
    meta: "Jul 2026 · Couples · Translated from Norwegian",
    tag: "4-day safari",
  },
];

export const guestPhotos = [
  "/images/figma/601df417-5727-4ca4-b968-3b8ec152e400.png",
  "/images/figma/d3190758-6057-424a-883a-6c0f91fde2bc.png",
  "/images/figma/3fc2e9e0-1579-44dd-b285-444e57097507.png",
  "/images/figma/b7278669-6506-4fbc-9d26-e903bfc3a0db.png",
  "/images/figma/dc5abce8-bc43-4957-9765-83c7781d2c9f.png",
  "/images/figma/3d977940-9c5f-46af-80b3-49b0c299992d.png",
];

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
