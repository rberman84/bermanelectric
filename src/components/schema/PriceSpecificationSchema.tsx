import StructuredData from "../town/StructuredData";

export interface ServicePriceSpec {
  name: string;
  description: string;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency?: string;
  unitText?: string;
  priceType?: "Hourly" | "Fixed" | "Estimate";
}

interface PriceSpecificationSchemaProps {
  services: ServicePriceSpec[];
}

/**
 * PriceSpecificationSchema - Provides transparent pricing signals to search engines
 * Helps with rich snippets and builds trust with potential customers
 */
const PriceSpecificationSchema = ({ services }: PriceSpecificationSchemaProps) => {
  const defaultServices: ServicePriceSpec[] = [
    {
      name: "Electrical Service Call",
      description: "Standard diagnostic service call to assess electrical issues",
      minPrice: 85,
      maxPrice: 150,
      priceCurrency: "USD",
      unitText: "per visit",
      priceType: "Fixed"
    },
    {
      name: "Panel Upgrade (100A to 200A)",
      description: "Upgrade electrical panel from 100 amp to 200 amp service",
      minPrice: 1800,
      maxPrice: 3500,
      priceCurrency: "USD",
      priceType: "Estimate"
    },
    {
      name: "EV Charger Installation (Level 2)",
      description: "Professional Level 2 EV charger installation",
      minPrice: 800,
      maxPrice: 2500,
      priceCurrency: "USD",
      priceType: "Estimate"
    },
    {
      name: "Outlet Installation",
      description: "Install new electrical outlet including wiring",
      minPrice: 150,
      maxPrice: 350,
      priceCurrency: "USD",
      unitText: "per outlet",
      priceType: "Fixed"
    },
    {
      name: "Whole House Generator Installation",
      description: "Complete standby generator installation with transfer switch",
      minPrice: 8000,
      maxPrice: 15000,
      priceCurrency: "USD",
      priceType: "Estimate"
    },
    {
      name: "Emergency Service Call",
      description: "24/7 emergency electrical service call",
      minPrice: 150,
      maxPrice: 250,
      priceCurrency: "USD",
      unitText: "per visit",
      priceType: "Fixed"
    }
  ];

  const servicesToUse = services.length > 0 ? services : defaultServices;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://bermanelectrical.com/#pricing",
    "name": "Berman Electric",
    "url": "https://bermanelectrical.com",
    "priceRange": "$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Electrical Services",
      "itemListElement": servicesToUse.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": service.priceCurrency || "USD",
          ...(service.minPrice && { "minPrice": service.minPrice }),
          ...(service.maxPrice && { "maxPrice": service.maxPrice }),
          ...(service.unitText && { "unitText": service.unitText }),
          ...(service.priceType && { 
            "valueAddedTaxIncluded": false,
            "description": `${service.priceType} pricing`
          })
        },
        "seller": {
          "@type": "LocalBusiness",
          "@id": "https://bermanelectrical.com/#organization"
        },
        "areaServed": {
          "@type": "State",
          "name": "New York"
        }
      }))
    }
  };

  return <StructuredData data={schema} id="price-specification-schema" />;
};

export default PriceSpecificationSchema;
