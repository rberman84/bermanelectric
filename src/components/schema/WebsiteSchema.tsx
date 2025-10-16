import StructuredData from "../town/StructuredData";

const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://bermanelectrical.com/#website",
    "url": "https://bermanelectrical.com",
    "name": "Berman Electric",
    "description": "Licensed electrician serving Long Island, NY with over 20 years of experience",
    "publisher": {
      "@id": "https://bermanelectrical.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bermanelectrical.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };

  return <StructuredData data={schema} id="website-schema" />;
};

export default WebsiteSchema;
