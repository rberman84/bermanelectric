import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, Car, Zap } from "lucide-react";

interface RelatedService {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

interface RelatedServicesProps {
  currentService: string;
  className?: string;
}

const allServices: Record<string, RelatedService> = {
  residential: {
    title: "Residential Electrical Services",
    description: "Complete home wiring, panel upgrades, lighting, and smart home installations",
    url: "/residential",
    icon: <Home className="w-6 h-6" />
  },
  commercial: {
    title: "Commercial Electrical Services",
    description: "Business electrical solutions for offices, retail, warehouses, and more",
    url: "/commercial",
    icon: <Building2 className="w-6 h-6" />
  },
  evcharger: {
    title: "EV Charger Installation",
    description: "Level 2 home and commercial EV charging station installations",
    url: "/ev-charger",
    icon: <Car className="w-6 h-6" />
  },
  emergency: {
    title: "24/7 Emergency Services",
    description: "Rapid response for electrical emergencies, power outages, and urgent repairs",
    url: "/emergency",
    icon: <Zap className="w-6 h-6" />
  }
};

const RelatedServices = ({ currentService, className = "" }: RelatedServicesProps) => {
  const relatedServices = Object.entries(allServices)
    .filter(([key]) => key !== currentService)
    .map(([, service]) => service);

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our Other Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive electrical solutions for every need across Long Island
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {relatedServices.map((service, index) => (
            <Link
              key={index}
              to={service.url}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200 hover:border-electric-400"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-electric-50 text-electric-600 rounded-lg group-hover:bg-electric-100 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-electric-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {service.description}
                  </p>
                  <div className="flex items-center text-electric-600 text-sm font-medium group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;
