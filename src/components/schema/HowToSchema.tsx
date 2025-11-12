import StructuredData from "../town/StructuredData";

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  image?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
}

const HowToSchema = ({
  name,
  description,
  steps,
  totalTime,
  image,
  estimatedCost
}: HowToSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(image && { "image": image }),
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && { "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    }}),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url && { "url": step.url }),
      ...(step.image && { "image": step.image })
    })),
    "provider": {
      "@type": "Organization",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric"
    }
  };

  return <StructuredData data={schema} id="howto-schema" />;
};

export default HowToSchema;
