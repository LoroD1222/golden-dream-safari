"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";

const links = [
  {href: "/", label: "Home"},
  {href: "/trips", label: "Safaris"},
  {href: "/trips#treks-zanzibar", label: "Kilimanjaro"},
  {href: "/trips#treks-zanzibar", label: "Zanzibar"},
  {href: "/trips#day-trips", label: "Day trips"},
  {href: "/about", label: "About"},
  {href: "/reviews", label: "Reviews"},
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1001px)");
    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeAtDesktopWidth);
    return () => desktop.removeEventListener("change", closeAtDesktopWidth);
  }, []);

  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Golden Dream Safaris home" onClick={() => setOpen(false)}>
      <Image src="/images/figma/brand-mark.png" alt="" width={35} height={35} priority />
      <span>Golden Dream Safaris</span>
    </Link>
    <button className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(value => !value)}>
      <span className="menu-toggle__line"/><span className="menu-toggle__line"/><span className="menu-toggle__line"/>
    </button>
    <button className={`site-nav-backdrop ${open ? "site-nav-backdrop--open" : ""}`} type="button" aria-label="Close navigation" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(false)}/>
    <nav id="site-navigation" className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Main navigation">
      {links.map((link, index) => <span className="site-nav__item" key={`${link.href}-${link.label}`}>
        <Link aria-current={pathname === link.href ? "page" : undefined} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
        {index < links.length - 1 && <i aria-hidden/>}
      </span>)}
      <Link className="button button--orange site-nav__mobile-cta" href="/contact#quote" onClick={() => setOpen(false)}>Get a free quote<span className="button__arrow" aria-hidden><FigmaIcon name="arrow-header" width={19}/></span></Link>
    </nav>
    <Link className="button button--orange header-quote" href="/contact#quote">Get a free quote<span className="button__arrow" aria-hidden><FigmaIcon name="arrow-header" width={19}/></span></Link>
  </header>;
}
