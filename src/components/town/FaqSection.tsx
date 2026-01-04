import StructuredData from "./StructuredData";
import type { TownData } from "@/lib/townContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionProps {
  town: TownData;
}

const FaqSection = ({ town }: FaqSectionProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.bermanelectrical.com/locations/${town.slug}#faq`,
    mainEntity: town.faq.map((item, index) => ({
      "@type": "Question",
      "@id": `https://www.bermanelectrical.com/locations/${town.slug}#faq-${index}`,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-muted py-16" id="faq">
      <StructuredData data={faqSchema} id={`${town.slug}-faq-schema`} />
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            {town.name} Electrical FAQs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Common questions from {town.name} homeowners and business owners, answered by our master electricians.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
            {town.faq.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 text-left">
                  <span className="font-semibold text-foreground pr-4">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional FAQ context */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">
            Have a question not answered here?
          </p>
          <a
            href="tel:+15163614068"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Call (516) 361-4068
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
