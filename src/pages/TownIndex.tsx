import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { towns, buildTownPath } from "@/lib/townContent";
import StructuredData from "@/components/town/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";

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
    <>
      <Helmet>
        <title>Licensed Electricians Serving All Suffolk County Towns | Berman Electric</title>
        <meta
          name="description"
          content="Professional electrical services across Suffolk County, NY. Licensed electricians serving Huntington, Smithtown, Brookhaven, Islip, Babylon, and 8 more towns. Emergency service, panel upgrades, EV chargers. Call (516) 361-4068."
        />
        <link rel="canonical" href="https://www.bermanelectric.com/locations" />
        <meta property="og:title" content="Licensed Electricians Serving All Suffolk County Towns | Berman Electric" />
        <meta property="og:description" content="Professional electrical services across Suffolk County, NY. Licensed electricians serving Huntington, Smithtown, Brookhaven, Islip, Babylon, and 8 more towns. Emergency service, panel upgrades, EV chargers." />
        <meta property="og:url" content="https://www.bermanelectric.com/locations" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData data={collectionPageSchema} id="town-collection-schema" />
      
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                Licensed Electricians Serving All Suffolk County Towns
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional electrical services in 13 Suffolk County communities. From <Link to="/locations/huntington" className="text-foreground underline hover:opacity-70 transition-opacity font-medium">Huntington</Link> to <Link to="/locations/shelter-island" className="text-foreground underline hover:opacity-70 transition-opacity font-medium">Shelter Island</Link>, we're your trusted local electrical contractor.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <Link to="/residential" className="hover:text-foreground font-medium underline">Residential Services</Link>
                <span>•</span>
                <Link to="/commercial" className="hover:text-foreground font-medium underline">Commercial Services</Link>
                <span>•</span>
                <Link to="/ev-charger" className="hover:text-foreground font-medium underline">EV Charger Installation</Link>
                <span>•</span>
                <Link to="/emergency" className="hover:text-foreground font-medium underline">24/7 Emergency Service</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container">
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Why Choose Berman Electric for Your Town?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Local Expertise</h3>
                  <p className="text-sm text-gray-600">We know Suffolk County's unique electrical codes, permit requirements, and building regulations for each town.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
                  <p className="text-sm text-gray-600">Fully licensed Master Electrician with comprehensive insurance coverage for your protection.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Response</h3>
                  <p className="text-sm text-gray-600">Same-day service available. Emergency electrician on call 24/7 throughout Suffolk County.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {towns.map((town) => (
                <Link
                  to={buildTownPath(town.slug)}
                  key={town.slug}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-electric-400 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-electric-600 transition-colors">
                      {town.name}, NY
                    </h2>
                    <span className="rounded-full bg-electric-50 px-3 py-1 text-xs font-semibold uppercase text-electric-700 group-hover:bg-electric-600 group-hover:text-white transition-colors">
                      View Page
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-gray-600 leading-relaxed">{town.seo.description}</p>
                  <dl className="mt-6 space-y-3 text-sm border-t border-gray-100 pt-4">
                    <div>
                      <dt className="font-semibold text-gray-700 mb-1">Areas Served</dt>
                      <dd className="text-gray-600">{town.neighborhoods.slice(0, 3).join(", ")}{town.neighborhoods.length > 3 ? "..." : ""}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700 mb-1">Featured Service</dt>
                      <dd className="text-gray-600">{town.serviceCatalog[0]}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700 mb-1">ZIP Codes</dt>
                      <dd className="text-gray-600">{town.zipCodes.join(", ")}</dd>
                    </div>
                  </dl>
                </Link>
              ))}
            </div>

            <div className="mt-16 bg-electric-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Service in Another Area?
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                While these are our featured town pages, we serve all of Nassau and Suffolk County. 
                Call us to discuss electrical service for your specific location.
              </p>
              <a 
                href="tel:+15163614068"
                className="inline-block bg-electric-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-electric-700 transition-colors"
              >
                Call (516) 361-4068
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TownIndex;
