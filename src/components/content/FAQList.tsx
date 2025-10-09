import type { FAQItem } from "@/lib/content";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface FAQListProps {
  items: FAQItem[];
}

const FAQList = ({ items }: FAQListProps) => {
  if (!items?.length) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      <div className="mt-6 space-y-4">
        {items.map((faq) => {
          const id = `faq-answer-${slugify(faq.question)}`;
          return (
            <details key={faq.question} className="group rounded-2xl border border-gray-100 bg-white p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-electric-900">
                <span className="flex items-center justify-between">
                  {faq.question}
                  <span className="ml-4 text-sm font-medium text-electric-600 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p id={id} className="mt-3 text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </details>
          );
        })}
      </div>
    </section>
  );
};

export default FAQList;
