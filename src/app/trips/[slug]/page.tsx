import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ButtonLink, SectionPill} from "@/components/button-link";
import {FaqSection} from "@/components/faq-section";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {contactDetails, reviews, siteOrigin, tripadvisorUrl, wildlifeTrips as allWildlifeTrips} from "@/data/site";
import {getItineraryRepository} from "@/features/itinerary/storage";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {InteractiveItinerary} from "@/components/interactive-itinerary";
import {TripOverviewGallery} from "@/components/trip-overview-gallery";
import {WhatsAppIcon} from "@/components/whatsapp-icon";

export const dynamic = "force-dynamic";

const detailHighlights = [
  "Baobab trees and elephant herds in Tarangire",
  "Game drives across the Serengeti plains",
  "Picnic lunch at the hippo pool on the crater floor",
  "A chance to see the Big Five",
  "Hotel pick-up and drop-off in Arusha",
];

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const item = await getItineraryRepository().get((await params).slug);
  if (!item || item.status !== "published") return {title: "Trip not found", robots: {index: false, follow: false}};
  return {title: item.title, description: item.summary, alternates: {canonical: `/trips/${item.slug}`}, openGraph: {title: item.title, description: item.summary, url: `/trips/${item.slug}`, images: item.heroImage ? [{url: item.heroImage, alt: item.title}] : []}};
}

