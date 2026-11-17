import {NextResponse} from "next/server";
import {getReviewRepository} from "@/features/content/storage";
import {reviewInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(await getReviewRepository().list());
}

export async function POST(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = reviewInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The review contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  return NextResponse.json(await getReviewRepository().create(parsed.data), {status: 201});
}
