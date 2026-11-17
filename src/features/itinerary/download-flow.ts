export const MOBILE_DOWNLOAD_PROMPT_DELAY_MS = 700;
export const MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS = 6_500;

export type DownloadDecision = "download" | "request-form" | "disabled";

export function decideItineraryDownload(enabled: boolean, hasAccess: boolean): DownloadDecision {
  if (!enabled) return "disabled";
  return hasAccess ? "download" : "request-form";
}

export function mobileDownloadStateAt(elapsedMs: number): "hidden" | "expanded" | "compact" {
  if (elapsedMs < MOBILE_DOWNLOAD_PROMPT_DELAY_MS) return "hidden";
  if (elapsedMs < MOBILE_DOWNLOAD_PROMPT_DELAY_MS + MOBILE_DOWNLOAD_PROMPT_EXPANDED_MS) return "expanded";
  return "compact";
}

export function successfulSubmissionEffect(downloadWasPending: boolean) {
  return {grantAccess: true, beginDownload: downloadWasPending, pendingDownload: false};
}

export function failedSubmissionEffect(downloadWasPending: boolean) {
  return {grantAccess: false, beginDownload: false, pendingDownload: downloadWasPending};
}
