import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {FaqSection} from "@/components/faq-section";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {siteOrigin} from "@/data/site";
import {formatItineraryDuration, formatItineraryPrice, itineraryPriceSuffix} from "@/features/itinerary/presentation";
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
  const isMountainTrek = itinerary.tripType === "Kilimanjaro trek" || itinerary.tripType === "Mount Meru trek";
  const isDayTrip = itinerary.tripType === "Day trip";
  const [allReviewItems, settings, accommodations, itineraryItems] = await Promise.all([getPublicReviewRepository().list(), getPublicSiteSettingsRepository().get(), getPublicAccommodationRepository().list(), itineraryRepository.list()]);
  const publishedReviews = allReviewItems.filter(review => review.status === "published");
  const relatedReviews = publishedReviews.filter(review => review.tripSlugs.includes(itinerary.slug) || review.featuredOnTripPages);
  const tripReviews = (relatedReviews.length ? relatedReviews : publishedReviews).slice(0, 3);
  const reviewSettings = settings.reviews;
  const tripDefaults = settings.tripDefaults;
  const downloadConfig = getItineraryDownloadConfig(itinerary);
  const publishedAccommodations = new Map(accommodations.filter(item => item.status === "published").map(item => [item.id, item]));
  const staysByDay = Object.fromEntries(itinerary.days.map(day => [day.dayNumber, (day.accommodationIds || []).map(id => publishedAccommodations.get(id)).filter((item): item is NonNullable<typeof item> => Boolean(item && item.category !== "Other")).map(item => ({tier: item.category as StayOption["tier"], property: item.name, location: item.location, images: item.images.map(image => ({src: image.src, alt: image.alt}))}))]));
  const relatedSlugs = itinerary.relatedTripSlugs || [];
  const relatedCandidates = itineraryItems.filter(item => item.status === "published" && item.slug !== itinerary.slug && item.tripType === itinerary.tripType);
  const relatedItineraries = [...relatedSlugs.map(slug => relatedCandidates.find(item => item.slug === slug)).filter((item): item is NonNullable<typeof item> => Boolean(item)), ...relatedCandidates.filter(item => !relatedSlugs.includes(item.slug))].slice(0, 3);
  const relatedTrips = relatedItineraries.map(item => ({slug: item.slug, title: item.title, image: item.heroImage || "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png", duration: formatItineraryDuration(item), price: formatItineraryPrice(item, {prefix: "from", unavailable: "Price on request"})}));
  const factItems: Array<["detail-duration" | "detail-start" | "detail-parks" | "detail-group" | "detail-best", string, string]> = isMountainTrek
    ? [["detail-duration", "Mountain days", `${itinerary.durationDays} days`], ["detail-start", "Starts & ends", "Moshi"], ["detail-parks", "Route", itinerary.routeFamily || itinerary.destinations[0] || "Mount Kilimanjaro"], ["detail-group", "Accommodation", itinerary.travelStyle?.includes("hut") ? "Mountain huts" : "Mountain camping"], ["detail-best", "Highest point", "Uhuru Peak · 5,895 m"]]
    : isDayTrip
      ? [["detail-duration", "Duration", "Full day"], ["detail-start", "Pickup", "Moshi or Arusha"], ["detail-parks", "Experience", itinerary.routeFamily || itinerary.destinations.join(" · ")], ["detail-group", "Travel style", "Private day trip"], ["detail-best", "Meals", "Lunch included"]]
      : [["detail-duration", "Duration", formatItineraryDuration(itinerary)], ["detail-start", "Starts & ends", tripDefaults.startEnd], ["detail-parks", "Parks", itinerary.destinations.map(value => value.replace(" National Park", "").replace(" Crater", "")).join(" · ")], ["detail-group", "Group", tripDefaults.groupStyle], ["detail-best", "Best for", tripDefaults.bestFor]];
  const touristTrip = {"@context": "https://schema.org", "@type": "TouristTrip", name: itinerary.title, description: itinerary.summary, touristType: isMountainTrek ? "Kilimanjaro climbers" : isDayTrip ? "Private day-trip travellers" : "Safari travellers", itinerary: itinerary.destinations.join(", "), provider: {"@type": "TravelAgency", name: "Golden Dream Safaris", url: siteOrigin}, offers: itinerary.startingPrice ? {"@type": "Offer", price: itinerary.startingPrice, priceCurrency: itinerary.currency, url: `${siteOrigin}/contact?trip=${itinerary.slug}#quote`} : undefined};
  const breadcrumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{"@type": "ListItem", position: 1, name: "Home", item: siteOrigin}, {"@type": "ListItem", position: 2, name: "Trips", item: `${siteOrigin}/trips`}, {"@type": "ListItem", position: 3, name: itinerary.title, item: `${siteOrigin}/trips/${itinerary.slug}`}]};
  return <MarketingShell><StructuredData data={[touristTrip, breadcrumb]}/>
    <section className="trip-detail-hero section-shell"><Image src={itinerary.heroImage || "/images/figma/9ee0aacc-baa1-43b0-90d6-54526abb5973.png"} alt={`${itinerary.title} ${isMountainTrek ? "mountain trek" : isDayTrip ? "day trip" : "safari"}`} fill priority quality={90} sizes="100vw"/><div className="trip-detail-hero__shade"/><div className="trip-detail-hero__copy"><p>Home&nbsp; / &nbsp;{isMountainTrek ? "Kilimanjaro" : isDayTrip ? "Day trips" : "Safaris"}&nbsp; / &nbsp;{isDayTrip ? "Full-day trip" : `${itinerary.durationDays}-day ${isMountainTrek ? "climb" : "safari"}`}</p><SectionEyebrow>{isDayTrip ? `Full day · ${itinerary.routeFamily || "Private experience"}` : `${itinerary.durationDays} days · ${isMountainTrek ? itinerary.routeFamily || "Mountain trek" : `${itinerary.durationDays - 1} ${itinerary.durationDays - 1 === 1 ? "night" : "nights"} · ${tripDefaults.groupStyle}`}`}</SectionEyebrow><h1>{itinerary.title}</h1><p>{itinerary.summary}{isMountainTrek || isDayTrip ? "" : ` ${tripDefaults.startEnd}.`}</p><div><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`} variant="light">Get a free quote</ButtonLink><a className="whatsapp-text-link whatsapp-text-link--light" href={settings.company.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div><aside><small>{typeof itinerary.startingPrice === "number" ? "All-inclusive from" : "Pricing"}</small><strong>{typeof itinerary.startingPrice === "number" ? new Intl.NumberFormat("en-US", {style: "currency", currency: itinerary.currency, maximumFractionDigits: 0}).format(itinerary.startingPrice) : "On request"}{typeof itinerary.startingPrice === "number" && <span>{itineraryPriceSuffix(itinerary)}</span>}</strong><p>{itinerary.priceIntroduction || tripDefaults.priceNote}</p><hr/><a href={reviewSettings.sourceUrl}><Image src="/images/figma/dd62734c-273a-42c3-a2f7-2bbb8ccf331d.png" alt={reviewSettings.sourceName} width={40} height={40}/><span><b>{reviewSettings.aggregateRating} <RatingStars compact/></b><small>{reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName}</small></span></a></aside></section>
    <section className="trip-facts section-shell">{factItems.map(([icon,label,value]) => <div key={label}><span className="trip-fact__icon"><FigmaIcon name={icon} width={22}/></span><span><small>{label}</small><strong>{value}</strong></span></div>)}</section>
    <nav className="trip-section-nav" aria-label="Trip sections"><div className="section-shell"><div><a href="#overview">Overview</a><a href="#itinerary">Itinerary</a><a href="#included">What&apos;s included</a><a href="#price">Price</a><a href="#trip-reviews">Reviews</a><a href="#faq">FAQ</a></div><div><ItineraryDownloadControl slug={itinerary.slug} config={downloadConfig} placement="desktop"/><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink></div></div></nav>
    <ItineraryDownloadControl slug={itinerary.slug} config={downloadConfig} placement="mobile"/>
    <section className="trip-overview section-shell section-pad" id="overview"><div><SectionEyebrow>Overview</SectionEyebrow><h2>{itinerary.overviewTitle || (isMountainTrek ? "About this climb" : isDayTrip ? "About this day trip" : "About this safari")}</h2>{(itinerary.overviewParagraphs?.length ? itinerary.overviewParagraphs : [itinerary.summary]).map(paragraph => <p key={paragraph}>{paragraph}</p>)}<h3>Highlights</h3><ul>{(itinerary.highlights?.length ? itinerary.highlights : fallbackHighlights).map(highlight => <li key={highlight}><FigmaIcon name="check" width={20}/>{highlight}</li>)}</ul></div><TripOverviewGallery images={itinerary.galleryImages}/></section>
    <InteractiveItinerary days={itinerary.days} routeStops={itinerary.routeStops} staysByDay={staysByDay} quoteHref={`/contact?trip=${itinerary.slug}#quote`} whatsappHref={settings.company.whatsapp} tripType={itinerary.tripType}/>
    <section className="trip-included section-shell section-pad" id="included"><SectionEyebrow>What&apos;s included</SectionEyebrow><h2>What&apos;s included in the price</h2><div>{[["Included",itinerary.inclusions],["On request",itinerary.onRequestItems || []],["Not included",itinerary.exclusions]].map(([title,items],index) => <article className={index === 0 ? "is-highlighted" : ""} key={title as string}><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}><FigmaIcon name={index === 0 ? "included-check" : index === 1 ? "on-request" : "excluded"} width={20}/>{item}</li>)}</ul></article>)}</div></section>
    <section className="trip-price" id="price">
      <div className="trip-price__card">
        <header className="trip-price__heading">
          <SectionEyebrow>Price</SectionEyebrow>
          <h2>{isMountainTrek ? "Your Kilimanjaro climb price" : isDayTrip ? "Your private day-trip price" : "Two choices set your price"}</h2>
          <p>{itinerary.priceIntroduction || "Park fees, accommodation, meals and transport are always included. Your exact price depends on group size, season and trip length."}</p>
        </header>

        {isDayTrip ? <>
          <div className="trip-price__choice-heading">
            <h3><span>1</span> Choose your pickup town</h3>
            <p>The published starting price changes with the transfer distance from your hotel.</p>
          </div>
          <div className="trip-price__travel-grid">
            {(itinerary.priceTiers || []).map(tier => <article key={tier.name}><div><h4>{tier.name}</h4><span>{tier.price}{tier.suffix}</span></div><p>{tier.description}</p></article>)}
          </div>
          <div className="trip-price__choice-heading">
            <h3><span>2</span> What the day includes</h3>
            <p>The confirmed plan covers the private transport, guiding, standard activity fees and lunch shown below.</p>
          </div>
          <div className="trip-price__tier-grid">
            <article><h4>Private transport</h4><strong>01</strong><p>Pickup and return from the confirmed Arusha or Moshi hotel.</p></article>
            <article><h4>Local guide</h4><strong>02</strong><p>A professional guide or driver-guide throughout the day.</p></article>
            <article><h4>Fees & lunch</h4><strong>03</strong><p>Standard entry or activity fees, drinking water and lunch.</p></article>
          </div>
        </> : <>
          <div className="trip-price__choice-heading">
            <h3><span>1</span> {isMountainTrek ? "Choose your departure" : "How you travel"}</h3>
            <p>{isMountainTrek ? "Join a scheduled climb or request a private departure for your group." : "Share the vehicle with other travellers, or have it to yourselves."}</p>
          </div>
          <div className="trip-price__travel-grid">
            <article>
              <div><h4>Join a group</h4><span>Sociable</span></div>
              <p>{isMountainTrek ? "Climb on a scheduled departure with other prepared trekkers and the full mountain crew." : "Share a safari vehicle with other guests. A sociable way to travel, and it costs less per person."}</p>
            </article>
            <article>
              <div><h4>Private</h4><span>Your own pace</span></div>
              <p>{isMountainTrek ? "Choose your dates and climb with a dedicated guide team arranged around your group." : "Your own vehicle and guide. Set your own pace and change plans along the way."}</p>
            </article>
          </div>
          <div className="trip-price__choice-heading">
            <h3><span>2</span> {isMountainTrek ? "What the package covers" : "Where you stay"}</h3>
            <p>{isMountainTrek ? "The route price includes the mountain services and safety support shown below." : "Same parks and itinerary at every level. Only the camps and lodges change."}</p>
          </div>
          <div className="trip-price__tier-grid">
            {isMountainTrek ? <>
              <article><h4>Mountain team</h4><strong>01</strong><p>Licensed guides, cook and porters throughout the climb.</p></article>
              <article><h4>Park & camp</h4><strong>02</strong><p>Park, rescue and accommodation fees plus mountain meals.</p></article>
              <article><h4>Safety support</h4><strong>03</strong><p>Daily health checks, emergency oxygen and first aid equipment.</p></article>
            </> : (itinerary.priceTiers || []).map(tier => <article key={tier.name}><h4>{tier.name}</h4><strong>{tier.price}{tier.suffix}</strong><p>{tier.description}</p></article>)}
          </div>
        </>}

        <p className="trip-price__included-note"><FigmaIcon name="included-check" width={20}/>{isMountainTrek ? "Every climb includes the published mountain services, meals, accommodation, park fees and safety support." : isDayTrip ? "Every day trip includes private transport, guiding, standard activity fees, lunch and drinking water." : "Every price includes park entry fees, accommodation, all meals, transport and drinking water."}</p>
        <div className="trip-price__actions"><ButtonLink href={`/contact?trip=${itinerary.slug}#quote`}>Get a free quote</ButtonLink><a className="whatsapp-text-link" href={settings.company.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div>
      </div>
    </section>
    <section className="trip-review-section section-shell section-pad" id="trip-reviews"><div className="trip-review-heading"><div><SectionEyebrow>Reviews</SectionEyebrow><h2>Reviews of this {isMountainTrek ? "climb" : isDayTrip ? "day trip" : "safari"}</h2></div><a href={reviewSettings.sourceUrl}><Image src="/images/figma/bbdcd6c3-7767-4a19-bcb1-af6e3ee94048.png" alt={reviewSettings.sourceName} width={34} height={34}/>{reviewSettings.aggregateRating} · {reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a></div><div>{tripReviews.map((review,index) => { const image = review.images[0]; const fallback = ["/images/figma/29bf44cf-4b39-44a1-8b50-e49c110d03bb.png","/images/figma/1ff7fca4-e1c6-405f-81fe-b30fc6376ed7.png","/images/figma/d484cf5c-038e-4090-b80e-af90971936c2.png"][index]; return <article key={review.id}><Image src={image?.src || fallback} alt={image?.alt || "Guest trip photo"} width={390} height={215}/><RatingStars compact/><blockquote>“{review.quote}”</blockquote><strong>{review.author}</strong><small>{review.meta}</small><a href={review.sourceUrl || reviewSettings.sourceUrl}>Find the review on {review.source || reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a></article>; })}</div></section>
    <section className="related-trips section-shell section-pad"><SectionEyebrow>You might also like</SectionEyebrow><h2>{isMountainTrek ? "More Kilimanjaro routes" : isDayTrip ? "More day trips" : "More safaris from Arusha"}</h2><div>{relatedTrips.map(trip => <article key={trip.slug}><div className="related-trip__image"><Image src={trip.image} alt="" fill sizes="(max-width: 800px) 50vw, 33vw"/></div><small>{trip.duration}</small><h3>{trip.title}</h3><p>{trip.price}</p><Link href={itineraryItems.some(item => item.slug === trip.slug && item.status === "published") ? `/trips/${trip.slug}` : `/contact?trip=${trip.slug}#quote`}>View trip <FigmaIcon name="arrow-card" width={18}/></Link></article>)}</div></section>
    <FaqSection items={itinerary.faqs}/>
  </MarketingShell>;
}
