import type {Metadata} from "next";
import Image from "next/image";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {TripsDirectory} from "@/components/trips-directory";
import {SectionEyebrow} from "@/components/button-link";
import {siteOrigin} from "@/data/site";
import {formatItineraryDuration, formatItineraryPrice} from "@/features/itinerary/presentation";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";

export const metadata: Metadata = {
  title: "Safaris, treks and Zanzibar",
  description: "Browse Golden Dream wildlife safaris, day trips, Kilimanjaro and Mount Meru treks, and Zanzibar stays. Every trip can be customised.",
  alternates: {canonical: "/trips"},
  openGraph: {title: "Safaris, treks and Zanzibar", url: "/trips", images: [{url: "/images/figma/trips-hero-figma.png", alt: "Zebras crossing the Tanzanian plains"}]},
};

const categoryLabels: Record<string, string> = {
  "joining-safari": "Joining Safari",
  "great-migration-north": "Great Migration North",
  "ndutu-calving-safari": "Ndutu Calving Safari",
  "private-safari": "Private Safari",
  kilimanjaro: "Kilimanjaro",
  "mount-meru": "Mount Meru",
  zanzibar: "Zanzibar",
  "day-trips": "Day trips",
};

export default async function TripsPage({searchParams}: {searchParams: Promise<{category?: string}>}) {
  const query = await searchParams;
  const itineraries = (await getPublicItineraryRepository().list()).filter(item => item.status === "published");
  const kilimanjaroTrips = itineraries
    .filter(item => item.status === "published" && item.tripType === "Kilimanjaro trek")
    .map(item => ({slug: item.slug, title: item.title.replace(" Kilimanjaro Climb", "").replace(" Kilimanjaro Hut Climb", ""), category: "Trek" as const, locations: item.routeFamily || "Mount Kilimanjaro", duration: formatItineraryDuration(item), price: formatItineraryPrice(item, {prefix: "from", unavailable: "Price on request"}), image: item.heroImage || "/images/kilimanjaro-packages/8-days-lemosho-route-kilimanjaro-scenic-climb.jpg"}));
  const safariItineraryTrips = itineraries
    .filter(item => item.tripType === "Wildlife safari" || item.tripType === "Day trip")
    .map(item => ({slug: item.slug, title: item.tripType === "Day trip" ? item.title : item.title.replace(/ Safari$/, ""), category: item.tripType === "Day trip" ? "Day trip" as const : "Wildlife safari" as const, locations: item.destinations.join(" · "), duration: formatItineraryDuration(item), price: formatItineraryPrice(item, {prefix: "from", unavailable: "Price on request"}), image: item.heroImage || "/images/figma/1a5404c8-be64-44f5-a5b7-387aa4da50b3.png", routeFamily: item.routeFamily}));
  const mountMeruTrips = itineraries
    .filter(item => item.tripType === "Mount Meru trek")
    .map(item => ({slug: item.slug, title: item.title.replace(" in Tanzania", ""), category: "Trek" as const, locations: "Mount Meru · Arusha National Park", duration: formatItineraryDuration(item), price: formatItineraryPrice(item, {prefix: "from", unavailable: "Price on request"}), image: item.heroImage || "/images/figma/6a496e48-5dd1-4dc8-8023-5c6bc0d6dfb4.png", routeFamily: item.routeFamily}));
  const zanzibarTrips = itineraries
    .filter(item => item.tripType === "Zanzibar stay")
    .map(item => ({slug: item.slug, title: item.title, category: "Island" as const, locations: item.destinations.join(" · "), duration: formatItineraryDuration(item), price: formatItineraryPrice(item, {prefix: "from", unavailable: "Price on request"}), image: item.heroImage || "/images/figma/37543361-a611-4b4f-9167-4a63269c4632.png", routeFamily: item.routeFamily}));
  const initialCategory = query.category ? categoryLabels[query.category] || "All trips" : "All trips";
  return <MarketingShell><StructuredData data={{"@context": "https://schema.org", "@type": "CollectionPage", name: "Safaris, treks and Zanzibar", url: `${siteOrigin}/trips`}}/><section className="trips-intro section-shell"><Image src="/images/figma/trips-hero-figma.png" alt="Zebras crossing the Tanzanian plains" fill loading="eager" quality={90} sizes="100vw"/><div><p>Home&nbsp; / &nbsp;Our trips</p><SectionEyebrow>Our trips</SectionEyebrow><h1>Safaris, treks and Zanzibar</h1><p>All our safaris start and end at your accommodation in Arusha. Accommodation, meals, transport and drinking water are included. These are our most popular trips, and every one can be customised.</p><div><span>Route-specific prices</span><span>Join a group or go private</span><span>Park fees included</span></div></div></section><TripsDirectory key={initialCategory} initialCategory={initialCategory} kilimanjaroTrips={kilimanjaroTrips} mountMeruTrips={mountMeruTrips} zanzibarTrips={zanzibarTrips} safariItineraryTrips={safariItineraryTrips} itinerarySlugs={itineraries.map(item => item.slug)}/></MarketingShell>;
}
