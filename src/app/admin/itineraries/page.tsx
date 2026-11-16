import type {Metadata} from "next";
import {ItineraryAdmin} from "@/features/itinerary/admin/itinerary-admin";
import {getItineraryRepository} from "@/features/itinerary/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Itinerary editor", robots: {index: false, follow: false}};

export default async function ItineraryAdminPage() {
  const items = await getItineraryRepository().list();
  const storageMode = process.env.ITINERARY_STORAGE === "sanity" ? "Sanity" : "local JSON";
  const storageDescription = storageMode === "Sanity"
    ? "Changes persist in the configured Sanity dataset."
    : process.env.VERCEL
      ? "Local JSON is read-only on Vercel. Configure Sanity before making changes."
      : "Changes persist in data/itineraries.json.";
  return <main className="admin-page"><div className="admin-heading"><span>Golden Dream · Itinerary CMS</span><h1>Itinerary editor</h1><p>{storageDescription}</p></div><ItineraryAdmin initialItems={items} storageLabel={storageMode}/></main>;
}
