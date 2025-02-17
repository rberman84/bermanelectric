
import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Over 20 Years of Experience in residential & commercial electrical work",
  "Licensed & Insured professionals delivering top-tier results",
  "Fast & Reliable Service, including 24/7 emergency repairs",
  "Honest, Upfront Pricing with no hidden costs",
  "Customer Satisfaction Guaranteed – We stand behind every project"
];

const TrustReasons = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Clients Trust Berman Electric
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustReasons;
