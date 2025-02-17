
import { CheckCircle2 } from "lucide-react";

const services = [
  "Free quotes for residential & commercial projects",
  "Electrical troubleshooting & repairs",
  "Panel upgrades & installations",
  "EV chargers & smart home wiring",
  "Generator installations & more!"
];

const ServicesList = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-semibold mb-6">📌 What we can help with:</h3>
      <ul className="space-y-4">
        {services.map((service, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
            <span className="text-gray-700">{service}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesList;
