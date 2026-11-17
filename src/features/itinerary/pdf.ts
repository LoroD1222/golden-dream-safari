import "server-only";

import {readFile} from "node:fs/promises";
import path from "node:path";
import {PDFDocument, StandardFonts, rgb, type PDFImage, type PDFFont, type PDFPage, type RGB} from "pdf-lib";
import type {Itinerary} from "@/features/itinerary/model";
import {getItineraryDownloadConfig} from "@/features/itinerary/download-config";
import {northernCircuitRouteStops} from "@/features/itinerary/route-data";

const PAGE_SIZE: [number, number] = [595.28, 841.89];
const ink = rgb(.07, .06, .055);
const orange = rgb(.95, .52, .18);
const cream = rgb(.965, .955, .94);
const muted = rgb(.38, .35, .31);
const line = rgb(.88, .85, .81);

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

async function embedPublicImage(pdf: PDFDocument, source?: string) {
  if (!source || !source.startsWith("/") || source.includes("..")) return null;
  try {
    const bytes = await readFile(path.join(process.cwd(), "public", source));
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return await pdf.embedJpg(bytes);
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return await pdf.embedPng(bytes);
  } catch {}
  return null;
}

function drawContainedImage(page: PDFPage, image: PDFImage, box: {x: number; y: number; width: number; height: number}) {
  page.drawRectangle({...box, color: cream});
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, {x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height});
}

