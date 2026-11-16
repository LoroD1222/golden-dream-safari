import type {MetadataRoute} from "next";
import {siteOrigin} from "@/data/site";
import {getItineraryRepository} from "@/features/itinerary/storage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const core = ["", "/trips", "/reviews", "/about", "/contact", "/terms", "/privacy", "/cookies", "/disclaimer"];
  const publishedTrips = (await getItineraryRepository().list()).filter(trip => trip.status === "published");
  return [...core.map(path => ({url: `${siteOrigin}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7})), ...publishedTrips.map(trip => ({url: `${siteOrigin}/trips/${trip.slug}`, lastModified: new Date(trip.updatedAt), changeFrequency: "monthly" as const, priority: .8}))];
}
