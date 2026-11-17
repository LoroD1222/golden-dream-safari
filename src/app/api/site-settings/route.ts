import {NextResponse} from "next/server";
import {getSiteSettingsRepository} from "@/features/content/storage";
import {siteSettingsInputSchema} from "@/features/content/schema";
import {requireContentAdmin, requireWritableContentStorage} from "@/features/itinerary/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(await getSiteSettingsRepository().get());
}

export async function PUT(request: Request) {
  const unauthorized = requireContentAdmin(request);
  if (unauthorized) return unauthorized;
  const unavailable = requireWritableContentStorage();
  if (unavailable) return unavailable;
  const parsed = siteSettingsInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({message: "The site settings contain invalid or missing fields.", issues: parsed.error.issues}, {status: 400});
  return NextResponse.json(await getSiteSettingsRepository().save(parsed.data));
}
