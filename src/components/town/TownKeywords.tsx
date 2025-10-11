import type { TownData } from "@/lib/townContent";

interface TownKeywordsProps {
  town: TownData;
}

const TownKeywords = ({ town }: TownKeywordsProps) => {
  const keywords = [
    `${town.name} electrician`,
    `electrician near ${town.name}`,
    `electrical contractor ${town.name}`,
    `licensed electrician ${town.name} NY`,
    ...town.neighborhoods.slice(0, 3).map(n => `electrician ${n}`),
    ...town.serviceCatalog.slice(0, 2),
    "emergency electrician",
    "electrical repair",
    "panel upgrade",
    "EV charger installation"
  ];

  return (
    <section className="bg-white py-12 border-t border-gray-100">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6 text-center">
            Electrical Services & Areas We Serve
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {keywords.map((keyword, index) => (
              <span 
                key={index}
                className="inline-block px-4 py-2 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200 hover:border-electric-300 hover:bg-electric-50 transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 max-w-3xl mx-auto">
            Berman Electric is your trusted electrical contractor serving {town.name}, {town.serviceArea}. 
            We specialize in {town.serviceCatalog[0].toLowerCase()}, {town.serviceCatalog[1]?.toLowerCase()}, 
            and all residential and commercial electrical needs throughout Suffolk County.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TownKeywords;
