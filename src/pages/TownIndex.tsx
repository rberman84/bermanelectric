import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { towns, buildTownPath } from "@/lib/townContent";
import StructuredData from "@/components/town/StructuredData";

const TownIndex = () => {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Suffolk County Electrical Service Areas",
    description: "Explore Berman Electric's localized electrical service pages for towns across Suffolk County, each with structured data, FAQs, and driving directions.",
    url: "https://www.bermanelectric.com/locations",
    provider: {
      "@type": "LocalBusiness",
      name: "Berman Electric",
      telephone: "+1-516-361-4068",
      address: {
        "@type": "PostalAddress",
        streetAddress: "26 Railroad Avenue",
        addressLocality: "Ronkonkoma",
        addressRegion: "NY",
        postalCode: "11779",
        addressCountry: "US",
      },
    },
    hasPart: towns.map((town) => ({
      "@type": "WebPage",
      name: `${town.name}, NY Electrical Services`,
      url: `https://www.bermanelectric.com${buildTownPath(town.slug)}`,
      description: town.seo.description,
    })),
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Helmet>
        <title>Suffolk County Town Pages | Berman Electric</title>
        <meta
          name="description"
          content="Browse Berman Electric's Suffolk County town pages featuring local electricians, services, FAQs, and directions for Huntington, Smithtown, Brookhaven, and more."
        />
        <link rel="canonical" href="https://www.bermanelectric.com/locations" />
        <meta property="og:title" content="Suffolk County Town Pages | Berman Electric" />
        <meta property="og:description" content="Browse Berman Electric's Suffolk County town pages featuring local electricians, services, FAQs, and directions for Huntington, Smithtown, Brookhaven, and more." />
        <meta property="og:url" content="https://www.bermanelectric.com/locations" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData data={collectionPageSchema} id="town-collection-schema" />

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">Suffolk County Electrical Service Areas</h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore our localized electrical service kits for towns across Suffolk County, each with structured data, FAQs, and driving directions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {towns.map((town) => (
            <Link
              to={buildTownPath(town.slug)}
              key={town.slug}
              className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-electric-400 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{town.name}, NY</h2>
                <span className="rounded-full bg-electric-50 px-3 py-1 text-xs font-semibold uppercase text-electric-700">
                  View Page
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm text-gray-600">{town.seo.description}</p>
              <dl className="mt-6 space-y-2 text-sm text-gray-500">
                <div>
                  <dt className="font-semibold text-gray-700">Neighborhoods</dt>
                  <dd>{town.neighborhoods.slice(0, 3).join(", ")}...</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Services</dt>
                  <dd>{town.serviceCatalog[0]}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TownIndex;
