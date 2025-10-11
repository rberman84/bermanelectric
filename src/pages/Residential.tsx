import { Plug, Lightbulb, Shield, Wrench, Car, Power, CheckCircle2, Phone, Mail, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import { generateAltText } from "@/lib/utils";
import ServiceSchema from "@/components/schema/ServiceSchema";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import RelatedServices from "@/components/service/RelatedServices";
import ServiceCluster from "@/components/service/ServiceCluster";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { getReviewStats, transformGoogleReviews, defaultReviews } from "@/components/shared/ReviewsSection";

const Residential = () => {
  const services = [{
    title: "Electrical Installations & Upgrades",
    icon: <Plug className="w-6 h-6 text-electric-600" />,
    items: ["Complete home wiring for new constructions & renovations", "Panel upgrades for improved electrical capacity", "Circuit breaker replacements", "Smart home automation & wiring"]
  }, {
    title: "Lighting Solutions",
    icon: <Lightbulb className="w-6 h-6 text-electric-600" />,
    items: ["Custom indoor & outdoor lighting installation", "Energy-efficient LED upgrades", "Landscape & security lighting", "Recessed lighting & dimmer switches"]
  }, {
    title: "Electrical Repairs & Troubleshooting",
    icon: <Wrench className="w-6 h-6 text-electric-600" />,
    items: ["Fixing faulty outlets, switches, & wiring", "Power surges, flickering lights, & circuit issues", "Emergency electrical repair services"]
  }, {
    title: "Home Safety & Code Compliance",
    icon: <Shield className="w-6 h-6 text-electric-600" />,
    items: ["Electrical safety inspections", "GFCI & AFCI outlet installations", "Whole-home surge protection", "Smoke & carbon monoxide detector wiring"]
  }, {
    title: "EV Charger Installation",
    icon: <Car className="w-6 h-6 text-electric-600" />,
    items: ["Home electric vehicle (EV) charger installation", "Level 1, Level 2, & fast-charging solutions", "Permits, wiring, & panel upgrades for EV charging"]
  }, {
    title: "Generator Installation & Backup Power",
    icon: <Power className="w-6 h-6 text-electric-600" />,
    items: ["Standby generator installation for uninterrupted power", "Transfer switches & whole-home power solutions", "Portable generator hookup & wiring"]
  }];
  const benefits = ["Over 20 Years of Experience – Trusted by homeowners across Long Island", "Licensed & Insured Electricians – Ensuring top-tier quality & safety", "Fast, Reliable Service – We get the job done right the first time", "Upfront Pricing – No hidden fees, just honest, competitive rates", "Customer Satisfaction Guaranteed – 5-star rated service"];
  
  const faqs = [
    {
      question: "How much does it cost to upgrade my electrical panel?",
      answer: "Panel upgrade costs vary based on your home's needs and current electrical capacity. Most residential panel upgrades range from $1,500 to $3,500. We provide free estimates and upfront pricing before any work begins."
    },
    {
      question: "How long does a typical residential electrical installation take?",
      answer: "Most residential electrical work is completed in 1-3 days depending on the scope. Simple installations like outlets or switches can be done in hours, while full home rewiring or panel upgrades may take several days. We provide detailed timelines during your consultation."
    },
    {
      question: "Do you offer emergency residential electrical services?",
      answer: "Yes! We provide 24/7 emergency electrical services for urgent issues like power outages, electrical fires, sparking outlets, or any situation that poses a safety risk to your home and family."
    },
    {
      question: "Are your electricians licensed and insured?",
      answer: "Absolutely. All our electricians are fully licensed, insured, and have over 20 years of experience serving Long Island homeowners. We maintain all necessary certifications and stay current with electrical codes."
    },
    {
      question: "Can you help with smart home electrical installations?",
      answer: "Yes! We specialize in smart home wiring and automation, including smart lighting systems, automated switches, smart thermostats, and integration with home automation platforms. We ensure your electrical system can support modern smart home technology."
    }
  ];

  const { data: googleReviews } = useGoogleReviews();
  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : defaultReviews;
  const { averageRating, totalReviews } = getReviewStats(reviews);

  return <>
      <SEO 
        title="Residential Electrical Services Long Island - Licensed Home Electrician"
        description="Professional residential electrical services on Long Island. Licensed electrician for home wiring, panel upgrades, lighting installation, EV chargers, smart home automation. Serving Suffolk & Nassau County. Call (516) 361-4068"
        keywords="residential electrician Long Island, home electrical services Suffolk County, electrical panel upgrades, home rewiring, lighting installation, EV charger installation, smart home wiring, GFCI installation"
        canonical="https://bermanelectrical.com/residential"
      />
      <ServiceSchema
        serviceName="Residential Electrical Services"
        serviceType="ElectricalService"
        description="Professional residential electrical services including home wiring, panel upgrades, lighting installation, EV charger installation, smart home automation, and emergency repairs. Licensed and insured electricians serving Long Island homeowners."
        url="https://bermanelectrical.com/residential"
        averageRating={averageRating}
        reviewCount={totalReviews}
        additionalOffers={services.map(service => ({
          name: service.title,
          description: service.items.join(". ")
        }))}
      />
      <Navbar />
      <BreadcrumbSchema items={[{ name: "Residential Electrical Services" }]} />
      <div className="pt-4">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70" aria-hidden="true">
            <img
              src="/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png"
              alt={generateAltText(
                "/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png",
                "Background image of a vintage light bulb symbolizing quality electrical workmanship"
              )}
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Home className="w-16 h-16 mx-auto mb-6 text-electric-400 drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                Residential Electrical Services
              </h1>
              <p className="text-xl text-electric-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Powering Your Home with Safety & Expertise
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                At Berman Electric, we provide top-tier residential electrical services to homeowners 
                across Long Island. Whether you need new installations, repairs, or energy-efficient 
                upgrades, our licensed and experienced electricians are here to ensure your home is 
                powered safely and efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative py-24">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/lovable-uploads/75ea0479-7d50-48c5-8033-c17332ea08c3.png"
              alt={generateAltText(
                "/lovable-uploads/75ea0479-7d50-48c5-8033-c17332ea08c3.png",
                "Background photo showcasing modern residential lighting"
              )}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/[0.51]"></div>
          </div>
          <div className="container relative">
            <h2 className="text-3xl font-bold text-center mb-16">Our Residential Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => <div key={index} className="card p-6 hover:translate-y-[-4px] bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    {service.icon}
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => <li key={idx} className="flex items-start gap-2">
                        <span className="text-electric-600 mt-1">•</span>
                        <span className="text-gray-600">{item}</span>
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-24 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Berman Electric?</h2>
            <div className="max-w-3xl mx-auto">
              {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{benefit}</p>
                </div>)}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-electric-600">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Get a Free Quote Today!
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Whether you're upgrading your home's electrical system, adding smart home features, 
                or need emergency repairs, Berman Electric is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 text-electric-700 bg-white rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 focus-visible:ring-offset-2 focus-visible:ring-offset-electric-600"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-electric-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Quote Online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <ServiceFAQ 
          title="Residential Electrical Services FAQ"
          faqs={faqs}
        />

        {/* Topic Cluster */}
        <ServiceCluster
          title="Complete Home Electrical Solutions"
          description="Everything you need to know about residential electrical services on Long Island"
          links={[
            { title: "Panel Upgrades & Service Upgrades", url: "/blog/when-to-upgrade-electrical-panel", description: "Signs you need an electrical panel upgrade" },
            { title: "Smart Home Electrical", url: "/blog/smart-home-electrical-upgrades", description: "Modern electrical upgrades for smart homes" },
            { title: "EV Charger Installation", url: "/ev-charger", description: "Install a Level 2 home EV charging station" }
          ]}
          blogPosts={[
            { title: "Top 5 Electrical Safety Tips for Homeowners", url: "/blog/electrical-safety-tips-long-island-homeowners" },
            { title: "5 Electrical Mistakes That Cost Thousands", url: "/blog/5-electrical-mistakes-homeowners-make-cost-thousands" },
            { title: "Why Licensed Electricians Save Money", url: "/blog/licensed-electricians-save-money" }
          ]}
        />

        {/* Related Services */}
        <RelatedServices currentService="residential" />

        {/* Final Tagline */}
        <div className="py-12 bg-gray-50">
          <div className="container text-center">
            <p className="text-2xl font-semibold text-gray-900">
              Power Your Home with Confidence – Trust Berman Electric!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>;
};
export default Residential;