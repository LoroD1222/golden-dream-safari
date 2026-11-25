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
  routeFamily?: string;
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
    question: "When is the best time to visit Tanzania?",
    answer: "Tanzania is a year-round destination. June to October is excellent for wildlife viewing, while January to March is ideal for the wildebeest calving season in Ndutu. For Kilimanjaro, January to March and June to October are popular climbing periods.",
  },
  {question: "How much does a Tanzania safari cost?", answer: "Safari prices depend on the duration, travel season, accommodation and number of travellers. We offer affordable group joining safaris, private mid-range safaris and luxury experiences to suit different budgets."},
  {question: "What is the difference between a private and group joining safari?", answer: "A private safari gives you exclusive use of your vehicle and guide, with greater flexibility. A group joining safari allows you to share the experience and cost with other travellers."},
  {question: "Where and when can I see the Great Migration?", answer: "The Great Migration moves throughout the Serengeti ecosystem. From the calving season in Ndutu to the Mara River crossings in Northern Serengeti, we recommend the best locations based on your travel dates and seasonal wildlife movements."},
  {question: "Can beginners climb Mount Kilimanjaro?", answer: "Yes. Many of our climbers have no previous mountaineering experience. With proper physical preparation, sufficient acclimatization and experienced mountain guides, Kilimanjaro is achievable for many first-time trekkers."},
  {question: "Which Kilimanjaro route is best?", answer: "We particularly recommend the 8-day Lemosho Route for its spectacular scenery and gradual acclimatization. The Machame, Marangu, Rongai and Northern Circuit routes also offer different advantages depending on your preferences and available time."},
  {question: "How do you ensure safety during Kilimanjaro climbs?", answer: "Our mountain safety procedures include trained guides, daily health monitoring, pulse oximeters, emergency oxygen and evacuation arrangements. Your wellbeing always takes priority over reaching the summit."},
  {question: "Can I combine Kilimanjaro, a wildlife safari and Zanzibar?", answer: "Absolutely. We specialize in tailor-made Tanzania holidays combining mountain expeditions, wildlife safaris and Zanzibar beach escapes in one seamlessly organized journey."},
  {question: "Do you organize trips for solo travellers?", answer: "Yes. We welcome solo travellers on both private and group joining safaris and Kilimanjaro expeditions."},
  {question: "Can you accommodate special dietary requirements?", answer: "Yes. Vegetarian, vegan, gluten-free and other dietary requirements can be accommodated with advance notice."},
  {question: "How do I book with Golden Dream Safaris?", answer: "Simply share your travel dates, interests and budget with us. We will prepare a personalized itinerary and quotation, explain the booking process and guide you through every step."},
  {question: "Is Golden Dream Safaris a local Tanzanian tour operator?", answer: "Yes. Golden Dream Safaris is a locally owned tour operator based in Arusha, Tanzania, founded by professionally trained wildlife guide Victor Costa."},
];

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
