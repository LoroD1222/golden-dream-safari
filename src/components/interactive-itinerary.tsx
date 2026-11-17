"use client";

import Image from "next/image";
import {useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";
import {ItineraryAccommodation} from "@/components/itinerary-accommodation";
import {SafariRouteMap} from "@/components/safari-route-map";
import type {ItineraryDay} from "@/features/itinerary/model";
import {northernCircuitRouteStops} from "@/features/itinerary/route-data";
import {TripPlanIcon} from "@/components/trip-icons";

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
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set([0]));
  const activeStop = routeStops[selectedStop];
  const allDaysOpen = days.length > 0 && openDays.size === days.length;

  function selectStop(index: number, scroll = false) {
    setSelectedStop(index);
    if (scroll) {
      const dayIndex = days.findIndex(day => day.dayNumber === routeStops[index].dayNumber);
      if (dayIndex >= 0) setOpenDays(current => new Set(current).add(dayIndex));
      document.getElementById(`day-${routeStops[index].dayNumber}`)?.scrollIntoView({behavior: "smooth", block: "start"});
    }
  }

  function toggleDay(index: number) {
    setOpenDays(current => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setSelectedStop(stopForDay(days[index].dayNumber));
  }

  return <section className="trip-ref-itinerary section-shell" id="itinerary">
    <aside aria-label="Interactive safari route">
      <div className="trip-ref-itinerary-sticky">
        <div className="trip-route-map-card">
          <div className="trip-route-map-canvas">
            <SafariRouteMap stops={routeStops} selectedIndex={selectedStop} onSelect={setSelectedStop} onExplore={index => selectStop(index, true)}/>
          </div>
          <div className="trip-route-map-stops">
            <p className="trip-route-map-kicker">Your route</p>
            <ol>{routeStops.map((stop, index) => <li key={`${stop.name}-${stop.label}-${index}`}>
              <button
                type="button"
                className={selectedStop === index ? "is-active" : ""}
                aria-pressed={selectedStop === index}
                onClick={() => selectStop(index, true)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stop.name}</strong>
                <small>{stop.label}</small>
              </button>
            </li>)}</ol>
            <div className="trip-route-map-detail" aria-live="polite">
              <strong>{activeStop.name}</strong>
              <p>{activeStop.description}</p>
              <button type="button" onClick={() => selectStop(selectedStop, true)}>Explore this destination ↗</button>
            </div>
          </div>
        </div>

        <div className="trip-ref-quote">
          <div className="trip-ref-quote-heading"><TripPlanIcon className="trip-ref-quote-icon"/><span>Plan Trip</span></div>
          <h3>Experience this northern Tanzania safari for yourself.</h3>
          <p>Speak with a local planner for a thoughtful first proposal built around your dates and priorities.</p>
          <div className="trip-ref-quote-actions">
            <a className="trip-ref-quote-button" href={quoteHref}>Request a quote <span><FigmaIcon name="detail-arrow" width={20}/></span></a>
            <a className="trip-ref-quote-question" href={whatsappHref}>Ask a question</a>
          </div>
        </div>
      </div>
    </aside>

    <div className="trip-ref-itinerary-content">
      <div className="trip-ref-itinerary-title">
        <h2>Itinerary</h2>
        <button
          className="trip-ref-itinerary-toggle"
          type="button"
          aria-expanded={allDaysOpen}
          onClick={() => setOpenDays(allDaysOpen ? new Set() : new Set(days.map((_, index) => index)))}
        >{allDaysOpen ? "Collapse All Days" : "Show All Days"}</button>
      </div>

      {days.map((day, index) => <details
        id={`day-${day.dayNumber}`}
        data-itinerary-day={day.dayNumber}
        open={openDays.has(index)}
        key={day.id}
      >
        <summary onClick={event => {event.preventDefault(); toggleDay(index);}}>
          <span className="trip-ref-day-number">Day {day.dayNumber}</span>
          <span className="trip-ref-day-dot" aria-hidden="true"/>
          <span className="trip-ref-day-name">{day.title}</span>
          <Image className="trip-ref-day-chevron" src="/itinerary-assets/itinerary-chevron.svg" alt="" width={50} height={50}/>
        </summary>
        <div className="trip-ref-day-content">
          <p className="trip-ref-day-summary">{day.summary}</p>
          {day.habitat && <dl className="trip-ref-day-facts"><div><dt>Habitat</dt><dd>{day.habitat}</dd></div></dl>}
          <div className="trip-ref-day-experience has-both">
            <figure><Image src={dayImages[index] || dayImages[0]} alt={`${day.title} safari experience`} fill sizes="(max-width: 900px) 100vw, 50vw"/></figure>
            <p className="trip-ref-day-narrative">{isNorthernCircuit ? exactStories[index] : day.activities[0]?.description}</p>
          </div>
          <ItineraryAccommodation day={day} isFinalDay={day.dayNumber === days.length}/>
          {day.dayNumber === days.length && <p className="trip-ref-dropoff-note">No overnight today. This afternoon we drive back to Arusha and drop you at your accommodation.</p>}
        </div>
      </details>)}
    </div>
  </section>;
}
