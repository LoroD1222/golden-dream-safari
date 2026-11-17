import {NextResponse} from "next/server";
import {getReviewCategoryRepository} from "@/features/content/storage";
import {reviewCategoryInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = reviewCategoryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The review category contains invalid fields.", issues: parsed.error.issues}, {status: 400});
  const item = await getReviewCategoryRepository().update((await params).id, parsed.data);
  return item ? NextResponse.json(item) : NextResponse.json({message: "Review category not found."}, {status: 404});
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  return await getReviewCategoryRepository().remove((await params).id) ? new NextResponse(null, {status: 204}) : NextResponse.json({message: "Review category not found."}, {status: 404});
}