export default async function TripDetailPage({params}: {params: Promise<{slug: string}>}) {
  const itinerary = await getItineraryRepository().get((await params).slug);
  if (!itinerary || itinerary.status !== "published") notFound();
  const wildlifeTrips = allWildlifeTrips.filter(trip => trip.slug !== itinerary.slug);
  const relatedTrips = ["serengeti-ngorongoro-crater", "great-migration", "big-four-parks"].map(slug => wildlifeTrips.find(trip => trip.slug === slug)).filter(Boolean);
  const touristTrip = {"@context": "https://schema.org", "@type": "TouristTrip", name: itinerary.title, description: itinerary.summary, touristType: "Safari travellers", itinerary: itinerary.destinations.join(", "), provider: {"@type": "TravelAgency", name: "Golden Dream Safaris", url: siteOrigin}, offers: itinerary.startingPrice ? {"@type": "Offer", price: itinerary.startingPrice, priceCurrency: itinerary.currency, url: `${siteOrigin}/contact?trip=${itinerary.slug}#quote`} : undefined};
  const breadcrumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{"@type": "ListItem", position: 1, name: "Home", item: siteOrigin}, {"@type": "ListItem", position: 2, name: "Trips", item: `${siteOrigin}/trips`}, {"@type": "ListItem", position: 3, name: itinerary.title, item: `${siteOrigin}/trips/${itinerary.slug}`}]};
  return <MarketingShell><StructuredData data={[touristTrip, breadcrumb]}/>
    <section className="trip-detail-hero section-shell"><Image src={itinerary.heroImage || "/images/figma/9ee0aacc-baa1-43b0-90d6-54526abb5973.png"} alt={`${itinerary.title} safari`} fill priority quality={90} sizes="100vw"/><div className="trip-detail-hero__shade"/><div className="trip-detail-hero__copy"><p>Home&nbsp; / &nbsp;Safaris&nbsp; / &nbsp;{itinerary.durationDays}-day safari</p><SectionPill>{itinerary.durationDays} days · {itinerary.durationDays - 1} nights · Join a group or go private</SectionPill><h1>{itinerary.title}</h1><p>{itinerary.summary} Four days, starting and ending at your accommodation in Arusha.</p><div><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`} variant="light">Get a free quote</ButtonLink><a className="whatsapp-text-link whatsapp-text-link--light" href={contactDetails.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div><aside><small>{itinerary.startingPrice ? "All-inclusive from" : "Pricing"}</small><strong>{itinerary.startingPrice ? `$${itinerary.startingPrice}` : "On request"}{itinerary.startingPrice && <span>/pp/day</span>}</strong><p>Group camping. Private lodge safaris up to $550/pp/day.</p><hr/><a href={tripadvisorUrl}><Image src="/images/figma/dd62734c-273a-42c3-a2f7-2bbb8ccf331d.png" alt="Tripadvisor" width={40} height={40}/><span><b>4.9 <RatingStars compact/></b><small>157 reviews on Tripadvisor</small></span></a></aside></section>
    <section className="trip-facts section-shell">{[["detail-duration","Duration",`${itinerary.durationDays} days · ${itinerary.durationDays-1} nights`],["detail-start","Starts & ends","Your hotel in Arusha"],["detail-parks","Parks",itinerary.destinations.map(value => value.replace(" National Park","").replace(" Crater","")).join(" · ")],["detail-group","Group","Join a group or private"],["detail-best","Best for","A first safari"]].map(([icon,label,value]) => <div key={label}><span className="trip-fact__icon"><FigmaIcon name={icon as "detail-duration" | "detail-start" | "detail-parks" | "detail-group" | "detail-best"} width={22}/></span><span><small>{label}</small><strong>{value}</strong></span></div>)}</section>
    <nav className="trip-section-nav" aria-label="Trip sections"><div className="section-shell"><div><a href="#overview">Overview</a><a href="#itinerary">Itinerary</a><a href="#included">What&apos;s included</a><a href="#price">Price</a><a href="#trip-reviews">Reviews</a><a href="#faq">FAQ</a></div><div><a className="download-button" href={`/api/trips/${itinerary.slug}/pdf`} download><FigmaIcon name="download" width={18}/>Download itinerary (PDF)</a><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink></div></div></nav>
    <section className="trip-overview section-shell section-pad" id="overview"><div><SectionPill>Overview</SectionPill><h2>About this safari</h2><p>Africa&apos;s famous baobab trees combined with Tanzania&apos;s best-known parks. Day 1 is in Tarangire, days 2 and 3 in the Serengeti, and day 4 in the Ngorongoro Crater.</p><p>You can join a group to keep the cost down, or book a private tour. The itinerary can be changed: add a park, an extra night or a few days on Zanzibar.</p><h3>Highlights</h3><ul>{detailHighlights.map(highlight => <li key={highlight}><FigmaIcon name="check" width={20}/>{highlight}</li>)}</ul></div><TripOverviewGallery/></section>
    <InteractiveItinerary slug={itinerary.slug} days={itinerary.days} quoteHref={`/contact?trip=${itinerary.slug}#quote`} whatsappHref={contactDetails.whatsapp}/>
    <section className="trip-included section-shell section-pad" id="included"><SectionPill>What&apos;s included</SectionPill><h2>What&apos;s included in the price</h2><div>{[["Included",itinerary.inclusions],["On request",["Airport transfers","A hotel in Arusha the night before or after","Special diets: tell us when you book","Extra days in Tarangire, Lake Manyara or Arusha NP"]],["Not included",itinerary.exclusions]].map(([title,items],index) => <article className={index === 0 ? "is-highlighted" : ""} key={title as string}><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}><FigmaIcon name={index === 0 ? "included-check" : index === 1 ? "on-request" : "excluded"} width={20}/>{item}</li>)}</ul></article>)}</div></section>
    <section className="trip-price" id="price"><div className="section-shell"><SectionPill>Price</SectionPill><h2>Prices</h2><p>Prices range from $200 per person per day (camping, joining a group) to $550 per person per day (private safari with lodge accommodation). Your price depends on the number of people, the parks, the accommodation, private or group, the season and the length of the trip.</p><div>{[["Group camping","$200","/pp/day","Join a group and stay at campsites. A chef travels with you."],["Mid-range lodge","On request","","Lodges and tented camps, private or with a small group."],["Private luxury","up to $550","/pp/day","Your own vehicle and guide, staying in safari lodges."]].map(([title,price,suffix,copy]) => <article key={title}><h3>{title}</h3><strong>{price}{suffix && <small>{suffix}</small>}</strong><p>{copy}</p></article>)}</div><div className="trip-price__actions"><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink><a className="whatsapp-text-link" href={contactDetails.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div></section>
    <section className="trip-review-section section-shell section-pad" id="trip-reviews"><div className="trip-review-heading"><div><SectionPill>Reviews</SectionPill><h2>Reviews of this safari</h2></div><a href={tripadvisorUrl}><Image src="/images/figma/bbdcd6c3-7767-4a19-bcb1-af6e3ee94048.png" alt="Tripadvisor" width={34} height={34}/>4.9 · 157 reviews on Tripadvisor <FigmaIcon name="arrow-card" width={18}/></a></div><div>{reviews.slice(0,3).map((review,index) => <article key={review.author}><Image src={["/images/figma/29bf44cf-4b39-44a1-8b50-e49c110d03bb.png","/images/figma/1ff7fca4-e1c6-405f-81fe-b30fc6376ed7.png","/images/figma/d484cf5c-038e-4090-b80e-af90971936c2.png"][index]} alt="Safari guest photo" width={390} height={215}/><RatingStars compact/><blockquote>“{review.quote}”</blockquote><strong>{review.author}</strong><small>{review.meta}</small><a href={tripadvisorUrl}>Find the review on Tripadvisor <FigmaIcon name="arrow-card" width={18}/></a></article>)}</div></section>
    <section className="related-trips section-shell section-pad"><SectionPill>You might also like</SectionPill><h2>More safaris from Arusha</h2><div>{relatedTrips.map(trip => trip && <article key={trip.slug}><div className="related-trip__image"><Image src={trip.image} alt="" fill sizes="(max-width: 800px) 50vw, 33vw"/></div><small>{trip.duration}</small><h3>{trip.title}</h3><p>{trip.price}</p><Link href={trip.slug === itinerary.slug ? `/trips/${trip.slug}` : `/contact?trip=${trip.slug}#quote`}>View trip <FigmaIcon name="arrow-card" width={18}/></Link></article>)}</div></section>
    <FaqSection/>
  </MarketingShell>;
}
