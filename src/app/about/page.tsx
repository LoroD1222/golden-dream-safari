import type {Metadata} from "next";
import Image from "next/image";
import {ButtonLink, SectionEyebrow} from "@/components/button-link";
import {MarketingShell} from "@/components/marketing-shell";
import {contactDetails, siteOrigin} from "@/data/site";
import {StructuredData} from "@/components/structured-data";
import {FigmaIcon, type FigmaIconName} from "@/components/figma-icon";
import {WhatsAppIcon} from "@/components/whatsapp-icon";

export const metadata: Metadata = {
  title: "About Golden Dream Safaris | Local Tanzania Tour Operator",
  description: "Meet the experienced safari guides and Kilimanjaro mountain teams behind Golden Dream Safaris, a locally owned Tanzania tour operator based in Arusha.",
  alternates: {canonical: "/about"},
  openGraph: {title: "About Golden Dream Safaris | Local Tanzania Tour Operator", url: "/about", images: [{url: "/images/figma/about-victor.png", alt: "Victor Costa guiding a safari"}]},
};

const team = [
  {title: "Mbwana", role: "Professional Safari Guide | 8 Years of Experience", bio: "Known for his remarkable wildlife-spotting abilities, humour and engaging personality, Mbwana brings the African wilderness to life.", image: "/images/team/mbwana-driver-guide.webp", alt: "Mbwana, a Golden Dream Safaris safari guide, with guests", position: "42% 48%"},
  {title: "Amiri", role: "Professional Safari Guide", bio: "A trusted member of the local safari team, dedicated to safe, welcoming and memorable wildlife journeys.", image: "/images/team/amiri-driver-guide.webp", alt: "Amiri, a Golden Dream Safaris safari guide, with guests", position: "42% 46%"},
  {title: "Chaina", role: "Senior Safari Guide | 20 Years of Experience", bio: "Chaina combines exceptional wildlife knowledge with a welcoming personality and a deep passion for Tanzania’s wilderness.", image: "/images/team/chaina-driver-guide.webp", alt: "Chaina, a Golden Dream Safaris senior safari guide, with guests", position: "18% 48%"},
  {title: "Victor Costa", role: "Founder & Senior Safari Guide | 20 Years of Experience", bio: "Mweka-trained and born in Marangu, Victor brings extensive wildlife knowledge, calm confidence and personal care to every adventure.", image: "/images/team/victor-costa-ceo.webp", alt: "Victor Costa, founder of Golden Dream Safaris, beside a safari vehicle", position: "center 62%"},
];

const purpose: Array<[string, string, FigmaIconName]> = [
  ["Our Mission", "To create exceptional Tanzania safaris and mountain expeditions through expert guiding, personalized service and a genuine commitment to our guests’ safety, comfort and happiness.", "value-local"],
  ["Our Vision", "To become one of Tanzania’s most trusted local tour operators, recognized for authentic experiences, outstanding service and responsible tourism.", "value-service"],
  ["Integrity", "Honest advice, transparent pricing and keeping our promises.", "value-honesty"],
  ["Safety", "Your wellbeing comes before every adventure and every summit.", "value-recommended"],
  ["Excellence", "Professional guiding, thoughtful planning and attention to every detail.", "value-service"],
  ["Authenticity", "Sharing the real Tanzania through genuine local experiences.", "value-local"],
  ["Personal Care", "Every guest matters. Every journey deserves our full attention.", "value-recommended"],
  ["Responsibility", "Respecting wildlife, protecting nature and supporting local communities.", "value-honesty"],
];

const mountainTeam: Array<[string, string, FigmaIconName]> = [
  ["Jackson Shirima", "Lead Kilimanjaro Guide | 15+ Years of Experience. Jackson combines extensive mountain expertise with calm leadership, knowledge of acclimatization and genuine encouragement.", "value-service"],
  ["Emmanuel", "Lead Kilimanjaro Guide | 10 Years of Experience. Professional, attentive and encouraging, Emmanuel helps climbers navigate physical and mental challenges with confidence.", "value-recommended"],
  ["Daniel", "Professional Kilimanjaro Guide | 7 Years of Experience. Daniel’s patience, professionalism and positive energy help every climber feel supported.", "value-local"],
];

