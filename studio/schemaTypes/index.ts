import {goldenDreamAccommodation} from './documents/golden-dream-accommodation'
import {goldenDreamItinerary} from './documents/golden-dream-itinerary'
import {goldenDreamReview} from './documents/golden-dream-review'
import {goldenDreamReviewCategory} from './documents/golden-dream-review-category'
import {goldenDreamSettings} from './documents/golden-dream-settings'
import {goldenDreamImage} from './objects/golden-dream-image'
import {itineraryActivity} from './objects/itinerary-activity'
import {itineraryAccommodation} from './objects/itinerary-accommodation'
import {itineraryDay} from './objects/itinerary-day'
import {itineraryFaq} from './objects/itinerary-faq'
import {itineraryPriceTier} from './objects/itinerary-price-tier'
import {itineraryRouteStop} from './objects/itinerary-route-stop'
import {optionalExperience} from './objects/optional-experience'

export const schemaTypes = [
  goldenDreamSettings,
  goldenDreamItinerary,
  goldenDreamAccommodation,
  goldenDreamReview,
  goldenDreamReviewCategory,
  goldenDreamImage,
  itineraryDay,
  itineraryAccommodation,
  itineraryActivity,
  itineraryRouteStop,
  itineraryPriceTier,
  optionalExperience,
  itineraryFaq,
]
