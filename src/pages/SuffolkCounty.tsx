import { Link } from "react-router-dom";
import { MapPin, Phone, CheckCircle, Zap, Home, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { towns } from "@/lib/townContent";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema";
import FAQSchema from "@/components/schema/FAQSchema";

const SuffolkCounty = () => {
  const faqItems = [
    {
      question: "Do you service all of Suffolk County?",
      answer: "Yes, Berman Electric provides comprehensive electrical services throughout Suffolk County, from western towns like Huntington and Smithtown to the East End including Riverhead and the Hamptons. We're based in Ronkonkoma for quick access to all areas."
    },
    {
      question: "What makes electrical service in Suffolk County unique?",
      answer: "Suffolk County presents unique challenges including coastal salt air exposure, rural properties requiring longer service runs, historic homes needing careful upgrades, and seasonal properties in the Hamptons requiring specialized systems. We have extensive experience with all these scenarios."
    },
    {
      question: "How quickly can you respond to emergencies in Suffolk County?",
      answer: "We offer 24/7 emergency service throughout Suffolk County. Response times vary by location but typically range from 20-60 minutes depending on your specific town. Call 516-361-4068 immediately for emergencies."
    },
    {
      question: "Do you handle permits in Suffolk County towns?",
      answer: "Yes, we coordinate all electrical permits and inspections with individual town and village building departments throughout Suffolk County. We're familiar with local requirements from Babylon to Southampton."
    }
  ];

  return (
    <>
      <SEO
        title="Suffolk County Electrician | Licensed Electrical Services Long Island"
        description="Professional electrical services throughout Suffolk County NY. Serving 40+ towns from Huntington to Montauk. Emergency service, panel upgrades, commercial electrical. Licensed & insured."
        keywords="Suffolk County electrician, Long Island electrical services, Suffolk County electrical contractor, licensed electrician Suffolk NY"
        canonical="https://www.bermanelectric.com/locations/suffolk-county"
      />
      
      <LocalBusinessSchema
        serviceName="Suffolk County Electrical Services"
        serviceDescription="Comprehensive electrical services for all of Suffolk County including residential, commercial, emergency repairs, panel upgrades, and smart home installation."
        pageUrl="/locations/suffolk-county"
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
                <span className="text-white text-sm font-medium">Suffolk County Wide Coverage</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Suffolk County's Trusted Licensed Electrician
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Serving 40+ towns from Huntington to Montauk with expert electrical services. 
                Over 20 years of experience with Suffolk County homes, businesses, and coastal properties.
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
                Complete Electrical Services Across Suffolk County
              </h2>
              <p className="text-lg text-gray-600">
                From waterfront estates to commercial buildings, we handle every electrical need
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Residential Electrical</h3>
                <p className="text-gray-600 mb-4">
                  Panel upgrades, rewiring, smart home integration, EV chargers, and generator installation for Suffolk County homes
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>100 to 200 amp service upgrades</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Whole-home rewiring for older properties</span>
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
                  Storefront lighting, three-phase power, fire alarm systems, and code compliance for Suffolk businesses
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Retail and restaurant electrical</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Office building power systems</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Emergency lighting and exit signs</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Service</h3>
                <p className="text-gray-600 mb-4">
                  24/7 emergency response throughout Suffolk County for power outages, electrical hazards, and urgent repairs
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Power outage troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Electrical fire hazard elimination</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-electric-600 mt-0.5 flex-shrink-0" />
                    <span>Storm damage electrical repair</span>
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
                Towns We Serve in Suffolk County
              </h2>
              <p className="text-lg text-gray-600">
                Click on any town for detailed local electrical services and information
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {towns.map((town) => (
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
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Suffolk County Trusts Berman Electric
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
                <p className="text-gray-600">
                  NY State Master Electrician License ME-44927. Fully insured for your protection.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
                <p className="text-gray-600">
                  Over 20 years serving Suffolk County. We know local codes, permits, and unique property challenges.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-electric-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Emergency Service</h3>
                <p className="text-gray-600">
                  Round-the-clock emergency response throughout Suffolk County for urgent electrical issues.
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
                Suffolk County Electrical FAQs
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
                Contact Berman Electric today for fast, professional electrical service anywhere in Suffolk County
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

export default SuffolkCounty;