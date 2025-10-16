import StructuredData from "../town/StructuredData";

interface LocalBusinessSchemaProps {
  serviceName: string;
  serviceDescription: string;
  pageUrl: string;
  averageRating?: number;
  reviewCount?: number;
}

const LocalBusinessSchema = ({
  serviceName,
  serviceDescription,
  pageUrl,
  averageRating = 5.0,
  reviewCount = 50
}: LocalBusinessSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://bermanelectrical.com${pageUrl}#localbusiness`,
    "name": `Berman Electric - ${serviceName}`,
    "description": serviceDescription,
    "url": `https://bermanelectrical.com${pageUrl}`,
    "telephone": "+1-516-361-4068",
    "email": "Rob@bermanelectrical.com",
    "priceRange": "$$",
    "image": "https://bermanelectrical.com/logo-optimized.webp",
    "logo": "https://bermanelectrical.com/logo-optimized.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ronkonkoma",
      "addressRegion": "NY",
      "postalCode": "11779",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8134",
      "longitude": "-73.1123"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "New York"
      },
      {
        "@type": "City",
        "name": "Ronkonkoma"
      },
      "Nassau County",
      "Suffolk County",
      "Long Island"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHours": "Mo-Fr 07:00-19:00",
    "sameAs": [
      "https://www.facebook.com/bermanelectric",
      "https://www.instagram.com/bermanelectric",
      "https://www.linkedin.com/company/berman-electric"
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Licensed Electrician",
      "credentialCategory": "Professional License",
      "recognizedBy": {
        "@type": "GovernmentOrganization",
        "name": "New York State"
      }
    },
    "additionalProperty": {
      "@type": "PropertyValue",
      "name": "License Number",
      "value": "ME-44927"
    }
  };

  return <StructuredData data={schema} id={`localbusiness-${serviceName.toLowerCase().replace(/\s+/g, '-')}`} />;
};

export default LocalBusinessSchema;
