import { HelpCircle } from "lucide-react";
import FAQSchema, { FAQItem } from "@/components/schema/FAQSchema";

interface ServiceFAQProps {
  title: string;
  faqs: FAQItem[];
}

const ServiceFAQ = ({ title, faqs }: ServiceFAQProps) => {
  return (
    <section className="py-24 bg-gray-50">
      <FAQSchema faqs={faqs} />
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-electric-600" />
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-electric-700 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
