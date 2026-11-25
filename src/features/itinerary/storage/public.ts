import "server-only";

import type {Itinerary} from "@/features/itinerary/model";
import {localItineraryRepository} from "@/features/itinerary/storage/local-json";
import {listSanityItineraries} from "@/sanity/content";

async function list(): Promise<Itinerary[]> {
  const localItems = await localItineraryRepository.list();
  try {
    const sanityItems = await listSanityItineraries();
    if (sanityItems.length > 0) {
      const bySlug = new Map<string, Itinerary>(sanityItems.map(item => [item.slug, item]));
      localItems.forEach(item => bySlug.set(item.slug, item));
      return [...bySlug.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
  } catch (error) {
    console.error("Sanity trip read failed; using the local fallback.", error);
  }
  return localItems;
}

export const publicItineraryRepository = {
  list,
  async get(idOrSlug: string) {
    return (await list()).find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
  },
};
