import "server-only";

import type {Itinerary} from "@/features/itinerary/model";
import {localItineraryRepository} from "@/features/itinerary/storage/local-json";
import {listSanityItineraries} from "@/sanity/content";

async function list(): Promise<Itinerary[]> {
  try {
    const items = await listSanityItineraries();
    if (items.length > 0) return items;
  } catch (error) {
    console.error("Sanity trip read failed; using the local fallback.", error);
  }
  return localItineraryRepository.list();
}

export const publicItineraryRepository = {
  list,
  async get(idOrSlug: string) {
    return (await list()).find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
  },
};
