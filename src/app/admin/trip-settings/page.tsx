import type {Metadata} from "next";
import {SiteSettingsAdmin} from "@/features/content/admin/site-settings-admin";
import {getSiteSettingsRepository} from "@/features/content/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Trip settings · Golden Dream CMS", robots: {index: false, follow: false}};

export default async function TripSettingsAdminPage() {
  const settings = await getSiteSettingsRepository().get();
  return <section className="cms-page">
    <header className="cms-page-header"><div><span>Website Content</span><h1>Trip Settings</h1><p>Manage shared company details, trip defaults and reviews-page content.</p></div><small>Last updated {new Date(settings.updatedAt).toLocaleDateString("en-GB")}</small></header>
    <SiteSettingsAdmin initialSettings={settings}/>
  </section>;
}
