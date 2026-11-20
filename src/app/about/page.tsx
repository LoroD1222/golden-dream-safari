import type {Metadata} from "next";
import Image from "next/image";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {MarketingShell} from "@/components/marketing-shell";
import {contactDetails, siteOrigin} from "@/data/site";
import {StructuredData} from "@/components/structured-data";
import {FigmaIcon, type FigmaIconName} from "@/components/figma-icon";
import {WhatsAppIcon} from "@/components/whatsapp-icon";

export const metadata: Metadata = {title: "About Golden Dream Safaris", description: "Meet Victor Costa and the local Arusha team behind Golden Dream Safaris.", alternates: {canonical: "/about"}, openGraph: {title: "About Golden Dream Safaris", url: "/about", images: [{url: "/images/figma/about-victor.png", alt: "Victor Costa guiding a safari"}]}};

const team = [
  {
    title: "Mbwana",
    role: "Driver-guide",
    image: "/images/team/mbwana-driver-guide.webp",
    alt: "Mbwana, a Golden Dream Safaris driver-guide, with safari guests",
    position: "42% 48%",
  },
  {
    title: "Amiri",
    role: "Driver-guide",
    image: "/images/team/amiri-driver-guide.webp",
    alt: "Amiri, a Golden Dream Safaris driver-guide, with safari guests",
    position: "42% 46%",
  },
  {
    title: "Chaina",
    role: "Driver-guide",
    image: "/images/team/chaina-driver-guide.webp",
    alt: "Chaina, a Golden Dream Safaris driver-guide, with safari guests",
    position: "18% 48%",
  },
  {
    title: "Victor Costa",
    role: "CEO & founder",
    image: "/images/figma/victor-host.png",
    alt: "Victor Costa, CEO and founder of Golden Dream Safaris, guiding near a pride of lions",
    position: "right center",
  },
];
const values: Array<[string, string, FigmaIconName]> = [
  ["Local agency, local rates", "Booking with us cuts out the middle-man, lowers the price and supports the local community.", "value-local"],
  ["Service first", "We are nothing without our guests, and we work hard to make sure you are satisfied.", "value-service"],
  ["Recommended by travellers", "Travellers recommend us for the way we look after them and for our team. We're rated 4.9 on Tripadvisor.", "value-recommended"],
  ["Honesty goes a long way", "We won't recommend a package that doesn't suit you, or push you to travel at a poor time of year.", "value-honesty"],
];

export default function AboutPage() {
  return <MarketingShell><StructuredData data={{"@context":"https://schema.org","@type":"AboutPage",name:"About Golden Dream Safaris",url:`${siteOrigin}/about`}}/><section className="about-hero section-shell"><div><p>Home&nbsp; / &nbsp;About us</p><SectionEyebrow>About us</SectionEyebrow><h1>About Golden Dream Safaris</h1><p>We&apos;re a local safari company in Arusha, Tanzania, owned by tour guide Victor Costa. We take more than sixty groups on safari each year.</p><div><ButtonLink href="/contact#quote">Get a free quote</ButtonLink><a className="whatsapp-text-link" href={contactDetails.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div><figure><Image src="/images/figma/about-victor.png" alt="Victor Costa guiding guests on safari" fill preload sizes="50vw"/><figcaption><span><FigmaIcon name="graduation-cap" width={24}/></span><div><strong>Mweka College graduate</strong><small>College of African Wildlife Management</small></div></figcaption></figure></section><section className="about-story section-shell section-pad"><div><SectionEyebrow>Our story</SectionEyebrow><h2>How it started</h2></div><div><p>Victor Costa became a wildlife tour guide after graduating from Mweka College, the College of African Wildlife Management. His love of African wildlife, and his interest in meeting people from other cultures, led him to start Golden Dream Safaris.</p><p>Booking with a local agency means local rates. There is no overseas middle-man, so the price is lower and more of what you pay stays in the community.</p><p>Victor still guides trips himself. He says what he enjoys most is seeing guests enjoy what Tanzania has to offer.</p></div></section><section className="about-values section-shell"><SectionEyebrow>What we stand for</SectionEyebrow><h2>Why book with us</h2><div>{values.map(([title,copy,icon]) => <article key={title}><span className="about-value-icon"><FigmaIcon name={icon} width={26}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section><section className="about-team section-shell section-pad"><SectionEyebrow>Meet the team</SectionEyebrow><h2>Our team</h2><p>Meet the local guides and safari team behind every Golden Dream trip.</p><div>{team.map(({title,role,image,alt,position}) => <article key={title}><div className="about-team__photo"><Image src={image} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 33vw, 20vw" style={{objectPosition: position}}/></div><h3>{title}</h3><p>{role}</p></article>)}</div></section><section className="about-numbers section-shell">{[["60+","groups on safari every year"],["4.9","average on Tripadvisor, 157 reviews"],["2","mountains: Kilimanjaro and Mount Meru"],["5","parks we visit, from the Serengeti to Arusha National Park"]].map(([number,label]) => <div key={number}><strong>{number}</strong><p>{label}</p></div>)}</section><div className="about-spacer"/></MarketingShell>;
}
