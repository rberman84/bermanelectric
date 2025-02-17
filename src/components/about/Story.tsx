
import { CheckCircle2 } from "lucide-react";

const Story = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Berman Electric was founded with a clear mission: to provide expert electrical 
            solutions with integrity, precision, and professionalism. Over the years, we've 
            grown into a leading electrical contractor known for:
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
              <span className="text-lg text-gray-700">
                High-quality workmanship backed by industry expertise
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
              <span className="text-lg text-gray-700">
                Exceptional customer service with a personal touch
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
              <span className="text-lg text-gray-700">
                Innovative solutions tailored to modern electrical needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
              <span className="text-lg text-gray-700">
                Strict adherence to safety standards & local electrical codes
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Story;
