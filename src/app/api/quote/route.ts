import {createHash} from "node:crypto";
import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import {z} from "zod";
import {createItineraryAccessToken, itineraryAccessCookieName, itineraryAccessCookieOptions} from "@/features/itinerary/access";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import {getPublicItineraryRepository} from "@/features/itinerary/storage";
import {travelStyleValues} from "@/features/quote/model";

export const runtime = "nodejs";

const RESEND_DELIVERY_EMAIL = "info@golden-dream-safaris.com";

const quoteSchema = z.object({
  trips: z.array(z.enum(["Wildlife safari", "Kilimanjaro", "Mount Meru", "Zanzibar", "Day trip", "Not sure yet"])).min(1).max(6),
  arrival: z.string().trim().max(30).refine(value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)),
  departure: z.string().trim().max(30).refine(value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)),
  days: z.enum(["1 day", "2–3 days", "4–5 days", "6–7 days", "8+ days"]),
  adults: z.number().int().min(1).max(40),
  children: z.number().int().min(0).max(40),
  travelStyle: z.enum(travelStyleValues),
  groupType: z.enum(["Private", "Join a group", "No preference"]),
  interests: z.array(z.enum(["The Big Five", "Great Migration", "Photography", "Honeymoon", "Travelling with kids", "Vegetarian or special diet"])).max(10),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  whatsapp: z.string().trim().max(50),
  country: z.string().trim().max(100),
  preferredContact: z.enum(["WhatsApp", "Email"]),
  message: z.string().trim().max(3000),
  consent: z.literal(true),
  website: z.string().max(0),
  tripSlug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120).optional(),
  downloadIntent: z.boolean().optional(),
}).superRefine((data, context) => {
  if (Boolean(data.arrival) !== Boolean(data.departure)) {
    context.addIssue({code: "custom", path: [data.arrival ? "departure" : "arrival"], message: "Provide both dates or leave both blank."});
  }
  if (data.arrival && data.departure && data.departure < data.arrival) {
    context.addIssue({code: "custom", path: ["departure"], message: "Departure must be on or after arrival."});
  }
  if (data.preferredContact === "WhatsApp" && !data.whatsapp) {
    context.addIssue({code: "custom", path: ["whatsapp"], message: "A WhatsApp number is required when WhatsApp is selected."});
  }
  if (data.downloadIntent) {
    if (!data.tripSlug) context.addIssue({code: "custom", path: ["tripSlug"], message: "A trip is required."});
    if (!data.arrival || !data.departure) context.addIssue({code: "custom", path: ["arrival"], message: "Preferred travel dates are required."});
    if (data.message.length < 10) context.addIssue({code: "custom", path: ["message"], message: "Tell us a little about your trip."});
  }
});

const attempts = new Map<string, number[]>();
const duplicates = new Map<string, number>();
const RATE_WINDOW = 15 * 60 * 1000;
const DUPLICATE_WINDOW = 10 * 60 * 1000;
const MAX_BODY_BYTES = 25_000;

