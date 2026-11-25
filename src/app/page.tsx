import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {FaqSection} from "@/components/faq-section";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";
import {IncludedExperience} from "@/components/included-experience";
import {contactDetails, siteOrigin} from "@/data/site";
import {getPublicReviewRepository, getPublicSiteSettingsRepository} from "@/features/content/storage";
import {formatItineraryDuration, formatItineraryPrice} from "@/features/itinerary/presentation";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tanzania is calling. Your dream adventure awaits.",
  description: "From the Serengeti to Kilimanjaro and Zanzibar, discover Tanzania with experienced local guides who turn every journey into unforgettable memories.",
  alternates: {canonical: "/"},
  openGraph: {title: "Golden Dream Safaris", description: "Tanzania is calling. Your dream adventure awaits.", url: "/", images: [{url: "/images/figma/home-hero.png", alt: "Wildlife beneath an acacia tree at sunset"}]},
};

const tripTiles = [
  {title: "Wildlife safaris", duration: "1–6 days", image: "/images/figma/935aa282-ad80-4b5a-9460-a66d0350eba1.png", copy: "Serengeti, Ngorongoro Crater, Tarangire, Lake Manyara and Arusha National Park.", className: "tile--safari", href: "/trips"},
  {title: "Kilimanjaro", duration: "5–9 days", image: "/images/figma/f164ae99-d3ca-4f5f-9431-180bbb4347ef.png", copy: "Climb Africa's highest mountain with our local crew.", className: "tile--kili", href: "/kilimanjaro"},
  {title: "Zanzibar", duration: "", image: "/images/figma/6ff58dc9-130f-465d-ad92-272fea6bd41c.png", copy: "", className: "tile--zanzibar", href: "/trips#treks-zanzibar"},
  {title: "Mount Meru", duration: "3–4 days", image: "/images/figma/6a496e48-5dd1-4dc8-8023-5c6bc0d6dfb4.png", copy: "Choose the 3-day or 4-day SWT Mount Meru climb.", className: "tile--meru", href: "/trips#mount-meru"},
  {title: "Day trips", duration: "", image: "/images/figma/11ffad81-69bd-4121-89c9-46d4c84274a3.png", copy: "", className: "tile--day", href: "/trips"},
];

