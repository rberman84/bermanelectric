import StructuredData from "./StructuredData";
import type { TownData } from "@/lib/townContent";

interface HowToSectionProps {
  town: TownData;
}

const HowToSection = ({ town }: HowToSectionProps) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: town.howTo.title,
    description: town.howTo.description,
    supply: [
      {
        "@type": "HowToSupply",
        name: "Photos or videos of the issue",
      },
      {
        "@type": "HowToSupply",
        name: "Site access details",
      },
    ],
    step: town.howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      itemListElement: {
        "@type": "HowToDirection",
        text: step.detail,
      },
    })),
    totalTime: "PT15M",
  };

  return (
    <section className="bg-white py-16">
      <StructuredData data={howToSchema} id={`${town.slug}-howto-schema`} />
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">{town.howTo.title}</h2>
          <p className="mt-4 text-gray-600">{town.howTo.description}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {town.howTo.steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <span className="absolute -top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-electric-600 text-lg font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-3 text-gray-700">{step.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 rounded-2xl bg-electric-50 p-6 text-center text-electric-800">
          {town.howTo.successNarrative}
        </p>
      </div>
    </section>
  );
};

export default HowToSection;
