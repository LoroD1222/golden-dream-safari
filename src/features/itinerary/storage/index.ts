import "server-only";

import type {ItineraryRepository} from "@/features/itinerary/model";
import {localItineraryRepository} from "@/features/itinerary/storage/local-json";
import {sanityItineraryRepository} from "@/features/itinerary/storage/sanity";

export function getItineraryRepository(): ItineraryRepository {
  return process.env.ITINERARY_STORAGE === "sanity" ? sanityItineraryRepository : localItineraryRepository;
}
