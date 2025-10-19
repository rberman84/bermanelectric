import { useParams, Navigate } from "react-router-dom";
import { Phone, CheckCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { getTownBySlug } from "@/lib/townContent";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Breadcrumb from "@/components/shared/Breadcrumb";

// Service configuration
const services = {
  "panel-upgrades": {
    name: "Panel Upgrades",
    title: "Electrical Panel Upgrades",
    description: "Professional electrical panel upgrade services to increase your home's electrical capacity and safety.",
    benefits: [
      "Upgrade from 100 to 200 amps",
      "Support modern appliances and HVAC",
      "Enable EV charger installation",
      "Whole-home surge protection",
      "Code-compliant installations"
    ],
    process: [
      "Free electrical capacity assessment",
      "Detailed upgrade proposal",
      "Permit coordination and scheduling",
      "Professional installation by licensed electricians",
      "Final inspection and testing"
    ]
  },
  "rewiring": {
    name: "Home Rewiring",
    title: "Whole Home Rewiring",
    description: "Complete home rewiring services for older homes with outdated or unsafe electrical systems.",
    benefits: [
      "Replace outdated wiring",
      "Eliminate safety hazards",
      "Support modern electrical loads",
      "Increase home value",
      "Pass electrical inspections"
    ],
    process: [
      "Comprehensive electrical assessment",
      "Detailed rewiring plan",
      "Minimize disruption during work",
      "Install modern wiring and outlets",
      "Final testing and certification"
    ]
  },
  "ev-charger": {
    name: "EV Charger Installation",
    title: "Electric Vehicle Charger Installation",
    description: "Professional EV charger installation for convenient home charging of your electric vehicle.",
    benefits: [
      "Level 2 fast charging at home",
      "Tesla and universal chargers",
      "Dedicated 240V circuits",
      "Smart charger integration",
      "Panel upgrades if needed"
    ],
    process: [
      "Assess electrical capacity",
      "Recommend charger type",
      "Handle permits and approvals",
      "Install charger and wiring",
      "Test and demonstrate operation"
    ]
  },
  "generator-installation": {
    name: "Generator Installation",
    title: "Backup Generator Installation",
    description: "Standby generator installation to keep your home powered during outages and storms.",
    benefits: [
      "Automatic power backup",
      "Whole-home or critical circuits",
      "Transfer switch installation",
      "Regular maintenance available",
      "Peace of mind during storms"
    ],
    process: [
      "Determine power requirements",
      "Select appropriate generator",
      "Coordinate gas/propane connection",
      "Install generator and transfer switch",
      "Test automatic operation"
    ]
  },
  "smart-home": {
    name: "Smart Home Wiring",
    title: "Smart Home Electrical Installation",
    description: "Expert electrical installation for smart home automation, lighting, and integrated systems.",
    benefits: [
      "Smart lighting and switches",
      "Whole-home automation",
      "Voice control integration",
      "Energy monitoring systems",
      "Future-proof wiring"
    ],
    process: [
      "Discuss automation goals",
      "Design integrated system",
      "Install smart-ready wiring",
      "Configure devices and hubs",
      "Train on system operation"
    ]
  },
  "lighting": {
    name: "Lighting Installation",
    title: "Interior & Exterior Lighting",
    description: "Professional lighting installation including recessed lights, chandeliers, landscape, and security lighting.",
    benefits: [
      "LED energy-efficient lighting",
      "Recessed and track lighting",
      "Landscape and security lights",
      "Dimmer and smart controls",
      "Custom lighting design"
    ],
    process: [
      "Lighting consultation and design",
      "Select fixtures and placement",
      "Install wiring and fixtures",
      "Configure controls and dimmers",
      "Final walkthrough and adjustments"
    ]
  }
};

const ServiceLocation = () => {
  const { serviceSlug, townSlug } = useParams<{ serviceSlug: string; townSlug: string }>();
  const town = getTownBySlug(townSlug);
  const service = serviceSlug ? services[serviceSlug as keyof typeof services] : null;

  // If town or service not found, redirect to 404
  if (!town || !service) {
    return <Navigate to="/404" replace />;
  }

  const faqItems = [
    {
      question: `How much does ${service.name.toLowerCase()} cost in ${town.name}?`,
      answer: `${service.name} costs vary based on your specific needs and home configuration. We provide free, detailed estimates for all ${town.name} projects with transparent pricing and no hidden fees. Contact us at 516-361-4068 for a personalized quote.`
    },
    {
      question: `Do you handle permits for ${service.name.toLowerCase()} in ${town.name}?`,
      answer: `Yes, we coordinate all necessary electrical permits and inspections with ${town.name}'s local building department. Our licensed electricians ensure all work meets code requirements.`
    },
    {
      question: `How long does ${service.name.toLowerCase()} take in ${town.name}?`,
      answer: `Most ${service.name.toLowerCase()} projects are completed within 1-2 days depending on scope. We provide detailed timelines during your consultation and work efficiently to minimize disruption to your ${town.name} home or business.`
    },
    {
      question: `Why choose Berman Electric for ${service.name.toLowerCase()} in ${town.name}?`,
      answer: `We're licensed, insured electricians with over 20 years serving ${town.name} and all of Long Island. We provide upfront pricing, professional service, and guaranteed quality workmanship on every project.`
    }
  ];

  const pageTitle = `${service.title} in ${town.name} | Licensed Electrician`;
  const pageDescription = `Expert ${service.name.toLowerCase()} services in ${town.name}, NY. Licensed electricians serving ${town.neighborhoods.join(", ")}. Free estimates. Call (516) 361-4068.`;
  const canonicalUrl = `https://www.bermanelectric.com/services/${serviceSlug}/${townSlug}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${service.name} ${town.name}, ${service.name.toLowerCase()} ${town.name} NY, electrician ${town.name}, ${service.name.toLowerCase()} Nassau County, ${service.name.toLowerCase()} Suffolk County`}
        canonical={canonicalUrl}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.bermanelectric.com" },
          { name: "Services", url: "https://www.bermanelectric.com/residential" },
          { name: service.name, url: `https://www.bermanelectric.com/services/${serviceSlug}` },
          { name: `${town.name}, NY` }
        ]}
      />

      <LocalBusinessSchema
        serviceName={`${service.title} in ${town.name}`}
        serviceDescription={`${service.description} Serving ${town.name} and surrounding areas: ${town.neighborhoods.slice(0, 3).join(", ")}.`}
        pageUrl={`/services/${serviceSlug}/${townSlug}`}
      />

      <FAQSchema faqs={faqItems} />

      <Navbar />

      <Breadcrumb
        items={[
          { label: "Services", href: "/residential" },
          { label: service.name },
          { label: town.name }
        ]}
      />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-electric-600 via-electric-700 to-electric-800 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {town.name}, NY {town.zipCodes.join(", ")}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {service.title} in {town.name}
              </h1>

              <p className="text-xl text-white/90 mb-8">
                {service.description} Licensed electricians serving {town.neighborhoods.slice(0, 3).join(", ")}.
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
                  Request Free Estimate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Why {town.name} Residents Choose Us for {service.name}
              </h2>
              <p className="text-gray-600 text-center mb-12">
                Professional {service.name.toLowerCase()} services with over 20 years of experience serving {town.name} and all of Long Island.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-6 rounded-xl border border-gray-200">
                    <CheckCircle className="h-6 w-6 text-electric-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Our {service.name} Process in {town.name}
              </h2>

              <div className="space-y-6">
                {service.process.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-electric-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 text-lg">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {service.name} FAQs for {town.name}
              </h2>

              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-electric-700 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Serving All of {town.name}
              </h2>
              <p className="text-gray-600 mb-8">
                We provide {service.name.toLowerCase()} throughout {town.name} including:
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {town.neighborhoods.map((neighborhood, index) => (
                  <span
                    key={index}
                    className="bg-electric-50 text-electric-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-8">
                ZIP Codes: {town.zipCodes.join(", ")}
              </p>
              <Link
                to={`/locations/${townSlug}`}
                className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 font-semibold"
              >
                View All Services in {town.name} →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-electric-700">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready for Professional {service.name}?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Contact Berman Electric today for expert {service.name.toLowerCase()} service in {town.name}
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
                  Request Free Estimate
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

export default ServiceLocation;