const safetyStandards: Array<[string, string, FigmaIconName]> = [
  ["Qualified & Experienced Guides", "Professional safari and mountain guides trained in first aid, risk management and emergency response.", "value-service"],
  ["Comprehensive Mountain Safety", "Daily health checks, pulse oximeters, emergency oxygen and carefully planned acclimatization schedules on Kilimanjaro.", "value-recommended"],
  ["Reliable Vehicles & Quality Equipment", "Regularly maintained safari vehicles and dependable mountain equipment for your safety and comfort.", "value-local"],
  ["Emergency Preparedness", "Established evacuation procedures and trained teams prepared to respond when unexpected situations arise.", "value-honesty"],
  ["Dedicated Local Support", "A reliable team on the ground, ready to assist you throughout your Tanzania adventure.", "value-service"],
  ["Responsible Guiding", "Respect for wildlife, safe viewing distances and responsible decision-making in the wilderness and on the mountain.", "value-local"],
];

const responsibleTourism: Array<[string, string, FigmaIconName]> = [
  ["Fair Treatment of Mountain Crews", "Fair wages, proper equipment, nutritious meals and respectful working conditions for our guides, porters and cooks.", "value-recommended"],
  ["Wildlife Conservation", "Responsible wildlife viewing, respect for natural habitats and national park conservation guidelines.", "value-local"],
  ["Supporting Local Communities", "We prioritize local employment, businesses and meaningful cultural experiences.", "value-service"],
  ["Protecting Our Environment", "Responsible waste management, reduced plastic use and Leave No Trace principles.", "value-honesty"],
  ["Respecting Local Cultures", "Authentic cultural experiences that respect the traditions, dignity and heritage of Tanzania’s communities.", "value-recommended"],
];

const equipment: Array<[string, string, FigmaIconName]> = [
  ["Safari Vehicles", "Vehicles chosen for wildlife viewing, comfort and reliability, with space to enjoy the scenery and capture photographs.", "value-local"],
  ["Mountain Camping Equipment", "Reliable sleeping tents, dining equipment and carefully prepared camps offer a welcoming place to rest.", "value-service"],
  ["Meals & Personal Preparation", "We plan meals and equipment around your itinerary and explain what is provided, what to pack and available rental options.", "value-recommended"],
];

function CardSection({eyebrow, title, intro, cards}: {eyebrow: string; title: string; intro?: string; cards: Array<[string, string, FigmaIconName]>}) {
  return <section className="about-values section-shell"><SectionEyebrow>{eyebrow}</SectionEyebrow><h2>{title}</h2>{intro && <p>{intro}</p>}<div>{cards.map(([cardTitle, copy, icon]) => <article key={cardTitle}><span className="about-value-icon"><FigmaIcon name={icon} width={26}/></span><h3>{cardTitle}</h3><p>{copy}</p></article>)}</div></section>;
}

