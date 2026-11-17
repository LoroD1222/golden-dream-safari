"use client";

import Image from "next/image";
import Link from "next/link";
import {FormEvent, useEffect, useId, useMemo, useRef, useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";

const tripChoices = [
  ["Wildlife safari", "/images/figma/f5a929d4-49ea-4274-b15a-0a88026f1d3a.png"],
  ["Kilimanjaro", "/images/figma/114aafa2-3e38-43cf-9973-100800b200d5.png"],
  ["Mount Meru", "/images/figma/16a5763a-2854-4aac-8a46-09c62d1eedda.png"],
  ["Zanzibar", "/images/figma/fb48968f-2efa-4a9c-98dd-fa8c1ce7225d.png"],
  ["Day trip", "/images/figma/a07ee8d6-0894-40c4-b59e-afdee1f87036.png"],
  ["Not sure yet", ""],
] as const;

type QuoteData = {
  trips: string[];
  arrival: string;
  departure: string;
  days: string;
  adults: number;
  children: number;
  travelStyle: string;
  groupType: string;
  interests: string[];
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  preferredContact: string;
  message: string;
  consent: boolean;
  website: string;
};

const initialData: QuoteData = {
  trips: ["Wildlife safari", "Zanzibar"], arrival: "", departure: "", days: "4–5 days", adults: 2, children: 0,
  travelStyle: "Mid-range lodge", groupType: "Private", interests: ["The Big Five"], name: "", email: "",
  whatsapp: "", country: "", preferredContact: "WhatsApp", message: "", consent: false, website: "",
};

function Choice({selected, children, onClick}: {selected: boolean; children: React.ReactNode; onClick: () => void}) {
  return <button className={`choice-chip ${selected ? "is-selected" : ""}`} type="button" aria-pressed={selected} onClick={onClick}>{children}</button>;
}

function DateField({label, value, min, onChange}: {label: string; value: string; min?: string; onChange: (value: string) => void}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function openCalendar() {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    try { input.showPicker(); } catch { input.click(); }
  }

  return <div className="date-field"><label htmlFor={id}>{label}</label><div className="date-control"><input ref={inputRef} id={id} type="date" min={min} value={value} onChange={(event) => onChange(event.target.value)}/><button type="button" aria-label={`Open ${label.toLowerCase()} calendar`} onClick={openCalendar}><Image src="/icons/figma/quote-calendar.svg" alt="" width={18} height={18}/></button></div></div>;
}

type QuoteWizardProps = {
  initialTrip?: string;
  initialArrival?: string;
  initialDeparture?: string;
  initialAdults?: number;
  initialMessage?: string;
};

export function QuoteWizard({initialTrip, initialArrival, initialDeparture, initialAdults, initialMessage}: QuoteWizardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [dateMode, setDateMode] = useState<"known" | "flexible">("known");
  const [data, setData] = useState<QuoteData>(() => ({
    ...initialData,
    trips: initialTrip ? [initialTrip] : [...initialData.trips],
    arrival: initialArrival || "",
    departure: initialDeparture || "",
    adults: initialAdults || initialData.adults,
    interests: [...initialData.interests],
    message: initialMessage || "",
  }));
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const steps = ["Trip", "Dates & group", "Travel style", "Your details"];
  const summary = useMemo(() => [data.trips.join(" + "), data.arrival && data.departure ? `${data.arrival}–${data.departure}` : "Dates flexible", `${data.adults} ${data.adults === 1 ? "adult" : "adults"}${data.children ? ` · ${data.children} ${data.children === 1 ? "child" : "children"}` : ""}`, data.travelStyle, data.groupType, data.interests.join(" · ")].filter(Boolean), [data]);

  useEffect(() => {
    if (step > 1) formRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
  }, [step]);

  const toggleArray = (key: "trips" | "interests", value: string) => setData(current => {
    const exists = current[key].includes(value);
    const next = exists ? current[key].filter(item => item !== value) : [...current[key], value];
    return {...current, [key]: next.length ? next : [value]};
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data.consent) {setStatus("error"); setMessage("Please agree to the privacy policy before sending your request."); return;}
    if (data.preferredContact === "WhatsApp" && !data.whatsapp.trim()) {setStatus("error"); setMessage("Add your WhatsApp number, or choose email as your reply method."); return;}
    if (data.arrival && data.departure && data.departure < data.arrival) {setStatus("error"); setMessage("Your departure date must be on or after your arrival date."); return;}
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/quote", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(data)});
      const payload = await response.json() as {message?: string};
      if (!response.ok) throw new Error(payload.message || "Your request could not be sent.");
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your request could not be sent.");
    }
  }

  if (status === "sent") return <div className="quote-sent" id="quote" role="status"><span aria-hidden><FigmaIcon name="quote-success" width={40}/></span><h2>Asante! Your request is on its way.</h2><p>Victor will look at your dates and reply with a proposal and a price. Want to talk sooner? Send him a message on WhatsApp.</p><a className="button button--dark" href="https://wa.me/255763571646">Message Victor on WhatsApp</a></div>;

  return <form ref={formRef} className="quote-wizard" id="quote" onSubmit={submit}>
    <div className="quote-top"><h2>Get a free quote</h2><span>Step {step} of 4</span></div>
    <ol className="quote-progress">{steps.map((label, index) => <li className={index < step ? "is-active" : ""} key={label}><span/><small>{label}</small></li>)}</ol>

    {step === 1 && <div className="quote-step">
      <h3>What would you like to do?</h3><p>Choose one or more. You can combine a safari with a trek or a few days on Zanzibar.</p>
      <div className="trip-choice-grid">{tripChoices.map(([label, image]) => <button className={`trip-choice ${data.trips.includes(label) ? "is-selected" : ""}`} type="button" aria-pressed={data.trips.includes(label)} key={label} onClick={() => toggleArray("trips", label)}>{image ? <Image src={image} alt="" fill sizes="160px"/> : <strong aria-hidden>?</strong>}<span>{label}</span><i aria-hidden>{data.trips.includes(label) ? <FigmaIcon name="check" width={16}/> : null}</i></button>)}</div>
      <div className="quote-navigation"><p>Free, and commits you to nothing.</p><button className="button button--orange" type="button" onClick={() => setStep(2)}>Next: dates<span className="button__arrow"><FigmaIcon name="quote-arrow" width={22}/></span></button></div>
    </div>}

    {step === 2 && <div className="quote-step">
      <h3>When are you coming, and who with?</h3><p>Rough dates are fine. We can suggest the best time if you&apos;re flexible.</p>
      <div className="segmented"><button type="button" aria-pressed={dateMode === "known"} className={dateMode === "known" ? "is-selected" : ""} onClick={() => setDateMode("known")}>I know my dates</button><button type="button" aria-pressed={dateMode === "flexible"} className={dateMode === "flexible" ? "is-selected" : ""} onClick={() => {setDateMode("flexible"); setData({...data, arrival: "", departure: ""});}}>I&apos;m flexible</button></div>
      {dateMode === "known" ? <div className="field-row"><DateField label="Arrival" value={data.arrival} onChange={(arrival) => setData({...data, arrival})}/><DateField label="Departure" min={data.arrival || undefined} value={data.departure} onChange={(departure) => setData({...data, departure})}/></div> : <p className="flexible-note">No problem — include the month or season in your final message, if you know it.</p>}
      <fieldset><legend>How many days on safari?</legend><div className="choice-row">{["1 day", "2–3 days", "4–5 days", "6–7 days", "8+ days"].map(value => <Choice key={value} selected={data.days === value} onClick={() => setData({...data, days: value})}>{value}</Choice>)}</div></fieldset>
      <div className="traveller-row">{[["Adults", "Age 16+", "adults"], ["Children", "Age 0–15", "children"]].map(([label, note, key]) => <div className="stepper" key={key}><span><strong>{label}</strong><small>{note}</small></span><button type="button" aria-label={`Remove ${label}`} onClick={() => setData({...data, [key]: Math.max(key === "adults" ? 1 : 0, data[key as "adults" | "children"] - 1)})}><FigmaIcon name="faq-minus" width={14}/></button><b>{data[key as "adults" | "children"]}</b><button type="button" aria-label={`Add ${label}`} disabled={data[key as "adults" | "children"] >= 40} onClick={() => setData({...data, [key]: Math.min(40, data[key as "adults" | "children"] + 1)})}><FigmaIcon name="faq-plus" width={14}/></button></div>)}</div>
      <QuoteNav back={() => setStep(1)} next={() => setStep(3)} nextLabel="Next: travel style"/>
    </div>}

    {step === 3 && <div className="quote-step">
      <h3>How would you like to travel?</h3><p>This helps us pick the right camps and lodges. Prices are per person per day.</p>
      <div className="tier-list">{[["Group camping", "Join a group and stay at campsites, with a chef.", "from $200"], ["Mid-range lodge", "Lodges and tented camps, private or small group.", "on request"], ["Private luxury", "Your own vehicle and guide, staying in safari lodges.", "up to $550"]].map(([label, copy, price]) => <button type="button" key={label} className={data.travelStyle === label ? "is-selected" : ""} onClick={() => setData({...data, travelStyle: label})}><FigmaIcon name={data.travelStyle === label ? "tier-radio-selected" : "tier-radio"} width={22}/><span><strong>{label}</strong><small>{copy}</small></span><b>{price}</b></button>)}</div>
      <fieldset><legend>Private or join a group?</legend><div className="choice-row">{["Private", "Join a group", "No preference"].map(value => <Choice key={value} selected={data.groupType === value} onClick={() => setData({...data, groupType: value})}>{value}</Choice>)}</div></fieldset>
      <fieldset><legend>Anything special? (optional)</legend><div className="choice-row">{["The Big Five", "Great Migration", "Photography", "Honeymoon", "Travelling with kids", "Vegetarian or special diet"].map(value => <Choice key={value} selected={data.interests.includes(value)} onClick={() => toggleArray("interests", value)}>{value}</Choice>)}</div></fieldset>
      <QuoteNav back={() => setStep(2)} next={() => setStep(4)} nextLabel="Next: your details"/>
    </div>}

    {step === 4 && <div className="quote-step">
      <h3>Where should we send your quote?</h3><p>We use your details only to plan your trip.</p>
      <div className="quote-summary"><div><strong>Your trip so far</strong><button type="button" onClick={() => setStep(1)}>Edit</button></div><p>{summary.map(item => <span key={item}>{item}</span>)}</p></div>
      <div className="field-row"><label>Your name *<input required value={data.name} autoComplete="name" onChange={e => setData({...data, name: e.target.value})} placeholder="Jane Smith"/></label><label>Email *<input required type="email" value={data.email} autoComplete="email" onChange={e => setData({...data, email: e.target.value})} placeholder="you@example.com"/></label></div>
      <div className="field-row"><label>WhatsApp (optional)<input value={data.whatsapp} autoComplete="tel" onChange={e => setData({...data, whatsapp: e.target.value})} placeholder="+44 7700 900000"/></label><label>Country<select className="country-input" value={data.country} autoComplete="country-name" onChange={e => setData({...data, country: e.target.value})}><option value="">Select…</option>{["Australia", "Belgium", "Canada", "Denmark", "France", "Germany", "Italy", "Netherlands", "Norway", "Spain", "Sweden", "Switzerland", "Tanzania", "United Kingdom", "United States", "Other"].map(country => <option value={country} key={country}>{country}</option>)}</select></label></div>
      <fieldset><legend>How should we reply?</legend><div className="choice-row">{["WhatsApp", "Email"].map(value => <Choice key={value} selected={data.preferredContact === value} onClick={() => setData({...data, preferredContact: value})}>{value}</Choice>)}</div></fieldset>
      <label className="message-field">Anything else? (optional)<textarea value={data.message} onChange={e => setData({...data, message: e.target.value})} placeholder="Special occasions, dietary needs, questions…"/></label>
      <label className="honeypot" aria-hidden>Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={e => setData({...data, website: e.target.value})}/></label>
      <label className="consent"><input type="checkbox" checked={data.consent} onChange={e => setData({...data, consent: e.target.checked})}/><span>I agree to the <Link href="/privacy" target="_blank">privacy policy</Link>.</span></label>
      {message && <p className="form-message" role="alert">{message}</p>}
      <div className="quote-navigation"><button className="back-button" type="button" onClick={() => setStep(3)}><FigmaIcon name="quote-back" width={18}/>Back</button><button className="button button--orange" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send my request"}<span className="button__arrow"><FigmaIcon name="quote-arrow" width={22}/></span></button></div>
    </div>}
  </form>;
}

function QuoteNav({back, next, nextLabel}: {back: () => void; next: () => void; nextLabel: string}) {
  return <div className="quote-navigation"><button className="back-button" type="button" onClick={back}><FigmaIcon name="quote-back" width={18}/>Back</button><button className="button button--orange" type="button" onClick={next}>{nextLabel}<span className="button__arrow"><FigmaIcon name="quote-arrow" width={22}/></span></button></div>;
}
