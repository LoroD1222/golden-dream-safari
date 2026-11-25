import Image from "next/image";
import Link from "next/link";
import {contactDetails, socialLinks} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";

const columns = [
  {title: "Trips", links: [["Wildlife safaris", "/trips"], ["Kilimanjaro trekking", "/kilimanjaro"], ["Mount Meru trekking", "/trips?category=mount-meru"], ["Zanzibar", "/trips?category=zanzibar"], ["Day trips", "/trips?category=day-trips"], ["Custom trips", "/contact#quote"]]},
  {title: "Plan", links: [["What to expect", "/#included"], ["The parks", "/trips"], ["Weather & seasons", "/contact#faq"], ["FAQ", "/contact#faq"], ["Gallery", "/reviews"]]},
  {title: "Company", links: [["About us", "/about"], ["Reviews", "/reviews"], ["Contact", "/contact"], ["Get a free quote", "/contact#quote"]]},
];

const footerSocials = [
  {label: "Golden Dream Safaris on Tripadvisor", href: socialLinks.tripadvisor, icon: "footer-tripadvisor" as const},
  {label: "Golden Dream Safaris on Instagram", href: socialLinks.instagram, icon: "footer-instagram" as const},
  {label: "Golden Dream Safaris on Facebook", href: socialLinks.facebook, icon: "footer-facebook" as const},
  {label: "Chat with Golden Dream Safaris on WhatsApp", href: socialLinks.whatsapp, icon: "footer-whatsapp" as const},
];

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <Link className="brand brand--light" href="/"><Image src="/images/figma/brand-mark.png" alt="" width={44} height={44}/><span>Golden Dream Safaris</span></Link>
        <p>Golden Dream Safaris is a locally owned Tanzania tour operator specializing in private and group wildlife safaris, Great Migration experiences, Kilimanjaro climbing, Mount Meru trekking and tailor-made Zanzibar holidays.</p>
        <p>Expertly guided. Personally planned. Authentically Tanzanian.</p>
        <address>
          <a href={contactDetails.phoneHref}><FigmaIcon name="footer-whatsapp-contact" width={22} className="footer-contact-icon footer-contact-icon--phone"/>{contactDetails.phoneDisplay}</a>
          <a href={`mailto:${contactDetails.email}`}><FigmaIcon name="footer-mail" width={20} className="footer-contact-icon"/>{contactDetails.email}</a>
          <span><FigmaIcon name="footer-pin" width={20} className="footer-contact-icon"/>{contactDetails.location}</span>
        </address>
        <nav className="social-links" aria-label="Golden Dream Safaris social links">{footerSocials.map(({label,href,icon}) => <a href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" key={label}><FigmaIcon name={icon} width={22}/></a>)}</nav>
      </div>
      <div className="footer-columns">{columns.map(column => <div className="footer-column" key={column.title}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}</div>
    </div>
    <div className="footer-cta"><div><h2>You&apos;ve Dreamed of Tanzania. Now Let&apos;s Make It Yours.</h2><p>Imagine your first sunrise in the Serengeti, standing above the clouds on Kilimanjaro or watching the sun disappear over Zanzibar&apos;s turquoise waters. Whatever brings you to Tanzania, our local experts are here to turn your dreams into a personally crafted adventure. Let us share our home with you. Your journey begins with a conversation.</p></div><Link className="button button--orange" href="/contact#quote">Plan My Tanzania Adventure<span className="button__arrow" aria-hidden><FigmaIcon name="arrow-footer" width={24}/></span></Link></div>
    <div className="footer-wordmark">GOLDEN DREAM</div>
    <div className="footer-bottom"><span>© 2026 Golden Dream Safaris. All rights reserved.</span><span><Link href="/terms">Terms & conditions</Link> · <Link href="/privacy">Privacy policy</Link> · <Link href="/cookies">Cookie policy</Link> · <Link href="/disclaimer">Disclaimer</Link></span></div>
  </footer>;
}
