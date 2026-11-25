import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {FaqSection} from "@/components/faq-section";
import {FigmaIcon} from "@/components/figma-icon";
import {MarketingShell} from "@/components/marketing-shell";
import {StructuredData} from "@/components/structured-data";
import {siteOrigin} from "@/data/site";
import {formatItineraryPrice} from "@/features/itinerary/presentation";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kilimanjaro climbing routes and prices",
  description: "Compare 12 guided Kilimanjaro itineraries from 5 to 9 days, including Lemosho, Machame, Marangu, Rongai, Umbwe and the Northern Circuit.",
  alternates: {canonical: "/kilimanjaro"},
  openGraph: {
    title: "Kilimanjaro climbing routes and prices",
    description: "Choose a Kilimanjaro route, compare the day-by-day itinerary and climb with a local Tanzanian mountain team.",
    url: "/kilimanjaro",
    images: [{url: "/images/kilimanjaro-packages/kilimanjaro-climbing-packages-serengeti-wild-tours.jpg", alt: "Climbers on Mount Kilimanjaro"}],
  },
};

const routeFaqs = [
  {question: "Which Kilimanjaro route should I choose?", answer: "Lemosho and the Northern Circuit suit climbers who want a longer acclimatization schedule. Machame is varied and popular, Marangu uses shared huts, Rongai approaches from the north, and Umbwe is steep and best for experienced trekkers."},
  {question: "How many days should I allow?", answer: "Seven to nine mountain days usually allow a steadier acclimatization schedule. Five and six day routes are available, but the right choice depends on your fitness, experience, time and preferred approach."},
  {question: "What is included in the climb price?", answer: "The published packages include airport transfers, Moshi hotel nights, park and rescue fees, the mountain crew, meals, route accommodation, daily health checks, emergency oxygen, first aid equipment and government taxes."},
  {question: "Do I stay in huts or tents?", answer: "Marangu uses shared mountain huts. Lemosho, Machame, Rongai, Umbwe and the Northern Circuit use mountain camps with tents prepared by the crew."},
  {question: "Can I book a private Kilimanjaro climb?", answer: "Yes. Choose a scheduled group departure or ask for a private climb on dates that work for your group."},
  {question: "What insurance do I need?", answer: "Your policy should cover trekking up to 6,000 metres, medical treatment, evacuation and repatriation. Bring the policy details with you and check the insurer’s altitude limits before travelling."},
];

