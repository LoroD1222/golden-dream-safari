import Link from "next/link";
import {MarketingShell} from "@/components/marketing-shell";
import {FigmaIcon} from "@/components/figma-icon";

export default function NotFound() {
  return <MarketingShell><section className="not-found section-shell"><span>404</span><h1>This trail ends here.</h1><p>The page you were looking for has moved, but your Tanzania trip can still start here.</p><div><Link className="button button--orange" href="/">Back to home<span className="button__arrow"><FigmaIcon name="arrow-header" width={20}/></span></Link><Link className="button button--outline" href="/trips">Explore trips</Link></div></section></MarketingShell>;
}
