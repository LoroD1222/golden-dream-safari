import {NextResponse} from "next/server";
import {getItineraryRepository} from "@/features/itinerary/storage";
import {itineraryInputSchema} from "@/features/itinerary/schema";
import {requireItineraryAdmin, requireWritableItineraryStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireItineraryAdmin(request);
  if (unauthorized) return unauthorized;
  const item = await getItineraryRepository().get((await params).id);
  return item ? NextResponse.json(item) : NextResponse.json({message: "Itinerary not found."}, {status: 404});
}

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireItineraryAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableItineraryStorage();
  if (unavailable) return unavailable;
  const parsed = itineraryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The itinerary contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  try {
    const item = await getItineraryRepository().update((await params).id, parsed.data);
    return item ? NextResponse.json(item) : NextResponse.json({message: "Itinerary not found."}, {status: 404});
  } catch (error) { return NextResponse.json({message: error instanceof Error ? error.message : "Could not update itinerary."}, {status: 409}); }
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireItineraryAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableItineraryStorage();
  if (unavailable) return unavailable;
  return await getItineraryRepository().remove((await params).id) ? new NextResponse(null, {status: 204}) : NextResponse.json({message: "Itinerary not found."}, {status: 404});
}