export default async function KilimanjaroPage() {
  const itineraries = (await getPublicItineraryRepository().list())
    .filter(item => item.status === "published" && item.tripType === "Kilimanjaro trek")
    .sort((a, b) => a.durationDays - b.durationDays || a.title.localeCompare(b.title));

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kilimanjaro climbing routes and prices",
    url: `${siteOrigin}/kilimanjaro`,
    mainEntity: itineraries.map(item => ({
      "@type": "TouristTrip",
      name: item.title,
      description: item.summary,
      url: `${siteOrigin}/trips/${item.slug}`,
      offers: item.startingPrice ? {"@type": "Offer", price: item.startingPrice, priceCurrency: item.currency} : undefined,
    })),
  };

  return <MarketingShell>
    <StructuredData data={collection}/>
    <section className="kili-hero section-shell">
      <Image src="/images/kilimanjaro-packages/kilimanjaro-climbing-packages-serengeti-wild-tours.jpg" alt="Kilimanjaro climbers with the mountain behind them" fill loading="eager" quality={90} sizes="100vw"/>
      <div className="kili-hero__shade"/>
      <div className="kili-hero__content">
        <p>Home&nbsp; / &nbsp;Kilimanjaro</p>
        <SectionEyebrow>5–9 day guided climbs</SectionEyebrow>
        <h1>Kilimanjaro climbing routes and prices</h1>
        <p>Compare the routes, walking days and accommodation style. Every itinerary is led by a licensed local mountain team from arrival in Moshi to your return after the climb.</p>
        <div><a className="button button--light" href="#routes">Compare all routes</a><ButtonLink href="/contact?tripType=Kilimanjaro#quote">Ask Victor</ButtonLink></div>
      </div>
      <aside><strong>{itineraries.length}</strong><span>complete route itineraries</span><p>One clear day-by-day plan for every route.</p></aside>
    </section>

    <section className="kili-trust section-shell" aria-label="Kilimanjaro climb support">
      {[["detail-group", "Licensed guides", "Professional local mountain leadership"], ["included-check", "Daily health checks", "Pulse, oxygen and symptom monitoring"], ["detail-best", "Emergency support", "Oxygen, first aid and rescue fees"], ["detail-parks", "Full mountain crew", "Guides, cook and porters"]].map(([icon, title, copy]) => <article key={title}><span><FigmaIcon name={icon as "detail-group" | "included-check" | "detail-best" | "detail-parks"} width={24}/></span><div><h2>{title}</h2><p>{copy}</p></div></article>)}
    </section>

    <section className="kili-routes section-shell section-pad" id="routes">
      <header><div><SectionEyebrow>Choose your route</SectionEyebrow><h2>Find the pace and trail that fit you</h2></div><p>Every card opens one complete itinerary. Prices are starting prices per person and are confirmed for your dates and group size.</p></header>
      <div className="kili-route-grid">{itineraries.map((item, index) => <article className={index === 0 ? "is-featured" : ""} key={item.slug}>
        <Link className="kili-route-image" href={`/trips/${item.slug}`}><Image src={item.heroImage || "/images/kilimanjaro-packages/kilimanjaro-summit-view-mawenzi-serengeti-wild-tours.jpg"} alt={item.title} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"/><span>{item.durationDays} mountain days</span></Link>
        <div className="kili-route-card__body"><small>{item.routeFamily}</small><h3>{item.title.replace(" Kilimanjaro Climb", "").replace(" Kilimanjaro Hut Climb", "")}</h3><p>{item.overviewParagraphs?.[0] || item.summary}</p><footer><strong>{formatItineraryPrice(item, {unavailable: "Price on request"})}</strong><Link href={`/trips/${item.slug}`}>View itinerary <FigmaIcon name="arrow-card" width={18}/></Link></footer></div>
      </article>)}</div>
    </section>

    <section className="kili-choose">
      <div className="section-shell"><div><SectionEyebrow>Compare the approaches</SectionEyebrow><h2>Six routes, different rhythms</h2><p>Longer is not automatically easier, but extra time usually gives your body a better opportunity to adjust. Victor will help you compare the trail, accommodation and daily walking schedule honestly.</p><ButtonLink href="/contact?tripType=Kilimanjaro#quote">Help me choose</ButtonLink></div><div className="kili-choose__list">{[
        ["Lemosho", "Scenic western approach with a gradual start and wide Shira Plateau views."],
        ["Northern Circuit", "The longest, quietest traverse with more time on the mountain."],
        ["Machame", "A varied camping route with a direct, energetic schedule."],
        ["Marangu", "The only route using shared mountain huts instead of tents."],
        ["Rongai", "A quieter northern approach with Mawenzi scenery."],
        ["Umbwe", "A steep, demanding opening suited to experienced trekkers."],
      ].map(([name, copy]) => <article key={name}><h3>{name}</h3><p>{copy}</p></article>)}</div></div>
    </section>

    <section className="kili-safety section-shell section-pad"><figure><Image src="/images/kilimanjaro-packages/kilimanjaro-local-mountain-guides-serengeti-wild-tours.jpg" alt="Local Kilimanjaro mountain guide team" fill sizes="(max-width: 800px) 100vw, 50vw"/></figure><div><SectionEyebrow>Mountain safety</SectionEyebrow><h2>Your guide watches the person, not only the number</h2><p>Pulse and blood-oxygen readings support the daily health check, but your guide also watches symptoms, pace and how your condition changes. If continuing is unsafe, the team supports your descent and follows national park rescue procedures.</p><ul><li>Daily health checks with a pulse oximeter</li><li>Emergency oxygen for stabilization during descent or evacuation</li><li>First aid equipment and park rescue fees included</li><li>Slow pacing, hydration and early symptom reporting</li></ul></div></section>
    <FaqSection items={routeFaqs}/>
  </MarketingShell>;
}