export default function AboutPage() {
  return <MarketingShell>
    <StructuredData data={{"@context":"https://schema.org","@type":"AboutPage",name:"About Golden Dream Safaris",url:`${siteOrigin}/about`}}/>

    <section className="about-hero section-shell"><div><p>Home&nbsp; / &nbsp;About us</p><SectionEyebrow>The people behind your adventure</SectionEyebrow><h1>Tanzanian by Birth. Explorers by Heart.</h1><p>Born beneath Mount Kilimanjaro and inspired by Tanzania’s extraordinary wilderness, our story is rooted in a genuine love for our country. We are Golden Dream Safaris, a locally owned Tanzania tour operator specializing in wildlife safaris, Kilimanjaro expeditions and tailor-made holidays.</p><p>Sharing Tanzania with the world is more than our profession. It is our passion.</p><div><ButtonLink href="/contact#quote">Plan your adventure</ButtonLink><a className="whatsapp-text-link" href={contactDetails.whatsapp}><WhatsAppIcon/>WhatsApp Victor</a></div></div><figure><Image src="/images/figma/about-victor.png" alt="Victor Costa guiding guests on safari" fill preload sizes="50vw"/><figcaption><span><FigmaIcon name="graduation-cap" width={24}/></span><div><strong>Mweka College graduate</strong><small>College of African Wildlife Management</small></div></figcaption></figure></section>

    <section className="about-story section-shell section-pad"><div><SectionEyebrow>Our story</SectionEyebrow><h2>Born Beneath Kilimanjaro. Inspired by the Wild.</h2></div><div><p>The story of Golden Dream Safaris begins in Marangu, a beautiful village nestled at the foothills of Mount Kilimanjaro, where our founder, Victor Costa, was born.</p><p>His love for Tanzania’s natural heritage led him to the College of African Wildlife Management, Mweka, where he trained as a professional wildlife guide.</p><p>Through years of guiding travellers across Tanzania, Victor discovered that the most memorable journeys were not simply about the destinations, but the people, connections and unexpected moments along the way. Golden Dream Safaris was founded on that belief.</p><p>Today, we are an independent, locally owned Tanzania tour operator bringing together experienced wildlife guides, dedicated mountain crews and passionate travel specialists.</p><p>From private and group safaris in the Serengeti to Kilimanjaro expeditions and Zanzibar holidays, every journey we create reflects our local knowledge, professional expertise and genuine Tanzanian hospitality.</p><p>Our ambition is not to be the biggest tour operator in Tanzania, but to be one you would confidently recommend to the people you love.</p></div></section>

    <CardSection eyebrow="Mission, vision & values" title="Rooted in Passion. Guided by Purpose." intro="We measure our success not by the number of bookings we receive, but by the experiences our guests take home." cards={purpose}/>

    <section className="about-team section-shell section-pad"><SectionEyebrow>Meet our team</SectionEyebrow><h2>The People Behind Your Extraordinary Adventure</h2><p>Passionate about Tanzania and dedicated to your experience, our safari and mountain guides combine professional expertise, local knowledge and genuine Tanzanian hospitality. Together, they bring 80+ years of guiding experience.</p><div>{team.map(({title,role,bio,image,alt,position}) => <article key={title}><div className="about-team__photo"><Image src={image} alt={alt} fill quality={90} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 20vw" style={{objectPosition: position}}/></div><h3>{title}</h3><p>{role}</p><p>{bio}</p></article>)}</div></section>

    <CardSection eyebrow="Our mountain team" title="Different Personalities. One Shared Passion." intro="From the wilderness of the Serengeti to the summit of Kilimanjaro, our team shares one commitment: to make your Tanzania adventure safe, personal and truly memorable." cards={mountainTeam}/>
    <CardSection eyebrow="Our safety standards" title="Extraordinary Adventures. Uncompromising Safety." intro="Adventure should be exciting, not uncertain. Your safety and wellbeing are fundamental to every journey we organize, and no wildlife encounter, summit or schedule is more important than your wellbeing." cards={safetyStandards}/>
    <CardSection eyebrow="Travel with purpose" title="Protecting Our Home. Empowering Our People." intro="Tanzania’s wildlife, mountains and communities are our heritage. We believe every adventure should contribute to protecting them." cards={responsibleTourism}/>
    <CardSection eyebrow="Vehicles & equipment" title="Comfort in the Wild. Confidence on the Mountain." intro="The right equipment makes a real difference. We pay attention to the practical details so you can focus on the adventure." cards={equipment}/>

    <section className="about-numbers section-shell">{[["80+","years of combined guiding experience"],["60+","groups on safari every year"],["4.9","average on Tripadvisor, 157 reviews"],["2","mountains: Kilimanjaro and Mount Meru"]].map(([number,label]) => <div key={number}><strong>{number}</strong><p>{label}</p></div>)}</section>
    <div className="about-spacer"/>
  </MarketingShell>;
}
