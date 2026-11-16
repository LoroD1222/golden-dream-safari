import {PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB} from "pdf-lib";
import {getItineraryRepository} from "@/features/itinerary/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function wrappedLines(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = `${line} ${word}`.trim();
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pdfSafeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, "*")
    .replace(/[^\x20-\x7E]/g, "");
}

export async function GET(_request: Request, {params}: {params: Promise<{slug: string}>}) {
  const itinerary = await getItineraryRepository().get((await params).slug);
  if (!itinerary || itinerary.status !== "published") return new Response("Itinerary not found", {status: 404});
  const pdf = await PDFDocument.create();
  pdf.setTitle(itinerary.title);
  pdf.setAuthor("Golden Dream Safaris");
  pdf.setSubject(`${itinerary.durationDays}-day Tanzania safari itinerary`);
  pdf.setKeywords(["Tanzania", "safari", ...itinerary.destinations]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const orange = rgb(.94, .54, .20);
  const ink = rgb(.08, .07, .06);
  let page: PDFPage = pdf.addPage([595, 842]);
  let y = 690;
  const addContinuationPage = () => {
    page = pdf.addPage([595, 842]);
    page.drawText("GOLDEN DREAM SAFARIS", {x: 48, y: 804, size: 9, font: bold, color: orange});
    page.drawLine({start: {x: 48, y: 794}, end: {x: 547, y: 794}, thickness: 1, color: rgb(.88, .86, .82)});
    y = 770;
  };
  const ensureSpace = (height: number) => {
    if (y - height < 58) addContinuationPage();
  };
  const draw = (text: string, size = 10, options?: {isBold?: boolean; color?: RGB; indent?: number}) => {
    const font = options?.isBold ? bold : regular;
    const indent = options?.indent || 0;
    for (const line of wrappedLines(pdfSafeText(text), font, size, 499 - indent)) {
      ensureSpace(size * 1.45);
      page.drawText(line, {x: 48 + indent, y, size, font, color: options?.color || ink});
      y -= size * 1.45;
    }
  };
  page.drawRectangle({x: 0, y: 690, width: 595, height: 152, color: ink});
  page.drawText("GOLDEN DREAM SAFARIS", {x: 48, y: 806, size: 10, font: bold, color: orange});
  wrappedLines(pdfSafeText(itinerary.title), bold, 23, 499).slice(0, 3).forEach((line, index) => {
    page.drawText(line, {x: 48, y: 772 - index * 28, size: 23, font: bold, color: rgb(1,1,1)});
  });
  y = 664;
  draw(`${itinerary.durationDays} days / ${itinerary.durationDays - 1} nights`, 12, {isBold: true, color: orange});
  y -= 5; draw(itinerary.summary, 11); y -= 18;
  for (const day of itinerary.days) {
    ensureSpace(72);
    draw(`DAY ${day.dayNumber}  ${day.title}`, 14, {isBold: true});
    y -= 3; draw(day.summary, 10);
    for (const activity of day.activities) draw(`• ${activity.title}: ${activity.description}`, 9, {indent: 12});
    if (day.accommodation) draw(`Accommodation: ${day.accommodation.name}, ${day.accommodation.location}`, 9, {isBold: true});
    draw(`Meals: ${day.meals.join(", ") || "Not listed"}`, 9); y -= 16;
  }
  ensureSpace(70);
  draw("WHAT'S INCLUDED", 14, {isBold: true, color: orange});
  for (const item of itinerary.inclusions) draw(`• ${item}`, 9, {indent: 12});
  y -= 14;
  ensureSpace(110);
  draw("NOT INCLUDED", 14, {isBold: true, color: orange});
  for (const item of itinerary.exclusions) draw(`• ${item}`, 9, {indent: 12});
  y -= 20; draw("goldendreamsafaris@gmail.com  |  +255 763 571 646  |  Arusha, Tanzania", 9, {isBold: true});
  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({start: {x: 48, y: 38}, end: {x: 547, y: 38}, thickness: .7, color: rgb(.86, .84, .80)});
    pdfPage.drawText(`Golden Dream Safaris  |  ${index + 1} of ${pages.length}`, {x: 48, y: 22, size: 8, font: regular, color: rgb(.38, .35, .31)});
  });
  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {headers: {"content-type": "application/pdf", "content-disposition": `attachment; filename="${itinerary.slug}.pdf"`, "cache-control": "no-store"}});
}
