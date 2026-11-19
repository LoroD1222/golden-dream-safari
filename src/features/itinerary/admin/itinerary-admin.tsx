"use client";

import {randomUUID} from "@/features/itinerary/admin/random-id";
import type {Itinerary, ItineraryDay, ItineraryFaq, ItineraryImage, ItineraryInput, ItineraryPriceTier, ItineraryRouteStop, OptionalExperience} from "@/features/itinerary/model";
import type {AccommodationRecord} from "@/features/content/model";
import {slugify} from "@/features/itinerary/schema";
import {useMemo, useState} from "react";
import {defaultItineraryDownloadConfig, getItineraryDownloadConfig} from "@/features/itinerary/download-config";

function newDay(number: number): ItineraryDay {
  return {id: randomUUID(), dayNumber: number, title: `Day ${number}`, summary: "Add the day summary.", narrative: "Add the detailed day story.", meals: [], activities: [{id: randomUUID(), title: "Activity", description: "Add the activity details."}], accommodationIds: []};
}

function newItinerary(): ItineraryInput {
  return {slug: "new-itinerary", title: "New itinerary", summary: "Add a short public summary.", tripType: "Wildlife safari", overviewTitle: "About this safari", overviewParagraphs: [], highlights: [], galleryImages: [], routeStops: [], durationDays: 1, destinations: ["Arusha"], currency: "USD", status: "draft", days: [newDay(1)], inclusions: [], exclusions: [], onRequestItems: [], priceTiers: [], optionalExperiences: [], practicalInformation: [], packingNotes: [], bookingConditions: [], faqs: [], relatedTripSlugs: [], download: {...defaultItineraryDownloadConfig}};
}

function splitLines(value: string) { return value.split("\n").map(item => item.trim()).filter(Boolean); }
function imageLines(items: ItineraryImage[]) { return items.map(item => [item.src, item.alt, item.caption].filter(Boolean).join(" | ")).join("\n"); }
function parseImages(value: string): ItineraryImage[] { return splitLines(value).map(line => {const [src, alt, caption] = line.split("|").map(item => item.trim()); return {src, alt: alt || "Trip photo", ...(caption ? {caption} : {})};}); }
function routeLines(items: ItineraryRouteStop[]) { return items.map(item => [item.name, item.label, item.description, item.dayNumber, item.coordinates.lat, item.coordinates.lng].join(" | ")).join("\n"); }
function parseRoutes(value: string): ItineraryRouteStop[] { return splitLines(value).map(line => {const [name,label,description,dayNumber,lat,lng] = line.split("|").map(item => item.trim()); return {name,label,description,dayNumber:Number(dayNumber),coordinates:{lat:Number(lat),lng:Number(lng)}};}).filter(item => item.name && item.label && item.description && Number.isFinite(item.dayNumber) && Number.isFinite(item.coordinates.lat) && Number.isFinite(item.coordinates.lng)); }
function priceLines(items: ItineraryPriceTier[]) { return items.map(item => [item.name,item.price,item.suffix,item.description].filter((value,index) => index !== 2 || value).join(" | ")).join("\n"); }
function parsePrices(value: string): ItineraryPriceTier[] { return splitLines(value).map(line => {const parts = line.split("|").map(item => item.trim()); const [name,price] = parts; const hasSuffix = parts.length > 3; const suffix = hasSuffix ? parts[2] : undefined; const description = hasSuffix ? parts.slice(3).join(" | ") : parts.slice(2).join(" | "); return {name,price,...(suffix ? {suffix} : {}),description};}).filter(item => item.name && item.price && item.description); }
function experienceLines(items: OptionalExperience[]) { return items.map(item => [item.name,item.price,item.note].join(" | ")).join("\n"); }
function parseExperiences(value: string): OptionalExperience[] { return splitLines(value).map(line => {const [name,price,...rest] = line.split("|").map(item => item.trim()); return {name,price,note:rest.join(" | ")};}).filter(item => item.name && item.price && item.note); }
function faqLines(items: ItineraryFaq[]) { return items.map(item => [item.question,item.answer].join(" | ")).join("\n"); }
function parseFaqs(value: string): ItineraryFaq[] { return splitLines(value).map(line => {const [question,...rest] = line.split("|").map(item => item.trim()); return {question,answer:rest.join(" | ")};}).filter(item => item.question && item.answer); }

