import "server-only";

import {listSanityAccommodations, listSanityReviewCategories, listSanityReviews, getSanitySettings} from "@/sanity/content";
import {localAccommodationRepository, localReviewCategoryRepository, localReviewRepository, localSiteSettingsRepository} from "@/features/content/storage/local-json";

async function sanityFirst<T>(loadSanity: () => Promise<T[]>, loadLocal: () => Promise<T[]>) {
  try {
    const items = await loadSanity();
    if (items.length > 0) return items;
  } catch (error) {
    console.error("Sanity content read failed; using the local fallback.", error);
  }
  return loadLocal();
}

export const publicReviewRepository = {
  list: () => sanityFirst(listSanityReviews, () => localReviewRepository.list()),
};

export const publicReviewCategoryRepository = {
  list: () => sanityFirst(listSanityReviewCategories, () => localReviewCategoryRepository.list()),
};

export const publicAccommodationRepository = {
  list: () => sanityFirst(listSanityAccommodations, () => localAccommodationRepository.list()),
};

export const publicSiteSettingsRepository = {
  async get() {
    try {
      const settings = await getSanitySettings();
      if (settings) return settings;
    } catch (error) {
      console.error("Sanity settings read failed; using the local fallback.", error);
    }
    return localSiteSettingsRepository.get();
  },
};
