"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const items = [
  {href: "/admin/trip-settings", label: "Trip Settings", icon: "settings"},
  {href: "/admin/trips", label: "Trips", icon: "globe"},
  {href: "/admin/accommodations", label: "Accommodations", icon: "home"},
  {href: "/admin/reviews", label: "Reviews", icon: "star"},
  {href: "/admin/review-categories", label: "Review Categories", icon: "tags"},
] as const;

function AdminIcon({name}: {name: typeof items[number]["icon"]}) {
  if (name === "settings") return <svg viewBox="0 0 24 24" aria-hidden><path d="M12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25Zm8 3.75-2.05-1.12a6.2 6.2 0 0 0-.48-1.15l.66-2.24-1.62-1.62-2.24.66a6.2 6.2 0 0 0-1.15-.48L12 4H9.7L8.58 6.05a6.2 6.2 0 0 0-1.15.48l-2.24-.66-1.62 1.62.66 2.24a6.2 6.2 0 0 0-.48 1.15L1.7 12v2.3l2.05 1.12c.12.4.28.78.48 1.15l-.66 2.24 1.62 1.62 2.24-.66c.37.2.75.36 1.15.48L9.7 22H12l1.12-2.05c.4-.12.78-.28 1.15-.48l2.24.66 1.62-1.62-.66-2.24c.2-.37.36-.75.48-1.15L20 14v-2Z"/></svg>;
  if (name === "globe") return <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>;
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden><path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M8 21v-7h8v7"/></svg>;
  if (name === "star") return <svg viewBox="0 0 24 24" aria-hidden><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden><path d="M4 5h7l9 9-6 6-9-9V5Z"/><circle cx="8" cy="8" r="1"/><path d="M12 5h3l6 6"/></svg>;
}

export function AdminSidebar() {
  const pathname = usePathname();
  return <aside className="cms-sidebar">
    <div className="cms-brand"><span>GD</span><div><strong>Golden Dream</strong><small>Content Studio</small></div></div>
    <div className="cms-sidebar-group"><p>Website Content</p><nav aria-label="CMS sections">{items.map(item => <Link className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : ""} href={item.href} key={item.href}><AdminIcon name={item.icon}/><span>{item.label}</span><b aria-hidden>›</b></Link>)}</nav></div>
    <Link className="cms-view-site" href="/" target="_blank">View public website <span aria-hidden>↗</span></Link>
  </aside>;
}
