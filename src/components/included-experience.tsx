"use client";

import Image from "next/image";
import {useState} from "react";
import {SectionEyebrow} from "@/components/button-link";

const offers = [
  {
    title: "Safaris & Mountain Expeditions",
    description: "Expertly planned wildlife safaris, Kilimanjaro climbs, Mount Meru treks and Zanzibar holidays.",
    icon: "/icons/figma/included-asset-5.svg",
    images: [
      {src: "/images/figma/included-safari-primary.png", alt: "Zebra and wildebeest beside flamingos on a Tanzanian lake", position: "center"},
      {src: "/images/figma/included-safari-secondary.png", alt: "Guests watching elephants from an open safari vehicle", position: "center"},
    ],
    badge: "Meals and water included",
  },
  {
    title: "Professional Local Guides",
    description: "Experienced wildlife and mountain specialists dedicated to your safety, comfort and adventure.",
    icon: "/icons/figma/included-asset-3.svg",
    images: [
      {src: "/images/figma/victor-host.png", alt: "Victor Costa guiding guests during a wildlife safari", position: "50% 38%"},
      {src: "/images/figma/c831b544-2b93-4b2a-82f8-dbffbac229f0.png", alt: "Golden Dream guests and local safari team beside their vehicles", position: "center"},
    ],
    badge: "A local team from Arusha",
  },
  {
    title: "Comfort for Every Travel Style",
    description: "From wilderness camping and luxury safari lodges to quality mountain equipment and freshly prepared meals.",
    icon: "/icons/figma/included-asset-4.svg",
    images: [
      {src: "/images/accommodations/nimali-tarangire.webp", alt: "Safari lodge surrounded by the Tanzanian bush", position: "center"},
      {src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "A comfortable tented safari lodge room", position: "center"},
    ],
    badge: "Camping or lodge — your choice",
  },
  {
    title: "Freshly Prepared Safari Meals",
    description: "Wholesome breakfasts, hot lunches, dinners, snacks and fresh fruit prepared throughout your journey.",
    icon: "/icons/figma/meal.svg",
    images: [
      {src: "/images/food/safari-breakfast-chapati-eggs.webp", alt: "Safari breakfast with chapati, eggs, avocado and sausage", position: "center"},
      {src: "/images/food/safari-hot-lunch-potatoes-stew.webp", alt: "Freshly prepared safari lunch with potatoes and vegetable stew", position: "center"},
      {src: "/images/food/safari-vegetable-pasta.webp", alt: "Vegetable pasta prepared for safari guests", position: "center"},
      {src: "/images/food/safari-snack-fruit-juice.webp", alt: "Safari snack with banana, fruit juice and a wafer", position: "center"},
      {src: "/images/food/safari-dinner-buffet.webp", alt: "Safari dinner with rice, vegetables, potatoes and pasta", position: "center"},
      {src: "/images/food/safari-fresh-fruit.webp", alt: "Fresh watermelon and pineapple served during a safari", position: "center"},
    ],
    badge: "Dietary needs catered for",
  },
] as const;

export function IncludedExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeOffer = offers[activeIndex];
  const activeImage = activeOffer.images[activeImageIndex % activeOffer.images.length];
  const secondaryImage = activeOffer.images[(activeImageIndex + 1) % activeOffer.images.length];

  function selectOffer(index: number) {
    setActiveIndex(index);
    setActiveImageIndex(0);
  }

  function changeImage(direction: number) {
    setActiveImageIndex(current => (current + direction + activeOffer.images.length) % activeOffer.images.length);
  }

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
                onClick={() => selectOffer(index)}
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
        <div className="included-collage__large" key={`${activeIndex}-${activeImageIndex}-large`}>
          <Image src={activeImage.src} alt={activeImage.alt} fill quality={90} sizes="(max-width: 1000px) 88vw, 497px" style={{objectPosition: activeImage.position}}/>
        </div>
        <div className="included-collage__small" key={`${activeIndex}-${activeImageIndex}-small`}>
          <Image src={secondaryImage.src} alt={secondaryImage.alt} fill quality={90} sizes="(max-width: 1000px) 62vw, 366px" style={{objectPosition: secondaryImage.position}}/>
        </div>
        {activeOffer.images.length > 2 && <div className="included-collage__controls" aria-label={`${activeOffer.title} photo gallery`}><button type="button" aria-label="Show previous meal photos" onClick={() => changeImage(-1)}>←</button><span>{activeImageIndex + 1} / {activeOffer.images.length}</span><button type="button" aria-label="Show next meal photos" onClick={() => changeImage(1)}>→</button></div>}
        <span className="included-collage__badge"><i><Image src="/icons/figma/included-asset-1.svg" alt="" width={18} height={18}/></i>{activeOffer.badge}</span>
      </div>
    </section>
  );
}
