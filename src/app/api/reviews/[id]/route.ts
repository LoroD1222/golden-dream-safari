import {NextResponse} from "next/server";
import {getReviewRepository} from "@/features/content/storage";
import {reviewInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = reviewInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The review contains invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  const item = await getReviewRepository().update((await params).id, parsed.data);
  return item ? NextResponse.json(item) : NextResponse.json({message: "Review not found."}, {status: 404});
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  return await getReviewRepository().remove((await params).id) ? new NextResponse(null, {status: 204}) : NextResponse.json({message: "Review not found."}, {status: 404});
}
