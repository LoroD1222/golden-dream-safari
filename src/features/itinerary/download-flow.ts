export const MOBILE_DOWNLOAD_PROMPT_DELAY_MS = 700;
export const MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS = 6_500;

export type DownloadDecision = "download" | "disabled";

export function decideItineraryDownload(enabled: boolean): DownloadDecision {
  return enabled ? "download" : "disabled";
}

export function mobileDownloadStateAt(elapsedMs: number): "hidden" | "expanded" | "compact" {
  if (elapsedMs < MOBILE_DOWNLOAD_PROMPT_DELAY_MS) return "hidden";
  if (elapsedMs < MOBILE_DOWNLOAD_PROMPT_DELAY_MS + MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS) return "expanded";
  return "compact";
}
