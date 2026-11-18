import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {FaqSection} from "@/components/faq-section";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {siteOrigin, wildlifeTrips as allWildlifeTrips} from "@/data/site";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";
import {getPublicAccommodationRepository, getPublicReviewRepository, getPublicSiteSettingsRepository} from "@/features/content/storage";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {InteractiveItinerary} from "@/components/interactive-itinerary";
import {TripOverviewGallery} from "@/components/trip-overview-gallery";
import {WhatsAppIcon} from "@/components/whatsapp-icon";
import {ItineraryDownloadControl} from "@/components/itinerary-download";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import type {StayOption} from "@/features/itinerary/trip-supplements";

export const dynamic = "force-dynamic";

const fallbackHighlights = [
  "Baobab trees and elephant herds in Tarangire",
  "Game drives across the Serengeti plains",
  "Picnic lunch at the hippo pool on the crater floor",
  "A chance to see the Big Five",
  "Hotel pick-up and drop-off in Arusha",
];

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const item = await getPublicItineraryRepository().get((await params).slug);
  if (!item || item.status !== "published") return {title: "Trip not found", robots: {index: false, follow: false}};
  return {title: item.title, description: item.summary, alternates: {canonical: `/trips/${item.slug}`}, openGraph: {title: item.title, description: item.summary, url: `/trips/${item.slug}`, images: item.heroImage ? [{url: item.heroImage, alt: item.title}] : []}};
}

