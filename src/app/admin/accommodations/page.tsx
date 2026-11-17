import type {Metadata} from "next";
import {AccommodationAdmin} from "@/features/content/admin/accommodation-admin";
import {getAccommodationRepository} from "@/features/content/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Accommodations · Golden Dream CMS", robots: {index: false, follow: false}};

export default async function AccommodationsAdminPage() {
  const items = await getAccommodationRepository().list();
  return <section className="cms-page">
    <header className="cms-page-header"><div><span>Website Content</span><h1>Accommodations</h1><p>Keep campsite, lodge and luxury property content in one reusable library.</p></div><small>{items.length} propert{items.length === 1 ? "y" : "ies"}</small></header>
    <AccommodationAdmin initialItems={items}/>
  </section>;
}
