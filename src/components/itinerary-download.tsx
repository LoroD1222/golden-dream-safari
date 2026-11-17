"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {ItineraryDownloadConfig} from "@/features/itinerary/model";
import {CheckCircleIcon, DownloadArrowIcon} from "@/components/trip-icons";
import {FigmaIcon} from "@/components/figma-icon";
import {decideItineraryDownload, MOBILE_DOWNLOAD_PROMPT_DELAY_MS, MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS, successfulSubmissionEffect} from "@/features/itinerary/download-flow";

export const tripDownloadPendingEvent = "golden-dream:trip-download-pending";
const accessStoragePrefix = "golden-dream:itinerary-access:";

function beginBrowserDownload(slug: string) {
  const anchor = document.createElement("a");
  anchor.href = `/trips/${encodeURIComponent(slug)}/itinerary.pdf`;
  anchor.download = `${slug}-itinerary.pdf`;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function rememberItineraryAccess(slug: string) {
  try { window.localStorage.setItem(`${accessStoragePrefix}${slug}`, "1"); } catch {}
}

export function downloadUnlockedItinerary(slug: string) {
  rememberItineraryAccess(slug);
  beginBrowserDownload(slug);
}

export function ItineraryDownloadControl({slug, config, placement}: {slug: string; config: ItineraryDownloadConfig; placement: "desktop" | "mobile"}) {
  const [checking, setChecking] = useState(false);
  const [mobileState, setMobileState] = useState<"hidden" | "expanded" | "compact">("hidden");
  const downloadInFlight = useRef(false);

  useEffect(() => {
    if (placement !== "mobile") return;
    const show = window.setTimeout(() => setMobileState("expanded"), MOBILE_DOWNLOAD_PROMPT_DELAY_MS);
    const compact = window.setTimeout(() => setMobileState("compact"), MOBILE_DOWNLOAD_PROMPT_DELAY_MS + MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS);
    return () => { window.clearTimeout(show); window.clearTimeout(compact); };
  }, [placement]);

  const requestDownload = useCallback(async () => {
    if (downloadInFlight.current) return;
    downloadInFlight.current = true;
    setChecking(true);
    try {
      const response = await fetch(`/api/trips/${encodeURIComponent(slug)}/itinerary-access`, {cache: "no-store"});
      const result = await response.json().catch(() => null) as {hasAccess?: boolean; enabled?: boolean} | null;
      const decision = decideItineraryDownload(result?.enabled !== false, Boolean(response.ok && result?.hasAccess));
      if (decision === "download") {
        beginBrowserDownload(slug);
        return;
      }
      if (decision === "disabled") return;
      window.dispatchEvent(new CustomEvent(tripDownloadPendingEvent, {detail: {slug}}));
    } finally {
      window.setTimeout(() => { downloadInFlight.current = false; }, 650);
      setChecking(false);
    }
  }, [slug]);

  if (!config.enabled) return null;
  if (placement === "desktop") return <button className="download-button trip-download-desktop" type="button" onClick={requestDownload} disabled={checking}>
    <DownloadArrowIcon/>{checking ? "Checking…" : config.buttonLabel}
  </button>;
  return <>
    <aside className={`trip-download-mobile is-${mobileState}`} aria-label="Itinerary download">
      {mobileState === "expanded" && <div className="trip-download-mobile__prompt">
        <button className="trip-download-mobile__main" type="button" onClick={requestDownload} disabled={checking}>
          <span className="trip-download-mobile__icon"><DownloadArrowIcon/></span>
          <span><strong>{config.mobileTitle}</strong><small>{config.mobileDescription}</small></span>
        </button>
        <button className="trip-download-mobile__close" type="button" onClick={() => setMobileState("compact")} aria-label="Minimize itinerary download" title="Minimize itinerary download">×</button>
      </div>}
      {mobileState === "compact" && <button className="trip-download-mobile__compact" type="button" onClick={requestDownload} disabled={checking} aria-label={config.buttonLabel} title={config.buttonLabel}><DownloadArrowIcon/></button>}
    </aside>
  </>;
}

type FormState = "idle" | "sending" | "success" | "error";

function tripLengthOption(days: number) {
  if (days <= 1) return "1 day";
  if (days <= 3) return "2–3 days";
  if (days <= 5) return "4–5 days";
  if (days <= 7) return "6–7 days";
  return "8+ days";
}

export function TripDownloadEnquiryForm({slug, title, durationDays, config}: {slug: string; title: string; durationDays: number; config: ItineraryDownloadConfig}) {
  const [state, setState] = useState<FormState>("idle");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handlePending = (event: Event) => {
      const detail = (event as CustomEvent<{slug: string}>).detail;
      if (detail?.slug !== slug) return;
      setPending(true);
      setState("idle");
      setFeedback(config.lockedMessage);
      const form = formRef.current;
      form?.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center"});
      window.setTimeout(() => form?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus(), 450);
    };
    window.addEventListener(tripDownloadPendingEvent, handlePending);
    return () => window.removeEventListener(tripDownloadPendingEvent, handlePending);
  }, [config.lockedMessage, slug]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(":invalid")?.focus();
      form.reportValidity();
      return;
    }
    const values = new FormData(form);
    setState("sending");
    setFeedback("");
    const travellers = Number(values.get("travellers"));
    const travelStyle = String(values.get("travelStyle"));
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
          trips: ["Wildlife safari"],
          arrival: values.get("arrival"),
          departure: values.get("departure"),
          days: tripLengthOption(durationDays),
          adults: travellers,
          children: 0,
          travelStyle,
          groupType: "No preference",
          interests: [],
          name: values.get("name"),
          email: values.get("email"),
          whatsapp: values.get("phone"),
          country: "",
          preferredContact: "Email",
          message: values.get("message"),
          consent: values.get("consent") === "on",
          website: values.get("website"),
          tripSlug: slug,
          downloadIntent: true,
        }),
      });
      const result = await response.json().catch(() => null) as {message?: string} | null;
      if (!response.ok) throw new Error(result?.message || config.errorMessage);
      setState("success");
      setFeedback(config.successMessage);
      rememberItineraryAccess(slug);
      const effect = successfulSubmissionEffect(pending);
      if (effect.beginDownload) {
        setPending(effect.pendingDownload);
        window.setTimeout(() => beginBrowserDownload(slug), 250);
      }
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : config.errorMessage);
    }
  }

  if (!config.enabled) return null;
  return <section className="trip-download-enquiry section-shell section-pad" id="trip-enquiry" aria-labelledby="trip-enquiry-title">
    <div className="trip-download-enquiry__intro"><span>Plan your safari</span><h2 id="trip-enquiry-title">Get this itinerary by email</h2><p>Tell Victor a little about your trip. Once your enquiry is sent, your {title} PDF will download automatically.</p></div>
    <form ref={formRef} onSubmit={submit} noValidate={false}>
      {feedback && <div className={`trip-download-feedback is-${state}${pending ? " is-locked" : ""}`} role={state === "error" ? "alert" : "status"} aria-live="polite">{state === "success" && <CheckCircleIcon/>}<span>{feedback}</span></div>}
      <div className="trip-download-form-grid">
        <label>Full name <span>*</span><input name="name" autoComplete="name" required minLength={2}/></label>
        <label>Email <span>*</span><input name="email" type="email" autoComplete="email" required/></label>
        <label>Phone <small>optional</small><input name="phone" type="tel" autoComplete="tel"/></label>
        <label>Number of travellers <span>*</span><input name="travellers" type="number" min="1" max="40" defaultValue="2" required/></label>
        <label>Arrival date <span>*</span><input name="arrival" type="date" required/></label>
        <label>Departure date <span>*</span><input name="departure" type="date" required/></label>
        <label className="span-2">Travel style <span>*</span><select name="travelStyle" defaultValue="" required><option value="" disabled>Select your preferred style</option><option>Group camping</option><option>Mid-range lodge</option><option>Private luxury</option></select></label>
        <label className="span-2">Message <span>*</span><textarea name="message" required minLength={10} placeholder="Tell us what you would love to see, your group, and any special requests."/></label>
      </div>
      <label className="trip-download-consent"><input name="consent" type="checkbox" required/> <span>I agree that Golden Dream Safaris may use these details to respond to my enquiry. *</span></label>
      <label className="trip-download-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <button className="trip-download-submit" type="submit" disabled={state === "sending"}>
        <span>{state === "sending" ? "Sending…" : "Send enquiry"}</span>
        <span className="trip-download-submit__arrow" aria-hidden><FigmaIcon name="detail-arrow" width={20}/></span>
      </button>
    </form>
  </section>;
}
