import Image from "next/image";
import {SectionEyebrow} from "@/components/button-link";
import {StructuredData} from "@/components/structured-data";
import {commonFaqs, contactDetails} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";
import type {ItineraryFaq} from "@/features/itinerary/model";

type FaqSectionProps = {
  compact?: boolean;
  items?: ItineraryFaq[];
  title?: string;
  intro?: string;
  questionTitle?: string;
  questionCopy?: string;
  questionButtonLabel?: string;
};

export function FaqSection({
  compact = false,
  items,
  title = "Questions before you book",
  intro = "Can't find your answer? Send us a message. It's free and commits you to nothing.",
  questionTitle = "Still have a question?",
  questionCopy = "Ask on WhatsApp or by email. No commitment.",
  questionButtonLabel = "WhatsApp Victor",
}: FaqSectionProps) {
  const faqs = items?.length ? items : commonFaqs;
  return <section className={`faq-section ${compact ? "faq-section--compact" : ""}`} id="faq">
    <StructuredData data={{"@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({"@type": "Question", name: faq.question, acceptedAnswer: {"@type": "Answer", text: faq.answer}}))}}/>
    <div className="faq-intro"><SectionEyebrow>FAQ</SectionEyebrow><h2>{title}</h2><p>{intro}</p><div className="question-card"><span className="question-avatar"><Image src="/images/figma/faq-victor-avatar.png" alt="Victor Costa" width={592} height={993} quality={95}/></span><h3>{questionTitle}</h3><p>{questionCopy}</p><a className="button button--orange" href={contactDetails.whatsapp}><FigmaIcon name="faq-whatsapp" width={23}/>{questionButtonLabel}</a></div></div>
    <div className="faq-list">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span aria-hidden><FigmaIcon className="faq-plus" name="faq-plus" width={18}/><FigmaIcon className="faq-minus" name="faq-minus" width={18}/></span></summary><p>{faq.answer}</p></details>)}</div>
  </section>;
}
