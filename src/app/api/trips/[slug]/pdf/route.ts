import type {NextRequest} from "next/server";
import {protectedItineraryPdfResponse} from "@/features/itinerary/pdf-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, {params}: {params: Promise<{slug: string}>}) {
  return protectedItineraryPdfResponse(request, (await params).slug);
}
