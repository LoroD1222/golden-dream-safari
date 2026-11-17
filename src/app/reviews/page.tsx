import type {Metadata} from "next";
import Image from "next/image";
import {MarketingShell} from "@/components/marketing-shell";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {ReviewsGrid} from "@/components/reviews-grid";
import {siteOrigin} from "@/data/site";
import {StructuredData} from "@/components/structured-data";
import {SectionEyebrow} from "@/components/button-link";
import {ImageWithFallback} from "@/components/image-with-fallback";
import {getPublicReviewCategoryRepository, getPublicReviewRepository, getPublicSiteSettingsRepository} from "@/features/content/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {title: "Guest reviews", description: "Read Tripadvisor reviews and see safari photos from Golden Dream guests.", alternates: {canonical: "/reviews"}, openGraph: {title: "What our guests say", url: "/reviews", images: [{url: "/images/figma/reviews-hero-figma.png", alt: "Golden Dream safari guests"}]}};

export default async function ReviewsPage() {
  const [reviews, categories, settings] = await Promise.all([getPublicReviewRepository().list(), getPublicReviewCategoryRepository().list(), getPublicSiteSettingsRepository().get()]);
  const publishedReviews = reviews.filter(review => review.status === "published");
  const publishedCategories = categories.filter(category => category.status === "published");
  const reviewSettings = settings.reviews;
  return <MarketingShell><StructuredData data={{"@context":"https://schema.org","@type":"WebPage",name:"Golden Dream guest reviews",url:`${siteOrigin}/reviews`}}/><section className="reviews-intro section-shell"><ImageWithFallback src={reviewSettings.heroImage} fallbackSrc="/images/figma/reviews-hero-figma.png" alt="Golden Dream guests and guide beside a safari vehicle" fill priority quality={90} sizes="100vw"/><div className="reviews-intro__shade"/><div><p>Home&nbsp; / &nbsp;Reviews</p><SectionEyebrow>Reviews</SectionEyebrow><h1>{reviewSettings.pageTitle}</h1><p>{reviewSettings.pageIntroduction}</p></div><aside><div><Image src="/images/figma/tripadvisor-logo.png" alt={reviewSettings.sourceName} width={64} height={64}/><strong>{reviewSettings.aggregateRating}</strong></div><RatingStars/><p>Based on {reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName}</p><a className="button button--dark" href={reviewSettings.sourceUrl}>Read all reviews on {reviewSettings.sourceName}<span className="button__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span></a></aside></section><ReviewsGrid reviews={publishedReviews} categories={publishedCategories} sourceUrl={reviewSettings.sourceUrl} sourceName={reviewSettings.sourceName}/></MarketingShell>;
}
