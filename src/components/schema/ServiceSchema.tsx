import { Helmet } from "react-helmet-async";

interface ServiceSchemaProps {
  serviceName: string;
  serviceType: string;
  description: string;
  url: string;
  averageRating?: number;
  reviewCount?: number;
  image?: string;
  priceRange?: string;
  areaServed?: string[];
  additionalOffers?: Array<{
    name: string;
    description: string;
  }>;
}

const ServiceSchema = ({
  serviceName,
  serviceType,
  description,
  url,
  averageRating,
  reviewCount,
  image = "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  priceRange = "$$",
  areaServed = ["Long Island, NY", "Suffolk County, NY", "Nassau County, NY"],
  additionalOffers = []
}: ServiceSchemaProps) => {
  const aggregateRating = averageRating && reviewCount && reviewCount > 0
    ? {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviewCount,
        bestRating: "5",
        worstRating: "1",
      }
    : undefined;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceType,
    name: serviceName,
    description: description,
    url: url,
    image: image,
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com",
      name: "Berman Electric",
      telephone: "+1-516-361-4068",
      email: "Rob@bermanelectrical.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "26 Railroad Avenue",
        addressLocality: "Ronkonkoma",
        addressRegion: "NY",
        postalCode: "11779",
        addressCountry: "US"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "40.8134",
        longitude: "-73.1123"
      },
      priceRange: priceRange,
      aggregateRating: aggregateRating,
      additionalProperty: {
        "@type": "PropertyValue",
        name: "License Number",
        value: "ME-44927"
      },
      sameAs: [
        "https://www.facebook.com/bermanelectric",
        "https://www.instagram.com/bermanelectric",
        "https://www.linkedin.com/company/berman-electric"
      ]
    },
    areaServed: areaServed.map(area => ({
      "@type": "AdministrativeArea",
      name: area
    })),
    hasOfferCatalog: additionalOffers.length > 0 ? {
      "@type": "OfferCatalog",
      name: `${serviceName} services`,
      itemListElement: additionalOffers.map((offer, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description
        }
      }))
    } : undefined
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;
