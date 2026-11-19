"use client";

import Image from "next/image";
import {useEffect, useState} from "react";
import type {ItineraryDay} from "@/features/itinerary/model";
import type {StayOption} from "@/features/itinerary/trip-supplements";

const assetBasePath = "/itinerary-assets";

export function ItineraryAccommodation({day, options, isFinalDay}: {day: ItineraryDay; options: StayOption[]; isFinalDay: boolean}) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mealInfoOpen, setMealInfoOpen] = useState(false);
  const selected = options[selectedOption];
  const selectedImage = selected?.images[slide] || selected?.images[0];

  useEffect(() => {
    if (paused || !selected || selected.images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setSlide(current => (current + 1) % selected.images.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused, selected]);

  function chooseOption(index: number) {
    setSelectedOption(index);
    setSlide(0);
  }

  function moveSlide(direction: number) {
    if (!selected?.images.length) return;
    setSlide(current => (current + direction + selected.images.length) % selected.images.length);
  }

  function tierIcon(tier: StayOption["tier"]) {
    const source = tier === "Private luxury" ? "premium-crown.svg" : "signature-star.svg";
    return <Image src={`${assetBasePath}/${source}`} alt="" width={28} height={28}/>;
  }

  return <>
    <div className="trip-ref-day-meta">
      <span className="trip-ref-accommodation-label"><Image src={`${assetBasePath}/accommodation.svg`} alt="" width={45} height={45}/>Day {day.dayNumber} | {isFinalDay ? "Drop-off" : "Accommodation"}</span>
      <button
        type="button"
        className="trip-ref-meal"
        aria-expanded={mealInfoOpen}
        aria-controls={`meal-plan-note-${day.dayNumber}`}
        onClick={() => setMealInfoOpen(open => !open)}
      ><Image src={`${assetBasePath}/meal.png`} alt="" width={20} height={20}/>Meal Plan: {day.meals.join(" · ")}<Image src={`${assetBasePath}/meal-info.svg`} alt="Meal-plan information" width={20} height={20}/></button>
    </div>
    {mealInfoOpen && <p className="trip-ref-meal-note" id={`meal-plan-note-${day.dayNumber}`}>Meals are prepared during the trip. Please tell us about allergies or dietary requirements when you request your quote.</p>}
    {!isFinalDay && !selected && day.accommodation && <div className="trip-ref-accommodation-text">
      <span>{day.accommodation.category === "Other" ? "Mountain stay" : day.accommodation.category}</span>
      <div><h4>{day.accommodation.name}</h4><p>{day.accommodation.description}</p><small>{day.accommodation.location}</small></div>
    </div>}
    {!isFinalDay && selected && selectedImage && <div className="trip-ref-lodge">
      <div className="trip-ref-lodge-options" role="group" aria-label={`Day ${day.dayNumber} accommodation options`}>
        <p>Options based on your packages:</p>
        {options.map((option, index) => <button
          type="button"
          className={`trip-ref-lodge-option${selectedOption === index ? " is-active" : ""}`}
          aria-pressed={selectedOption === index}
          onClick={() => chooseOption(index)}
          key={option.tier}
        >
          <span className="trip-ref-lodge-tier"><span className="trip-ref-lodge-tier-icon">{tierIcon(option.tier)}</span>{option.tier}</span>
          <span className="trip-ref-lodge-name">{option.property}</span>
        </button>)}
        <small>Property availability and the final room category are confirmed in your trip proposal.</small>
      </div>

      <figure
        aria-live="polite"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);}}
      >
        <span className="trip-ref-lodge-photo" style={{height: "var(--trip-ref-lodge-photo-height, 288px)"}}>
          <Image
            key={`${selectedOption}-${slide}-${selectedImage.src}`}
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            quality={95}
            sizes="(max-width: 1100px) 100vw, 426px"
          />
          <span className={`trip-ref-lodge-badge trip-ref-lodge-badge--${selected.tier.toLowerCase().replaceAll(" ", "-")}`}>{selected.tier}</span>
          <span className="trip-ref-lodge-arrows">
            <button type="button" aria-label={`Previous ${selected.tier.toLowerCase()} accommodation`} onClick={() => moveSlide(-1)}>‹</button>
            <span>{slide + 1} / {selected.images.length}</span>
            <button type="button" aria-label={`Next ${selected.tier.toLowerCase()} accommodation`} onClick={() => moveSlide(1)}>›</button>
          </span>
        </span>
        <figcaption>{selected.property}</figcaption>
      </figure>
    </div>}
  </>;
}
