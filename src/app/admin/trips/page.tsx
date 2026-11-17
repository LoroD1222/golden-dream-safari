import type {Metadata} from "next";
import {ItineraryAdmin} from "@/features/itinerary/admin/itinerary-admin";
import {getItineraryRepository} from "@/features/itinerary/storage";
import {getAccommodationRepository} from "@/features/content/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Trips · Golden Dream CMS", robots: {index: false, follow: false}};

export default async function TripsAdminPage() {
  const [items, accommodations] = await Promise.all([getItineraryRepository().list(), getAccommodationRepository().list()]);
  const storageDescription = process.env.VERCEL ? "Editing needs persistent storage on the production host." : "Changes persist in data/itineraries.json.";
  return <section className="cms-page"><header className="cms-page-header"><div><span>Website Content</span><h1>Trips</h1><p>Manage every itinerary, its public page, daily schedule, accommodation relations and downloadable PDF.</p></div><small>{storageDescription}</small></header><ItineraryAdmin initialItems={items} initialAccommodations={accommodations} storageLabel="local JSON"/></section>;
}
