"use client";

import {randomUUID} from "@/features/itinerary/admin/random-id";
import type {Itinerary, ItineraryDay, ItineraryInput} from "@/features/itinerary/model";
import {slugify} from "@/features/itinerary/schema";
import {useMemo, useState} from "react";
import {defaultItineraryDownloadConfig, getItineraryDownloadConfig} from "@/features/itinerary/download-config";

function newDay(number: number): ItineraryDay {
  return {id: randomUUID(), dayNumber: number, title: `Day ${number}`, summary: "Add the day summary.", meals: [], activities: [{id: randomUUID(), title: "Activity", description: "Add the activity details."}]};
}

function newItinerary(): ItineraryInput {
  return {slug: "new-itinerary", title: "New itinerary", summary: "Add a short public summary.", durationDays: 1, destinations: ["Arusha"], currency: "USD", status: "draft", days: [newDay(1)], inclusions: [], exclusions: [], practicalInformation: [], download: {...defaultItineraryDownloadConfig}};
}

export function ItineraryAdmin({initialItems, storageLabel}: {initialItems: Itinerary[]; storageLabel: string}) {
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
        <label>Travel style<input value={draft.travelStyle || ""} onChange={e => setDraft({...draft, travelStyle: e.target.value || undefined})}/></label>
        <label>Status<select value={draft.status} onChange={e => setDraft({...draft, status: e.target.value as ItineraryInput["status"]})}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      </div>
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
        <div className="admin-form-grid"><label>Habitat<input value={day.habitat || ""} onChange={e => updateDay(dayIndex, {habitat: e.target.value})}/></label><label>Meals (comma-separated)<input value={day.meals.join(", ")} onChange={e => updateDay(dayIndex, {meals: e.target.value.split(",").map(value => value.trim()).filter(Boolean)})}/></label></div>
        <label>Day image path<input value={day.image || ""} onChange={e => updateDay(dayIndex, {image: e.target.value || undefined})}/></label>
        <h3>Activities</h3>{day.activities.map((activity, activityIndex) => <div className="admin-activity" key={activity.id}>
          <label>Activity title<input value={activity.title} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, title: e.target.value} : item)})}/></label>
          <label>Description<textarea value={activity.description} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, description: e.target.value} : item)})}/></label>
          <div className="admin-form-grid"><label>Time (optional)<input value={activity.time || ""} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, time: e.target.value || undefined} : item)})}/></label><label>Location (optional)<input value={activity.location || ""} onChange={e => updateDay(dayIndex, {activities: day.activities.map((item, index) => index === activityIndex ? {...item, location: e.target.value || undefined} : item)})}/></label></div>
          <button type="button" onClick={() => updateDay(dayIndex, {activities: day.activities.filter((_, index) => index !== activityIndex)})}>Remove activity</button>
        </div>)}
        <button className="text-action" type="button" onClick={() => updateDay(dayIndex, {activities: [...day.activities, {id: randomUUID(), title: "New activity", description: "Add details."}]})}>+ Add activity</button>
        <div className="admin-subheading"><h3>Accommodation</h3>{day.accommodation ? <button type="button" onClick={() => updateDay(dayIndex, {accommodation: undefined})}>Remove accommodation</button> : <button type="button" onClick={() => updateDay(dayIndex, {accommodation: {name: "To be confirmed", category: "Other", location: "To be confirmed", description: "Accommodation details to be confirmed."}})}>+ Add accommodation</button>}</div>
        {day.accommodation && <div className="admin-form-grid"><label>Name<input value={day.accommodation.name} onChange={e => updateDay(dayIndex, {accommodation: {...day.accommodation!, name: e.target.value}})}/></label><label>Category<select value={day.accommodation.category} onChange={e => updateDay(dayIndex, {accommodation: {...day.accommodation!, category: e.target.value as NonNullable<ItineraryDay["accommodation"]>["category"]}})}><option>Group camping</option><option>Mid-range lodge</option><option>Private luxury</option><option>Other</option></select></label><label>Location<input value={day.accommodation.location} onChange={e => updateDay(dayIndex, {accommodation: {...day.accommodation!, location: e.target.value}})}/></label><label>Image path (optional)<input value={day.accommodation.image || ""} onChange={e => updateDay(dayIndex, {accommodation: {...day.accommodation!, image: e.target.value || undefined}})}/></label><label className="span-2">Description<textarea value={day.accommodation.description} onChange={e => updateDay(dayIndex, {accommodation: {...day.accommodation!, description: e.target.value}})}/></label></div>}
      </article>)}</div>
      <div className="admin-form-grid admin-lists"><label>Inclusions (one per line)<textarea value={draft.inclusions.join("\n")} onChange={e => setDraft({...draft, inclusions: e.target.value.split("\n").map(value => value.trim()).filter(Boolean)})}/></label><label>Exclusions (one per line)<textarea value={draft.exclusions.join("\n")} onChange={e => setDraft({...draft, exclusions: e.target.value.split("\n").map(value => value.trim()).filter(Boolean)})}/></label><label className="span-2">Practical information (one per line)<textarea value={(draft.practicalInformation || []).join("\n")} onChange={e => setDraft({...draft, practicalInformation: e.target.value.split("\n").map(value => value.trim()).filter(Boolean)})}/></label></div>
    </section>
  </div>;
}

function toInput(item: Itinerary): ItineraryInput {
  const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = item;
  void _id; void _createdAt; void _updatedAt;
  return {...input, download: getItineraryDownloadConfig(item), practicalInformation: item.practicalInformation || []};
}
