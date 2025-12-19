import StructuredData from "../town/StructuredData";

export interface ServicePricing {
  name: string;
  description: string;
  priceRange?: string;
  priceCurrency?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ServiceWithPricingSchemaProps {
  serviceName: string;
  serviceType: string;
  description: string;
  url: string;
  services: ServicePricing[];
  averageRating?: number;
  reviewCount?: number;
}

const ServiceWithPricingSchema = ({
  serviceName,
  serviceType,
  description,
  url,
  services,
  averageRating,
  reviewCount
}: ServiceWithPricingSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://bermanelectrical.com${url}#service`,
    "name": serviceName,
    "serviceType": serviceType,
    "description": description,
    "url": `https://bermanelectrical.com${url}`,
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric",
      "telephone": "+1-516-361-4068",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "26 Railroad Avenue",
        "addressLocality": "Ronkonkoma",
        "addressRegion": "NY",
        "postalCode": "11779",
        "addressCountry": "US"
      }
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "New York"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Suffolk County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Nassau County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Long Island"
      }
    ],
    ...(averageRating && reviewCount && reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Pricing`,
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        },
        ...(service.priceRange && {
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": service.priceCurrency || "USD",
            ...(service.minPrice && { "minPrice": service.minPrice }),
            ...(service.maxPrice && { "maxPrice": service.maxPrice }),
            "price": service.priceRange
          }
        })
      }))
    },
    "termsOfService": "https://bermanelectrical.com/terms",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `https://bermanelectrical.com${url}`,
      "servicePhone": "+1-516-361-4068",
      "availableLanguage": "English"
    }
  };

  return <StructuredData data={schema} id={`service-pricing-${url.replace(/\//g, '-')}`} />;
};

export default ServiceWithPricingSchema;
