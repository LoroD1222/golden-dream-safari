"use client";

import Image from "next/image";
import {useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";
import {ItineraryAccommodation} from "@/components/itinerary-accommodation";
import {SafariRouteMap} from "@/components/safari-route-map";
import type {ItineraryDay, ItineraryRouteStop} from "@/features/itinerary/model";
import {northernCircuitRouteStops} from "@/features/itinerary/route-data";
import {TripPlanIcon} from "@/components/trip-icons";
import type {StayOption} from "@/features/itinerary/trip-supplements";

const fallbackDayImages = ["/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png", "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png", "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png", "/images/figma/66d4cce3-2303-4bdf-a3b9-8d8f56ab67de.png"];

export function InteractiveItinerary({
  days,
  routeStops: providedRouteStops,
  staysByDay,
  quoteHref,
  whatsappHref,
  tripType = "Wildlife safari",
}: {
  days: ItineraryDay[];
  routeStops?: ItineraryRouteStop[];
  staysByDay?: Record<number, StayOption[]>;
  quoteHref: string;
  whatsappHref: string;
  tripType?: string;
}) {
  const isMountainTrek = tripType === "Kilimanjaro trek" || tripType === "Mount Meru trek";
  const isDayTrip = tripType === "Day trip";
  const routeStops = providedRouteStops?.length ? providedRouteStops : northernCircuitRouteStops;
  const [selectedStop, setSelectedStop] = useState(routeStops.length > 1 ? 1 : 0);
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set([0]));
  const activeStop = routeStops[selectedStop];
  const allDaysOpen = days.length > 0 && openDays.size === days.length;

  function selectStop(index: number) {
    setSelectedStop(index);
  }

  function toggleDay(index: number) {
    setOpenDays(current => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    const stopIndex = routeStops.findIndex(stop => stop.dayNumber === days[index].dayNumber);
    setSelectedStop(stopIndex >= 0 ? stopIndex : 0);
  }

  return <section className="trip-ref-itinerary section-shell" id="itinerary">
    <aside aria-label={`Interactive ${isMountainTrek ? "mountain" : isDayTrip ? "day trip" : "safari"} route`}>
      <div className="trip-ref-itinerary-sticky">
        <div className="trip-route-map-card">
          <div className="trip-route-map-canvas">
            <SafariRouteMap stops={routeStops} selectedIndex={selectedStop} onSelect={setSelectedStop} onExplore={selectStop}/>
          </div>
          <div className="trip-route-map-stops">
            <p className="trip-route-map-kicker">Your route</p>
            <ol>{routeStops.map((stop, index) => <li key={`${stop.name}-${stop.label}-${index}`}>
              <button
                type="button"
                className={selectedStop === index ? "is-active" : ""}
                aria-pressed={selectedStop === index}
                onClick={() => selectStop(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stop.name}</strong>
                <small>{stop.label}</small>
              </button>
            </li>)}</ol>
            <div className="trip-route-map-detail" aria-live="polite">
              <strong>{activeStop.name}</strong>
              <p>{activeStop.description}</p>
              <button type="button" onClick={() => selectStop(selectedStop)}>View on map ↗</button>
            </div>
          </div>
        </div>

        <div className="trip-ref-quote">
          <div className="trip-ref-quote-heading"><TripPlanIcon className="trip-ref-quote-icon"/><span>Plan Trip</span></div>
          <h3>{isMountainTrek ? "Climb with a local mountain team." : isDayTrip ? "Plan a private day around your Tanzania stay." : "Experience this northern Tanzania safari for yourself."}</h3>
          <p>{isMountainTrek ? "Tell Victor your preferred route and dates. We’ll confirm the climb, equipment guidance and support around your plans." : isDayTrip ? "Tell Victor your date, hotel and group size. We’ll confirm the timing, pickup and final price." : "Speak with a local planner for a thoughtful first proposal built around your dates and priorities."}</p>
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
            <figure><Image src={day.image || fallbackDayImages[index] || fallbackDayImages[0]} alt={day.imageAlt || `${day.title} safari experience`} fill sizes="(max-width: 900px) 100vw, 50vw"/></figure>
            <p className="trip-ref-day-narrative">{day.narrative || day.activities[0]?.description}</p>
          </div>
          <ItineraryAccommodation day={day} options={staysByDay?.[day.dayNumber] || []} isFinalDay={day.dayNumber === days.length}/>
          {day.dayNumber === days.length && <p className="trip-ref-dropoff-note">{day.dropOffNote || "No overnight today. This afternoon we drive back to Arusha and drop you at your accommodation."}</p>}
        </div>
      </details>)}
    </div>
  </section>;
}