function pruneTracking(now: number) {
  if (attempts.size > 5_000) {
    for (const [key, timestamps] of attempts) {
      const recent = timestamps.filter(timestamp => now - timestamp < RATE_WINDOW);
      if (recent.length) attempts.set(key, recent); else attempts.delete(key);
    }
  }
  if (duplicates.size > 5_000) {
    for (const [key, timestamp] of duplicates) if (now - timestamp >= DUPLICATE_WINDOW) duplicates.delete(key);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"}[character] || character));
}

function row(label: string, value: string) {
  return `<tr><td style="padding:9px 12px;color:#6f675d;border-bottom:1px solid #eee9e2">${escapeHtml(label)}</td><td style="padding:9px 12px;font-weight:600;border-bottom:1px solid #eee9e2">${escapeHtml(value || "—")}</td></tr>`;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  pruneTracking(now);
  const recent = (attempts.get(ip) || []).filter(timestamp => now - timestamp < RATE_WINDOW);
  if (recent.length >= 5) return NextResponse.json({message: "Too many requests. Please wait a few minutes and try again."}, {status: 429, headers: {"Retry-After": "900"}});
  attempts.set(ip, [...recent, now]);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({message: "The request is too large."}, {status: 413});

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({message: "Invalid request."}, {status: 400}); }
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({message: "Please check the required fields and try again."}, {status: 400});

  const data = parsed.data;
  const itinerary = data.downloadIntent && data.tripSlug ? await getPublicItineraryRepository().get(data.tripSlug) : null;
  if (data.downloadIntent && (!itinerary || itinerary.status !== "published")) return NextResponse.json({message: "This trip is no longer available."}, {status: 404});
  if (itinerary && !getItineraryDownloadConfig(itinerary).enabled) return NextResponse.json({message: "PDF downloads are not available for this trip."}, {status: 403});
  const fingerprint = createHash("sha256").update(`${data.email}|${data.name}|${data.trips.join(",")}|${data.arrival}|${data.message}`).digest("hex");
  const duplicateAt = duplicates.get(fingerprint);
  if (duplicateAt && now - duplicateAt < DUPLICATE_WINDOW) return NextResponse.json({message: "This request was already sent recently."}, {status: 409});

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim() || `Golden Dream Safaris <${RESEND_DELIVERY_EMAIL}>`;
  const to = process.env.RESEND_TO_EMAIL?.trim() || RESEND_DELIVERY_EMAIL;
  if (!apiKey) return NextResponse.json({message: "Email delivery is not configured yet. Please use WhatsApp or email us directly."}, {status: 503});

  const resend = new Resend(apiKey);
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#141210"><div style="background:#0b0907;color:white;padding:24px 28px;border-radius:18px 18px 0 0"><p style="color:#ef8a33;margin:0 0 8px">Golden Dream Safaris</p><h1 style="margin:0;font-size:28px">New quote request</h1></div><table style="width:100%;border-collapse:collapse;background:#faf9f7">${row("Name", data.name)}${row("Email", data.email)}${row("WhatsApp", data.whatsapp)}${row("Country", data.country)}${row("Trip", data.trips.join(" + "))}${row("Dates", data.arrival && data.departure ? `${data.arrival} to ${data.departure}` : "Flexible")}${row("Length", data.days)}${row("Travellers", `${data.adults} adults, ${data.children} children`)}${row("Travel style", data.travelStyle)}${row("Group type", data.groupType)}${row("Interests", data.interests.join(", "))}${row("Preferred reply", data.preferredContact)}${row("Message", data.message)}</table><p style="padding:18px 24px;color:#6f675d">Submitted from the Golden Dream website quote form.</p></div>`;

  const text = [
    `New quote request from ${data.name}`,
    `Email: ${data.email}`,
    `WhatsApp: ${data.whatsapp || "-"}`,
    `Country: ${data.country || "-"}`,
    `Trip: ${data.trips.join(" + ")}`,
    `Dates: ${data.arrival && data.departure ? `${data.arrival} to ${data.departure}` : "Flexible"}`,
    `Length: ${data.days}`,
    `Travellers: ${data.adults} adults, ${data.children} children`,
    `Travel style: ${data.travelStyle}`,
    `Group type: ${data.groupType}`,
    `Interests: ${data.interests.join(", ") || "-"}`,
    `Preferred reply: ${data.preferredContact}`,
    `Message: ${data.message || "-"}`,
  ].join("\n");
  const result = await resend.emails.send({from, to: [to], replyTo: data.email, subject: `Quote request from ${data.name}: ${data.trips.join(" + ")}`, html, text});
  if (result.error) return NextResponse.json({message: "Email delivery failed. Please try again or contact us directly."}, {status: 502});

  duplicates.set(fingerprint, now);
  const response = NextResponse.json({message: "Your request was sent.", downloadAccess: Boolean(data.downloadIntent)});
  if (data.downloadIntent && data.tripSlug) {
    response.cookies.set(itineraryAccessCookieName(data.tripSlug), createItineraryAccessToken(data.tripSlug, Date.now(), undefined, {
      arrival: data.arrival,
      departure: data.departure,
      adults: data.adults,
      children: data.children,
      travelStyle: data.travelStyle,
    }), itineraryAccessCookieOptions);
  }
  return response;
}
