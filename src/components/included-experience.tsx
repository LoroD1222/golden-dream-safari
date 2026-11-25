"use client";

import Image from "next/image";
import {useState} from "react";
import {SectionEyebrow} from "@/components/button-link";

const offers = [
  {
    title: "Safaris & Mountain Expeditions",
    description: "Expertly planned wildlife safaris, Kilimanjaro climbs, Mount Meru treks and Zanzibar holidays.",
    icon: "/icons/figma/included-asset-5.svg",
    primaryImage: "/images/figma/included-safari-primary.png",
    primaryAlt: "Zebra and wildebeest beside flamingos on a Tanzanian lake",
    secondaryImage: "/images/figma/included-safari-secondary.png",
    secondaryAlt: "Guests watching elephants from an open safari vehicle",
    badge: "Meals and water included",
    primaryPosition: "center",
    secondaryPosition: "center",
  },
  {
    title: "Professional Local Guides",
    description: "Experienced wildlife and mountain specialists dedicated to your safety, comfort and adventure.",
    icon: "/icons/figma/included-asset-3.svg",
    primaryImage: "/images/figma/victor-host.png",
    primaryAlt: "Victor Costa guiding guests during a wildlife safari",
    secondaryImage: "/images/figma/c831b544-2b93-4b2a-82f8-dbffbac229f0.png",
    secondaryAlt: "Golden Dream guests and local safari team beside their vehicles",
    badge: "A local team from Arusha",
    primaryPosition: "50% 38%",
    secondaryPosition: "center",
  },
  {
    title: "Comfort for Every Travel Style",
    description: "From wilderness camping and luxury safari lodges to quality mountain equipment and freshly prepared meals.",
    icon: "/icons/figma/included-asset-4.svg",
    primaryImage: "/images/accommodations/nimali-tarangire.webp",
    primaryAlt: "Safari lodge surrounded by the Tanzanian bush",
    secondaryImage: "/images/accommodations/lake-masek-tented-lodge.jpg",
    secondaryAlt: "A comfortable tented safari lodge room",
    badge: "Camping or lodge — your choice",
    primaryPosition: "center",
    secondaryPosition: "center",
  },
] as const;

export function IncludedExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOffer = offers[activeIndex];

  return (
    <section className="included section-shell section-pad" id="included">
      <div className="included-copy">
        <SectionEyebrow>What we offer</SectionEyebrow>
        <h2>Exceptional Adventures. Every Detail Considered.</h2>
        <p>From Tanzania wildlife safaris to Kilimanjaro expeditions, we carefully plan every detail for your comfort, safety and enjoyment.</p>
        <ol className="included-list" aria-label="Safari inclusions">
          {offers.map((offer, index) => (
            <li key={offer.title}>
              <button
                className={activeIndex === index ? "is-active" : ""}
                type="button"
                aria-pressed={activeIndex === index}
                aria-controls="included-visual"
                onClick={() => setActiveIndex(index)}
              >
                <span className="included-list__icon"><Image src={offer.icon} alt="" width={26} height={26}/></span>
                <span className="included-list__text"><strong>{offer.title}</strong><small>{offer.description}</small></span>
              </button>
            </li>
          ))}
        </ol>
        <p>Every itinerary includes transparent pricing and clearly defined inclusions, so you know exactly what to expect.</p>
      </div>
      <div className="included-collage" id="included-visual" aria-live="polite" aria-label={`Images for ${activeOffer.title}`}>
        <div className="included-collage__large" key={`${activeIndex}-large`}>
          <Image src={activeOffer.primaryImage} alt={activeOffer.primaryAlt} fill quality={90} sizes="(max-width: 1000px) 88vw, 497px" style={{objectPosition: activeOffer.primaryPosition}}/>
        </div>
        <div className="included-collage__small" key={`${activeIndex}-small`}>
          <Image src={activeOffer.secondaryImage} alt={activeOffer.secondaryAlt} fill quality={90} sizes="(max-width: 1000px) 62vw, 366px" style={{objectPosition: activeOffer.secondaryPosition}}/>
        </div>
        <span className="included-collage__badge"><i><Image src="/icons/figma/included-asset-1.svg" alt="" width={18} height={18}/></i>{activeOffer.badge}</span>
      </div>
    </section>
  );
}
