import {SectionPill} from "@/components/button-link";
import {StructuredData} from "@/components/structured-data";
import {commonFaqs, contactDetails} from "@/data/site";
import {FigmaIcon} from "@/components/figma-icon";

export function FaqSection({compact = false}: {compact?: boolean}) {
  return <section className={`faq-section ${compact ? "faq-section--compact" : ""}`} id="faq">
    <StructuredData data={{"@context": "https://schema.org", "@type": "FAQPage", mainEntity: commonFaqs.map(faq => ({"@type": "Question", name: faq.question, acceptedAnswer: {"@type": "Answer", text: faq.answer}}))}}/>
    <div className="faq-intro"><SectionPill>FAQ</SectionPill><h2>Questions before you book</h2><p>Can&apos;t find your answer? Send us a message. It&apos;s free and commits you to nothing.</p><div className="question-card"><span className="question-avatar">V</span><h3>Still have a question?</h3><p>Ask on WhatsApp or by email. No commitment.</p><a className="button button--orange" href={contactDetails.whatsapp}><FigmaIcon name="faq-whatsapp" width={23}/>WhatsApp Victor</a></div></div>
    <div className="faq-list">{commonFaqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span aria-hidden><FigmaIcon className="faq-plus" name="faq-plus" width={18}/><FigmaIcon className="faq-minus" name="faq-minus" width={18}/></span></summary><p>{faq.answer}</p></details>)}</div>
  </section>;
}
