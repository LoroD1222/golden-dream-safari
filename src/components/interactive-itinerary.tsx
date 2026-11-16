"use client";

import Image from "next/image";
import {useState} from "react";
import {ButtonLink, SectionPill} from "@/components/button-link";
import {FigmaIcon} from "@/components/figma-icon";
import type {ItineraryDay} from "@/features/itinerary/model";

const dayImages = [
  "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png",
  "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png",
  "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png",
  "/images/figma/66d4cce3-2303-4bdf-a3b9-8d8f56ab67de.png",
];

const packageIcons = ["package-camping", "package-lodge", "package-luxury"] as const;

const exactStories = [
  "Pick-up from your hotel at around 8:30 am after breakfast. Game drives in Tarangire among the baobabs, with a picnic lunch in the park.",
  "After breakfast, drive through the highlands into the Serengeti. Afternoon game drives across the plains, with lunch beside the park.",
  "Game drives on the way out of the Serengeti, a picnic lunch, then the drive to Ngorongoro for the night.",
  "After an early breakfast, descend into the crater for game drives. Lunch at the hippo pool picnic site, then back up the rim and the drive to Arusha.",
];

type RouteStop = {
  name: string;
  label: string;
  description: string;
  dayNumber: number;
  x: number;
  y: number;
};

const northernCircuitStops: RouteStop[] = [
  {name: "Arusha", label: "Day 1", description: "Arrival, briefing and the northern circuit starting point.", dayNumber: 1, x: 52, y: 53},
  {name: "Tarangire National Park", label: "Day 1", description: "Baobab trees, big elephant herds and the Tarangire River.", dayNumber: 1, x: 20, y: 78},
  {name: "Mto wa Mbu", label: "Night 1", description: "A lively safari town between Tarangire and the highlands.", dayNumber: 1, x: 27, y: 68},
  {name: "Serengeti National Park", label: "Days 2–3", description: "Open plains, rocky kopjes and some of Tanzania's best wildlife viewing.", dayNumber: 2, x: 6, y: 46},
  {name: "Ngorongoro Crater", label: "Days 3–4", description: "A wildlife-rich caldera with a picnic stop beside the hippo pool.", dayNumber: 3, x: 17, y: 61},
  {name: "Arusha", label: "Day 4", description: "Return to your Arusha accommodation after the crater game drive.", dayNumber: 4, x: 52, y: 53},
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
  const routeStops = northernCircuitStops;
  const [selectedStop, setSelectedStop] = useState(1);
  const [zoom, setZoom] = useState(1);
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
            <div className="route-map-layer" style={{transform: `scale(${zoom})`}}>
              <Image src="/images/figma/e5b53aa1-7458-40b6-b414-6001688526db.png" alt="Map of the northern Tanzania safari route" fill sizes="420px" priority={false}/>
              {routeStops.slice(0, -1).map((stop, index) => <button
                type="button"
                className={`route-map-marker ${selectedStop === index ? "is-active" : ""}`}
                style={{left: `${stop.x}%`, top: `${stop.y}%`}}
                aria-label={`Show ${stop.name}`}
                aria-pressed={selectedStop === index}
                onClick={() => selectStop(index)}
                key={`${stop.name}-${index}`}
              ><span>{index + 1}</span></button>)}
            </div>
            <div className="route-map-controls" aria-label="Map zoom controls">
              <button type="button" aria-label="Zoom in" onClick={() => setZoom(value => Math.min(1.45, value + .15))}>+</button>
              <button type="button" aria-label="Zoom out" onClick={() => setZoom(value => Math.max(1, value - .15))}>−</button>
            </div>
            <div className="route-map-popup" aria-live="polite">
              <strong>{String(selectedStop + 1).padStart(2, "0")}. {activeStop.name}</strong>
              <p>{activeStop.description}</p>
              <button type="button" onClick={() => selectStop(selectedStop, true)}>Explore this destination →</button>
            </div>
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
        <div className="route-help"><span><FigmaIcon name="book" width={20}/>Plan your trip</span><h3>Want to change this trip?</h3><p>Send us your dates and we&apos;ll reply with a quote. Parks and days can be changed. It&apos;s free and commits you to nothing.</p><div><ButtonLink href={quoteHref}>Get a free quote</ButtonLink><a href={whatsappHref}><FigmaIcon name="detail-whatsapp" width={20}/>WhatsApp</a></div></div>
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
          <div className="accommodation-heading"><span><FigmaIcon name="bed" width={22}/></span><h4>{day.dayNumber === days.length ? `Day ${day.dayNumber} | Drop-off` : `Day ${day.dayNumber} | Accommodation`}</h4><span><FigmaIcon name="meal" width={20}/>Meal plan: {day.meals.join(" · ")}<FigmaIcon name="info" width={18}/></span></div>
          {day.accommodation && <div className="accommodation-options">
            <div><small>Options based on your package:</small>{["Group camping", "Mid-range lodge", "Private luxury"].map((option, optionIndex) => <div className={optionIndex === 0 ? "is-selected" : ""} key={option}><span><FigmaIcon name={packageIcons[optionIndex]} width={20}/></span><p><strong>{option}</strong><small>{optionIndex === 0 ? "Campsite confirmed in your proposal" : optionIndex === 1 ? "Lodge or tented camp confirmed in your proposal" : "Luxury property confirmed in your proposal"} · {day.accommodation?.location}</small></p></div>)}<p className="availability-note">Availability and the final room type are confirmed in your quote.</p></div>
            <div className="property-card"><small>{day.accommodation.category}</small><div><span>Property photos</span><i aria-hidden>‹</i><i aria-hidden>›</i></div><strong>{day.accommodation.name}</strong></div>
          </div>}
          {day.dayNumber === days.length && <p className="dropoff-note">No overnight today. This afternoon we drive back to Arusha and drop you at your accommodation.</p>}
        </article>)}
      </div>
    </div>
  </section>;
}
