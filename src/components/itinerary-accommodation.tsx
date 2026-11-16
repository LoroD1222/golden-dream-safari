"use client";

import Image from "next/image";
import {useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";
import type {ItineraryDay} from "@/features/itinerary/model";

const packageIcons = ["package-camping", "package-lodge", "package-luxury"] as const;

type StayOption = {
  tier: "Group camping" | "Mid-range lodge" | "Private luxury";
  property: string;
  location: string;
  images: Array<{src: string; alt: string}>;
};

const stayOptionsByDay: Record<number, StayOption[]> = {
  1: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Mto wa Mbu", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}]},
    {tier: "Mid-range lodge", property: "Nimali Tarangire", location: "Tarangire", images: [{src: "/images/accommodations/nimali-tarangire.webp", alt: "Nimali Tarangire lodge"}]},
    {tier: "Private luxury", property: "Nimali Tarangire", location: "Tarangire", images: [{src: "/images/accommodations/nimali-tarangire.webp", alt: "Nimali Tarangire luxury lodge"}]},
  ],
  2: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Serengeti", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}]},
    {tier: "Mid-range lodge", property: "Lake Masek Tented Lodge", location: "Serengeti", images: [{src: "/images/accommodations/lake-masek-tented-lodge.jpg", alt: "Lake Masek Tented Lodge"}]},
    {tier: "Private luxury", property: "Melia Serengeti Lodge", location: "Serengeti", images: [{src: "/images/accommodations/melia-serengeti-lodge.jpg", alt: "Melia Serengeti Lodge"}, {src: "/images/accommodations/lemala-kuria-hills.jpg", alt: "Lemala Kuria Hills Lodge"}]},
  ],
  3: [
    {tier: "Group camping", property: "Karibu River Camp", location: "Ngorongoro", images: [{src: "/images/accommodations/karibu-river-camp.jpg", alt: "Karibu River Camp accommodation"}]},
    {tier: "Mid-range lodge", property: "Neptune Ngorongoro", location: "Ngorongoro", images: [{src: "/images/accommodations/neptune-ngorongoro.webp", alt: "Neptune Ngorongoro Luxury Lodge"}]},
    {tier: "Private luxury", property: "Lemala Kuria Hills", location: "Northern Serengeti", images: [{src: "/images/accommodations/lemala-kuria-hills.jpg", alt: "Lemala Kuria Hills Lodge"}, {src: "/images/accommodations/melia-serengeti-lodge.jpg", alt: "Melia Serengeti Lodge"}]},
  ],
};

export function ItineraryAccommodation({day, isFinalDay}: {day: ItineraryDay; isFinalDay: boolean}) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [slide, setSlide] = useState(0);
  const [mealInfoOpen, setMealInfoOpen] = useState(false);
  const options = stayOptionsByDay[day.dayNumber] || [];
  const selected = options[selectedOption];
  const selectedImage = selected?.images[slide] || selected?.images[0];

  function chooseOption(index: number) {
    setSelectedOption(index);
    setSlide(0);
  }

  function moveSlide(direction: number) {
    if (!selected?.images.length) return;
    setSlide(current => (current + direction + selected.images.length) % selected.images.length);
  }

  return <>
    <div className="accommodation-heading">
      <span><FigmaIcon name="bed" width={22}/></span>
      <h4>{isFinalDay ? `Day ${day.dayNumber} | Drop-off` : `Day ${day.dayNumber} | Accommodation`}</h4>
      <button
        type="button"
        className="meal-plan-button"
        aria-expanded={mealInfoOpen}
        aria-controls={`meal-plan-note-${day.dayNumber}`}
        onClick={() => setMealInfoOpen(open => !open)}
      ><FigmaIcon name="meal" width={20}/>Meal plan: {day.meals.join(" · ")}<FigmaIcon name="info" width={18}/></button>
    </div>
    {mealInfoOpen && <p className="meal-plan-note" id={`meal-plan-note-${day.dayNumber}`}>Meals are prepared during the safari. Please tell us about allergies or dietary requirements when you request your quote.</p>}
    {!isFinalDay && selected && selectedImage && <div className="accommodation-options">
      <div className="accommodation-option-list" role="group" aria-label={`Day ${day.dayNumber} accommodation options`}>
        <small>Options based on your package:</small>
        {options.map((option, index) => <button
          type="button"
          className={selectedOption === index ? "is-selected" : ""}
          aria-pressed={selectedOption === index}
          onClick={() => chooseOption(index)}
          key={option.tier}
        ><span><FigmaIcon name={packageIcons[index]} width={20}/></span><span><strong>{option.tier}</strong><small>{option.property} · {option.location}</small></span></button>)}
        <p className="availability-note">Availability and the final room type are confirmed in your quote.</p>
      </div>
      <figure className="property-card" aria-live="polite">
        <span className="property-card__tier">{selected.tier}</span>
        <div className="property-card__media">
          <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="(max-width: 1100px) 100vw, 360px"/>
          <button type="button" aria-label={`Previous ${selected.tier.toLowerCase()} accommodation photo`} onClick={() => moveSlide(-1)}><FigmaIcon name="chevron-prev" width={20}/></button>
          <button type="button" aria-label={`Next ${selected.tier.toLowerCase()} accommodation photo`} onClick={() => moveSlide(1)}><FigmaIcon name="chevron-next" width={20}/></button>
          {selected.images.length > 1 && <small>{slide + 1} / {selected.images.length}</small>}
        </div>
        <figcaption>{selected.property}</figcaption>
      </figure>
    </div>}
  </>;
}
