import {createHmac, timingSafeEqual} from "node:crypto";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function safeTripSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function itineraryAccessCookieName(slug: string) {
  return `trip_itinerary_access_${safeTripSlug(slug)}`;
}

function accessSecret() {
  return process.env.ITINERARY_ACCESS_SECRET || process.env.RESEND_API_KEY || "";
}

function signature(slug: string, expires: number, secret: string) {
  return createHmac("sha256", secret).update(`${safeTripSlug(slug)}.${expires}`).digest("base64url");
}

export function createItineraryAccessToken(slug: string, now = Date.now(), secret = accessSecret()) {
  if (!secret) throw new Error("Itinerary access signing is not configured.");
  const expires = Math.floor(now / 1000) + ONE_YEAR_SECONDS;
  return `${expires}.${signature(slug, expires, secret)}`;
}

export function verifyItineraryAccessToken(slug: string, token: string | undefined, now = Date.now(), secret = accessSecret()) {
  if (!secret || !token) return false;
  const [expiresText, supplied] = token.split(".");
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(now / 1000) || !supplied) return false;
  const expected = signature(slug, expires, secret);
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

export const itineraryAccessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR_SECONDS,
};
