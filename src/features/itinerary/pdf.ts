import "server-only";

import {readFile} from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
  type PDFImage,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import type {Itinerary} from "@/features/itinerary/model";
import type {ItineraryPdfProfile} from "@/features/itinerary/access";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import {northernCircuitRouteStops} from "@/features/itinerary/route-data";
import {getTripSupplement, type StayOption} from "@/features/itinerary/trip-supplements";
import type {AccommodationRecord, SiteSettings} from "@/features/content/model";

const PAGE_SIZE: [number, number] = [595.28, 841.89];
const PAGE_WIDTH = PAGE_SIZE[0];
const PAGE_HEIGHT = PAGE_SIZE[1];
const ink = rgb(.075, .064, .055);
const charcoal = rgb(.14, .19, .22);
const orange = rgb(.95, .52, .18);
const orangeDeep = rgb(.64, .28, .055);
const cream = rgb(.965, .955, .94);
const pale = rgb(.982, .977, .968);
const muted = rgb(.39, .37, .34);
const line = rgb(.88, .85, .81);
const white = rgb(1, 1, 1);

function safeText(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[–—]/g, "-").replace(/→/g, "to").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of safeText(text).split(/\n+/)) {
    let current = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      const candidate = `${current} ${word}`.trim();
      if (current && font.widthOfTextAtSize(candidate, size) > width) { lines.push(current); current = word; }
      else current = candidate;
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawLines(page: PDFPage, text: string, options: {x: number; y: number; width: number; size: number; font: PDFFont; color?: RGB; lineHeight?: number; maxLines?: number}) {
  const lineHeight = options.lineHeight || options.size * 1.38;
  const lines = wrap(text, options.font, options.size, options.width).slice(0, options.maxLines);
  lines.forEach((item, index) => page.drawText(item, {x: options.x, y: options.y - index * lineHeight, size: options.size, font: options.font, color: options.color || ink}));
  return options.y - lines.length * lineHeight;
}

type ImageCache = Map<string, Promise<PDFImage | null>>;

async function loadImageBytes(source: string) {
  if (source.startsWith("/") && !source.includes("..")) return readFile(path.join(process.cwd(), "public", source));
  const url = new URL(source);
  if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io") return null;
  url.searchParams.set("w", "1600");
  url.searchParams.set("fit", "max");
  url.searchParams.set("q", "82");
  const response = await fetch(url, {signal: AbortSignal.timeout(8_000)});
  if (!response.ok) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  return bytes.length <= 12_000_000 ? bytes : null;
}

async function embedImage(pdf: PDFDocument, source: string | undefined, cache: ImageCache) {
  if (!source) return null;
  const existing = cache.get(source);
  if (existing) return existing;
  const pending = (async () => {
  try {
    const bytes = await loadImageBytes(source);
    if (!bytes) return null;
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return await pdf.embedJpg(bytes);
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return await pdf.embedPng(bytes);
  } catch {}
  return null;
  })();
  cache.set(source, pending);
  return pending;
}

async function embedFirstImage(pdf: PDFDocument, sources: string[], cache: ImageCache) {
  for (const source of sources) {
    const image = await embedImage(pdf, source, cache);
    if (image) return image;
  }
  return null;
}

async function preloadImages(pdf: PDFDocument, sources: string[], cache: ImageCache, concurrency = 6) {
  const queue = [...new Set(sources.filter(Boolean))];
  let cursor = 0;
  await Promise.all(Array.from({length: Math.min(concurrency, queue.length)}, async () => {
    while (cursor < queue.length) {
      const source = queue[cursor++];
      await embedImage(pdf, source, cache);
    }
  }));
}

function drawCoverImage(page: PDFPage, image: PDFImage, box: {x: number; y: number; width: number; height: number}) {
  const scale = Math.max(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.pushOperators(pushGraphicsState(), rectangle(box.x, box.y, box.width, box.height), clip(), endPath());
  page.drawImage(image, {x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height});
  page.pushOperators(popGraphicsState());
}

function drawFitImage(page: PDFPage, image: PDFImage, box: {x: number; y: number; width: number; height: number}) {
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, {x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height});
}

function formatDate(value?: string) {
  if (!value) return "To be confirmed";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en", {day: "numeric", month: "short", year: "numeric", timeZone: "UTC"}).format(date);
}

function drawSectionTitle(page: PDFPage, title: string, subtitle: string | undefined, fonts: {regular: PDFFont; bold: PDFFont}) {
  page.drawText(safeText(title).toUpperCase(), {x: 42, y: 754, size: 8.5, font: fonts.bold, color: orangeDeep});
  page.drawText(safeText(title), {x: 42, y: 716, size: 29, font: fonts.bold, color: ink});
  if (subtitle) drawLines(page, subtitle, {x: 42, y: 691, width: 505, size: 10.5, font: fonts.regular, color: muted, lineHeight: 15, maxLines: 2});
}

function drawBulletList(page: PDFPage, items: string[], options: {x: number; y: number; width: number; font: PDFFont; maxItems?: number; negative?: boolean}) {
  let y = options.y;
  for (const item of items.slice(0, options.maxItems || items.length)) {
    const lines = wrap(item, options.font, 8.7, options.width - 22).slice(0, 3);
    page.drawCircle({x: options.x + 5, y: y + 3, size: 3, color: options.negative ? muted : orange});
    lines.forEach((text, index) => page.drawText(text, {x: options.x + 18, y: y - index * 12, size: 8.7, font: options.font, color: ink}));
    y -= lines.length * 12 + 7;
  }
  return y;
}

function drawPageHeader(page: PDFPage, companyName: string, label: string, fonts: {regular: PDFFont; bold: PDFFont}) {
  page.drawText(safeText(companyName).toUpperCase(), {x: 42, y: 811, size: 8.5, font: fonts.bold, color: orangeDeep});
  const clipped = safeText(label).slice(0, 68);
  page.drawText(clipped, {x: 553 - Math.min(300, fonts.regular.widthOfTextAtSize(clipped, 8)), y: 811, size: 8, font: fonts.regular, color: muted});
  page.drawLine({start: {x: 42, y: 800}, end: {x: 553, y: 800}, thickness: .7, color: line});
}

function drawFactCard(page: PDFPage, label: string, value: string, x: number, y: number, width: number, fonts: {regular: PDFFont; bold: PDFFont}) {
  page.drawRectangle({x, y, width, height: 64, color: pale, borderColor: line, borderWidth: .55});
  page.drawText(safeText(label).toUpperCase(), {x: x + 10, y: y + 44, size: 6.7, font: fonts.bold, color: orangeDeep});
  drawLines(page, value, {x: x + 10, y: y + 27, width: width - 20, size: 8.5, font: fonts.bold, color: ink, lineHeight: 10.5, maxLines: 2});
}

function drawRouteMap(page: PDFPage, stops: typeof northernCircuitRouteStops, fonts: {regular: PDFFont; bold: PDFFont}) {
  const map = {x: 42, y: 348, width: 245, height: 302};
  page.drawRectangle({...map, color: cream, borderColor: line, borderWidth: .6});
  page.drawText("NORTHERN TANZANIA ROUTE", {x: 58, y: 624, size: 7.2, font: fonts.bold, color: orangeDeep});
  const minLng = 34.55;
  const maxLng = 37.05;
  const minLat = -4.05;
  const maxLat = -2.05;
  const points = stops.map((stop, index) => ({
    x: map.x + 31 + ((stop.coordinates.lng - minLng) / (maxLng - minLng)) * (map.width - 62) + (index === stops.length - 1 ? 6 : 0),
    y: map.y + 36 + ((stop.coordinates.lat - minLat) / (maxLat - minLat)) * (map.height - 86) + (index === stops.length - 1 ? -10 : 0),
  }));
  points.slice(0, -1).forEach((point, index) => page.drawLine({start: point, end: points[index + 1], thickness: 1.8, color: orange, dashArray: [5, 4]}));
  points.forEach((point, index) => {
    page.drawCircle({x: point.x, y: point.y, size: index === 0 || index === points.length - 1 ? 7 : 6, color: index === 0 || index === points.length - 1 ? charcoal : orange, borderColor: white, borderWidth: 2});
    page.drawCircle({x: point.x, y: point.y, size: 1.7, color: white});
  });
  page.drawText("Schematic route - not to scale", {x: 58, y: 363, size: 6.5, font: fonts.regular, color: muted});
  let listY = 625;
  stops.forEach((stop, index) => {
    page.drawText(String(index + 1).padStart(2, "0"), {x: 318, y: listY, size: 7.5, font: fonts.bold, color: orangeDeep});
    page.drawText(safeText(stop.name), {x: 344, y: listY, size: 10, font: fonts.bold, color: ink});
    page.drawText(safeText(stop.label), {x: 516, y: listY, size: 7, font: fonts.regular, color: muted});
    drawLines(page, stop.description, {x: 344, y: listY - 14, width: 199, size: 7.4, font: fonts.regular, color: muted, lineHeight: 9.5, maxLines: 2});
    listY -= 47;
  });
}

async function drawAccommodationCards(page: PDFPage, pdf: PDFDocument, stays: StayOption[], fonts: {regular: PDFFont; bold: PDFFont}, imageCache: ImageCache) {
  const cardWidth = 163;
  for (const [index, stay] of stays.slice(0, 3).entries()) {
    const x = 42 + index * 174;
    const y = 55;
    page.drawRectangle({x, y, width: cardWidth, height: 137, color: pale, borderColor: line, borderWidth: .65});
    const image = await embedFirstImage(pdf, stay.images.map(item => item.src), imageCache);
    if (image) drawCoverImage(page, image, {x, y: y + 67, width: cardWidth, height: 70});
    else page.drawRectangle({x, y: y + 67, width: cardWidth, height: 70, color: cream});
    page.drawText(safeText(stay.tier).toUpperCase(), {x: x + 10, y: y + 51, size: 6.2, font: fonts.bold, color: orangeDeep});
    drawLines(page, stay.property, {x: x + 10, y: y + 35, width: cardWidth - 20, size: 8.7, font: fonts.bold, color: ink, lineHeight: 10, maxLines: 2});
    drawLines(page, stay.location, {x: x + 10, y: y + 11, width: cardWidth - 20, size: 6.8, font: fonts.regular, color: muted, lineHeight: 8, maxLines: 1});
  }
}

export async function generateItineraryPdf(itinerary: Itinerary, profile?: ItineraryPdfProfile, accommodations: AccommodationRecord[] = [], siteSettings?: SiteSettings) {
  const itineraryConfig = getItineraryDownloadConfig(itinerary);
  const config = siteSettings ? {...itineraryConfig, companyName: siteSettings.company.name, companyDescription: siteSettings.company.description, companyLogo: siteSettings.company.logo, contactEmail: siteSettings.company.email, contactPhone: siteSettings.company.phone, contactLocation: siteSettings.company.location, contactWebsite: siteSettings.company.website, contactWhatsApp: siteSettings.company.whatsapp} : itineraryConfig;
  const supplement = getTripSupplement(itinerary.slug);
  const accommodationMap = new Map(accommodations.filter(item => item.status === "published").map(item => [item.id, item]));
  const staysByDay = Object.fromEntries(itinerary.days.map(day => [day.dayNumber, (day.accommodationIds || []).map(id => accommodationMap.get(id)).filter((item): item is AccommodationRecord => Boolean(item && item.category !== "Other")).map(item => ({tier: item.category as StayOption["tier"], property: item.name, location: item.location, images: item.images.map(image => ({src: image.src, alt: image.alt}))}))]));
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${itinerary.title} itinerary`);
  pdf.setAuthor(config.companyName);
  pdf.setSubject(`${itinerary.durationDays}-day Tanzania safari itinerary`);
  pdf.setKeywords(["Tanzania", "safari", ...itinerary.destinations]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const fonts = {regular, bold, italic};
  const imageCache: ImageCache = new Map();
  const fallbackDayImages = ["/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png", "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png", "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png", "/images/figma/66d4cce3-2303-4bdf-a3b9-8d8f56ab67de.png"];
  const heroSources = [itinerary.heroImage, fallbackDayImages[0]].filter((source): source is string => Boolean(source));
  const accommodationSources = itinerary.days.flatMap(day => {
    const stays = staysByDay[day.dayNumber]?.length ? staysByDay[day.dayNumber] : supplement.staysByDay[day.dayNumber] || [];
    return stays.flatMap(stay => stay.images.map(image => image.src));
  });
  await preloadImages(pdf, [
    ...heroSources,
    config.companyLogo || "",
    "/images/figma/brand-mark.png",
    ...itinerary.days.flatMap((day, index) => [day.image || "", fallbackDayImages[index] || fallbackDayImages[0]]),
    ...accommodationSources,
  ], imageCache);
  const hero = await embedFirstImage(pdf, heroSources, imageCache);
  const logo = await embedFirstImage(pdf, [config.companyLogo || "", "/images/figma/brand-mark.png"].filter(Boolean), imageCache);
  const routeStops = itinerary.routeStops?.length ? itinerary.routeStops : itinerary.slug === "tarangire-serengeti-ngorongoro" ? northernCircuitRouteStops : itinerary.destinations.map((name, index) => ({name, label: `Stop ${index + 1}`, description: "Safari destination", dayNumber: index + 1, coordinates: {lat: -3.7 + index * .22, lng: 35.2 + index * .25}}));

  const cover = pdf.addPage(PAGE_SIZE);
  if (hero) drawCoverImage(cover, hero, {x: 0, y: 282, width: PAGE_WIDTH, height: PAGE_HEIGHT - 282});
  else cover.drawRectangle({x: 0, y: 282, width: PAGE_WIDTH, height: PAGE_HEIGHT - 282, color: charcoal});
  cover.drawRectangle({x: 0, y: 282, width: PAGE_WIDTH, height: PAGE_HEIGHT - 282, color: ink, opacity: .5});
  cover.drawRectangle({x: 0, y: 0, width: PAGE_WIDTH, height: 282, color: white});
  if (logo) drawFitImage(cover, logo, {x: 42, y: 780, width: 34, height: 34});
  cover.drawText(safeText(config.companyName), {x: 86, y: 795, size: 11, font: bold, color: white});
  drawLines(cover, config.companyDescription, {x: 86, y: 780, width: 390, size: 7.2, font: regular, color: rgb(.9, .88, .85), lineHeight: 10, maxLines: 2});
  cover.drawText("TAILOR-MADE TANZANIA SAFARI", {x: 42, y: 694, size: 8.5, font: bold, color: orange});
  drawLines(cover, itinerary.title, {x: 42, y: 654, width: 505, size: 31, font: bold, color: white, lineHeight: 36, maxLines: 3});
  drawLines(cover, itinerary.summary, {x: 42, y: 532, width: 485, size: 12, font: regular, color: white, lineHeight: 17, maxLines: 4});
  const contactLine = [config.contactPhone, config.contactEmail, config.contactWebsite].filter(Boolean).join("  /  ");
  cover.drawText(safeText(contactLine), {x: 42, y: 310, size: 7.5, font: regular, color: white});
  const dates = profile ? `${formatDate(profile.arrival)} - ${formatDate(profile.departure)}` : "Flexible / to be confirmed";
  const guestCount = profile ? profile.adults + profile.children : 0;
  const guests = profile ? `${guestCount} guest${guestCount === 1 ? "" : "s"} (${profile.adults} adult${profile.adults === 1 ? "" : "s"}${profile.children ? `, ${profile.children} child${profile.children === 1 ? "" : "ren"}` : ""})` : "Tailored to your group";
  const facts = [
    ["Duration", `${itinerary.durationDays} days / ${Math.max(0, itinerary.durationDays - 1)} nights`],
    ["Travel dates", dates],
    ["Guests", guests],
    ["Travel style", profile?.travelStyle || itinerary.travelStyle || "Camping, lodge or private"],
    ["Starting price", itinerary.startingPrice ? `From ${itinerary.currency} ${itinerary.startingPrice} pp/day` : "On request"],
  ];
  facts.forEach(([label, value], index) => drawFactCard(cover, label, value, 42 + index * 103, 165, 94, fonts));
  cover.drawText("DESTINATIONS", {x: 42, y: 139, size: 7, font: bold, color: orangeDeep});
  drawLines(cover, itinerary.destinations.join("  /  "), {x: 42, y: 121, width: 510, size: 9.2, font: regular, color: ink, lineHeight: 13, maxLines: 2});

  const routePage = pdf.addPage(PAGE_SIZE);
  drawPageHeader(routePage, config.companyName, itinerary.title, fonts);
  drawSectionTitle(routePage, "Your safari route", "A clear view of the journey from Arusha through northern Tanzania's celebrated wildlife landscapes.", fonts);
  drawRouteMap(routePage, routeStops, fonts);
  routePage.drawRectangle({x: 42, y: 76, width: 511, height: 238, color: pale, borderColor: line, borderWidth: .6});
  routePage.drawText("TRIP AT A GLANCE", {x: 60, y: 286, size: 7.2, font: bold, color: orangeDeep});
  const overview = [["Dates", dates], ["Guests", guests], ["Style", profile?.travelStyle || itinerary.travelStyle || "Tailored safari"], ["Start / finish", "Your accommodation in Arusha"]];
  overview.forEach(([label, value], index) => {
    const x = 60 + (index % 2) * 248;
    const y = 250 - Math.floor(index / 2) * 76;
    routePage.drawText(safeText(label).toUpperCase(), {x, y, size: 6.5, font: bold, color: orangeDeep});
    drawLines(routePage, value, {x, y: y - 17, width: 210, size: 9.5, font: bold, color: ink, lineHeight: 12, maxLines: 2});
  });
  drawLines(routePage, "All driving times and distances shown in this itinerary are estimates. Your guide may adjust the route for wildlife movements, road conditions and park regulations.", {x: 60, y: 111, width: 470, size: 7.5, font: italic, color: muted, lineHeight: 10, maxLines: 3});

  for (const [index, day] of itinerary.days.entries()) {
    const page = pdf.addPage(PAGE_SIZE);
    drawPageHeader(page, config.companyName, `Day ${day.dayNumber} - ${day.title}`, fonts);
    page.drawText(`DAY ${day.dayNumber}`, {x: 42, y: 754, size: 8.5, font: bold, color: orangeDeep});
    drawLines(page, day.title, {x: 42, y: 722, width: 510, size: 23, font: bold, color: ink, lineHeight: 27, maxLines: 2});
    drawLines(page, day.summary, {x: 42, y: 666, width: 510, size: 10, font: regular, color: muted, lineHeight: 14, maxLines: 2});
    const travel = supplement.travelByDay[day.dayNumber];
    const dayFacts = [["Habitat", day.habitat || "Varied safari landscape"], ["Driving", day.driveTime || travel?.driveTime || "Route dependent"], ["Distance", day.distance || travel?.distance || "Route dependent"], ["Activity", day.activityLevel || travel?.activityLevel || "Easy safari day"]];
    dayFacts.forEach(([label, value], factIndex) => drawFactCard(page, label, value, 42 + factIndex * 130, 581, 120, fonts));
    const dayImage = await embedFirstImage(pdf, [day.image || "", fallbackDayImages[index] || fallbackDayImages[0]].filter(Boolean), imageCache);
    if (dayImage) drawCoverImage(page, dayImage, {x: 42, y: 350, width: 511, height: 210});
    else page.drawRectangle({x: 42, y: 350, width: 511, height: 210, color: cream});
    page.drawRectangle({x: 42, y: 350, width: 511, height: 23, color: ink, opacity: .72});
    page.drawText(safeText(day.imageAlt || `${day.title} - safari experience`), {x: 53, y: 358, size: 7.2, font: regular, color: white});
    page.drawText("DAY EXPERIENCE", {x: 42, y: 325, size: 7.2, font: bold, color: orangeDeep});
    drawLines(page, day.narrative || day.activities[0]?.description || day.summary, {x: 42, y: 306, width: 330, size: 8.4, font: regular, color: muted, lineHeight: 11.4, maxLines: 4});
    page.drawText("ACTIVITIES", {x: 396, y: 325, size: 7.2, font: bold, color: orangeDeep});
    const activityTitles = day.activities.slice(0, 3).map(activity => activity.title).join(" / ") || "Safari day at leisure";
    drawLines(page, activityTitles, {x: 396, y: 306, width: 157, size: 8.2, font: bold, color: ink, lineHeight: 11.4, maxLines: 4});
    page.drawRectangle({x: 42, y: 220, width: 511, height: 46, color: cream, borderColor: line, borderWidth: .55});
    page.drawText("MEAL PLAN", {x: 56, y: 248, size: 6.7, font: bold, color: orangeDeep});
    drawLines(page, day.meals.join(" / ") || "Not listed", {x: 56, y: 232, width: 220, size: 8.7, font: bold, color: ink, lineHeight: 10, maxLines: 1});
    page.drawText("OVERNIGHT", {x: 300, y: 248, size: 6.7, font: bold, color: orangeDeep});
    const overnight = day.accommodation ? `${day.accommodation.category} - ${day.accommodation.location}` : "Return to Arusha / drop-off";
    drawLines(page, overnight, {x: 300, y: 232, width: 236, size: 8.7, font: bold, color: ink, lineHeight: 10, maxLines: 1});
    const stays = staysByDay[day.dayNumber]?.length ? staysByDay[day.dayNumber] : supplement.staysByDay[day.dayNumber] || [];
    if (stays.length) {
      page.drawText("ACCOMMODATION OPTIONS", {x: 42, y: 202, size: 7.2, font: bold, color: orangeDeep});
      await drawAccommodationCards(page, pdf, stays, fonts, imageCache);
    } else {
      page.drawRectangle({x: 42, y: 88, width: 511, height: 112, color: pale, borderColor: line, borderWidth: .6});
      page.drawText("END OF SAFARI", {x: 60, y: 172, size: 7.2, font: bold, color: orangeDeep});
      drawLines(page, "After the crater game drive and picnic lunch, return to your accommodation in Arusha. Airport transfer or an extra hotel night can be added on request.", {x: 60, y: 150, width: 470, size: 9.5, font: regular, color: ink, lineHeight: 14, maxLines: 4});
    }
  }

  const includedPage = pdf.addPage(PAGE_SIZE);
  drawPageHeader(includedPage, config.companyName, "Inclusions, exclusions and optional experiences", fonts);
  drawSectionTitle(includedPage, "What your safari includes", "Your final quotation confirms the exact package, selected accommodation and any requested upgrades.", fonts);
  includedPage.drawRectangle({x: 42, y: 395, width: 245, height: 270, color: pale, borderColor: line, borderWidth: .6});
  includedPage.drawRectangle({x: 308, y: 395, width: 245, height: 270, color: pale, borderColor: line, borderWidth: .6});
  includedPage.drawText("INCLUDED", {x: 60, y: 638, size: 8, font: bold, color: orangeDeep});
  drawBulletList(includedPage, itinerary.inclusions, {x: 60, y: 613, width: 208, font: regular, maxItems: 9});
  includedPage.drawText("NOT INCLUDED", {x: 326, y: 638, size: 8, font: bold, color: muted});
  drawBulletList(includedPage, itinerary.exclusions, {x: 326, y: 613, width: 208, font: regular, maxItems: 9, negative: true});
  includedPage.drawText("OPTIONAL EXPERIENCES", {x: 42, y: 365, size: 8, font: bold, color: orangeDeep});
  const optionalY = 335;
  (itinerary.optionalExperiences?.length ? itinerary.optionalExperiences : supplement.optionalExperiences).forEach((item, index) => {
    const x = 42 + (index % 2) * 266;
    const y = optionalY - Math.floor(index / 2) * 112;
    includedPage.drawRectangle({x, y: y - 86, width: 245, height: 92, color: white, borderColor: line, borderWidth: .6});
    includedPage.drawText(safeText(item.name), {x: x + 14, y: y - 16, size: 9.5, font: bold, color: ink});
    includedPage.drawText(safeText(item.price), {x: x + 14, y: y - 34, size: 8, font: bold, color: orangeDeep});
    drawLines(includedPage, item.note, {x: x + 14, y: y - 52, width: 217, size: 7.5, font: regular, color: muted, lineHeight: 10, maxLines: 3});
  });

  const practicalPage = pdf.addPage(PAGE_SIZE);
  drawPageHeader(practicalPage, config.companyName, "Practical travel information", fonts);
  drawSectionTitle(practicalPage, "Before you travel", "A compact checklist for a comfortable, well-prepared safari in northern Tanzania.", fonts);
  practicalPage.drawText("PRACTICAL INFORMATION", {x: 42, y: 649, size: 8, font: bold, color: orangeDeep});
  const practical = itinerary.practicalInformation?.length ? itinerary.practicalInformation : [
    "Bring a valid passport, arrange the appropriate Tanzania visa and travel with comprehensive travel insurance.",
    "Park roads can be dusty and uneven. Soft-sided luggage is easier to store in the safari vehicle.",
    "Please tell us about allergies, dietary requirements, mobility needs and celebrations before arrival.",
    "Drinking water is supplied on safari. Keep cash for tips and small personal purchases.",
  ];
  drawBulletList(practicalPage, practical, {x: 42, y: 623, width: 235, font: regular, maxItems: 7});
  practicalPage.drawText("PACKING NOTES", {x: 308, y: 649, size: 8, font: bold, color: orangeDeep});
  drawBulletList(practicalPage, itinerary.packingNotes?.length ? itinerary.packingNotes : supplement.packingNotes, {x: 308, y: 623, width: 235, font: regular, maxItems: 7});
  practicalPage.drawLine({start: {x: 42, y: 396}, end: {x: 553, y: 396}, thickness: .7, color: line});
  practicalPage.drawText("IMPORTANT BOOKING CONDITIONS", {x: 42, y: 370, size: 8, font: bold, color: orangeDeep});
  drawBulletList(practicalPage, itinerary.bookingConditions?.length ? itinerary.bookingConditions : supplement.bookingConditions, {x: 42, y: 343, width: 511, font: regular, maxItems: 6, negative: true});
  practicalPage.drawRectangle({x: 42, y: 58, width: 511, height: 110, color: ink});
  practicalPage.drawText("READY TO PLAN YOUR SAFARI?", {x: 62, y: 145, size: 8, font: bold, color: orange});
  practicalPage.drawText(safeText(config.companyName), {x: 62, y: 120, size: 18, font: bold, color: white});
  drawLines(practicalPage, config.companyDescription, {x: 62, y: 102, width: 300, size: 7.5, font: regular, color: rgb(.88, .86, .82), lineHeight: 10, maxLines: 3});
  const contacts = [config.contactPhone, config.contactWhatsApp ? `WhatsApp ${config.contactWhatsApp}` : "", config.contactEmail, config.contactWebsite].filter((value): value is string => Boolean(value));
  contacts.forEach((item, index) => practicalPage.drawText(safeText(item), {x: 382, y: 139 - index * 22, size: 8.2, font: index === 0 ? bold : regular, color: white}));

  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    page.drawLine({start: {x: 42, y: 39}, end: {x: 553, y: 39}, thickness: .55, color: line});
    page.drawText(`${safeText(config.companyName)}  /  ${safeText(config.contactWebsite || config.contactEmail)}`, {x: 42, y: 21, size: 7.1, font: regular, color: muted});
    const pageNumber = `${index + 1} / ${pages.length}`;
    page.drawText(pageNumber, {x: 553 - regular.widthOfTextAtSize(pageNumber, 7.2), y: 21, size: 7.2, font: bold, color: muted});
  });
  return pdf.save();
}
