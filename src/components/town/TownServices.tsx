import { CheckCircle2 } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface TownServicesProps {
  town: TownData;
}

const TownServices = ({ town }: TownServicesProps) => {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Electrical Services Tailored for {town.name}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {town.serviceCatalog.join(" • ")}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {town.services.map((service) => (
            <div
              key={service.title}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-electric-700">{service.title}</h3>
              <p className="mt-4 flex-1 text-gray-600">{service.description}</p>
              <ul className="mt-6 space-y-3">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-electric-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TownServices;
