import "server-only";

import type {NextRequest} from "next/server";
import {itineraryAccessCookieName, verifyItineraryAccessToken} from "@/features/itinerary/access";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import {generateItineraryPdf} from "@/features/itinerary/pdf";
import {getItineraryRepository} from "@/features/itinerary/storage";

const privateHeaders = {"cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow"};

export async function protectedItineraryPdfResponse(request: NextRequest, slug: string) {
  const token = request.cookies.get(itineraryAccessCookieName(slug))?.value;
  if (!verifyItineraryAccessToken(slug, token)) return new Response("Complete the trip enquiry form before downloading this itinerary.", {status: 403, headers: {...privateHeaders, "content-type": "text/plain; charset=utf-8"}});
  const itinerary = await getItineraryRepository().get(slug);
  if (!itinerary || itinerary.status !== "published") return new Response("Itinerary not found.", {status: 404, headers: {...privateHeaders, "content-type": "text/plain; charset=utf-8"}});
  if (!getItineraryDownloadConfig(itinerary).enabled) return new Response("PDF downloads are not enabled for this trip.", {status: 403, headers: {...privateHeaders, "content-type": "text/plain; charset=utf-8"}});
  try {
    const bytes = await generateItineraryPdf(itinerary);
    return new Response(Buffer.from(bytes), {headers: {...privateHeaders, "content-type": "application/pdf", "content-disposition": `attachment; filename="${itinerary.slug}-itinerary.pdf"`}});
  } catch (error) {
    console.error("Itinerary PDF generation failed", error);
    return new Response("The itinerary PDF could not be generated. Please try again in a moment.", {status: 500, headers: {...privateHeaders, "content-type": "text/plain; charset=utf-8"}});
  }
}