export function ItineraryAdmin({initialItems, initialAccommodations, storageLabel}: {initialItems: Itinerary[]; initialAccommodations: AccommodationRecord[]; storageLabel: string}) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | "new">(initialItems[0]?.id || "new");
  const selected = useMemo(() => items.find(item => item.id === selectedId), [items, selectedId]);
  const [draft, setDraft] = useState<ItineraryInput>(() => selected ? toInput(selected) : newItinerary());
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function select(item: Itinerary | null) {
    setSelectedId(item?.id || "new");
    setDraft(item ? toInput(item) : newItinerary());
    setStatus("");
  }

  async function save() {
    setSaving(true); setStatus("");
    try {
      const isNew = selectedId === "new";
      const response = await fetch(isNew ? "/api/itineraries" : `/api/itineraries/${selectedId}`, {method: isNew ? "POST" : "PUT", headers: {"content-type": "application/json"}, body: JSON.stringify(draft)});
      const payload = await response.json() as Itinerary | {message?: string};
      if (!response.ok || !("id" in payload)) {setStatus("message" in payload ? payload.message || "Could not save." : "Could not save."); return;}
      setItems(current => isNew ? [payload, ...current] : current.map(item => item.id === payload.id ? payload : item));
      setSelectedId(payload.id); setDraft(toInput(payload)); setStatus(`Saved to ${storageLabel}.`);
    } catch {
      setStatus("Could not reach the itinerary API. Your changes have not been saved.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (selectedId === "new" || !window.confirm("Delete this itinerary? This cannot be undone.")) return;
    try {
      const response = await fetch(`/api/itineraries/${selectedId}`, {method: "DELETE"});
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as {message?: string} | null;
        setStatus(payload?.message || "Could not delete the itinerary."); return;
      }
      const next = items.filter(item => item.id !== selectedId); setItems(next); select(next[0] || null);
    } catch {
      setStatus("Could not reach the itinerary API. Nothing was deleted.");
    }
  }

  function updateDay(index: number, patch: Partial<ItineraryDay>) {
    setDraft(current => ({...current, days: current.days.map((day, dayIndex) => dayIndex === index ? {...day, ...patch} : day)}));
  }

  return <div className="admin-shell">
    <aside className="admin-list"><button className="button button--orange" type="button" onClick={() => select(null)}>+ New itinerary</button>{items.map(item => <button className={item.id === selectedId ? "is-active" : ""} type="button" key={item.id} onClick={() => select(item)}><strong>{item.title}</strong><span>{item.status} · {item.days.length} days</span></button>)}</aside>
    <section className="admin-editor">
      <div className="admin-actions"><div><span>{selectedId === "new" ? "Create" : "Editing"}</span><h2>{draft.title}</h2></div><div><button className="button button--outline" type="button" onClick={remove} disabled={selectedId === "new"}>Delete</button><button className="button button--orange" type="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save itinerary"}</button></div></div>
      {status && <p className="admin-status" role="status">{status}</p>}
      <div className="admin-form-grid">
        <label>Title<input value={draft.title} onChange={e => setDraft({...draft, title: e.target.value, slug: selectedId === "new" ? slugify(e.target.value) : draft.slug})}/></label>
        <label>Slug<input value={draft.slug} onChange={e => setDraft({...draft, slug: slugify(e.target.value)})}/></label>
        <label className="span-2">Summary<textarea value={draft.summary} onChange={e => setDraft({...draft, summary: e.target.value})}/></label>
        <label>Destinations (comma-separated)<input value={draft.destinations.join(", ")} onChange={e => setDraft({...draft, destinations: e.target.value.split(",").map(value => value.trim()).filter(Boolean)})}/></label>
        <label>Hero image path<input value={draft.heroImage || ""} onChange={e => setDraft({...draft, heroImage: e.target.value || undefined})}/></label>
        <label>Starting price<input type="number" min="0" value={draft.startingPrice ?? ""} onChange={e => setDraft({...draft, startingPrice: e.target.value ? Number(e.target.value) : undefined})}/></label>
        <label>Trip type<select value={draft.tripType || ""} onChange={e => setDraft({...draft, tripType: e.target.value ? e.target.value as ItineraryInput["tripType"] : undefined})}><option value="">Choose a type</option><option>Wildlife safari</option><option>Kilimanjaro trek</option><option>Mount Meru trek</option><option>Zanzibar stay</option><option>Day trip</option></select></label>
        <label>Route family<input value={draft.routeFamily || ""} onChange={e => setDraft({...draft, routeFamily: e.target.value || undefined})} placeholder="Lemosho Route"/></label>
        <label>Travel style<input value={draft.travelStyle || ""} onChange={e => setDraft({...draft, travelStyle: e.target.value || undefined})}/></label>
        <label>Status<select value={draft.status} onChange={e => setDraft({...draft, status: e.target.value as ItineraryInput["status"]})}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      </div>
      <div className="admin-day"><div className="admin-days-heading"><div><span>Public page</span><h2>Overview, gallery and route</h2></div></div><div className="admin-form-grid">
        <label>Overview heading<input value={draft.overviewTitle || ""} onChange={e => setDraft({...draft, overviewTitle: e.target.value || undefined})}/></label>
        <label>Related trip slugs<input value={(draft.relatedTripSlugs || []).join(", ")} onChange={e => setDraft({...draft, relatedTripSlugs: e.target.value.split(",").map(value => slugify(value)).filter(Boolean)})}/></label>
        <label className="span-2">Overview paragraphs <small>One paragraph per line</small><textarea value={(draft.overviewParagraphs || []).join("\n")} onChange={e => setDraft({...draft, overviewParagraphs: splitLines(e.target.value)})}/></label>
        <label className="span-2">Highlights <small>One highlight per line</small><textarea value={(draft.highlights || []).join("\n")} onChange={e => setDraft({...draft, highlights: splitLines(e.target.value)})}/></label>
        <label className="span-2">Gallery images <small>One per line: path | alt text | caption</small><textarea value={imageLines(draft.galleryImages || [])} onChange={e => setDraft({...draft, galleryImages: parseImages(e.target.value)})}/></label>
        <label className="span-2">Route stops <small>One per line: name | label | description | day number | latitude | longitude</small><textarea value={routeLines(draft.routeStops || [])} onChange={e => setDraft({...draft, routeStops: parseRoutes(e.target.value)})}/></label>
      </div></div>
      {draft.download && <div className="admin-day"><div className="admin-days-heading"><div><span>Trip download</span><h2>PDF and enquiry wording</h2></div><label><input type="checkbox" checked={draft.download.enabled} onChange={e => setDraft({...draft, download: {...draft.download!, enabled: e.target.checked}})}/> Enable PDF download</label></div><div className="admin-form-grid">
        <label>Download button label<input value={draft.download.buttonLabel} onChange={e => setDraft({...draft, download: {...draft.download!, buttonLabel: e.target.value}})}/></label>
        <label>Mobile prompt title<input value={draft.download.mobileTitle} onChange={e => setDraft({...draft, download: {...draft.download!, mobileTitle: e.target.value}})}/></label>
        <label className="span-2">Mobile prompt description<textarea value={draft.download.mobileDescription} onChange={e => setDraft({...draft, download: {...draft.download!, mobileDescription: e.target.value}})}/></label>
        <label className="span-2">Locked form message<textarea value={draft.download.lockedMessage} onChange={e => setDraft({...draft, download: {...draft.download!, lockedMessage: e.target.value}})}/></label>
        <label>Success message<textarea value={draft.download.successMessage} onChange={e => setDraft({...draft, download: {...draft.download!, successMessage: e.target.value}})}/></label>
        <label>Error message<textarea value={draft.download.errorMessage} onChange={e => setDraft({...draft, download: {...draft.download!, errorMessage: e.target.value}})}/></label>
        <label>PDF company name<input value={draft.download.companyName} onChange={e => setDraft({...draft, download: {...draft.download!, companyName: e.target.value}})}/></label>
        <label>PDF logo path<input value={draft.download.companyLogo || ""} onChange={e => setDraft({...draft, download: {...draft.download!, companyLogo: e.target.value || undefined}})}/></label>
        <label className="span-2">PDF company description<textarea value={draft.download.companyDescription} onChange={e => setDraft({...draft, download: {...draft.download!, companyDescription: e.target.value}})}/></label>
        <label>PDF contact email<input type="email" value={draft.download.contactEmail} onChange={e => setDraft({...draft, download: {...draft.download!, contactEmail: e.target.value}})}/></label>
        <label>PDF contact phone<input value={draft.download.contactPhone} onChange={e => setDraft({...draft, download: {...draft.download!, contactPhone: e.target.value}})}/></label>
        <label>PDF contact location<input value={draft.download.contactLocation} onChange={e => setDraft({...draft, download: {...draft.download!, contactLocation: e.target.value}})}/></label>
        <label>PDF website<input value={draft.download.contactWebsite || ""} onChange={e => setDraft({...draft, download: {...draft.download!, contactWebsite: e.target.value || undefined}})}/></label>
        <label>PDF WhatsApp<input value={draft.download.contactWhatsApp || ""} onChange={e => setDraft({...draft, download: {...draft.download!, contactWhatsApp: e.target.value || undefined}})}/></label>
      </div></div>}
      <div className="admin-days-heading"><div><span>Day management</span><h2>{draft.days.length} itinerary days</h2></div><button className="button button--outline" type="button" onClick={() => setDraft({...draft, durationDays: draft.days.length + 1, days: [...draft.days, newDay(draft.days.length + 1)]})}>+ Add day</button></div>
      <div className="admin-days">{draft.days.map((day, dayIndex) => <article className="admin-day" key={day.id}>
        <div className="admin-day__top"><strong>Day {day.dayNumber}</strong><button type="button" disabled={draft.days.length === 1} onClick={() => setDraft({...draft, durationDays: draft.days.length - 1, days: draft.days.filter((_, index) => index !== dayIndex).map((item, index) => ({...item, dayNumber: index + 1}))})}>Remove day</button></div>
        <label>Day title<input value={day.title} onChange={e => updateDay(dayIndex, {title: e.target.value})}/></label>
        <label>Summary<textarea value={day.summary} onChange={e => updateDay(dayIndex, {summary: e.target.value})}/></label>
        <label>Detailed day narrative<textarea value={day.narrative || ""} onChange={e => updateDay(dayIndex, {narrative: e.target.value || undefined})}/></label>
        <div className="admin-form-grid"><label>Habitat<input value={day.habitat || ""} onChange={e => updateDay(dayIndex, {habitat: e.target.value || undefined})}/></label><label>Meals (comma-separated)<input value={day.meals.join(", ")} onChange={e => updateDay(dayIndex, {meals: e.target.value.split(",").map(value => value.trim()).filter(Boolean)})}/></label><label>Driving or hiking time<input value={day.driveTime || ""} onChange={e => updateDay(dayIndex, {driveTime: e.target.value || undefined})}/></label><label>Distance<input value={day.distance || ""} onChange={e => updateDay(dayIndex, {distance: e.target.value || undefined})}/></label><label>Activity level<input value={day.activityLevel || ""} onChange={e => updateDay(dayIndex, {activityLevel: e.target.value || undefined})}/></label></div>
        <div className="admin-form-grid"><label>Day image path<input value={day.image || ""} onChange={e => updateDay(dayIndex, {image: e.target.value || undefined})}/></label><label>Day image alt text<input value={day.imageAlt || ""} onChange={e => updateDay(dayIndex, {imageAlt: e.target.value || undefined})}/></label></div>
        <label>Drop-off note (final day)<textarea value={day.dropOffNote || ""} onChange={e => updateDay(dayIndex, {dropOffNote: e.target.value || undefined})}/></label>
        <div className="admin-subheading"><h3>Accommodation options</h3><span>Choose reusable properties from Accommodations.</span></div>
        <div className="cms-check-grid">{initialAccommodations.filter(item => item.status !== "archived").map(item => <label key={item.id}><input type="checkbox" checked={(day.accommodationIds || []).includes(item.id)} onChange={() => updateDay(dayIndex, {accommodationIds: (day.accommodationIds || []).includes(item.id) ? (day.accommodationIds || []).filter(id => id !== item.id) : [...(day.accommodationIds || []), item.id]})}/><span><strong>{item.category}</strong><br/>{item.name} · {item.location}</span></label>)}</div>
        <h3>Activities</h3>{day.activities.map((activity, activityIndex) => <div className="admin-activity" key={activity.id}>
          <label>Activity title<input value={activity.title} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, title: e.target.value} : item)})}/></label>
          <label>Description<textarea value={activity.description} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, description: e.target.value} : item)})}/></label>
          <div className="admin-form-grid"><label>Time (optional)<input value={activity.time || ""} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, time: e.target.value || undefined} : item)})}/></label><label>Location (optional)<input value={activity.location || ""} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, location: e.target.value || undefined} : item)})}/></label></div>
          <button type="button" onClick={() => updateDay(dayIndex, {activities: day.activities.filter((_, index) => index !== activityIndex)})}>Remove activity</button>
        </div>)}
        <button className="text-action" type="button" onClick={() => updateDay(dayIndex, {activities: [...day.activities, {id: randomUUID(), title: "New activity", description: "Add details."}]})}>+ Add activity</button>
      </article>)}</div>
      <div className="admin-days-heading"><div><span>Trip content</span><h2>Price, inclusions and travel information</h2></div></div>
      <div className="admin-form-grid admin-lists">
        <label>Inclusions (one per line)<textarea value={draft.inclusions.join("\n")} onChange={e => setDraft({...draft, inclusions: splitLines(e.target.value)})}/></label>
        <label>Exclusions (one per line)<textarea value={draft.exclusions.join("\n")} onChange={e => setDraft({...draft, exclusions: splitLines(e.target.value)})}/></label>
        <label className="span-2">Available on request (one per line)<textarea value={(draft.onRequestItems || []).join("\n")} onChange={e => setDraft({...draft, onRequestItems: splitLines(e.target.value)})}/></label>
        <label className="span-2">Price introduction<textarea value={draft.priceIntroduction || ""} onChange={e => setDraft({...draft, priceIntroduction: e.target.value || undefined})}/></label>
        <label className="span-2">Price tiers <small>One per line: name | price | optional suffix | description</small><textarea value={priceLines(draft.priceTiers || [])} onChange={e => setDraft({...draft, priceTiers: parsePrices(e.target.value)})}/></label>
        <label className="span-2">Optional experiences <small>One per line: name | price | note</small><textarea value={experienceLines(draft.optionalExperiences || [])} onChange={e => setDraft({...draft, optionalExperiences: parseExperiences(e.target.value)})}/></label>
        <label>Practical information (one per line)<textarea value={(draft.practicalInformation || []).join("\n")} onChange={e => setDraft({...draft, practicalInformation: splitLines(e.target.value)})}/></label>
        <label>Packing notes (one per line)<textarea value={(draft.packingNotes || []).join("\n")} onChange={e => setDraft({...draft, packingNotes: splitLines(e.target.value)})}/></label>
        <label className="span-2">Booking conditions (one per line)<textarea value={(draft.bookingConditions || []).join("\n")} onChange={e => setDraft({...draft, bookingConditions: splitLines(e.target.value)})}/></label>
        <label className="span-2">Trip FAQs <small>One per line: question | answer</small><textarea value={faqLines(draft.faqs || [])} onChange={e => setDraft({...draft, faqs: parseFaqs(e.target.value)})}/></label>
      </div>
    </section>
  </div>;
}

function toInput(item: Itinerary): ItineraryInput {
  const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
  void _id; void _createdAt; void _updatedAt;
  return {...input, download: getItineraryDownloadConfig(item), overviewTitle: item.overviewTitle || "About this safari", overviewParagraphs: item.overviewParagraphs || [], highlights: item.highlights || [], galleryImages: item.galleryImages || [], routeStops: item.routeStops || [], onRequestItems: item.onRequestItems || [], priceTiers: item.priceTiers || [], optionalExperiences: item.optionalExperiences || [], practicalInformation: item.practicalInformation || [], packingNotes: item.packingNotes || [], bookingConditions: item.bookingConditions || [], faqs: item.faqs || [], relatedTripSlugs: item.relatedTripSlugs || [], days: item.days.map(day => ({...day, accommodationIds: day.accommodationIds || []}))};
}
