"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {ItineraryDownloadConfig} from "@/features/itinerary/model";
import {DownloadArrowIcon} from "@/components/trip-icons";
import {MOBILE_DOWNLOAD_PROMPT_DELAY_MS, MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS} from "@/features/itinerary/download-flow";

function beginBrowserDownload(slug: string) {
  const anchor = document.createElement("a");
  anchor.href = `/trips/${encodeURIComponent(slug)}/itinerary.pdf`;
  anchor.download = `${slug}-itinerary.pdf`;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function ItineraryDownloadControl({slug, config, placement}: {slug: string; config: ItineraryDownloadConfig; placement: "desktop" | "mobile"}) {
  const [mobileState, setMobileState] = useState<"hidden" | "expanded" | "compact">("hidden");
  const downloadInFlight = useRef(false);

  useEffect(() => {
    if (placement !== "mobile") return;
    const show = window.setTimeout(() => setMobileState("expanded"), MOBILE_DOWNLOAD_PROMPT_DELAY_MS);
    const compact = window.setTimeout(() => setMobileState("compact"), MOBILE_DOWNLOAD_PROMPT_DELAY_MS + MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS);
    return () => { window.clearTimeout(show); window.clearTimeout(compact); };
  }, [placement]);

  const requestDownload = useCallback(() => {
    if (downloadInFlight.current) return;
    downloadInFlight.current = true;
    beginBrowserDownload(slug);
    window.setTimeout(() => { downloadInFlight.current = false; }, 650);
  }, [slug]);

  if (!config.enabled) return null;
  if (placement === "desktop") return <button className="download-button trip-download-desktop" type="button" onClick={requestDownload}>
    <DownloadArrowIcon/>{config.buttonLabel}
  </button>;
  return <>
    <aside className={`trip-download-mobile is-${mobileState}`} aria-label="Itinerary download">
      {mobileState === "expanded" && <div className="trip-download-mobile__prompt">
        <button className="trip-download-mobile__main" type="button" onClick={requestDownload}>
          <span className="trip-download-mobile__icon"><DownloadArrowIcon/></span>
          <span><strong>{config.mobileTitle}</strong><small>{config.mobileDescription}</small></span>
        </button>
        <button className="trip-download-mobile__close" type="button" onClick={() => setMobileState("compact")} aria-label="Minimize itinerary download" title="Minimize itinerary download">×</button>
      </div>}
      {mobileState === "compact" && <button className="trip-download-mobile__compact" type="button" onClick={requestDownload} aria-label={config.buttonLabel} title={config.buttonLabel}><DownloadArrowIcon/></button>}
    </aside>
  </>;
}
