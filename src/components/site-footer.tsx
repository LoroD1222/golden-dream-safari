import Image from "next/image";
import Link from "next/link";
import {contactDetails, tripadvisorUrl} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";

const columns = [
  {title: "Trips", links: [["Wildlife safaris", "/trips"], ["Kilimanjaro trekking", "/trips#treks-zanzibar"], ["Mount Meru trekking", "/trips#treks-zanzibar"], ["Zanzibar", "/trips#treks-zanzibar"], ["Day trips", "/trips"], ["Custom trips", "/contact#quote"]]},
  {title: "Plan", links: [["What to expect", "/#included"], ["The parks", "/trips"], ["Weather & seasons", "/contact#faq"], ["FAQ", "/contact#faq"], ["Gallery", "/reviews"]]},
  {title: "Company", links: [["About us", "/about"], ["Reviews", "/reviews"], ["Contact", "/contact"], ["Get a free quote", "/contact#quote"]]},
];

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <Link className="brand brand--light" href="/"><Image src="/images/figma/brand-mark.png" alt="" width={44} height={44}/><span>Golden Dream Safaris</span></Link>
        <p>Local safari company in Arusha, Tanzania. Wildlife safaris, Kilimanjaro and Mount Meru treks, and Zanzibar.</p>
        <address>
          <a href={contactDetails.phoneHref}><FigmaIcon name="footer-whatsapp-contact" width={20}/>{contactDetails.phoneDisplay}</a>
          <a href={`mailto:${contactDetails.email}`}><FigmaIcon name="footer-mail" width={20}/>{contactDetails.email}</a>
          <span><FigmaIcon name="footer-pin" width={20}/>{contactDetails.location}</span>
        </address>
        <div className="social-links" aria-label="Contact and social links"><a href={tripadvisorUrl} aria-label="Find Golden Dream Safaris on Tripadvisor"><FigmaIcon name="footer-tripadvisor" width={22}/></a><span aria-label="Instagram"><FigmaIcon name="footer-instagram" width={22}/></span><span aria-label="Facebook"><FigmaIcon name="footer-facebook" width={22}/></span><a href={contactDetails.whatsapp} aria-label="WhatsApp Golden Dream Safaris"><FigmaIcon name="footer-whatsapp" width={22}/></a></div>
      </div>
      <div className="footer-columns">{columns.map(column => <div className="footer-column" key={column.title}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}</div>
    </div>
    <div className="footer-cta"><div><h2>Plan your trip with us</h2><p>Send a request, commitment-free. We hope to hear from you soon.</p></div><Link className="button button--orange" href="/contact#quote">Get a free quote<span className="button__arrow" aria-hidden><FigmaIcon name="arrow-footer" width={24}/></span></Link></div>
    <div className="footer-wordmark">GOLDEN DREAM</div>
    <div className="footer-bottom"><span>© 2026 Golden Dream Safaris. All rights reserved.</span><span><Link href="/terms">Terms & conditions</Link> · <Link href="/privacy">Privacy policy</Link> · <Link href="/cookies">Cookie policy</Link> · <Link href="/disclaimer">Disclaimer</Link></span></div>
  </footer>;
}
