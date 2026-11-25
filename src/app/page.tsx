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
  title: "Tanzania Safaris & Kilimanjaro Climbs | Golden Dream Safaris",
  description: "Discover Tanzania with Golden Dream Safaris. Expertly guided wildlife safaris, Great Migration tours, Kilimanjaro climbs and tailor-made Zanzibar holidays.",
  alternates: {canonical: "/"},
  openGraph: {title: "Tanzania Safaris & Kilimanjaro Climbs | Golden Dream Safaris", description: "Discover Tanzania with Golden Dream Safaris. Expertly guided wildlife safaris, Great Migration tours, Kilimanjaro climbs and tailor-made Zanzibar holidays.", url: "/", images: [{url: "/images/figma/home-hero.png", alt: "Wildlife beneath an acacia tree at sunset"}]},
};

const tripTiles = [
  {title: "Tanzania Wildlife Safaris", duration: "", image: "/images/figma/935aa282-ad80-4b5a-9460-a66d0350eba1.png", copy: "Witness the Great Migration, encounter the Big Five and explore Africa’s most celebrated wilderness with expert local guides.", className: "tile--safari", href: "/trips?category=wildlife-safaris"},
  {title: "Kilimanjaro Climbing", duration: "", image: "/images/figma/f164ae99-d3ca-4f5f-9431-180bbb4347ef.png", copy: "Experience Africa’s highest mountain with experienced mountain guides, carefully planned routes and dedicated support at every step.", className: "tile--kili", href: "/kilimanjaro"},
  {title: "Zanzibar Beach Holidays", duration: "", image: "/images/figma/6ff58dc9-130f-465d-ad92-272fea6bd41c.png", copy: "Escape to white-sand beaches, turquoise waters and the rich cultural heritage of Tanzania’s enchanting spice island.", className: "tile--zanzibar", href: "/trips?category=zanzibar"},
  {title: "Mount Meru Trekking", duration: "", image: "/images/figma/6a496e48-5dd1-4dc8-8023-5c6bc0d6dfb4.png", copy: "Discover Tanzania’s quieter mountain adventure, combining wildlife encounters, spectacular scenery and rewarding summit experiences.", className: "tile--meru", href: "/trips?category=mount-meru"},
  {title: "Day Trips & Cultural Experiences", duration: "", image: "/images/figma/11ffad81-69bd-4121-89c9-46d4c84274a3.png", copy: "Discover Tanzania beyond the safari trails, from spectacular waterfalls and natural hot springs to authentic cultural encounters.", className: "tile--day", href: "/trips?category=day-trips"},
];

const trustReasons = [
  ["Locally Owned. Professionally Guided.", "Founded by a Mweka-trained wildlife guide with firsthand expertise in Tanzania safaris and mountain expeditions."],
  ["Safety Without Compromise", "First-aid-trained guides, quality equipment, daily Kilimanjaro health checks, emergency oxygen and evacuation procedures."],
  ["Exceptional Value. Transparent Pricing.", "Fair prices, carefully selected accommodation and quality experiences without hidden costs."],
  ["Personalized Adventures. Dedicated Support.", "Tailor-made journeys with personal attention from your first enquiry to your departure."],
  ["Professional Safari & Mountain Guides", "Experienced local specialists who know Tanzania firsthand."],
];

const popularDefinitions = [
  {slug: "5-days-northern-tanzania-joining-safari", title: "5-Day Tanzania Group Joining Safari", description: "Share the adventure, not just the cost. Explore Tanzania’s iconic wildlife destinations, meet like-minded travellers and enjoy an expertly guided safari with camping or lodge accommodation."},
  {slug: "8-days-lemosho-route", title: "8-Day Kilimanjaro Lemosho Route", description: "Climb Africa’s highest mountain through spectacular landscapes, with experienced mountain guides and a carefully planned acclimatization schedule."},
  {slug: "4-days-northern-tanzania-joining-safari", title: "4-Day Classic Tanzania Safari", description: "Discover Tarangire’s elephant herds, the legendary Serengeti and the wildlife-rich Ngorongoro Crater. An extraordinary introduction to Tanzania’s wilderness."},
  {slug: "7-days-northern-serengeti-river-crossing-safari", title: "Great Migration Safaris", description: "Follow the spectacular wildebeest migration, from the newborn calves of Ndutu to the dramatic Mara River crossings in Northern Serengeti. Expertly planned around your travel dates."},
];

