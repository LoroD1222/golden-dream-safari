"use client";

import Image from "next/image";
import {useState} from "react";
import {ButtonLink, SectionPill} from "@/components/button-link";
import {FigmaIcon} from "@/components/figma-icon";
import {ItineraryAccommodation} from "@/components/itinerary-accommodation";
import {SafariRouteMap} from "@/components/safari-route-map";
import {WhatsAppIcon} from "@/components/whatsapp-icon";
import type {ItineraryDay} from "@/features/itinerary/model";
import {northernCircuitRouteStops} from "@/features/itinerary/route-data";

const dayImages = [
  "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png",
  "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png",
  "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png",
  "/images/figma/66d4cce3-2303-4bdf-a3b9-8d8f56ab67de.png",
];

const exactStories = [
  "Pick-up from your hotel at around 8:30 am after breakfast. Game drives in Tarangire among the baobabs, with a picnic lunch in the park.",
  "After breakfast, drive through the highlands into the Serengeti. Afternoon game drives across the plains, with lunch beside the park.",
  "Game drives on the way out of the Serengeti, a picnic lunch, then the drive to Ngorongoro for the night.",
  "After an early breakfast, descend into the crater for game drives. Lunch at the hippo pool picnic site, then back up the rim and the drive to Arusha.",
];

function stopForDay(dayNumber: number) {
  return dayNumber === 1 ? 1 : dayNumber === 2 ? 3 : dayNumber === 3 ? 4 : 5;
}

export function InteractiveItinerary({
  slug,
  days,
  quoteHref,
  whatsappHref,
}: {
  slug: string;
  days: ItineraryDay[];
  quoteHref: string;
  whatsappHref: string;
}) {
  const isNorthernCircuit = slug === "tarangire-serengeti-ngorongoro";
  const routeStops = northernCircuitRouteStops;
  const [selectedStop, setSelectedStop] = useState(1);
  const activeStop = routeStops[selectedStop];

  function selectStop(index: number, scroll = false) {
    setSelectedStop(index);
    if (scroll) document.getElementById(`day-${routeStops[index].dayNumber}`)?.scrollIntoView({behavior: "smooth", block: "start"});
  }

  return <section className="itinerary-section section-shell" id="itinerary">
    <div className="itinerary-heading"><SectionPill>Itinerary</SectionPill><h2>Day by day</h2><p>Times are approximate and depend on where the animals are.</p></div>
    <div className="itinerary-layout">
      <aside className="route-sidebar" aria-label="Interactive safari route">
        <div className="route-card">
          <div className="interactive-route-map">
            <SafariRouteMap stops={routeStops} selectedIndex={selectedStop} onSelect={setSelectedStop} onExplore={index => selectStop(index, true)}/>
          </div>
          <div className="route-list">
            <small>Your route</small>
            {routeStops.map((stop, index) => <button
              type="button"
              className={selectedStop === index ? "is-active" : ""}
              aria-pressed={selectedStop === index}
              onClick={() => selectStop(index, true)}
              key={`${stop.name}-${stop.label}-${index}`}
            ><b>{String(index + 1).padStart(2, "0")}</b><span>{stop.name}</span><small>{stop.label}</small></button>)}
            <div className="route-selected-copy">
              <strong>{activeStop.name}</strong>
              <p>{activeStop.description}</p>
              <button type="button" onClick={() => selectStop(selectedStop, true)}>Explore this park ↗</button>
            </div>
          </div>
        </div>
        <div className="route-help"><span><FigmaIcon name="book" width={20}/>Plan your trip</span><h3>Want to change this trip?</h3><p>Send us your dates and we&apos;ll reply with a quote. Parks and days can be changed. It&apos;s free and commits you to nothing.</p><div><ButtonLink href={quoteHref}>Get a free quote</ButtonLink><a className="whatsapp-text-link" href={whatsappHref}><WhatsAppIcon/>WhatsApp</a></div></div>
      </aside>
      <div className="day-list">
        {days.map((day, index) => <article
          className="day-card"
          id={`day-${day.dayNumber}`}
          data-itinerary-day={day.dayNumber}
          tabIndex={0}
          onFocus={() => setSelectedStop(stopForDay(day.dayNumber))}
          onMouseEnter={() => setSelectedStop(stopForDay(day.dayNumber))}
          key={day.id}
        >
          <header><span>Day {day.dayNumber}</span><h3>{day.title}</h3></header>
          <p className="day-summary">{day.summary}</p>
          {day.habitat && day.dayNumber !== 1 && <span className="habitat"><small>Habitat</small>{day.habitat}</span>}
          <div className="day-experience"><Image src={dayImages[index] || dayImages[0]} alt={`${day.title} safari experience`} width={420} height={260}/><p>{isNorthernCircuit ? exactStories[index] : day.activities[0]?.description}</p></div>
          <hr className="day-divider"/>
          <ItineraryAccommodation day={day} isFinalDay={day.dayNumber === days.length}/>
          {day.dayNumber === days.length && <p className="dropoff-note">No overnight today. This afternoon we drive back to Arusha and drop you at your accommodation.</p>}
        </article>)}
      </div>
    </div>
  </section>;
}
