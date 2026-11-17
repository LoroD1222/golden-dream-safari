import "server-only";

import {localAccommodationRepository, localReviewCategoryRepository, localReviewRepository, localSiteSettingsRepository} from "@/features/content/storage/local-json";

export function getReviewRepository() { return localReviewRepository; }
export function getReviewCategoryRepository() { return localReviewCategoryRepository; }
export function getAccommodationRepository() { return localAccommodationRepository; }
export function getSiteSettingsRepository() { return localSiteSettingsRepository; }
