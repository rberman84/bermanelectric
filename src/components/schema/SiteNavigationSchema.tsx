import StructuredData from "../town/StructuredData";

const SiteNavigationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Primary Navigation",
    "hasPart": [
      {
        "@type": "WebPage",
        "@id": "https://bermanelectrical.com/residential",
        "name": "Residential Electrical Services",
        "description": "Comprehensive residential electrical services for Long Island homes",
        "url": "https://bermanelectrical.com/residential"
      },
      {
        "@type": "WebPage",
        "@id": "https://bermanelectrical.com/commercial",
        "name": "Commercial Electrical Services",
        "description": "Professional commercial electrical services for businesses",
        "url": "https://bermanelectrical.com/commercial"
      },
      {
        "@type": "WebPage",
        "@id": "https://bermanelectrical.com/emergency",
        "name": "Emergency Electrical Services",
        "description": "24/7 emergency electrical services across Long Island",
        "url": "https://bermanelectrical.com/emergency"
      },
      {
        "@type": "WebPage",
        "@id": "https://bermanelectrical.com/ev-charger",
        "name": "EV Charger Installation",
        "description": "Professional EV charger installation for home and business",
        "url": "https://bermanelectrical.com/ev-charger"
      },
      {
        "@type": "WebPage",
        "@id": "https://bermanelectrical.com/locations",
        "name": "Service Locations",
        "description": "Serving Suffolk and Nassau Counties on Long Island",
        "url": "https://bermanelectrical.com/locations"
      }
    ]
  };

  return <StructuredData data={schema} id="site-navigation-schema" />;
};

export default SiteNavigationSchema;
