import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MarketingShell} from "@/components/marketing-shell";
import {contactDetails} from "@/data/site";

const pages = {
  terms: {title: "Terms & conditions", intro: "The terms that apply when you enquire about or book a trip with Golden Dream Safaris."},
  privacy: {title: "Privacy policy", intro: "How Golden Dream Safaris handles the information you share with us."},
  cookies: {title: "Cookie policy", intro: "Information about cookies and similar technologies on this website."},
  disclaimer: {title: "Website disclaimer", intro: "Important information about the travel content published on this website."},
} as const;

type LegalKey = keyof typeof pages;
type Props = {params: Promise<{legal: string}>};

export function generateStaticParams() { return Object.keys(pages).map(legal => ({legal})); }

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {legal} = await params;
  const page = pages[legal as LegalKey];
  if (!page) return {};
  return {title: page.title, description: page.intro, alternates: {canonical: `/${legal}`}};
}

export default async function LegalPage({params}: Props) {
  const {legal} = await params;
  const page = pages[legal as LegalKey];
  if (!page) notFound();
  return <MarketingShell><article className="legal-page section-shell"><p>Home&nbsp; / &nbsp;{page.title}</p><h1>{page.title}</h1><p className="legal-lead">{page.intro}</p><section><h2>About this page</h2><p>This page is provided as a clear starting point for guests planning a trip. Final booking terms, payment schedules, cancellation rules and inclusions are confirmed in your written proposal before you pay.</p></section><section><h2>Your information</h2><p>We use the details you provide to answer your enquiry and plan your trip. We do not sell personal information. Quote requests are sent securely to the Golden Dream Safaris team and retained only as needed to continue the conversation and meet legal obligations.</p></section><section><h2>Travel information</h2><p>Routes, accommodation, wildlife sightings, prices and availability can change. Your final itinerary and invoice are the authoritative record for your booking. Travellers are responsible for passports, visas, insurance and health requirements.</p></section><section><h2>Questions</h2><p>For a copy of the terms that apply to a specific trip, or for a privacy request, email <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>.</p></section><p className="legal-updated">Last updated: 16 November 2026</p></article></MarketingShell>;
}
