import type {Metadata} from "next";
import {FaqSection} from "@/components/faq-section";
import {MarketingShell} from "@/components/marketing-shell";
import {QuoteWizard} from "@/components/quote-wizard";
import {StructuredData} from "@/components/structured-data";
import {SectionPill} from "@/components/button-link";
import {contactDetails, otherTrips, siteOrigin, wildlifeTrips} from "@/data/site";
import {FigmaIcon, type FigmaIconName} from "@/components/figma-icon";

export const metadata: Metadata = {
  title: "Contact & free safari quote",
  description: "Tell Golden Dream Safaris about your Tanzania trip and get a free, no-commitment proposal and price.",
  alternates: {canonical: "/contact"},
  openGraph: {title: "Ask for a free Tanzania safari quote", url: "/contact"},
};

const methods = [
  {label: "WhatsApp", value: contactDetails.phoneDisplay, note: "Message us on WhatsApp", href: contactDetails.whatsapp, icon: "contact-whatsapp", featured: true},
  {label: "Email", value: contactDetails.email, note: "Send us an email", href: `mailto:${contactDetails.email}`, icon: "contact-mail"},
  {label: "Office", value: contactDetails.location, note: "All trips start and end here", href: "https://www.google.com/maps/search/?api=1&query=Arusha%2C%20Tanzania", icon: "contact-pin"},
] satisfies Array<{label: string; value: string; note: string; href: string; icon: FigmaIconName; featured?: boolean}>;

type ContactQuery = {trip?: string; tripType?: string; destination?: string; arrival?: string; departure?: string; travellers?: string};

function safeDate(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

export default async function ContactPage({searchParams}: {searchParams: Promise<ContactQuery>}) {
  const query = await searchParams;
  const selected = [...wildlifeTrips, ...otherTrips].find(trip => trip.slug === query.trip);
  const initialTrip = selected?.category === "Trek" ? selected.title.includes("Kilimanjaro") ? "Kilimanjaro" : "Mount Meru" : selected?.category === "Island" ? "Zanzibar" : selected ? "Wildlife safari" : query.tripType === "Trek" ? "Kilimanjaro" : query.tripType === "Zanzibar" ? "Zanzibar" : query.tripType === "Safari" ? "Wildlife safari" : undefined;
  const initialAdults = query.travellers ? Math.min(40, Math.max(1, Number.parseInt(query.travellers, 10) || 2)) : undefined;
  const initialMessage = query.destination ? `I am interested in visiting ${query.destination}.` : undefined;
  return <MarketingShell>
    <StructuredData data={{"@context":"https://schema.org","@type":"ContactPage",name:"Contact Golden Dream Safaris",url:`${siteOrigin}/contact`}}/>
    <section className="contact-hero section-shell">
      <div className="contact-intro">
        <p>Home&nbsp; / &nbsp;Contact</p>
        <SectionPill>Contact</SectionPill>
        <h1>Ask for a quote</h1>
        <p>Tell us about your trip and we&apos;ll reply with a proposal and a price. Asking is free and commits you to nothing.</p>
        <div className="contact-methods">
          {methods.map(method => <a className={method.featured ? "is-featured" : ""} href={method.href} key={method.label}>
            <span aria-hidden><FigmaIcon name={method.icon} width={24}/></span><span><small>{method.label}</small><strong>{method.value}</strong><em>{method.note}</em></span><b aria-hidden><FigmaIcon name="arrow-header" width={20}/></b>
          </a>)}
        </div>
      </div>
      <div className="contact-form-wrap"><QuoteWizard initialTrip={initialTrip} initialArrival={safeDate(query.arrival)} initialDeparture={safeDate(query.departure)} initialAdults={initialAdults} initialMessage={initialMessage}/></div>
    </section>
    <FaqSection compact/>
  </MarketingShell>;
}
