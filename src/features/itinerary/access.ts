import {createHmac, timingSafeEqual} from "node:crypto";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export type ItineraryPdfProfile = {
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  travelStyle: "Group camping" | "Mid-range lodge" | "Private luxury";
};

export function safeTripSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function itineraryAccessCookieName(slug: string) {
  return `trip_itinerary_access_${safeTripSlug(slug)}`;
}

function accessSecret() {
  return process.env.ITINERARY_ACCESS_SECRET || process.env.RESEND_API_KEY || "";
}

function signature(slug: string, expires: number, secret: string, profile = "") {
  const value = profile ? `${safeTripSlug(slug)}.${expires}.${profile}` : `${safeTripSlug(slug)}.${expires}`;
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createItineraryAccessToken(slug: string, now = Date.now(), secret = accessSecret(), profile?: ItineraryPdfProfile) {
  if (!secret) throw new Error("Itinerary access signing is not configured.");
  const expires = Math.floor(now / 1000) + ONE_YEAR_SECONDS;
  const encodedProfile = profile ? Buffer.from(JSON.stringify(profile)).toString("base64url") : "";
  const signed = signature(slug, expires, secret, encodedProfile);
  return encodedProfile ? `${expires}.${encodedProfile}.${signed}` : `${expires}.${signed}`;
}

export function verifyItineraryAccessToken(slug: string, token: string | undefined, now = Date.now(), secret = accessSecret()) {
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 2 && parts.length !== 3) return false;
  const [expiresText, profile = "", supplied = profile] = parts;
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(now / 1000) || !supplied) return false;
  const expected = signature(slug, expires, secret, parts.length === 3 ? profile : "");
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

export function readItineraryPdfProfile(slug: string, token: string | undefined, now = Date.now(), secret = accessSecret()): ItineraryPdfProfile | undefined {
  if (!verifyItineraryAccessToken(slug, token, now, secret)) return undefined;
  const parts = token!.split(".");
  if (parts.length !== 3) return undefined;
  try {
    const value = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as Partial<ItineraryPdfProfile>;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.arrival || "") || !/^\d{4}-\d{2}-\d{2}$/.test(value.departure || "")) return undefined;
    if (!Number.isInteger(value.adults) || value.adults! < 1 || value.adults! > 40 || !Number.isInteger(value.children) || value.children! < 0 || value.children! > 40) return undefined;
    if (!(["Group camping", "Mid-range lodge", "Private luxury"] as const).includes(value.travelStyle as ItineraryPdfProfile["travelStyle"])) return undefined;
    return value as ItineraryPdfProfile;
  } catch {
    return undefined;
  }
}

export const itineraryAccessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR_SECONDS,
};
