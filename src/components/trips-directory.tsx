"use client";

import Image from "next/image";
import Link from "next/link";
import {Fragment, type ReactNode, useMemo, useState} from "react";
import {otherTrips, wildlifeTrips, type TripCardData} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";

const tabs = ["All trips", "Wildlife safaris", "Kilimanjaro", "Mount Meru", "Zanzibar", "Day trips"];

export function TripsDirectory() {
  const [active, setActive] = useState("All trips");
  const [sort, setSort] = useState("shortest");
  const visibleWildlife = useMemo(() => {
    if (active === "All trips") return wildlifeTrips;
    if (active === "Wildlife safaris") return wildlifeTrips.filter(trip => trip.category === "Wildlife safari");
    if (active === "Day trips") return wildlifeTrips.filter(trip => trip.category === "Day trip");
    return [];
  }, [active]);
  const visibleOther = useMemo(() => {
    const matching = active === "All trips" ? otherTrips : otherTrips.filter(trip => trip.title.toLowerCase().includes(active.toLowerCase()));
    return [...matching].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (parseInt(a.duration) || 999) - (parseInt(b.duration) || 999));
  }, [active, sort]);
  // The Figma frame defines the curated default order. Keep that order for the
  // default view and only reorder when the visitor explicitly selects A–Z.
  const sorted = sort === "title" ? [...visibleWildlife].sort((a,b) => a.title.localeCompare(b.title)) : visibleWildlife;

  return <section className="trips-directory section-shell"><div className="trips-filters"><div>{tabs.map(tab => <button className={active === tab ? "is-active" : ""} type="button" aria-pressed={active === tab} key={tab} onClick={() => setActive(tab)}>{tab}</button>)}</div><label>Sort:<select value={sort} onChange={event => setSort(event.target.value)}><option value="shortest">Shortest first</option><option value="title">A–Z</option></select></label></div>
    {sorted.length > 0 && <TripGroup title="Wildlife safaris" count={sorted.length} trips={sorted} accessory={active === "All trips" ? <div className="mix-card trips-mix-card"><Image src="/images/figma/de18e2f3-87a7-428d-b5b9-b36080db459b.png" alt="Zebra on the plains" fill sizes="33vw"/><div><span>Mix & match</span><h2>Duration of your choice</h2><p>Choose the length of your safari and the parks you want to visit. We&apos;ll make a proposal that fits, with no strings attached.</p><Link className="button button--orange" href="/contact#quote">Get a free quote<span className="button__arrow"><FigmaIcon name="arrow-header" width={20}/></span></Link></div></div> : undefined}/>} 
    {visibleOther.length > 0 && <TripGroup title="Treks & Zanzibar" count={visibleOther.length} trips={visibleOther} id="treks-zanzibar"/>}
    {sorted.length === 0 && visibleOther.length === 0 && <p className="trips-empty">No trips match this category yet. Ask us to build one for you.</p>}
  </section>;
}

function TripGroup({title, count, trips, id, accessory}: {title: string; count: number; trips: TripCardData[]; id?: string; accessory?: ReactNode}) {
  return <div className="trip-group" id={id}><h2>{title} <small>{count} trips</small></h2><div className="trip-card-grid">{trips.map((trip,index) => <Fragment key={trip.slug}>{index === 3 && accessory}<article className="trip-directory-card"><div><Image src={trip.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw"/><span>{trip.duration}</span></div><small>{trip.category}</small><h3>{trip.title}</h3><p><FigmaIcon name="pin-card" width={16}/>{trip.locations}</p><footer><strong>{trip.price}</strong><Link href={trip.slug === "tarangire-serengeti-ngorongoro" ? `/trips/${trip.slug}` : `/contact?trip=${trip.slug}#quote`}>{trip.slug === "tarangire-serengeti-ngorongoro" ? "View trip" : "Ask about trip"}<FigmaIcon name="arrow-card" width={18}/></Link></footer></article></Fragment>)}</div></div>;
}
