export const contactDetails = {
  phoneDisplay: "+255 763 571 646",
  phoneHref: "tel:+255763571646",
  email: "info@golden-dream-safaris.com",
  whatsapp: "https://wa.me/255763571646",
  location: "Arusha, Tanzania",
};

export const socialLinks = {
  tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g297913-d15771176-Reviews-Golden_Dream_Safaris-Arusha_Arusha_Region.html",
  instagram: "https://www.instagram.com/goldendreamsafaris/",
  facebook: "https://www.facebook.com/pg/GoldendreamsafarisTZ/reviews/?ref=page_internal",
  whatsapp: contactDetails.whatsapp,
} as const;

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
    price: "Price on request",
    image: "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png",
  },
  {
    slug: "tarangire-serengeti-ngorongoro",
    title: "Tarangire, Serengeti & Ngorongoro",
    category: "Wildlife safari",
    locations: "Tarangire · Serengeti · Ngorongoro",
    duration: "4 days · 3 nights",
    price: "Price on request",
    image: "/images/figma/1a5404c8-be64-44f5-a5b7-387aa4da50b3.png",
  },
  {
    slug: "lake-manyara-serengeti-ngorongoro",
    title: "Lake Manyara, Serengeti & Ngorongoro",
    category: "Wildlife safari",
    locations: "Manyara · Serengeti · Ngorongoro",
    duration: "4 days · 3 nights",
    price: "Price on request",
    image: "/images/figma/279a986b-f6f3-4660-96c5-716505530be6.png",
  },
  {
    slug: "big-four-parks",
    title: "The Big Four Parks",
    category: "Wildlife safari",
    locations: "Manyara · Tarangire · Serengeti · Ngorongoro",
    duration: "5 days · 4 nights",
    price: "Price on request",
    image: "/images/figma/fcb78e89-1d4d-4e01-9c6c-fdaec6e228d9.png",
  },
  {
    slug: "lake-manyara-tarangire-ngorongoro",
    title: "Lake Manyara, Tarangire & Ngorongoro",
    category: "Wildlife safari",
    locations: "Manyara · Tarangire · Ngorongoro",
    duration: "3 days · 2 nights",
    price: "Price on request",
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
    price: "Price on request",
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
    answer: "Each published itinerary shows its confirmed starting price when one is available. Routes without a published rate are marked as price on request. Your exact quote depends on group size, private or joining, accommodation, parks, season and trip length.",
  },
  {question: "What's included?", answer: "Accommodation, meals on safari, transport, drinking water and park activities listed in your proposal are included."},
  {question: "Can I change the itinerary?", answer: "Yes. Every trip can be changed until it fits your dates, interests and preferred comfort level."},
  {question: "Private tour or join a group?", answer: "Both are possible. Tell us your preference and we will explain the options for your dates."},
  {question: "When is the best time to go?", answer: "Tanzania is a year-round destination. The best time depends on the parks, wildlife and activities you want to experience."},
  {question: "Can you arrange airport transfers and a hotel in Arusha?", answer: "Yes. Airport transfers and an Arusha hotel before or after your trip can be added on request."},
  {question: "I have dietary requirements. Is that OK?", answer: "Yes. Tell us about dietary requirements when you request your quote so the team can plan ahead."},
  {question: "How do I book?", answer: "Send your dates and group details. We will prepare an itinerary and price, then explain the next steps."},
];

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