export async function generateItineraryPdf(itinerary: Itinerary) {
  const config = getItineraryDownloadConfig(itinerary);
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${itinerary.title} itinerary`);
  pdf.setAuthor(config.companyName);
  pdf.setSubject(`${itinerary.durationDays}-day Tanzania safari itinerary`);
  pdf.setKeywords(["Tanzania", "safari", ...itinerary.destinations]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const hero = await embedPublicImage(pdf, itinerary.heroImage);
  const logo = await embedPublicImage(pdf, config.companyLogo || "/images/figma/brand-mark.png");
  let page = pdf.addPage(PAGE_SIZE);
  let y = 795;

  const drawHeader = (label = itinerary.title) => {
    page.drawText(config.companyName.toUpperCase(), {x: 42, y: 811, size: 8.5, font: bold, color: orange});
    const clipped = safeText(label).slice(0, 72);
    page.drawText(clipped, {x: 553 - Math.min(300, regular.widthOfTextAtSize(clipped, 8)), y: 811, size: 8, font: regular, color: muted});
    page.drawLine({start: {x: 42, y: 800}, end: {x: 553, y: 800}, thickness: .8, color: line});
    y = 778;
  };
  const newPage = (label?: string) => { page = pdf.addPage(PAGE_SIZE); drawHeader(label); };
  const ensure = (height: number, label?: string) => { if (y - height < 58) newPage(label); };
  const paragraph = (text: string, options: {size?: number; font?: PDFFont; color?: RGB; indent?: number; gap?: number; width?: number} = {}) => {
    const size = options.size || 10;
    const font = options.font || regular;
    const indent = options.indent || 0;
    const lines = wrap(text, font, size, options.width || 511 - indent);
    ensure(lines.length * size * 1.4 + (options.gap || 0));
    for (const textLine of lines) { page.drawText(textLine, {x: 42 + indent, y, size, font, color: options.color || ink}); y -= size * 1.4; }
    y -= options.gap || 0;
  };
  const sectionHeading = (title: string) => {
    ensure(52);
    y -= 4;
    page.drawText(safeText(title).toUpperCase(), {x: 42, y, size: 9, font: bold, color: orange});
    y -= 22;
  };
  const bulletList = (items: string[], positive = true) => {
    for (const item of items) {
      const lines = wrap(item, regular, 9.5, 475);
      ensure(lines.length * 14 + 5);
      page.drawCircle({x: 49, y: y + 3, size: 3.3, color: positive ? orange : muted});
      for (const textLine of lines) { page.drawText(textLine, {x: 62, y, size: 9.5, font: regular, color: ink}); y -= 13.5; }
      y -= 3;
    }
  };

  if (hero) drawContainedImage(page, hero, {x: 0, y: 392, width: 595.28, height: 450});
  else page.drawRectangle({x: 0, y: 392, width: 595.28, height: 450, color: ink});
  page.drawRectangle({x: 0, y: 392, width: 595.28, height: 450, color: ink, opacity: .48});
  if (logo) drawContainedImage(page, logo, {x: 42, y: 772, width: 34, height: 34});
  page.drawText(config.companyName.toUpperCase(), {x: 85, y: 785, size: 9, font: bold, color: rgb(1,1,1)});
  wrap(itinerary.title, bold, 31, 500).slice(0, 4).forEach((titleLine, index) => page.drawText(titleLine, {x: 42, y: 650 - index * 36, size: 31, font: bold, color: rgb(1,1,1)}));
  page.drawText(`${itinerary.durationDays} DAYS / ${Math.max(0, itinerary.durationDays - 1)} NIGHTS`, {x: 42, y: 432, size: 10, font: bold, color: orange});
  y = 355;
  paragraph(itinerary.summary, {size: 13, width: 500, gap: 20});
  [["DURATION", `${itinerary.durationDays} days`], ["PRICE", itinerary.startingPrice ? `From ${itinerary.currency} ${itinerary.startingPrice} pp/day` : "On request"], ["STYLE", itinerary.travelStyle || "Camping, lodge or private"]].forEach(([label, value], index) => {
    const x = 42 + index * 171;
    page.drawRectangle({x, y: 180, width: 157, height: 70, color: cream, borderColor: line, borderWidth: .5});
    page.drawText(label, {x: x + 13, y: 228, size: 7.5, font: bold, color: orange});
    wrap(value, bold, 10, 131).slice(0, 2).forEach((textLine, lineIndex) => page.drawText(textLine, {x: x + 13, y: 207 - lineIndex * 13, size: 10, font: bold, color: ink}));
  });
  page.drawText("DESTINATIONS", {x: 42, y: 144, size: 7.5, font: bold, color: orange});
  wrap(itinerary.destinations.join("  /  "), regular, 10, 500).slice(0, 3).forEach((textLine, index) => page.drawText(textLine, {x: 42, y: 124 - index * 14, size: 10, font: regular, color: ink}));

  newPage("Your route");
  sectionHeading("Your safari route");
  paragraph("A northern Tanzania journey planned from Arusha through the country's most celebrated wildlife landscapes.", {size: 11, color: muted, gap: 18});
  const routeStops = itinerary.slug === "tarangire-serengeti-ngorongoro" ? northernCircuitRouteStops : itinerary.destinations.map((name, index) => ({name, label: `Stop ${index + 1}`}));
  const routeTop = y;
  routeStops.forEach((stop, index) => {
    const stopY = routeTop - index * 54;
    if (index < routeStops.length - 1) page.drawLine({start: {x: 58, y: stopY - 9}, end: {x: 58, y: stopY - 47}, thickness: 1.5, color: orange, dashArray: [4, 4]});
    page.drawCircle({x: 58, y: stopY, size: index === 0 || index === routeStops.length - 1 ? 7 : 6, color: index === 0 || index === routeStops.length - 1 ? ink : orange, borderColor: rgb(1,1,1), borderWidth: 2});
    page.drawText(String(index + 1).padStart(2, "0"), {x: 82, y: stopY - 3, size: 8, font: bold, color: orange});
    page.drawText(safeText(stop.name), {x: 108, y: stopY - 4, size: 12, font: bold, color: ink});
    page.drawText(safeText(stop.label), {x: 430, y: stopY - 3, size: 8.5, font: regular, color: muted});
  });
  y = routeTop - routeStops.length * 54 - 8;
  sectionHeading("At a glance");
  paragraph(`${itinerary.durationDays} days beginning and ending in Arusha. Each day can be refined around your dates, preferred comfort level and the wildlife experiences you care about most.`, {size: 10.5});

  const fallbackDayImages = ["/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png", "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png", "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png", "/images/figma/66d4cce3-2303-4bdf-a3b9-8d8f56ab67de.png"];
  for (const [index, day] of itinerary.days.entries()) {
    ensure(335, `Day ${day.dayNumber}`);
    if (y < 760) { page.drawLine({start: {x: 42, y: y + 12}, end: {x: 553, y: y + 12}, thickness: .7, color: line}); }
    page.drawText(`DAY ${day.dayNumber}`, {x: 42, y, size: 8.5, font: bold, color: orange}); y -= 21;
    for (const titleLine of wrap(day.title, bold, 18, 510)) { page.drawText(titleLine, {x: 42, y, size: 18, font: bold, color: ink}); y -= 21; }
    paragraph(day.summary, {size: 9.5, color: muted, gap: 8});
    const dayImage = await embedPublicImage(pdf, day.image || fallbackDayImages[index]);
    if (dayImage) { ensure(145); drawContainedImage(page, dayImage, {x: 42, y: y - 130, width: 511, height: 130}); y -= 143; }
    if (day.habitat) {
      page.drawRectangle({x: 42, y: y - 28, width: 511, height: 28, color: cream});
      page.drawText("HABITAT", {x: 55, y: y - 18, size: 7, font: bold, color: orange});
      page.drawText(safeText(day.habitat), {x: 112, y: y - 19, size: 8.5, font: bold, color: ink}); y -= 40;
    }
    page.drawText("DAY PLAN", {x: 42, y, size: 7.5, font: bold, color: orange}); y -= 16;
    for (const activity of day.activities) {
      ensure(42);
      page.drawText(safeText(activity.title), {x: 42, y, size: 9.5, font: bold, color: ink});
      const meta = safeText([activity.time, activity.location].filter(Boolean).join("  /  "));
      if (meta) page.drawText(meta, {x: 553 - Math.min(250, regular.widthOfTextAtSize(meta, 7.5)), y, size: 7.5, font: italic, color: muted});
      y -= 15;
      paragraph(activity.description, {size: 8.5, color: muted, gap: 5});
    }
    ensure(56);
    page.drawRectangle({x: 42, y: y - 42, width: 511, height: 42, color: cream, borderColor: line, borderWidth: .5});
    page.drawText("MEALS", {x: 55, y: y - 15, size: 7, font: bold, color: orange});
    page.drawText(safeText(day.meals.join(" / ") || "Not listed"), {x: 55, y: y - 31, size: 8.5, font: regular, color: ink});
    if (day.accommodation) {
      page.drawText("ACCOMMODATION", {x: 282, y: y - 15, size: 7, font: bold, color: orange});
      page.drawText(safeText(`${day.accommodation.name} - ${day.accommodation.location}`), {x: 282, y: y - 31, size: 8.5, font: regular, color: ink});
    }
    y -= 58;
    const accommodationImage = await embedPublicImage(pdf, day.accommodation?.image);
    if (accommodationImage) { ensure(145); drawContainedImage(page, accommodationImage, {x: 42, y: y - 130, width: 511, height: 130}); y -= 143; }
  }

  newPage("What's included");
  sectionHeading("What's included"); bulletList(itinerary.inclusions);
  y -= 8; sectionHeading("Not included"); bulletList(itinerary.exclusions, false);
  if (itinerary.practicalInformation?.length) { y -= 8; sectionHeading("Practical information"); bulletList(itinerary.practicalInformation); }
  ensure(145); y -= 18;
  page.drawRectangle({x: 42, y: y - 120, width: 511, height: 120, color: ink});
  page.drawText("READY TO PLAN YOUR SAFARI?", {x: 62, y: y - 28, size: 9, font: bold, color: orange});
  page.drawText(config.companyName, {x: 62, y: y - 52, size: 16, font: bold, color: rgb(1,1,1)});
  page.drawText(safeText(config.contactEmail), {x: 62, y: y - 76, size: 9.5, font: regular, color: rgb(1,1,1)});
  page.drawText(safeText(`${config.contactPhone}  /  ${config.contactLocation}`), {x: 62, y: y - 95, size: 9.5, font: regular, color: rgb(1,1,1)});

  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({start: {x: 42, y: 38}, end: {x: 553, y: 38}, thickness: .6, color: line});
    pdfPage.drawText(`${config.companyName}  /  ${safeText(itinerary.title).slice(0, 55)}`, {x: 42, y: 21, size: 7.5, font: regular, color: muted});
    const pageNumber = `${index + 1} / ${pages.length}`;
    pdfPage.drawText(pageNumber, {x: 553 - regular.widthOfTextAtSize(pageNumber, 7.5), y: 21, size: 7.5, font: bold, color: muted});
  });
  return pdf.save();
}
