import Link from "next/link";
import type {ReactNode} from "react";
import {FigmaIcon} from "@/components/figma-icon";

export function ButtonLink({href, children, variant = "orange", className = ""}: {href: string; children: ReactNode; variant?: "orange" | "dark" | "outline" | "light"; className?: string}) {
  return <Link className={`button button--${variant} ${className}`.trim()} href={href}>{children}<span className="button__arrow" aria-hidden><FigmaIcon name={variant === "light" ? "arrow-hero" : "arrow-header"} width={20}/></span></Link>;
}

export function SectionPill({children}: {children: ReactNode}) {
  return <span className="section-pill"><FigmaIcon name="orange-dot" width={6}/>{children}</span>;
}