export default async function TripDetailPage({params}: {params: Promise<{slug: string}>}) {
  const itineraryRepository = getPublicItineraryRepository();
  const itinerary = await itineraryRepository.get((await params).slug);
  if (!itinerary || itinerary.status !== "published") notFound();
  const [allReviewItems, settings, accommodations, itineraryItems] = await Promise.all([getPublicReviewRepository().list(), getPublicSiteSettingsRepository().get(), getPublicAccommodationRepository().list(), itineraryRepository.list()]);
  const publishedReviews = allReviewItems.filter(review => review.status === "published");
  const relatedReviews = publishedReviews.filter(review => review.tripSlugs.includes(itinerary.slug) || review.featuredOnTripPages);
  const tripReviews = (relatedReviews.length ? relatedReviews : publishedReviews).slice(0, 3);
  const reviewSettings = settings.reviews;
  const tripDefaults = settings.tripDefaults;
  const downloadConfig = getItineraryDownloadConfig(itinerary);
  const publishedAccommodations = new Map(accommodations.filter(item => item.status === "published").map(item => [item.id, item]));
  const staysByDay = Object.fromEntries(itinerary.days.map(day => [day.dayNumber, (day.accommodationIds || []).map(id => publishedAccommodations.get(id)).filter((item): item is NonNullable<typeof item> => Boolean(item && item.category !== "Other")).map(item => ({tier: item.category as StayOption["tier"], property: item.name, location: item.location, images: item.images.map(image => ({src: image.src, alt: image.alt}))}))]));
  const wildlifeTrips = allWildlifeTrips.filter(trip => trip.slug !== itinerary.slug);
  const relatedSlugs = itinerary.relatedTripSlugs?.length ? itinerary.relatedTripSlugs : ["serengeti-ngorongoro-crater", "great-migration", "big-four-parks"];
  const relatedTrips = relatedSlugs.map(slug => {
    const cms = itineraryItems.find(item => item.slug === slug && item.status === "published");
    if (cms) return {slug: cms.slug, title: cms.title, image: cms.heroImage || "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png", duration: `${cms.durationDays} days · ${Math.max(0, cms.durationDays - 1)} nights`, price: cms.startingPrice ? `from $${cms.startingPrice}/pp/day` : "On request"};
    return wildlifeTrips.find(trip => trip.slug === slug);
  }).filter((trip): trip is NonNullable<typeof trip> => Boolean(trip));
  const touristTrip = {"@context": "https://schema.org", "@type": "TouristTrip", name: itinerary.title, description: itinerary.summary, touristType: "Safari travellers", itinerary: itinerary.destinations.join(", "), provider: {"@type": "TravelAgency", name: "Golden Dream Safaris", url: siteOrigin}, offers: itinerary.startingPrice ? {"@type": "Offer", price: itinerary.startingPrice, priceCurrency: itinerary.currency, url: `${siteOrigin}/contact?trip=${itinerary.slug}#quote`} : undefined};
  const breadcrumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{"@type": "ListItem", position: 1, name: "Home", item: siteOrigin}, {"@type": "ListItem", position: 2, name: "Trips", item: `${siteOrigin}/trips`}, {"@type": "ListItem", position: 3, name: itinerary.title, item: `${siteOrigin}/trips/${itinerary.slug}`}]};
  return <MarketingShell><StructuredData data={[touristTrip, breadcrumb]}/>
    <section className="trip-detail-hero section-shell"><Image src={itinerary.heroImage || "/images/figma/9ee0aacc-baa1-43b0-90d6-54526abb5973.png"} alt={`${itinerary.title} safari`} fill priority quality={90} sizes="100vw"/><div className="trip-detail-hero__shade"/><div className="trip-detail-hero__copy"><p>Home&nbsp; / &nbsp;Safaris&nbsp; / &nbsp;{itinerary.durationDays}-day safari</p><SectionEyebrow>{itinerary.durationDays} days · {itinerary.durationDays - 1} nights · {tripDefaults.groupStyle}</SectionEyebrow><h1>{itinerary.title}</h1><p>{itinerary.summary} {tripDefaults.startEnd}.</p><div><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`} variant="light">Get a free quote</ButtonLink><a className="whatsapp-text-link whatsapp-text-link--light" href={settings.company.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div><aside><small>{itinerary.startingPrice ? "All-inclusive from" : "Pricing"}</small><strong>{itinerary.startingPrice ? `$${itinerary.startingPrice}` : "On request"}{itinerary.startingPrice && <span>/pp/day</span>}</strong><p>{tripDefaults.priceNote}</p><hr/><a href={reviewSettings.sourceUrl}><Image src="/images/figma/dd62734c-273a-42c3-a2f7-2bbb8ccf331d.png" alt={reviewSettings.sourceName} width={40} height={40}/><span><b>{reviewSettings.aggregateRating} <RatingStars compact/></b><small>{reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName}</small></span></a></aside></section>
    <section className="trip-facts section-shell">{[["detail-duration","Duration",`${itinerary.durationDays} days · ${itinerary.durationDays-1} nights`],["detail-start","Starts & ends",tripDefaults.startEnd],["detail-parks","Parks",itinerary.destinations.map(value => value.replace(" National Park","").replace(" Crater","")).join(" · ")],["detail-group","Group",tripDefaults.groupStyle],["detail-best","Best for",tripDefaults.bestFor]].map(([icon,label,value]) => <div key={label}><span className="trip-fact__icon"><FigmaIcon name={icon as "detail-duration" | "detail-start" | "detail-parks" | "detail-group" | "detail-best"} width={22}/></span><span><small>{label}</small><strong>{value}</strong></span></div>)}</section>
    <nav className="trip-section-nav" aria-label="Trip sections"><div className="section-shell"><div><a href="#overview">Overview</a><a href="#itinerary">Itinerary</a><a href="#included">What&apos;s included</a><a href="#price">Price</a><a href="#trip-reviews">Reviews</a><a href="#faq">FAQ</a></div><div><ItineraryDownloadControl slug={itinerary.slug} config={downloadConfig} placement="desktop"/><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink></div></div></nav>
    <ItineraryDownloadControl slug={itinerary.slug} config={downloadConfig} placement="mobile"/>
    <section className="trip-overview section-shell section-pad" id="overview"><div><SectionEyebrow>Overview</SectionEyebrow><h2>{itinerary.overviewTitle || "About this safari"}</h2>{(itinerary.overviewParagraphs?.length ? itinerary.overviewParagraphs : [itinerary.summary]).map(paragraph => <p key={paragraph}>{paragraph}</p>)}<h3>Highlights</h3><ul>{(itinerary.highlights?.length ? itinerary.highlights : fallbackHighlights).map(highlight => <li key={highlight}><FigmaIcon name="check" width={20}/>{highlight}</li>)}</ul></div><TripOverviewGallery images={itinerary.galleryImages}/></section>
    <InteractiveItinerary days={itinerary.days} routeStops={itinerary.routeStops} staysByDay={staysByDay} quoteHref={`/contact?trip=${itinerary.slug}#quote`} whatsappHref={settings.company.whatsapp}/>
    <section className="trip-included section-shell section-pad" id="included"><SectionEyebrow>What&apos;s included</SectionEyebrow><h2>What&apos;s included in the price</h2><div>{[["Included",itinerary.inclusions],["On request",itinerary.onRequestItems || []],["Not included",itinerary.exclusions]].map(([title,items],index) => <article className={index === 0 ? "is-highlighted" : ""} key={title as string}><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}><FigmaIcon name={index === 0 ? "included-check" : index === 1 ? "on-request" : "excluded"} width={20}/>{item}</li>)}</ul></article>)}</div></section>
    <section className="trip-price" id="price">
      <div className="trip-price__card">
        <header className="trip-price__heading">
          <SectionEyebrow>Price</SectionEyebrow>
          <h2>Two choices set your price</h2>
          <p>Park fees, accommodation, meals and transport are always included. Your exact price depends on these two choices, plus group size, season and trip length.</p>
        </header>

        <div className="trip-price__choice-heading">
          <h3><span>1</span> How you travel</h3>
          <p>Share the vehicle with other travellers, or have it to yourselves.</p>
        </div>
        <div className="trip-price__travel-grid">
          <article>
            <div><h4>Join a group</h4><span>Sociable</span></div>
            <p>Share a safari vehicle with other guests. A sociable way to travel, and it costs less per person.</p>
          </article>
          <article>
            <div><h4>Private</h4><span>Your own pace</span></div>
            <p>Your own vehicle and guide. Set your own pace and change plans along the way.</p>
          </article>
        </div>

        <div className="trip-price__choice-heading">
          <h3><span>2</span> Where you stay</h3>
          <p>Same parks and itinerary at every level. Only the camps and lodges change.</p>
        </div>
        <div className="trip-price__tier-grid">
          <article><h4>Camping</h4><strong>$</strong><p>Tented campsites inside or near the parks, with your own chef.</p></article>
          <article><h4>Mid-range lodge</h4><strong>$$</strong><p>Comfortable lodges and permanent tented camps.</p></article>
          <article><h4>Luxury lodge</h4><strong>$$$</strong><p>The best-located safari lodges, with extra comfort.</p></article>
        </div>

        <p className="trip-price__included-note"><FigmaIcon name="included-check" width={20}/>Every price includes park entry fees, accommodation, all meals, transport and drinking water.</p>
        <div className="trip-price__actions"><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink><a className="whatsapp-text-link" href={settings.company.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div>
      </div>
    </section>
    <section className="trip-review-section section-shell section-pad" id="trip-reviews"><div className="trip-review-heading"><div><SectionEyebrow>Reviews</SectionEyebrow><h2>Reviews of this safari</h2></div><a href={reviewSettings.sourceUrl}><Image src="/images/figma/bbdcd6c3-7767-4a19-bcb1-af6e3ee94048.png" alt={reviewSettings.sourceName} width={34} height={34}/>{reviewSettings.aggregateRating} · {reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a></div><div>{tripReviews.map((review,index) => { const image = review.images[0]; const fallback = ["/images/figma/29bf44cf-4b39-44a1-8b50-e49c110d03bb.png","/images/figma/1ff7fca4-e1c6-405f-81fe-b30fc6376ed7.png","/images/figma/d484cf5c-038e-4090-b80e-af90971936c2.png"][index]; return <article key={review.id}><Image src={image?.src || fallback} alt={image?.alt || "Safari guest photo"} width={390} height={215}/><RatingStars compact/><blockquote>“{review.quote}”</blockquote><strong>{review.author}</strong><small>{review.meta}</small><a href={review.sourceUrl || reviewSettings.sourceUrl}>Find the review on {review.source || reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a></article>; })}</div></section>
    <section className="related-trips section-shell section-pad"><SectionEyebrow>You might also like</SectionEyebrow><h2>More safaris from Arusha</h2><div>{relatedTrips.map(trip => <article key={trip.slug}><div className="related-trip__image"><Image src={trip.image} alt="" fill sizes="(max-width: 800px) 50vw, 33vw"/></div><small>{trip.duration}</small><h3>{trip.title}</h3><p>{trip.price}</p><Link href={itineraryItems.some(item => item.slug === trip.slug && item.status === "published") ? `/trips/${trip.slug}` : `/contact?trip=${trip.slug}#quote`}>View trip <FigmaIcon name="arrow-card" width={18}/></Link></article>)}</div></section>
    <FaqSection items={itinerary.faqs}/>
  </MarketingShell>;
}
