import type {ReactNode} from "react";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {WhatsAppWidget} from "@/components/whatsapp-widget";

export function MarketingShell({children}: {children: ReactNode}) {
  return <><SiteHeader/><main>{children}</main><SiteFooter/><WhatsAppWidget/></>;
}
