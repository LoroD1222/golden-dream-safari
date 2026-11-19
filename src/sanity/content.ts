import "server-only";

import {defineQuery} from "groq";
import type {AccommodationRecord, Review, ReviewCategory, SiteSettings} from "@/features/content/model";
import type {Itinerary} from "@/features/itinerary/model";
import {sanityClient} from "@/sanity/client";

const imageProjection = `"src": image.asset->url, alt, caption`;

const reviewCategoriesQuery = defineQuery(/* groq */ `
  *[_type == "goldenDreamReviewCategory"] | order(order asc, _updatedAt desc) {
    "id": _id, name, "slug": slug.current, description, status, order,
    "createdAt": _createdAt, "updatedAt": _updatedAt
  }
`);

const reviewsQuery = defineQuery(/* groq */ `
  *[_type == "goldenDreamReview"] | order(order asc, _updatedAt desc) {
    "id": _id, title, quote, rating, author, authorLocation, meta, travelDate,
    publishedDate, travelerType, source, sourceUrl, sourceReviewId, originalLanguage,
    translated, "categoryIds": categories[]._ref, "tripSlugs": trips[]->slug.current,
    images[]{${imageProjection}}, reply, replyAuthor, replyDate, verified,
    featuredOnHomepage, featuredOnTripPages, status, order,
    "createdAt": _createdAt, "updatedAt": _updatedAt
  }
`);

const accommodationsQuery = defineQuery(/* groq */ `
  *[_type == "goldenDreamAccommodation"] | order(order asc, _updatedAt desc) {
    "id": _id, name, "slug": slug.current, category, location, description,
    images[]{${imageProjection}}, website, availabilityNote, status, order,
    "createdAt": _createdAt, "updatedAt": _updatedAt
  }
`);

const settingsQuery = defineQuery(/* groq */ `
  *[_id == "goldenDreamSettings"][0] {
    "id": _id,
    company {name, description, "logo": logo.image.asset->url, email, phone, whatsapp, website, location},
    tripDefaults,
    reviews {pageTitle, pageIntroduction, "heroImage": heroImage.image.asset->url, sourceName, sourceUrl, aggregateRating, aggregateCount},
    "updatedAt": _updatedAt
  }
`);

const itinerariesQuery = defineQuery(/* groq */ `
  *[_type == "goldenDreamItinerary"] | order(_updatedAt desc) {
    "id": _id, sourceId, sourcePath, sourceUrl, tripType, routeFamily,
    "slug": slug.current, title, summary,
    "heroImage": heroImage.image.asset->url,
    overviewTitle, overviewParagraphs, highlights,
    galleryImages[]{${imageProjection}},
    routeStops[]{_key, name, label, description, dayNumber, "coordinates": {"lat": coordinates.lat, "lng": coordinates.lng}},
    durationDays, destinations, startingPrice, currency, status,
    days[]{
      "id": _key, dayNumber, title, summary, narrative, habitat, driveTime, distance,
      activityLevel, meals,
      activities[]{"id": _key, title, description, time, location},
      "accommodationIds": accommodations[]._ref,
      accommodation {name, category, location, description, "image": image.asset->url},
      "image": image.image.asset->url, "imageAlt": image.alt, dropOffNote
    },
    inclusions, exclusions, onRequestItems, priceIntroduction,
    priceTiers[]{_key, name, price, suffix, description},
    optionalExperiences[]{_key, name, price, note}, travelStyle,
    practicalInformation, packingNotes, bookingConditions,
    faqs[]{_key, question, answer},
    "relatedTripSlugs": relatedTrips[]->slug.current,
    "createdAt": _createdAt, "updatedAt": _updatedAt
  }
`);

export async function listSanityReviewCategories() {
  return sanityClient.fetch<ReviewCategory[]>(reviewCategoriesQuery);
}

export async function listSanityReviews() {
  return sanityClient.fetch<Review[]>(reviewsQuery);
}

export async function listSanityAccommodations() {
  return sanityClient.fetch<AccommodationRecord[]>(accommodationsQuery);
}

export async function getSanitySettings() {
  return sanityClient.fetch<SiteSettings | null>(settingsQuery);
}

export async function listSanityItineraries() {
  const items = await sanityClient.fetch<Array<Omit<Itinerary, "startingPrice"> & {startingPrice?: number | null}>>(itinerariesQuery);
  return items.map(item => ({
    ...item,
    startingPrice: typeof item.startingPrice === "number" ? item.startingPrice : undefined,
  }));
}
