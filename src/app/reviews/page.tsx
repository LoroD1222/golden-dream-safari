import type {Metadata} from "next";
import Image from "next/image";
import {MarketingShell} from "@/components/marketing-shell";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {ReviewsGrid} from "@/components/reviews-grid";
import {siteOrigin, tripadvisorUrl} from "@/data/site";
import {StructuredData} from "@/components/structured-data";

export const metadata: Metadata = {title: "Guest reviews", description: "Read Tripadvisor reviews and see safari photos from Golden Dream guests.", alternates: {canonical: "/reviews"}, openGraph: {title: "What our guests say", url: "/reviews", images: [{url: "/images/figma/reviews-hero.png", alt: "Golden Dream safari guests"}]}};

export default function ReviewsPage() {
  return <MarketingShell><StructuredData data={{"@context":"https://schema.org","@type":"WebPage",name:"Golden Dream guest reviews",url:`${siteOrigin}/reviews`}}/><section className="reviews-intro section-shell"><Image src="/images/figma/reviews-hero.png" alt="Golden Dream guests and guide beside a safari vehicle" fill priority sizes="100vw"/><div className="reviews-intro__shade"/><div><p>Home&nbsp; / &nbsp;Reviews</p><h1>What our guests say</h1><p>All reviews below are from Tripadvisor, written by guests who travelled with us.</p></div><aside><div><Image src="/images/figma/tripadvisor-logo.png" alt="Tripadvisor" width={64} height={64}/><strong>4.9</strong></div><RatingStars/><p>Based on 157 reviews on Tripadvisor</p><a className="button button--dark" href={tripadvisorUrl}>Read all reviews on Tripadvisor<span className="button__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span></a></aside></section><ReviewsGrid/></MarketingShell>;
}