export default async function HomePage() {
  const [reviewItems, settings, itineraryItems] = await Promise.all([getPublicReviewRepository().list(), getPublicSiteSettingsRepository().get(), getPublicItineraryRepository().list()]);
  const publishedReviews = reviewItems.filter(review => review.status === "published");
  const featuredReviews = publishedReviews.filter(review => review.featuredOnHomepage);
  const reviews = (featuredReviews.length ? featuredReviews : publishedReviews).slice(0, 4);
  const reviewSettings = settings.reviews;
  const publishedItineraries = itineraryItems.filter(item => item.status === "published");
  const pricedItineraries = publishedItineraries.filter(item => typeof item.startingPrice === "number");
  const popularSafaris = popularDefinitions.map(definition => {
    const item = pricedItineraries.find(itinerary => itinerary.slug === definition.slug);
    return item ? {...item, definition} : undefined;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item)).map(item => ({
    slug: item.slug,
    title: item.definition.title,
    image: item.heroImage || "/images/figma/0c4e4185-aa73-4852-8df9-372bce86de7b.png",
    duration: formatItineraryDuration(item),
    price: formatItineraryPrice(item),
    priceLabel: item.routeFamily === "Joining Safari" ? "Group-camping trip from" : item.tripType === "Wildlife safari" ? "2-traveller price from" : "Published starting price",
    parks: item.destinations.join(" · "),
    description: item.definition.description,
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
        <div className="home-hero__copy">
          <SectionEyebrow>Your trusted local Tanzania tour operator</SectionEyebrow>
          <h1><span>Tanzania Safaris &amp;</span><span>Kilimanjaro Adventures,</span><span><em>Personally Crafted.</em></span></h1>
          <p className="home-hero__lead">From the legendary Serengeti plains to the summit of Mount Kilimanjaro and the pristine beaches of Zanzibar, discover Tanzania with experienced local guides who call it home.</p>
          <p className="home-hero__support">Private and group adventures, exceptional value and genuine Tanzanian hospitality. Your dream. Our expertise. Your Tanzania.</p>
          <div className="hero-actions"><ButtonLink href="/contact#quote" variant="light">Plan Your Tanzania Adventure</ButtonLink><ButtonLink href="/trips" variant="outline">Explore Our Tours</ButtonLink></div>
        </div>
      </div>
      <div className="home-highlights"><a className="highlight highlight--dark" href={reviewSettings.sourceUrl}><Image src="/images/figma/tripadvisor-highlight.png" alt={reviewSettings.sourceName} width={64} height={64}/><div><RatingStars compact/><strong>{reviewSettings.aggregateRating} rated on {reviewSettings.sourceName}</strong><small>Based on {reviewSettings.aggregateCount} reviews</small></div></a><a className="highlight highlight--whatsapp" href={settings.company.whatsapp}><span className="highlight__whatsapp-icon"><FigmaIcon name="footer-whatsapp" width={26}/></span><div><small>Talk to Victor directly</small><strong>{settings.company.phone}</strong><span>Chat on WhatsApp →</span></div></a><Link className="highlight highlight--orange" href="/contact#quote"><div><strong>Fair, route-specific prices</strong><small>{priceSummary}. Open an itinerary for its confirmed starting rate and inclusions.</small></div><span><FigmaIcon name="arrow-highlight" width={28}/></span></Link></div>
    </section>

    <section className="home-trips section-shell section-pad"><div className="section-heading"><div><SectionEyebrow>Explore Tanzania your way</SectionEyebrow><h2>Extraordinary Places. Remarkable Experiences.</h2></div><p>From the wildlife-rich plains of the Serengeti to the snow-capped summit of Kilimanjaro and the turquoise shores of Zanzibar, discover a country of extraordinary contrasts. Choose from expertly guided safaris, mountain expeditions and tailor-made holidays, each designed around your sense of adventure.</p></div><div className="trip-bento">{tripTiles.map(tile => <Link className={`trip-tile ${tile.className}`} href={tile.href} key={tile.title}><Image src={tile.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw"/>{tile.duration && <span className="trip-tile__duration">{tile.duration}</span>}<span className="trip-tile__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span><div><h3>{tile.title}</h3>{tile.copy && <p>{tile.copy}</p>}</div></Link>)}<Link className="trip-mix" href="/contact#quote"><Image src="/images/figma/30025a96-02fc-4c4d-8e81-e3149f6ce292.png" alt="Zebra on the plains" fill sizes="60vw"/><div><SectionEyebrow>Tailor-made Tanzania holidays</SectionEyebrow><h3>Create Your Adventure</h3><p>Combine wildlife, mountains, culture and beach escapes in a personalized journey designed around your interests, budget and travel dates.</p><span className="button button--orange">Create Your Adventure<span className="button__arrow"><FigmaIcon name="arrow-header" width={20}/></span></span></div></Link></div></section>

    <section className="home-about"><div className="section-shell"><div className="home-about__statement"><SectionEyebrow>Why choose us</SectionEyebrow><h2>Your Tanzania Adventure, In Expert Hands</h2><p>From wildlife safaris to Kilimanjaro expeditions, we combine local expertise, exceptional service and genuine Tanzanian hospitality.</p><div className="home-about__reasons">{trustReasons.map(([title,copy]) => <article key={title}><FigmaIcon name="check" width={32}/><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div><div className="home-about__photos">{[["/images/figma/c831b544-2b93-4b2a-82f8-dbffbac229f0.png","Our guests"],["/images/figma/c709c3ab-d64a-4463-9049-a810508bb337.png","Ngorongoro Crater"],["/images/figma/6eaf5518-1f23-476a-9bd4-f7fc9b439d7e.png","Serengeti"]].map(([src,label]) => <figure key={label}><Image src={src} alt={label} fill quality={90} sizes="(max-width: 700px) calc(100vw - 56px), (max-width: 1100px) calc(50vw - 56px), 33vw"/><figcaption><FigmaIcon name="orange-dot" width={6}/>{label}</figcaption></figure>)}</div><div className="stat-grid">{[["60+","groups a year","Taken on safari every year.","stat-groups.svg"],[reviewSettings.aggregateRating,`on ${reviewSettings.sourceName}`,`From ${reviewSettings.aggregateCount} guest reviews.`,"stat-rating.svg"],["5","parks we visit","Serengeti, Ngorongoro, Tarangire, Manyara and Arusha.","stat-parks.svg"],["2","mountains","Kilimanjaro and Mount Meru.","stat-mountains.svg"]].map(([number,label,copy,icon]) => <div className="stat-card" key={label}><div className="stat-card__number"><i><Image src={`/icons/figma/${icon}`} alt="" width={24} height={24}/></i><strong>{number}</strong></div><h3>{label}</h3><p>{copy}</p></div>)}</div></div></section>

    <section className="popular-safaris section-shell section-pad">
      <div className="center-heading"><SectionEyebrow>Popular adventures</SectionEyebrow><h2>Our Most Popular Tanzania Adventures</h2><p>Discover our handpicked Tanzania safaris and Kilimanjaro expeditions, combining extraordinary wildlife, breathtaking landscapes and exceptional local guiding.</p></div>
      <div className="popular-list popular-list--figma">{popularSafaris.map(trip => <article className="popular-card popular-card--figma" key={trip.title}><div className="popular-card__photo"><Image src={trip.image} alt={trip.title} fill quality={90} sizes="(max-width: 820px) calc(100vw - 52px), (max-width: 1240px) calc(50vw - 68px), 424px"/><span className="popular-card__duration"><FigmaIcon name="clock-card" width={16}/>{trip.duration}</span><div className="popular-card__price"><small>{trip.priceLabel}</small><strong>{trip.price}</strong></div></div><div className="popular-card__content"><h3>{trip.title}</h3><p className="popular-card__parks"><FigmaIcon name="pin-card" width={16}/>{trip.parks}</p><p>{trip.description}</p><div className="popular-card__tags">{trip.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="popular-card__actions"><Link href={`/trips/${trip.slug}`}>View itinerary →</Link><ButtonLink href={`/contact?trip=${trip.slug}#quote`}>Explore this adventure</ButtonLink></div></div></article>)}</div>
      <p>Every traveller has a different dream. Let us create a Tanzania adventure that is uniquely yours.</p><ButtonLink href="/trips" variant="outline">Explore All Tanzania Tours</ButtonLink>
    </section>

    <section className="home-reviews"><div className="section-shell"><div className="center-heading"><SectionEyebrow>Real journeys. Real experiences.</SectionEyebrow><h2>Loved by Travellers. Recommended by Experience.</h2><p>From unforgettable Serengeti safaris to life-changing Kilimanjaro climbs, discover why travellers from around the world choose Golden Dream Safaris and recommend us to others.</p></div><div className="rating-bar"><Image src="/images/figma/tripadvisor-logo.png" alt={reviewSettings.sourceName} width={64} height={64}/><strong>{reviewSettings.aggregateRating}</strong><span><RatingStars/><small>Based on {reviewSettings.aggregateCount} reviews on {reviewSettings.sourceName}</small></span><a className="button button--dark" href={reviewSettings.sourceUrl}>Read All Tripadvisor Reviews<span className="button__arrow"><FigmaIcon name="arrow-up-right" width={22}/></span></a></div><div className="home-review-grid">{reviews.map((review,index) => { const image = review.images[0]; return <article className={index === 0 ? "review-featured" : ""} key={review.id}>{image && <span className="home-review-photo"><Image src={image.src} alt={image.alt || "Guest safari photo"} fill quality={90} sizes={index === 0 ? "(max-width: 700px) calc(100vw - 72px), 52vw" : "(max-width: 700px) calc(100vw - 72px), 38vw"}/></span>}<RatingStars compact/><blockquote>“{review.quote}”</blockquote><a href={review.sourceUrl || reviewSettings.sourceUrl}>Read the full review on {review.source || reviewSettings.sourceName} <FigmaIcon name="arrow-card" width={18}/></a><div className="home-review-meta"><span><strong>{review.author}</strong><small>{review.meta}</small></span><span className="review-source"><Image src="/images/figma/tripadvisor-logo.png" alt="" width={24} height={24}/>Reviewed on {review.source || reviewSettings.sourceName}</span></div></article>; })}</div></div></section>

    <section className="booking-steps"><div className="section-shell booking-grid"><div><SectionEyebrow>How it works</SectionEyebrow><h2>Your Tanzania Adventure Starts Here</h2><p>Three simple steps from inspiration to exploration.</p><figure><Image src="/images/figma/4f52664e-2cff-4177-85a2-7772489dcddc.png" alt="Victor guiding guests on safari" fill sizes="50vw"/><figcaption><span><FigmaIcon name="booking-chat" width={20}/></span>Personal planning with our local team</figcaption></figure></div><div className="booking-timeline">{[["01","Share Your Travel Dreams","Tell us your travel dates, interests and budget. Our local experts will help you find the ideal Tanzania safari or Kilimanjaro expedition.","booking-chat","Free travel consultation"],["02","Personalize Your Journey","Receive a tailor-made itinerary, expert recommendations and a transparent quotation. Together, we’ll perfect every detail.","booking-plan","Personalized quotation"],["03","Travel With Confidence","Confirm your adventure and leave the arrangements to us. Our dedicated local team will support you throughout your journey in Tanzania.","booking-pickup","No obligation to book"]] .map(([number,title,copy,icon,note]) => <div className="booking-step" key={number}><span>{number}</span><div><h3><FigmaIcon name={icon as "booking-chat" | "booking-plan" | "booking-pickup"} width={22}/>{title}</h3><p>{copy}</p><small>{note}</small></div></div>)}<div className="booking-actions"><ButtonLink href="/contact#quote">Start Planning Your Adventure</ButtonLink><a href={settings.company.whatsapp}><FigmaIcon name="footer-whatsapp" width={20}/>Chat With Our Local Experts</a></div></div></div></section>

    <IncludedExperience/>

    <section className="host section-shell"><div className="host-photo"><Image src="/images/figma/victor-host.png" alt="Victor Costa guiding guests" fill quality={90} sizes="(max-width: 1000px) calc(100vw - 32px), 648px"/><span><i><FigmaIcon name="graduation-cap" width={24}/></i><strong>Mweka College graduate</strong><small>College of African Wildlife Management</small></span></div><div><SectionEyebrow>Meet our founder</SectionEyebrow><h2>Born in Tanzania. Inspired by Nature. Guided by Passion.</h2><p>Born in Marangu, at the foothills of Mount Kilimanjaro, Victor Costa grew up surrounded by the natural beauty that inspires travellers from around the world.</p><p>His passion for wildlife led him to the College of African Wildlife Management, Mweka, where he trained as a professional wildlife guide.</p><p>With years of experience exploring Tanzania’s wilderness, Victor founded Golden Dream Safaris with a simple vision: to share his country through authentic, safe and deeply personal adventures.</p><p>Known for his warm personality, calm confidence and genuine care for others, Victor has a natural ability to make guests feel welcome and at ease from the moment they meet him.</p><p>Today, alongside his dedicated safari guides and Kilimanjaro mountain teams, he continues to share the Tanzania he knows, loves and proudly calls home.</p><strong>Victor Costa | Founder &amp; Professional Wildlife Guide<br/>“Tanzania is my home, and welcoming you here is more than my profession. It is my passion.”</strong><ButtonLink href="/about" variant="dark">Meet Victor &amp; Our Team</ButtonLink></div></section>

    <FaqSection title="Everything You Need to Know Before Your Tanzania Adventure" intro="Planning your first Tanzania safari or Kilimanjaro climb? Here are answers to some of our most frequently asked questions." questionTitle="Still Have Questions? We’re Here to Help." questionCopy="Speak directly with our local travel experts for honest advice and personalized recommendations." questionButtonLabel="Ask Our Travel Experts"/>
  </MarketingShell>;
}
