"use client";

import Image from "next/image";
import Link from "next/link";
import {Fragment, type ReactNode, useMemo, useState} from "react";
import {otherTrips, wildlifeTrips, type TripCardData} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";

const tabs = ["All trips", "Wildlife safaris", "Kilimanjaro", "Mount Meru", "Zanzibar", "Day trips"];

export function TripsDirectory({kilimanjaroTrips = [], safariItineraryTrips = [], itinerarySlugs = []}: {kilimanjaroTrips?: TripCardData[]; safariItineraryTrips?: TripCardData[]; itinerarySlugs?: string[]}) {
  const [active, setActive] = useState("All trips");
  const [sort, setSort] = useState("shortest");
  const allWildlife = useMemo(() => {
    return safariItineraryTrips.length ? safariItineraryTrips : wildlifeTrips;
  }, [safariItineraryTrips]);
  const visibleWildlife = useMemo(() => {
    if (active === "All trips") return allWildlife;
    if (active === "Wildlife safaris") return allWildlife.filter(trip => trip.category === "Wildlife safari");
    if (active === "Day trips") return allWildlife.filter(trip => trip.category === "Day trip");
    return [];
  }, [active, allWildlife]);
  const visibleOther = useMemo(() => {
    const matching = active === "Kilimanjaro"
      ? kilimanjaroTrips
      : active === "All trips"
        ? [...kilimanjaroTrips, ...otherTrips.filter(trip => trip.slug !== "kilimanjaro-trek")]
        : otherTrips.filter(trip => trip.title.toLowerCase().includes(active.toLowerCase()));
    return [...matching].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (parseInt(a.duration) || 999) - (parseInt(b.duration) || 999));
  }, [active, kilimanjaroTrips, sort]);
  const sorted = [...visibleWildlife].sort((a, b) => sort === "title"
    ? a.title.localeCompare(b.title)
    : (a.category === "Day trip" ? 1 : parseInt(a.duration) || 999) - (b.category === "Day trip" ? 1 : parseInt(b.duration) || 999));

  return <section className="trips-directory section-shell"><div className="trips-filters"><div>{tabs.map(tab => <button className={active === tab ? "is-active" : ""} type="button" aria-pressed={active === tab} key={tab} onClick={() => setActive(tab)}>{tab}</button>)}</div><label>Sort:<select value={sort} onChange={event => setSort(event.target.value)}><option value="shortest">Shortest first</option><option value="title">A–Z</option></select></label></div>
    {sorted.length > 0 && <TripGroup title={active === "All trips" ? "Safaris & day trips" : active} count={sorted.length} trips={sorted} itinerarySlugs={itinerarySlugs} accessory={active === "All trips" ? <div className="mix-card trips-mix-card"><Image src="/images/figma/de18e2f3-87a7-428d-b5b9-b36080db459b.png" alt="Zebra on the plains" fill sizes="33vw"/><div><span>Mix & match</span><h2>Duration of your choice</h2><p>Choose the length of your safari and the parks you want to visit. We&apos;ll make a proposal that fits, with no strings attached.</p><Link className="button button--orange" href="/contact#quote">Get a free quote<span className="button__arrow"><FigmaIcon name="arrow-header" width={20}/></span></Link></div></div> : undefined}/>}
    {visibleOther.length > 0 && <TripGroup title={active === "Kilimanjaro" ? "Kilimanjaro routes" : "Treks & Zanzibar"} count={visibleOther.length} trips={visibleOther} id="treks-zanzibar" itinerarySlugs={kilimanjaroTrips.map(trip => trip.slug)}/>}
    {sorted.length === 0 && visibleOther.length === 0 && <p className="trips-empty">No trips match this category yet. Ask us to build one for you.</p>}
  </section>;
}

function TripGroup({title, count, trips, id, accessory, itinerarySlugs = []}: {title: string; count: number; trips: TripCardData[]; id?: string; accessory?: ReactNode; itinerarySlugs?: string[]}) {
  return <div className="trip-group" id={id}><h2>{title} <small>{count} trips</small></h2><div className="trip-card-grid">{trips.map((trip,index) => { const hasItinerary = itinerarySlugs.includes(trip.slug); const isFirstDayTrip = trip.category === "Day trip" && !trips.slice(0, index).some(item => item.category === "Day trip"); return <Fragment key={trip.slug}>{index === 3 && accessory}<article className="trip-directory-card" id={isFirstDayTrip ? "day-trips" : undefined}><div><Image src={trip.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw"/><span>{trip.duration}</span></div><small>{trip.category}</small><h3>{trip.title}</h3><p><FigmaIcon name="pin-card" width={16}/>{trip.locations}</p><footer><strong>{trip.price}</strong><Link href={hasItinerary ? `/trips/${trip.slug}` : `/contact?trip=${trip.slug}#quote`}>{hasItinerary ? "View trip" : "Ask about trip"}<FigmaIcon name="arrow-card" width={18}/></Link></footer></article></Fragment>;})}</div></div>;
}
