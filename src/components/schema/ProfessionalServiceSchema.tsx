import StructuredData from "../town/StructuredData";

interface ProfessionalServiceSchemaProps {
  serviceName: string;
  serviceType: string;
  description: string;
  pageUrl: string;
  priceRange?: string;
  areaServed?: string[];
}

const ProfessionalServiceSchema = ({
  serviceName,
  serviceType,
  description,
  pageUrl,
  priceRange = "$$",
  areaServed = ["Suffolk County", "Nassau County", "Long Island"]
}: ProfessionalServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `https://bermanelectrical.com${pageUrl}#service`,
    "name": serviceName,
    "serviceType": serviceType,
    "description": description,
    "url": `https://bermanelectrical.com${pageUrl}`,
    "image": "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
    "priceRange": priceRange,
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric",
      "telephone": "+1-516-361-4068",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "26 Railroad Avenue",
        "addressLocality": "Ronkonkoma",
        "addressRegion": "NY",
        "postalCode": "11779",
        "addressCountry": "US"
      },
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Professional License",
          "name": "Master Electrician License",
          "identifier": "ME-44927",
          "issuedBy": {
            "@type": "Organization",
            "name": "New York State Department of Labor"
          }
        }
      ]
    },
    "areaServed": areaServed.map(area => ({
      "@type": "City",
      "name": area
    })),
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `https://bermanelectrical.com${pageUrl}`,
      "servicePhone": "+1-516-361-4068",
      "availableLanguage": {
        "@type": "Language",
        "name": "English"
      }
    },
    "termsOfService": "https://bermanelectrical.com/terms",
    "hoursAvailable": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "16:00"
      }
    ]
  };

  return <StructuredData data={schema} id={`professional-service-${serviceType.toLowerCase().replace(/\s+/g, '-')}`} />;
};

export default ProfessionalServiceSchema;
