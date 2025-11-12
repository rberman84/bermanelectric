import StructuredData from "../town/StructuredData";

interface SpeakableSchemaProps {
  pageUrl: string;
  cssSelectors?: string[];
  xpaths?: string[];
}

const SpeakableSchema = ({ pageUrl, cssSelectors, xpaths }: SpeakableSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    "url": pageUrl,
    "speakable": {
      "@type": "SpeakableSpecification",
      ...(cssSelectors && { "cssSelector": cssSelectors }),
      ...(xpaths && { "xpath": xpaths })
    }
  };

  return <StructuredData data={schema} id="speakable-schema" />;
};

export default SpeakableSchema;
