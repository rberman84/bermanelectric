import StructuredData from "./StructuredData";
import type { TownData } from "@/lib/townContent";

interface FaqSectionProps {
  town: TownData;
}

const FaqSection = ({ town }: FaqSectionProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: town.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-gray-50 py-16">
      <StructuredData data={faqSchema} id={`${town.slug}-faq-schema`} />
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {town.name} Electrical FAQs
          </h2>
          <p className="mt-4 text-gray-600">
            Answers from Berman Electric's master electricians to the most common {town.name} questions.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {town.faq.map((item) => (
            <div key={item.question} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-electric-700">{item.question}</h3>
              <p className="mt-3 text-gray-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
