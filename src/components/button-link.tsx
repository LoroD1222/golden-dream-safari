import Link from "next/link";
import type {ReactNode} from "react";
import {FigmaIcon} from "@/components/figma-icon";

export function ButtonLink({href, children, variant = "orange", className = ""}: {href: string; children: ReactNode; variant?: "orange" | "dark" | "outline" | "light"; className?: string}) {
  const arrow = variant === "light" ? "arrow-hero" : variant === "dark" ? "arrow-host" : "arrow-header";
  return <Link className={`button button--${variant} ${className}`.trim()} href={href}>{children}<span className="button__arrow" aria-hidden><FigmaIcon name={arrow} width={20}/></span></Link>;
}

export function SectionPill({children}: {children: ReactNode}) {
  return <span className="section-pill"><span aria-hidden/>{children}</span>;
}
