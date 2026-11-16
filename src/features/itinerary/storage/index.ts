import "server-only";

import type {ItineraryRepository} from "@/features/itinerary/model";
import {localItineraryRepository} from "@/features/itinerary/storage/local-json";

export function getItineraryRepository(): ItineraryRepository {
  return localItineraryRepository;
}
