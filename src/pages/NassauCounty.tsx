import { Link } from "react-router-dom";
import { MapPin, Phone, CheckCircle, Zap, Home, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { nassauTowns } from "@/lib/townContent";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema";
import FAQSchema from "@/components/schema/FAQSchema";

const NassauCounty = () => {
  const faqItems = [
    {
      question: "Do you service all of Nassau County?",
      answer: "Yes, Berman Electric provides comprehensive electrical services throughout Nassau County, including Garden City, Hempstead, Oyster Bay, and all surrounding communities. We're based in nearby Ronkonkoma for quick access to all Nassau locations."
    },
    {
      question: "What electrical services do you provide in Nassau County?",
      answer: "We offer complete residential and commercial electrical services including panel upgrades, rewiring, smart home installation, EV charger installation, commercial electrical, emergency repairs, and more. All work is performed by licensed electricians."
    },
    {
      question: "How quickly can you respond to emergencies in Nassau County?",
      answer: "We provide 24/7 emergency electrical service throughout Nassau County with typical response times of 30-45 minutes depending on your specific location. Call 516-361-4068 for immediate emergency assistance."
    },
    {
      question: "Do you handle permits for Nassau County projects?",
      answer: "Yes, we coordinate all required electrical permits and inspections with Nassau County town and village building departments. We're familiar with local codes and requirements throughout the county."
    }
  ];

  return (
    <>
      <SEO
        title="Nassau County Electrician | Licensed Electrical Services Long Island"
        description="Professional electrical services throughout Nassau County NY. Serving Garden City, Hempstead, Oyster Bay & more. Emergency service, panel upgrades, commercial electrical. Licensed & insured."
        keywords="Nassau County electrician, Long Island electrical services, Nassau County electrical contractor, licensed electrician Nassau NY"
        canonical="https://www.bermanelectric.com/locations/nassau-county"
      />
      
      <LocalBusinessSchema
        serviceName="Nassau County Electrical Services"
        serviceDescription="Comprehensive electrical services for all of Nassau County including residential, commercial, emergency repairs, panel upgrades, and smart home installation."
        pageUrl="/locations/nassau-county"
      />

      <FAQSchema faqs={faqItems} />

      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-electric-600 via-electric-700 to-electric-800 py-20">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">Nassau County Wide Coverage</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Nassau County's Trusted Licensed Electrician
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Serving Garden City, Hempstead, Oyster Bay, and all Nassau County communities with 
                expert electrical services. Over 20 years of experience with Nassau's Gold Coast estates 
                to village homes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="tel:516-361-4068"
                  className="inline-flex items-center gap-2 bg-white text-electric-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  516-361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Schedule Service
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Services */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Electrical Services Across Nassau County
              </h2>
              <p className="text-lg text-gray-600">
                From historic estates to modern businesses, we handle every electrical need
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Residential Electrical</h3>
                <p className="text-gray-600 mb-4">
                  Panel upgrades, whole-home rewiring, smart home systems, EV chargers, and generator installation
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Historic home electrical modernization</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Gold Coast estate electrical systems</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Level 2 EV charger installation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Commercial Electrical</h3>
                <p className="text-gray-600 mb-4">
                  Retail fit-outs, office electrical, medical facility power, and code compliance upgrades
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Medical office electrical systems</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Retail and restaurant electrical</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Multi-family building service</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Service</h3>
                <p className="text-gray-600 mb-4">
                  24/7 emergency response for power outages, electrical hazards, and urgent repairs
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Rapid emergency response</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Electrical hazard elimination</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Storm damage restoration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Towns Grid */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Towns We Serve in Nassau County
              </h2>
              <p className="text-lg text-gray-600">
                Click on any town for detailed local electrical services and information
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nassauTowns.map((town) => (
                <Link
                  key={town.slug}
                  to={`/locations/${town.slug}`}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-electric-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-electric-700 transition-colors">
                      {town.name}
                    </h3>
                    <MapPin className="h-5 w-5 text-gray-400 group-hover:text-electric-600 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    ZIP: {town.zipCodes.join(", ")}
                  </p>
                  {town.neighborhoods.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Serving: {town.neighborhoods.slice(0, 2).join(", ")}
                      {town.neighborhoods.length > 2 && "..."}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Don't see your Nassau County town listed? We serve all Nassau communities.
              </p>
              <a 
                href="tel:516-361-4068"
                className="inline-flex items-center gap-2 text-electric-700 font-semibold hover:text-electric-800"
              >
                <Phone className="h-5 w-5" />
                Call 516-361-4068 to confirm service
              </a>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Nassau County Trusts Berman Electric
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
                <p className="text-gray-600">
                  NY State Master Electrician License ME-44927. Fully insured for commercial and residential work.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nassau County Expertise</h3>
                <p className="text-gray-600">
                  Extensive experience with Nassau's diverse properties from Gold Coast estates to modern condos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-gray-600">
                  Round-the-clock emergency service throughout Nassau County for urgent electrical problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Nassau County Electrical FAQs
              </h2>
              
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-electric-700 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-700">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-electric-700">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready for Expert Electrical Service?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Contact Berman Electric today for fast, professional electrical service anywhere in Nassau County
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:516-361-4068"
                  className="inline-flex items-center justify-center gap-2 bg-white text-electric-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  516-361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Request Estimate
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default NassauCounty;