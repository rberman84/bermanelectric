import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home, Building2, Zap, Car, Wrench } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface TownServicesProps {
  town: TownData;
}

// Service page links for internal linking
const servicePageLinks = [
  { name: "Residential Electrical", slug: "/residential", icon: Home, keywords: ["home", "house", "panel", "outlet", "lighting"] },
  { name: "Commercial Electrical", slug: "/commercial", icon: Building2, keywords: ["business", "office", "retail", "warehouse"] },
  { name: "EV Charger Installation", slug: "/ev-charger", icon: Car, keywords: ["ev", "charger", "electric vehicle", "tesla"] },
  { name: "Emergency Services", slug: "/emergency", icon: Zap, keywords: ["emergency", "24/7", "urgent", "power outage"] },
];

const TownServices = ({ town }: TownServicesProps) => {
  // Determine which service pages are most relevant based on town services
  const townServiceText = town.serviceCatalog.join(" ").toLowerCase() + " " + 
    town.services.map(s => s.title + " " + s.description).join(" ").toLowerCase();
  
  const relevantServices = servicePageLinks.filter(service => 
    service.keywords.some(keyword => townServiceText.includes(keyword))
  );

  // If less than 4 services matched, include remaining ones
  const linkedServices = relevantServices.length >= 4 
    ? relevantServices.slice(0, 6)
    : [...relevantServices, ...servicePageLinks.filter(s => !relevantServices.includes(s))].slice(0, 6);

  return (
    <section className="bg-card py-16" id="services">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground">
          Electrical Services in {town.name}, NY
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From {town.neighborhoods[0]} to {town.neighborhoods[town.neighborhoods.length - 1]}, 
          our licensed electricians provide comprehensive electrical services tailored to {town.name}'s 
          unique homes and businesses.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        {town.services.map((service) => (
          <div
            key={service.title}
            className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
          >
            <h3 className="text-xl font-semibold text-primary">{service.title}</h3>
            <p className="mt-4 flex-1 text-muted-foreground">{service.description}</p>
            <ul className="mt-6 space-y-3">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Internal Links to Service Pages */}
      <div className="bg-muted rounded-2xl p-8">
        <h3 className="text-xl font-bold text-center mb-6">
          Explore Our {town.name} Electrical Services
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {linkedServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                to={service.slug}
                className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                    {service.name}
                  </span>
                  <span className="text-xs text-muted-foreground">in {town.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          All services available in {town.zipCodes.join(", ")} and surrounding areas
        </p>
      </div>

      {/* Service Catalog List */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Complete Service Catalog for {town.name}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {town.serviceCatalog.map((service) => (
            <span
              key={service}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              <Wrench className="w-3 h-3" />
              {service}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TownServices;
