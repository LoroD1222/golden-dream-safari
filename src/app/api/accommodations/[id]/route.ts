import {NextResponse} from "next/server";
import {getAccommodationRepository} from "@/features/content/storage";
import {accommodationInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = accommodationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The accommodation contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  const item = await getAccommodationRepository().update((await params).id, parsed.data);
  return item ? NextResponse.json(item) : NextResponse.json({message: "Accommodation not found."}, {status: 404});
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  return await getAccommodationRepository().remove((await params).id) ? new NextResponse(null, {status: 204}) : NextResponse.json({message: "Accommodation not found."}, {status: 404});
}
