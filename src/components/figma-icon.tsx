import type {CSSProperties} from "react";
import Image from "next/image";

const iconFiles = {
  "arrow-header": "arrow-header.svg",
  "arrow-hero": "arrow-hero.svg",
  "arrow-plan": "arrow-plan.svg",
  "arrow-host": "arrow-host.svg",
  "arrow-highlight": "arrow-highlight.svg",
  "arrow-card": "arrow-card.svg",
  "arrow-up-right": "arrow-up-right.svg",
  "arrow-footer": "arrow-footer.svg",
  "whatsapp-hero": "whatsapp-hero.svg",
  "highlight-whatsapp": "highlight-whatsapp.svg",
  "form-globe": "form-globe.svg",
  "form-calendar": "form-calendar.svg",
  "form-user": "form-user.svg",
  "form-chevron": "form-chevron.svg",
  "pin-card": "pin-card.svg",
  "clock-card": "clock-card.svg",
  "chevron-card": "chevron-card.svg",
  "people-card": "people-card.svg",
  "house-card": "house-card.svg",
  "stars-rating": "stars-rating.svg",
  "stars-review": "stars-review.svg",
  "contact-whatsapp": "contact-whatsapp.svg",
  "contact-mail": "contact-mail.svg",
  "contact-pin": "contact-pin.svg",
  "footer-whatsapp-contact": "footer-whatsapp-contact.svg",
  "footer-mail": "footer-mail.svg",
  "footer-pin": "footer-pin.svg",
  "footer-tripadvisor": "footer-tripadvisor.svg",
  "footer-instagram": "footer-instagram.svg",
  "footer-facebook": "footer-facebook.svg",
  "footer-whatsapp": "footer-whatsapp.svg",
  "faq-whatsapp": "faq-whatsapp.svg",
  "faq-plus": "faq-plus.svg",
  "faq-minus": "faq-minus.svg",
  "detail-arrow": "detail-arrow.svg",
  "detail-whatsapp": "detail-whatsapp.svg",
  "detail-duration": "detail-duration.svg",
  "detail-start": "detail-start.svg",
  "detail-parks": "detail-parks.svg",
  "detail-group": "detail-group.svg",
  "detail-best": "detail-best.svg",
  check: "check.svg",
  download: "download.svg",
  book: "book.svg",
  bed: "bed.svg",
  meal: "meal.svg",
  info: "info.svg",
  "package-camping": "package-camping.svg",
  "package-lodge": "package-lodge.svg",
  "package-luxury": "package-luxury.svg",
  "chevron-prev": "chevron-prev.svg",
  "chevron-next": "chevron-next.svg",
  "included-check": "included-check.svg",
  "on-request": "on-request.svg",
  excluded: "excluded.svg",
  "graduation-cap": "graduation-cap.svg",
  "value-local": "value-local.svg",
  "value-service": "value-service.svg",
  "value-recommended": "value-recommended.svg",
  "value-honesty": "value-honesty.svg",
  "booking-chat": "booking-chat.svg",
  "booking-dates": "booking-dates.svg",
  "booking-plan": "booking-plan.svg",
  "booking-pickup": "booking-pickup.svg",
  "quote-calendar": "quote-calendar.svg",
  "quote-back": "quote-back.svg",
  "quote-arrow": "quote-arrow.svg",
  "quote-success": "quote-success.svg",
  "tier-radio": "tier-radio.svg",
  "tier-radio-selected": "tier-radio-selected.svg",
  "quote-chevron": "quote-chevron.svg",
  "orange-dot": "orange-dot.svg",
} as const;

export type FigmaIconName = keyof typeof iconFiles;

export function FigmaIcon({name, width = 20, height = width, className = "", style}: {
  name: FigmaIconName;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return <Image
    aria-hidden="true"
    alt=""
    className={`figma-icon ${className}`.trim()}
    src={`/icons/figma/${iconFiles[name]}`}
    width={width}
    height={height}
    unoptimized
    style={{width, height, ...style}}
  />;
}

export function RatingStars({compact = false, className = ""}: {compact?: boolean; className?: string}) {
  return <FigmaIcon
    name={compact ? "stars-review" : "stars-rating"}
    width={compact ? 116 : 126}
    height={compact ? 20 : 22}
    className={`rating-stars ${className}`.trim()}
  />;
}
