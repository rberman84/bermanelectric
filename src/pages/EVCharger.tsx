import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { Car, Zap, Shield, CheckCircle2, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import ServiceSchema from "@/components/schema/ServiceSchema";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import RelatedServices from "@/components/service/RelatedServices";
import ServiceCluster from "@/components/service/ServiceCluster";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { getReviewStats, transformGoogleReviews, defaultReviews } from "@/components/shared/ReviewsSection";
import Breadcrumb from "@/components/shared/Breadcrumb";
import EVChargerFAQSchema from "@/components/schema/EVChargerFAQSchema";
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema";
import ServiceWithPricingSchema, { ServicePricing } from "@/components/schema/ServiceWithPricingSchema";
import InternalLinkingSidebar from "@/components/seo/InternalLinkingSidebar";

const pricedServices: ServicePricing[] = [
  { name: "Level 2 EV Charger Installation", description: "Complete Level 2 home charging station installation", priceRange: "$500 - $1,500", priceCurrency: "USD", minPrice: 500, maxPrice: 1500 },
  { name: "Panel Upgrade for EV Charging", description: "Electrical panel upgrade to support EV charger", priceRange: "$1,500 - $3,500", priceCurrency: "USD", minPrice: 1500, maxPrice: 3500 },
  { name: "Tesla Wall Connector Installation", description: "Tesla Wall Connector professional installation", priceRange: "$400 - $1,200", priceCurrency: "USD", minPrice: 400, maxPrice: 1200 },
  { name: "Commercial EV Charging Station", description: "Multi-unit commercial EV charging installation", priceRange: "$2,000 - $10,000", priceCurrency: "USD", minPrice: 2000, maxPrice: 10000 },
  { name: "Dedicated 240V Circuit", description: "Install dedicated 240V circuit for EV charging", priceRange: "$300 - $800", priceCurrency: "USD", minPrice: 300, maxPrice: 800 },
];

const services = [
  {
    title: "Residential EV Charger Installation",
    items: [
      "Level 1 & Level 2 home charging station installations",
      "Electrical panel upgrades for increased power capacity",
      "Dedicated circuits & wiring for safe charging",
      "Smart home integration for automated EV charging"
    ]
  },
  {
    title: "Commercial EV Charging Solutions",
    items: [
      "Multi-unit residential EV charger installations",
      "Workplace & fleet charging station setup",
      "Public EV charger installation for retail, offices & parking lots",
      "Load management & energy-efficient charging solutions"
    ]
  },
  {
    title: "Panel Upgrades & Dedicated Circuits",
    items: [
      "Ensure your home's electrical panel can handle EV charging loads",
      "Upgrade older electrical panels to prevent overloads & power failures",
      "Install dedicated circuits for faster, safer charging"
    ]
  },
  {
    title: "Smart & Fast-Charging Solutions",
    items: [
      "Wi-Fi-enabled EV chargers with mobile app control",
      "Fast-charging Level 2 stations for quicker charge times",
      "Integration with solar power & energy-efficient systems"
    ]
  }
];

const benefits = [
  "Charge Your Car Overnight – No more waiting at public stations",
  "Save Money – Home charging is more cost-effective than commercial charging stations",
  "Increase Home Value – An EV charger adds resale value to your property",
  "Convenience & Safety – No need to rely on crowded public chargers"
];

const whyChooseUs = [
  "Licensed & Insured Electricians – Certified professionals ensuring safe, code-compliant installations",
  "Over 20 Years of Experience – Trusted electrical contractors serving homes & businesses across Long Island",
  "Custom Charging Solutions – We tailor EV charger setups to match your needs, power capacity & budget",
  "Fast & Hassle-Free Installation – We handle everything from permits to installation & testing",
  "Guaranteed Workmanship & Support – We stand behind our work & offer ongoing support"
];

const EVCharger = () => {
  const faqs = [
    {
      question: "How much does it cost to install an EV charger at home?",
      answer: "Home EV charger installation typically costs between $500 to $2,500 depending on your electrical panel capacity, distance to installation location, and charger type. Level 2 chargers are most common for homes. We provide free estimates with transparent, upfront pricing."
    },
    {
      question: "Do I need to upgrade my electrical panel for an EV charger?",
      answer: "Many homes need a panel upgrade to support Level 2 EV chargers, which require 240V circuits. We'll assess your current electrical capacity during our consultation and recommend upgrades if needed to safely power your EV charger."
    },
    {
      question: "How long does EV charger installation take?",
      answer: "Most residential EV charger installations are completed in 4-8 hours. If a panel upgrade is needed, the project may take 1-2 days. We handle all permits and inspections to ensure code compliance."
    },
    {
      question: "What's the difference between Level 1 and Level 2 EV chargers?",
      answer: "Level 1 chargers use standard 120V outlets and add 3-5 miles of range per hour. Level 2 chargers use 240V circuits and add 25-30 miles per hour—much faster! We recommend Level 2 for most homeowners and all commercial applications."
    },
    {
      question: "Can you install EV chargers for commercial properties?",
      answer: "Yes! We specialize in commercial EV charging station installations for businesses, multi-unit residential buildings, retail locations, and fleet operations. We handle everything from load management to networked charging solutions."
    },
    {
      question: "Are there rebates or tax credits for EV charger installation?",
      answer: "Yes! Federal tax credits and local utility rebates are often available for EV charger installations. We'll help you understand available incentives in your area and provide documentation needed for your applications."
    }
  ];

  const { data: googleReviews } = useGoogleReviews();
  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : defaultReviews;
  const { averageRating, totalReviews } = getReviewStats(reviews);

  return (
    <>
      <SEO 
        title="EV Charger Installation Long Island | Tesla & Level 2"
        description="Professional EV charger installation on Long Island. Tesla, ChargePoint & JuiceBox Level 2 stations. Panel upgrades included. Call (516) 361-4068"
        keywords="EV charger installation Long Island, electric vehicle charging station Suffolk County, Tesla charger installation, Level 2 EV charger, home EV charging, commercial EV charging, electric car charger electrician"
        canonical="https://bermanelectrical.com/ev-charger"
      />
      <ServiceSchema
        serviceName="EV Charger Installation Services"
        serviceType="ElectricalService"
        description="Professional electric vehicle (EV) charger installation for residential and commercial properties on Long Island. Expert installation of Level 1, Level 2, and fast-charging stations including Tesla, ChargePoint, and JuiceBox. Panel upgrades, dedicated circuits, and smart charging solutions."
        url="https://bermanelectrical.com/ev-charger"
        averageRating={averageRating}
        reviewCount={totalReviews}
        additionalOffers={services.map(service => ({
          name: service.title,
          description: service.items.join(". ")
        }))}
      />
      <LocalBusinessSchema
        serviceName="EV Charger Installation"
        serviceDescription="Professional EV charger installation on Long Island for residential and commercial properties. Expert Tesla, ChargePoint, and JuiceBox installation with panel upgrades and dedicated circuits."
        pageUrl="/ev-charger"
        averageRating={averageRating}
        reviewCount={totalReviews}
      />
      <ServiceWithPricingSchema
        serviceName="EV Charger Installation Services"
        serviceType="ElectricalService"
        description="Professional EV charger installation with transparent pricing. Tesla, ChargePoint, and Level 2 charging stations for homes and businesses."
        url="/ev-charger"
        services={pricedServices}
        averageRating={averageRating}
        reviewCount={totalReviews}
      />
      <Navbar />
      <Breadcrumb items={[{ label: "Services", href: "/ev-charger" }, { label: "EV Charger Installation" }]} />
      <EVChargerFAQSchema />
      <BreadcrumbSchema items={[{ name: "EV Charger Installation" }]} />
      <div className="pt-4">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-20">
            <div className="max-w-4xl mx-auto text-center">
              <Car className="w-16 h-16 mx-auto mb-6 text-foreground" />
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                EV Charger Installation
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Power your electric vehicle with confidence. Professional Tesla, ChargePoint, and JuiceBox installation across Long Island with panel upgrades included.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Our EV Charger Installation Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">
                Why Install an EV Charger at Home?
              </h2>
              <div className="bg-gray-50 rounded-xl shadow-lg p-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                    <Zap className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Choose Berman Electric?
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                    <Shield className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-electric-600">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Get Your EV Charger Installed Today!
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Whether you need a home charging station, commercial fleet setup, or multi-unit 
                EV solution, Berman Electric is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 text-electric-700 bg-white rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 focus-visible:ring-offset-2 focus-visible:ring-offset-electric-600"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-electric-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Free Quote
                </Link>
              </div>
              <p className="text-white/90 mt-8 font-semibold">
                Power Up Your Drive with Berman Electric – Your Trusted EV Charger Installation Experts!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <ServiceFAQ 
          title="EV Charger Installation FAQ"
          faqs={faqs}
        />

        {/* Topic Cluster */}
        <ServiceCluster
          title="Electric Vehicle Charging Solutions"
          description="Complete EV charging installation guide for Long Island homes and businesses"
          links={[
            { title: "Residential Panel Upgrades", url: "/residential", description: "Upgrade your panel to support EV charging" },
            { title: "Commercial EV Solutions", url: "/commercial", description: "Multi-unit and workplace charging stations" },
            { title: "Smart Home Integration", url: "/blog/smart-home-electrical-upgrades", description: "Connect your EV charger to smart home systems" }
          ]}
          blogPosts={[
            { title: "EV Charger Installation Guide", url: "/blog/ev-charger-installation-guide-long-island" },
            { title: "Panel Upgrade Guide", url: "/blog/when-to-upgrade-electrical-panel" }
          ]}
        />

        {/* Internal Linking Sidebar Section */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">EV Charger Installation Experts on Long Island</h2>
                <p className="text-gray-600 mb-4">
                  As electric vehicles become more popular, having a reliable home charging station is essential. Our licensed electricians 
                  specialize in Tesla Wall Connector, ChargePoint, and JuiceBox installations, ensuring your EV is always ready to go.
                </p>
                <p className="text-gray-600">
                  We handle everything from panel upgrades to dedicated 240V circuits, providing turnkey EV charging solutions 
                  for homes and businesses across Nassau and Suffolk County.
                </p>
              </div>
              <InternalLinkingSidebar
                currentContent="ev charger electric vehicle tesla chargepoint level 2 charging station panel upgrade"
                currentSlug="/ev-charger"
                blogCategory="EV Charging"
                blogTags={["ev charger", "electric vehicle", "tesla", "charging"]}
              />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <RelatedServices currentService="evcharger" />
      </div>
      <Footer />
    </>
  );
};

export default EVCharger;
