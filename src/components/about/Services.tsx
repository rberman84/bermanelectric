
import { CheckCircle2 } from "lucide-react";

const services = [
  "Electrical Installations & Upgrades",
  "Lighting & Smart Home Solutions",
  "Emergency Electrical Repairs (24/7 Service)",
  "Commercial & Industrial Electrical Services",
  "EV Charger & Generator Installations"
];

const Services = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 flex-shrink-0" />
                  <span className="text-lg text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
