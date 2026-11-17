import type {Metadata} from "next";
import Image from "next/image";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {TripsDirectory} from "@/components/trips-directory";
import {SectionEyebrow} from "@/components/button-link";
import {siteOrigin} from "@/data/site";

export const metadata: Metadata = {
  title: "Safaris, treks and Zanzibar",
  description: "Browse Golden Dream wildlife safaris, day trips, Kilimanjaro and Mount Meru treks, and Zanzibar stays. Every trip can be customised.",
  alternates: {canonical: "/trips"},
  openGraph: {title: "Safaris, treks and Zanzibar", url: "/trips", images: [{url: "/images/figma/trips-hero-figma.png", alt: "Zebras crossing the Tanzanian plains"}]},
};

export default function TripsPage() {
  return <MarketingShell><StructuredData data={{"@context": "https://schema.org", "@type": "CollectionPage", name: "Safaris, treks and Zanzibar", url: `${siteOrigin}/trips`}}/><section className="trips-intro section-shell"><Image src="/images/figma/trips-hero-figma.png" alt="Zebras crossing the Tanzanian plains" fill priority quality={90} sizes="100vw"/><div><p>Home&nbsp; / &nbsp;Our trips</p><SectionEyebrow>Our trips</SectionEyebrow><h1>Safaris, treks and Zanzibar</h1><p>All our safaris start and end at your accommodation in Arusha. Accommodation, meals, transport and drinking water are included. These are our most popular trips, and every one can be customised.</p><div><span>$200–$550 per person per day</span><span>Join a group or go private</span><span>Park fees included</span></div></div></section><TripsDirectory/></MarketingShell>;
}
