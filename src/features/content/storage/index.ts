import "server-only";

import {localAccommodationRepository, localReviewCategoryRepository, localReviewRepository, localSiteSettingsRepository} from "@/features/content/storage/local-json";
import {publicAccommodationRepository, publicReviewCategoryRepository, publicReviewRepository, publicSiteSettingsRepository} from "@/features/content/storage/public";

export function getReviewRepository() { return localReviewRepository; }
export function getReviewCategoryRepository() { return localReviewCategoryRepository; }
export function getAccommodationRepository() { return localAccommodationRepository; }
export function getSiteSettingsRepository() { return localSiteSettingsRepository; }
export function getPublicReviewRepository() { return publicReviewRepository; }
export function getPublicReviewCategoryRepository() { return publicReviewCategoryRepository; }
export function getPublicAccommodationRepository() { return publicAccommodationRepository; }
export function getPublicSiteSettingsRepository() { return publicSiteSettingsRepository; }
