import StructuredData from "../town/StructuredData";

/**
 * SitelinksSearchBoxSchema - Enables the search box in Google sitelinks
 * This allows users to search directly from Google search results
 */
const SitelinksSearchBoxSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://bermanelectrical.com/#website",
    "url": "https://bermanelectrical.com",
    "name": "Berman Electric",
    "description": "Licensed electrician serving Long Island, NY",
    "publisher": {
      "@type": "LocalBusiness",
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

  return <StructuredData data={schema} id="sitelinks-searchbox-schema" />;
};

export default SitelinksSearchBoxSchema;
