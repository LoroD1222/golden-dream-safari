import type {Metadata} from "next";
import {ReviewAdmin} from "@/features/content/admin/review-admin";
import {getReviewCategoryRepository, getReviewRepository} from "@/features/content/storage";
import {getItineraryRepository} from "@/features/itinerary/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Reviews · Golden Dream CMS", robots: {index: false, follow: false}};

export default async function ReviewsAdminPage() {
  const [reviews, categories, itineraries] = await Promise.all([
    getReviewRepository().list(),
    getReviewCategoryRepository().list(),
    getItineraryRepository().list(),
  ]);

  return <section className="cms-page">
    <header className="cms-page-header"><div><span>Website Content</span><h1>Reviews</h1><p>Add, publish and place guest reviews across the website.</p></div><small>{reviews.length} review{reviews.length === 1 ? "" : "s"}</small></header>
    <ReviewAdmin initialReviews={reviews} categories={categories} trips={itineraries.map(({slug, title}) => ({slug, title}))}/>
  </section>;
}
