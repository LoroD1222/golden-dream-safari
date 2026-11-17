import {NextRequest, NextResponse} from "next/server";
import {itineraryAccessCookieName, verifyItineraryAccessToken} from "@/features/itinerary/access";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, {params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const itinerary = await getPublicItineraryRepository().get(slug);
  const enabled = Boolean(itinerary && itinerary.status === "published" && getItineraryDownloadConfig(itinerary).enabled);
  const token = request.cookies.get(itineraryAccessCookieName(slug))?.value;
  return NextResponse.json({enabled, hasAccess: enabled && verifyItineraryAccessToken(slug, token)}, {headers: {"cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow"}});
}
