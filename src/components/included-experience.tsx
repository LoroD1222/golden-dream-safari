"use client";

import Image from "next/image";
import {useState} from "react";
import {SectionPill} from "@/components/button-link";

const offers = [
  {
    title: "Safaris & treks",
    description: "Game drives in the Serengeti, Ngorongoro, Tarangire, Lake Manyara and Arusha National Park, plus Kilimanjaro and Mount Meru climbs and Zanzibar.",
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
    title: "Local guides",
    description: "Victor and his team of local guides, drivers and chefs.",
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
    title: "Camping or lodges",
    description: "From $200 per person per day (camping, joining a group) to $550 (private safari, lodge accommodation).",
    icon: "/icons/figma/included-asset-4.svg",
    primaryImage: "/images/figma/701c4e7b-d313-41a8-b79a-890f42cea6c5.png",
    primaryAlt: "A safari chef preparing a fresh meal outdoors",
    secondaryImage: "/images/figma/c709c3ab-d64a-4463-9049-a810508bb337.png",
    secondaryAlt: "Guests beside safari vehicles beneath an acacia tree",
    badge: "Camping or lodge — your choice",
    primaryPosition: "50% 44%",
    secondaryPosition: "center",
  },
] as const;

export function IncludedExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOffer = offers[activeIndex];

  return (
    <section className="included section-shell section-pad" id="included">
      <div className="included-copy">
        <SectionPill>What we offer</SectionPill>
        <h2>What&apos;s included in every safari</h2>
        <p>Park entry fees, accommodation, all meals, transport in a safari vehicle and drinking water. Airport transfers and a hotel in Arusha can be added on request.</p>
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
