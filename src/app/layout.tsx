import "@fontsource-variable/urbanist";
import "./globals.css";
import type {Metadata, Viewport} from "next";
import {siteOrigin} from "@/data/site";

export const viewport: Viewport = {width: "device-width", initialScale: 1, themeColor: "#0b0907"};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {default: "Golden Dream Safaris | Local Tanzania safari company", template: "%s | Golden Dream Safaris"},
  description: "Local safari company in Arusha for tailor-made wildlife safaris, Kilimanjaro and Mount Meru treks, and Zanzibar stays.",
  applicationName: "Golden Dream Safaris",
  openGraph: {type: "website", siteName: "Golden Dream Safaris", locale: "en_US"},
  twitter: {card: "summary_large_image"},
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