export default async function HomePage() {
  const [reviewItems, settings, itineraryItems] = await Promise.all([getPublicReviewRepository().list(), getPublicSiteSettingsRepository().get(), getPublicItineraryRepository().list()]);
  const publishedReviews = reviewItems.filter(review => review.status === "published");
  const featuredReviews = publishedReviews.filter(review => review.featuredOnHomepage);
  const reviews = (featuredReviews.length ? featuredReviews : publishedReviews).slice(0, 3);
  const reviewSettings = settings.reviews;
  const publishedItineraries = itineraryItems.filter(item => item.status === "published");
  const pricedItineraries = publishedItineraries.filter(item => typeof item.startingPrice === "number");
  const popularSlugs = ["5-days-northern-tanzania-joining-safari", "7-days-northern-serengeti-river-crossing-safari", "7-days-lemosho-route", "7-days-machame-route"];
  const popularSafaris = popularSlugs.map(slug => pricedItineraries.find(item => item.slug === slug)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map(item => ({
    slug: item.slug,
    title: item.title.replace(/ Safari$/, ""),
    image: item.heroImage || "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png",
    duration: formatItineraryDuration(item),
    price: formatItineraryPrice(item),
    priceLabel: item.routeFamily === "Joining Safari" ? "Group-camping trip from" : item.tripType === "Wildlife safari" ? "2-traveller price from" : "Published starting price",
    parks: item.destinations.join(" · "),
    description: item.summary,
    tags: (item.highlights || []).slice(0, 2),
  }));
  const lowestDayTripPrice = publishedItineraries.filter(item => item.tripType === "Day trip").map(item => item.startingPrice).filter((price): price is number => typeof price === "number").sort((a, b) => a - b)[0];
  const priceSummary = ["Multi-day safaris from €200/pp/day", lowestDayTripPrice !== undefined ? `day trips from $${lowestDayTripPrice}/pp` : undefined].filter(Boolean).join("; ");
  const organization = {"@context": "https://schema.org", "@type": "TravelAgency", name: "Golden Dream Safaris", url: siteOrigin, email: contactDetails.email, telephone: contactDetails.phoneDisplay, address: {"@type": "PostalAddress", addressLocality: "Arusha", addressCountry: "TZ"}, areaServed: "Tanzania"};
  return <MarketingShell>
    <StructuredData data={[organization, {"@context": "https://schema.org", "@type": "WebSite", name: "Golden Dream Safaris", url: siteOrigin}]}/>
    <section className="home-top">
      <div className="home-hero">
        <Image src="/images/figma/home-hero.png" alt="Zebra and antelope beneath an acacia tree at sunset" fill loading="eager" quality={90} sizes="(max-width: 900px) 100vw, 1366px"/>
        <div className="home-hero__overlay"/>
        <div className="home-hero__copy"><SectionEyebrow>Locally owned in Tanzania</SectionEyebrow><h1><span>Tanzania is calling.</span><span>Your <em>dream adventure</em> awaits.</span></h1><p>From the wild plains of the Serengeti to the summit of Kilimanjaro and the beautiful beaches of Zanzibar, discover Tanzania with experienced local guides who turn every journey into unforgettable memories.</p><div className="hero-actions"><ButtonLink href="/contact#quote" variant="light">Get a Free Quote</ButtonLink><a href={settings.company.whatsapp}><FigmaIcon name="footer-whatsapp" width={20}/>WhatsApp Victor</a></div></div>
      </div>
      <div className="home-highlights"><a className="highlight highlight--dark" href={reviewSettings.sourceUrl}><Image src="/images/figma/tripadvisor-highlight.png" alt={reviewSettings.sourceName} width={64} height={64}/><div><RatingStars compact/><strong>{reviewSettings.aggregateRating} rated on {reviewSettings.sourceName}</strong><small>Based on {reviewSettings.aggregateCount} reviews</small></div></a><a className="highlight highlight--whatsapp" href={settings.company.whatsapp}><span className="highlight__whatsapp-icon"><FigmaIcon name="footer-whatsapp" width={26}/></span><div><small>Talk to Victor directly</small><strong>{settings.company.phone}</strong><span>Chat on WhatsApp →</span></div></a><Link className="highlight highlight--orange" href="/contact#quote"><div><strong>Fair, route-specific prices</strong><small>{priceSummary}. Open an itinerary for its confirmed starting rate and inclusions.</small></div><span><FigmaIcon name="arrow-highlight" width={28}/></span></Link></div>
    </section>

    <section className="home-trips section-shell section-pad"><div className="section-heading"><div><SectionEyebrow>Our trips</SectionEyebrow><h2>Safaris, mountain treks and Zanzibar</h2></div><p>Combine them as you like: a safari with a Kilimanjaro climb, or a few days on Zanzibar at the end.</p></div><div className="trip-bento">{tripTiles.map(tile => <Link className={`trip-tile ${tile.className}`} href={tile.href} key={tile.title}><Image src={tile.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw"/>{tile.duration && <span className="trip-tile__duration">{tile.duration}</span>}<span className="trip-tile__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span><div><h3>{tile.title}</h3>{tile.copy && <p>{tile.copy}</p>}</div></Link>)}<Link className="trip-mix" href="/contact#quote"><Image src="/images/figma/30025a96-02fc-4c4d-8e81-e3149f6ce292.png" alt="Zebra on the plains" fill sizes="60vw"/><div><SectionEyebrow>Mix & match</SectionEyebrow><h3>Can&apos;t find what you&apos;re looking for?</h3><p>We only list our most popular trips. Tell us the parks and how many days you have, and we&apos;ll send a proposal with no strings attached.</p><span className="button button--orange">Get a free quote<span className="button__arrow"><FigmaIcon name="arrow-header" width={20}/></span></span></div></Link></div></section>

    <section className="home-about"><div className="section-shell"><div className="home-about__statement"><SectionEyebrow>Why choose us</SectionEyebrow><h2>Why choose Golden Dream Safaris?</h2><p>Your journey, our passion. Memories that last forever.</p><div className="home-about__reasons">{["Your adventure, your way","Trusted by travellers from around the world","Book directly with locals, enjoy better value","Expert guides with a passion for Tanzania","Every detail taken care of, from start to finish"].map(reason => <article key={reason}><FigmaIcon name="check" width={32}/><h3>{reason}</h3></article>)}</div></div><div className="home-about__photos">{[["/images/figma/c831b544-2b93-4b2a-82f8-dbffbac229f0.png","Our guests"],["/images/figma/c709c3ab-d64a-4463-9049-a810508bb337.png","Ngorongoro Crater"],["/images/figma/6eaf5518-1f23-476a-9bd4-f7fc9b439d7e.png","Serengeti"]].map(([src,label]) => <figure key={label}><Image src={src} alt={label} fill quality={90} sizes="(max-width: 700px) calc(100vw - 56px), (max-width: 1100px) calc(50vw - 56px), 33vw"/><figcaption><FigmaIcon name="orange-dot" width={6}/>{label}</figcaption></figure>)}</div><div className="stat-grid">{[["60+","groups a year","Taken on safari every year.","stat-groups.svg"],["4.9","on Tripadvisor","From 157 guest reviews.","stat-rating.svg"],["5","parks we visit","Serengeti, Ngorongoro, Tarangire, Manyara and Arusha.","stat-parks.svg"],["2","mountains","Kilimanjaro and Mount Meru.","stat-mountains.svg"]].map(([number,label,copy,icon]) => <div className="stat-card" key={label}><div className="stat-card__number"><i><Image src={`/icons/figma/${icon}`} alt="" width={24} height={24}/></i><strong>{number}</strong></div><h3>{label}</h3><p>{copy}</p></div>)}</div></div></section>

    <section className="popular-safaris section-shell section-pad"><div className="center-heading"><SectionEyebrow>Popular journeys</SectionEyebrow><h2>Two safaris and two mountain routes</h2><p>Every card below opens a complete itinerary with its confirmed starting price and inclusions.</p></div><div className="popular-list popular-list--figma">{popularSafaris.map(trip => <article className="popular-card popular-card--figma" key={trip.title}><div className="popular-card__photo"><Image src={trip.image} alt={trip.title} fill quality={90} sizes="(max-width: 820px) calc(100vw - 52px), (max-width: 1240px) calc(50vw - 68px), 424px"/><span className="popular-card__duration"><FigmaIcon name="clock-card" width={16}/>{trip.duration}</span><div className="popular-card__price"><small>{trip.priceLabel}</small><strong>{trip.price}</strong></div></div><div className="popular-card__content"><h3>{trip.title}</h3><p className="popular-card__parks"><FigmaIcon name="pin-card" width={16}/>{trip.parks}</p><p>{trip.description}</p><div className="popular-card__tags">{trip.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="popular-card__actions"><Link href={`/trips/${trip.slug}`}>View itinerary →</Link><ButtonLink href={`/contact?trip=${trip.slug}#quote`}>Ask about this trip</ButtonLink></div></div></article>)}</div><ButtonLink href="/trips" variant="outline">See all itineraries</ButtonLink></section>

    <section className="booking-steps"><div className="section-shell booking-grid"><div><SectionEyebrow>How it works</SectionEyebrow><h2>How Victor plans your safari</h2><p>No call centre and no booking engine. You plan your trip with Victor, and nothing is booked until it feels right.</p><figure><Image src="/images/figma/4f52664e-2cff-4177-85a2-7772489dcddc.png" alt="Victor guiding guests on safari" fill sizes="50vw"/><figcaption><span><FigmaIcon name="booking-chat" width={20}/></span>Plan your trip with Victor himself</figcaption></figure></div><div className="booking-timeline">{[["01","Tell Victor what you're dreaming of","Your dates, who's travelling, the animals and experiences you care about, and your budget.","booking-chat","Free, no commitment"],["02","Get a plan built around you","Victor suggests the parks, timing and places to stay that fit your trip, and tells you honestly if your dates fall in a poor season.","booking-plan","Adjusted until it's right"],["03","Travel with his team","From pick-up at your accommodation in Arusha to your last game drive, Victor's guides, drivers and chefs look after you.","booking-pickup","Pick-up in Arusha included"]] .map(([number,title,copy,icon,note]) => <div className="booking-step" key={number}><span>{number}</span><div><h3><FigmaIcon name={icon as "booking-chat" | "booking-plan" | "booking-pickup"} width={22}/>{title}</h3><p>{copy}</p><small>{note}</small></div></div>)}<div className="booking-actions"><ButtonLink href="/contact#quote">Ask for a quote</ButtonLink><a href={settings.company.whatsapp}><FigmaIcon name="footer-whatsapp" width={20}/>WhatsApp Victor</a></div></div></div></section>

    <IncludedExperience/>

    <section className="host section-shell"><div className="host-photo"><Image src="/images/figma/victor-host.png" alt="Victor Costa guiding guests" fill quality={90} sizes="(max-width: 1000px) calc(100vw - 32px), 648px"/><span><i><FigmaIcon name="graduation-cap" width={24}/></i><strong>Mweka College graduate</strong><small>College of African Wildlife Management</small></span></div><div><SectionEyebrow>Meet Victor</SectionEyebrow><h2>Victor knows Tanzania. He&apos;ll help you see it properly.</h2><p>Victor trained as a wildlife tour guide at Mweka College, the College of African Wildlife Management. He guides in the Serengeti, Ngorongoro, Tarangire, Lake Manyara and Arusha National Park, and helps every guest choose where to stay, from campsites to safari lodges.</p><p>Today his team takes more than sixty groups on safari each year.</p><strong>“Victor customised a safari to accommodate our desired itinerary.” Jas P, on Tripadvisor</strong><ButtonLink href={settings.company.whatsapp} variant="dark">WhatsApp Victor</ButtonLink></div></section>

    <section className="home-reviews"><div className="section-shell"><div className="center-heading"><SectionEyebrow>Reviews</SectionEyebrow><h2>What our guests say</h2><p>Reviews from {reviewSettings.sourceName}, written by guests who travelled with us.</p></div><div className="rating-bar"><Image src="/images/figma/tripadvisor-logo.png" alt={reviewSettings.sourceName} width={64} height={64}/><strong>{reviewSettings.aggregateRating}</strong><span><RatingStars/><small>Based on {reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName}</small></span><a className="button button--dark" href={reviewSettings.sourceUrl}>Read all reviews on {reviewSettings.sourceName}<span className="button__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span></a></div><div className="home-review-grid">{reviews.map((review,index) => { const image = review.images[0]; return <article className={index === 0 ? "review-featured" : ""} key={review.id}>{image && <span className="home-review-photo"><Image src={image.src} alt={image.alt || "Guest safari photo"} fill quality={90} sizes={index === 0 ? "(max-width: 700px) calc(100vw - 72px), 52vw" : "(max-width: 700px) calc(100vw - 72px), 38vw"}/></span>}<RatingStars compact/><blockquote>“{review.quote}”</blockquote><a href={review.sourceUrl || reviewSettings.sourceUrl}>Read the full review on {review.source || reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a><div className="home-review-meta"><span><strong>{review.author}</strong><small>{review.meta}</small></span><span className="review-source"><Image src="/images/figma/tripadvisor-logo.png" alt="" width={24} height={24}/>Reviewed on {review.source || reviewSettings.sourceName}</span></div></article>; })}</div></div></section>
    <FaqSection/>
  </MarketingShell>;
}
