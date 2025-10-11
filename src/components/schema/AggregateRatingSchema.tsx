import { Helmet } from "react-helmet-async";

interface AggregateRatingSchemaProps {
  ratingValue: number;
  reviewCount: number;
  businessName?: string;
  businessUrl?: string;
}

const AggregateRatingSchema = ({ 
  ratingValue, 
  reviewCount,
  businessName = "Berman Electric",
  businessUrl = "https://www.bermanelectric.com"
}: AggregateRatingSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${businessUrl}#organization`,
    name: businessName,
    url: businessUrl,
    telephone: "+1-516-361-4068",
    priceRange: "$$",
    image: `${businessUrl}/logo.png`,
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
      latitude: "40.8173",
      longitude: "-73.1121",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    areaServed: {
      "@type": "State",
      name: "New York",
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "License Number",
      value: "ME-44927",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default AggregateRatingSchema;
