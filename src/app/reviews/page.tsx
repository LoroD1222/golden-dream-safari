import type {Metadata} from "next";
import Image from "next/image";
import {MarketingShell} from "@/components/marketing-shell";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {ReviewsGrid} from "@/components/reviews-grid";
import {guestPhotos, siteOrigin, tripadvisorUrl} from "@/data/site";
import {StructuredData} from "@/components/structured-data";

export const metadata: Metadata = {title: "Guest reviews", description: "Read Tripadvisor reviews and see safari photos from Golden Dream guests.", alternates: {canonical: "/reviews"}, openGraph: {title: "What our guests say", url: "/reviews", images: [{url: "/images/figma/a50c0c41-c009-4bff-9e82-7756c28db6f2.png", alt: "Golden Dream safari guests"}]}};

export default function ReviewsPage() {
  return <MarketingShell><StructuredData data={{"@context":"https://schema.org","@type":"WebPage",name:"Golden Dream guest reviews",url:`${siteOrigin}/reviews`}}/><section className="reviews-intro section-shell"><Image src="/images/figma/a50c0c41-c009-4bff-9e82-7756c28db6f2.png" alt="Golden Dream guests and guide beside a safari vehicle" fill priority sizes="100vw"/><div className="reviews-intro__shade"/><div><p>Home&nbsp; / &nbsp;Reviews</p><span className="section-pill"><FigmaIcon name="orange-dot" width={6}/>Reviews</span><h1>What our guests say</h1><p>All reviews below are from Tripadvisor, written by guests who travelled with us.</p></div><aside><div><Image src="/images/figma/fe5f5cc6-3f32-4905-a8c8-8ab4010cba12.png" alt="Tripadvisor" width={64} height={64}/><strong>4.9</strong></div><RatingStars/><p>Based on 157 reviews on Tripadvisor</p><a className="button button--dark" href={tripadvisorUrl}>Read all reviews on Tripadvisor<span className="button__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span></a></aside></section><section className="guest-photos section-shell"><h2>Photos from our guests</h2><div>{guestPhotos.map((photo,index) => <span className="guest-photo" key={photo}><Image src={photo} alt={`Golden Dream guest photo ${index+1}`} fill sizes="(max-width: 700px) 50vw, 17vw"/></span>)}</div></section><ReviewsGrid/></MarketingShell>;
}
