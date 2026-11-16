import {NextResponse} from "next/server";
import {getItineraryRepository} from "@/features/itinerary/storage";
import {itineraryInputSchema} from "@/features/itinerary/schema";
import {requireItineraryAdmin, requireWritableItineraryStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireItineraryAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(await getItineraryRepository().list());
}

export async function POST(request: Request) {
  const unauthorized = requireItineraryAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableItineraryStorage();
  if (unavailable) return unavailable;
  const parsed = itineraryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The itinerary contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  try { return NextResponse.json(await getItineraryRepository().create(parsed.data), {status: 201}); }
  catch (error) { return NextResponse.json({message: error instanceof Error ? error.message : "Could not create itinerary."}, {status: 409}); }
}
