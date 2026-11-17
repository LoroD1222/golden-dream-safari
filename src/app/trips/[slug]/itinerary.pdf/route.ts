import {itineraryPdfResponse} from "@/features/itinerary/pdf-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, {params}: {params: Promise<{slug: string}>}) {
  return itineraryPdfResponse((await params).slug);
}
