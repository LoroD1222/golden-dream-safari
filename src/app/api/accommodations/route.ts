import {NextResponse} from "next/server";
import {getAccommodationRepository} from "@/features/content/storage";
import {accommodationInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(await getAccommodationRepository().list());
}

export async function POST(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = accommodationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The accommodation contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  return NextResponse.json(await getAccommodationRepository().create(parsed.data), {status: 201});
}
