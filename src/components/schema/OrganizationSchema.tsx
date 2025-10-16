import StructuredData from "../town/StructuredData";

const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://bermanelectrical.com/#organization",
    "name": "Berman Electric",
    "legalName": "Berman Electric",
    "url": "https://bermanelectrical.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bermanelectrical.com/logo-optimized.webp",
      "width": 160,
      "height": 160
    },
    "image": "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
    "description": "Licensed electrician serving Long Island, NY with over 20 years of experience. Specializing in residential and commercial electrical services.",
    "email": "Rob@bermanelectrical.com",
    "telephone": "+1-516-361-4068",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ronkonkoma",
      "addressRegion": "NY",
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
    "sameAs": [
      "https://www.facebook.com/bermanelectric",
      "https://www.instagram.com/bermanelectric",
      "https://www.linkedin.com/company/berman-electric"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-516-361-4068",
      "contactType": "Customer Service",
      "areaServed": ["US"],
      "availableLanguage": ["English"]
    },
    "foundingDate": "2003",
    "founder": {
      "@type": "Person",
      "name": "Robert Berman"
    }
  };

  return <StructuredData data={schema} id="organization-schema" />;
};

export default OrganizationSchema;
