import "server-only";

import type {ItineraryRepository} from "@/features/itinerary/model";
import {localItineraryRepository} from "@/features/itinerary/storage/local-json";
import {publicItineraryRepository} from "@/features/itinerary/storage/public";

export function getItineraryRepository(): ItineraryRepository {
  return localItineraryRepository;
}

export function getPublicItineraryRepository() {
  return publicItineraryRepository;
}
