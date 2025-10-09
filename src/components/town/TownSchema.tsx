import StructuredData from "./StructuredData";
import type { TownData } from "@/lib/townContent";

interface TownSchemaProps {
  town: TownData;
  averageRating: number;
  totalReviews: number;
}

const TownSchema = ({ town, averageRating, totalReviews }: TownSchemaProps) => {
  const aggregateRating = totalReviews > 0
    ? {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalReviews,
        bestRating: "5",
        worstRating: "1",
      }
    : undefined;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Berman Electric",
    image: "https://www.bermanelectric.com/logo.png",
    url: `https://www.bermanelectric.com/locations/${town.slug}`,
    telephone: "+1-516-361-4068",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26 Railroad Avenue",
      addressLocality: "Ronkonkoma",
      addressRegion: "NY",
      postalCode: "11779",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: town.coordinates.latitude,
      longitude: town.coordinates.longitude,
    },
    areaServed: {
      "@type": "City",
      name: `${town.name}, NY`,
    },
    serviceArea: `${town.name}, NY ${town.zipCodes.join(", ")}`,
    sameAs: [
      "https://www.facebook.com/bermanelectric",
      "https://www.instagram.com/bermanelectric",
      "https://www.linkedin.com/company/berman-electric",
      "https://www.google.com/search?q=Berman+Electric+Ronkonkoma",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
    makesOffer: town.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
      areaServed: `${town.name}, NY`,
    })),
    aggregateRating,
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${town.name} Electrical Services`,
    description: town.serviceCatalog.join("; "),
    provider: {
      "@type": "LocalBusiness",
      name: "Berman Electric",
      telephone: "+1-516-361-4068",
      areaServed: `${town.name}, NY`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${town.name}, NY`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${town.name} electrician services`,
      itemListElement: town.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };

  return <StructuredData data={[localBusinessSchema, serviceSchema]} id={`${town.slug}-business-schema`} />;
};

export default TownSchema;
