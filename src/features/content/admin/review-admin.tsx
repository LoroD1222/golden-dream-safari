"use client";

import {useMemo, useState} from "react";
import type {Review, ReviewCategory, ReviewInput} from "@/features/content/model";

type TripChoice = {slug: string; title: string};

function newReview(order: number): ReviewInput {
  return {title: "New guest review", quote: "Add the guest review.", rating: 5, author: "Guest name", meta: "Travel date · Traveller type", source: "Tripadvisor", translated: false, categoryIds: [], tripSlugs: [], images: [], verified: true, featuredOnHomepage: false, featuredOnTripPages: false, status: "draft", order};
}

function toInput(review: Review): ReviewInput {
  const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input} = review;
  void _id; void _createdAt; void _updatedAt;
  return input;
}

function parseImages(value: string) {
  return value.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const [src, alt, caption] = line.split("|").map(item => item.trim());
    return {src, alt: alt || "Guest review photo", ...(caption ? {caption} : {})};
  });
}

function imageLines(images: ReviewInput["images"]) { return images.map(image => [image.src, image.alt, image.caption].filter(Boolean).join(" | ")).join("\n"); }

export function ReviewAdmin({initialReviews, categories, trips}: {initialReviews: Review[]; categories: ReviewCategory[]; trips: TripChoice[]}) {
  const [items, setItems] = useState(initialReviews);
  const [selectedId, setSelectedId] = useState<string | "new">(initialReviews[0]?.id || "new");
  const selected = items.find(item => item.id === selectedId);
  const [draft, setDraft] = useState<ReviewInput>(() => selected ? toInput(selected) : newReview(initialReviews.length * 10 + 10));
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const visible = useMemo(() => items.filter(item => `${item.author} ${item.title} ${item.source}`.toLowerCase().includes(query.toLowerCase())), [items, query]);

  function select(item: Review | null) {
    setSelectedId(item?.id || "new");
    setDraft(item ? toInput(item) : newReview(items.length * 10 + 10));
    setMessage("");
  }

  async function save() {
    setSaving(true); setMessage("");
    try {
      const isNew = selectedId === "new";
      const response = await fetch(isNew ? "/api/reviews" : `/api/reviews/${selectedId}`, {method: isNew ? "POST" : "PUT", headers: {"content-type": "application/json"}, body: JSON.stringify(draft)});
      const payload = await response.json() as Review | {message?: string};
      if (!response.ok || !("id" in payload)) { setMessage("message" in payload ? payload.message || "Could not save review." : "Could not save review."); return; }
      setItems(current => isNew ? [...current, payload] : current.map(item => item.id === payload.id ? payload : item));
      setSelectedId(payload.id); setDraft(toInput(payload)); setMessage("Review saved.");
    } catch { setMessage("Could not reach the review API."); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (selectedId === "new" || !window.confirm("Delete this review?")) return;
    const response = await fetch(`/api/reviews/${selectedId}`, {method: "DELETE"});
    if (!response.ok) { setMessage("Could not delete the review."); return; }
    const next = items.filter(item => item.id !== selectedId); setItems(next); select(next[0] || null);
  }

  function toggleCategory(id: string) {
    setDraft(current => ({...current, categoryIds: current.categoryIds.includes(id) ? current.categoryIds.filter(item => item !== id) : [...current.categoryIds, id]}));
  }

  function toggleTrip(slug: string) {
    setDraft(current => ({...current, tripSlugs: current.tripSlugs.includes(slug) ? current.tripSlugs.filter(item => item !== slug) : [...current.tripSlugs, slug]}));
  }

  return <div className="cms-editor-layout">
    <aside className="cms-record-list"><div className="cms-record-list__tools"><button type="button" onClick={() => select(null)}>+ Add review</button><input type="search" placeholder="Search reviews" value={query} onChange={event => setQuery(event.target.value)}/></div>{visible.map(item => <button className={item.id === selectedId ? "is-active" : ""} type="button" key={item.id} onClick={() => select(item)}><span><strong>{item.author}</strong><small>{item.title}</small></span><em>{item.status}</em></button>)}</aside>
    <section className="cms-record-editor">
      <div className="cms-editor-actions"><div><span>{selectedId === "new" ? "Create review" : "Editing review"}</span><h2>{draft.author}</h2></div><div><button className="button button--outline" type="button" disabled={selectedId === "new"} onClick={remove}>Delete</button><button className="button button--orange" type="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save review"}</button></div></div>
      {message && <p className="admin-status" role="status">{message}</p>}
      <div className="cms-form-grid">
        <label>Review title<input value={draft.title} onChange={event => setDraft({...draft, title: event.target.value})}/></label>
        <label>Author<input value={draft.author} onChange={event => setDraft({...draft, author: event.target.value})}/></label>
        <label className="span-2">Review text<textarea value={draft.quote} onChange={event => setDraft({...draft, quote: event.target.value})}/></label>
        <label>Rating<select value={draft.rating} onChange={event => setDraft({...draft, rating: Number(event.target.value)})}>{[5,4,3,2,1].map(value => <option value={value} key={value}>{value} stars</option>)}</select></label>
        <label>Status<select value={draft.status} onChange={event => setDraft({...draft, status: event.target.value as ReviewInput["status"]})}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <label>Display meta<input value={draft.meta} onChange={event => setDraft({...draft, meta: event.target.value})}/></label>
        <label>Author location<input value={draft.authorLocation || ""} onChange={event => setDraft({...draft, authorLocation: event.target.value || undefined})}/></label>
        <label>Travel date<input type="month" value={draft.travelDate || ""} onChange={event => setDraft({...draft, travelDate: event.target.value || undefined})}/></label>
        <label>Traveller type<input value={draft.travelerType || ""} onChange={event => setDraft({...draft, travelerType: event.target.value || undefined})}/></label>
        <label>Review source<input value={draft.source} onChange={event => setDraft({...draft, source: event.target.value})}/></label>
        <label>Original review URL<input value={draft.sourceUrl || ""} onChange={event => setDraft({...draft, sourceUrl: event.target.value || undefined})}/></label>
        <label>Original language<input value={draft.originalLanguage || ""} onChange={event => setDraft({...draft, originalLanguage: event.target.value || undefined})}/></label>
        <label>Display order<input type="number" min="0" value={draft.order} onChange={event => setDraft({...draft, order: Number(event.target.value)})}/></label>
        <label className="span-2">Images <small>One per line: path | alt text | caption</small><textarea value={imageLines(draft.images)} onChange={event => setDraft({...draft, images: parseImages(event.target.value)})}/></label>
        <label className="span-2">Victor&apos;s reply<textarea value={draft.reply || ""} onChange={event => setDraft({...draft, reply: event.target.value || undefined})}/></label>
      </div>
      <div className="cms-fieldset"><h3>Review categories</h3><p>Add as many categories as needed from the Review Categories section.</p><div className="cms-check-grid">{categories.filter(category => category.status !== "archived").map(category => <label key={category.id}><input type="checkbox" checked={draft.categoryIds.includes(category.id)} onChange={() => toggleCategory(category.id)}/>{category.name}</label>)}</div></div>
      <div className="cms-fieldset"><h3>Related trips</h3><div className="cms-check-grid">{trips.map(trip => <label key={trip.slug}><input type="checkbox" checked={draft.tripSlugs.includes(trip.slug)} onChange={() => toggleTrip(trip.slug)}/>{trip.title}</label>)}</div></div>
      <div className="cms-fieldset"><h3>Placement</h3><div className="cms-check-grid"><label><input type="checkbox" checked={draft.verified} onChange={event => setDraft({...draft, verified: event.target.checked})}/>Verified review</label><label><input type="checkbox" checked={draft.translated} onChange={event => setDraft({...draft, translated: event.target.checked})}/>Translated review</label><label><input type="checkbox" checked={draft.featuredOnHomepage} onChange={event => setDraft({...draft, featuredOnHomepage: event.target.checked})}/>Feature on homepage</label><label><input type="checkbox" checked={draft.featuredOnTripPages} onChange={event => setDraft({...draft, featuredOnTripPages: event.target.checked})}/>Feature on trip pages</label></div></div>
    </section>
  </div>;
}
