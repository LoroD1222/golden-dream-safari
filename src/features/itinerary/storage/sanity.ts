import "server-only";

import {createClient} from "@sanity/client";
import type {Itinerary, ItineraryInput, ItineraryRepository} from "@/features/itinerary/model";

function configuredClient(write = false) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) throw new Error("Sanity storage is selected, but project ID and dataset are not configured.");
  const token = write
    ? process.env.SANITY_API_WRITE_TOKEN
    : process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (write && !token) throw new Error("Sanity write storage is selected, but SANITY_API_WRITE_TOKEN is not configured.");
  return createClient({projectId, dataset, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-16", useCdn: false, token});
}

const projection = `{_id,"id":_id,"slug":slug.current,title,summary,heroImage,durationDays,destinations,startingPrice,currency,status,days[]{"id":coalesce(id,_key),dayNumber,title,summary,habitat,meals,activities[]{"id":coalesce(id,_key),title,description,time,location},accommodation},inclusions,exclusions,"createdAt":_createdAt,"updatedAt":_updatedAt}`;

function toSanityInput(input: ItineraryInput) {
  return {
    ...input,
    slug: {_type: "slug", current: input.slug},
    days: input.days.map(day => ({
      ...day,
      _key: day.id,
      activities: day.activities.map(activity => ({...activity, _key: activity.id})),
    })),
  };
}

async function assertUniqueSlug(slug: string, excludedId?: string) {
  const duplicate = await configuredClient().fetch<string | null>(
    `*[_type == "goldenDreamItinerary" && slug.current == $slug && _id != $excludedId][0]._id`,
    {slug, excludedId: excludedId || ""},
  );
  if (duplicate) throw new Error("An itinerary with this slug already exists.");
}

async function getItinerary(idOrSlug: string) {
  return configuredClient().fetch<Itinerary | null>(`*[_type == "goldenDreamItinerary" && (_id == $value || slug.current == $value)][0] ${projection}`, {value: idOrSlug});
}

export const sanityItineraryRepository: ItineraryRepository = {
  async list() { return configuredClient().fetch<Itinerary[]>(`*[_type == "goldenDreamItinerary"] | order(_updatedAt desc) ${projection}`); },
  async get(idOrSlug) { return getItinerary(idOrSlug); },
  async create(input: ItineraryInput) {
    await assertUniqueSlug(input.slug);
    const document = await configuredClient(true).create({...toSanityInput(input), _type: "goldenDreamItinerary"});
    const result = await getItinerary(document._id);
    if (!result) throw new Error("Sanity created the itinerary but it could not be read back.");
    return result;
  },
  async update(id: string, input: ItineraryInput) {
    await assertUniqueSlug(input.slug, id);
    await configuredClient(true).patch(id).set(toSanityInput(input)).commit();
    return getItinerary(id);
  },
  async remove(id: string) {
    const existing = await getItinerary(id);
    if (!existing) return false;
    await configuredClient(true).delete(id);
    return true;
  },
};
