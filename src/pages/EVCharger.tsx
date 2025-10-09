import Navbar from "@/components/Navbar";
import { Car, Zap, Shield, CheckCircle2, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/media/ResponsiveImage";
import { generateAltText } from "@/lib/utils";

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
  return (
    <>
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="/lovable-uploads/130c4fb5-1384-416b-a335-4fc8b7562611.png"
              alt="EV Charging Port"
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover"
              sizes="(min-width: 1280px) 60vw, 100vw"
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70" aria-hidden="true">
            <img
              src="/lovable-uploads/130c4fb5-1384-416b-a335-4fc8b7562611.png"
              alt={generateAltText(
                "/lovable-uploads/130c4fb5-1384-416b-a335-4fc8b7562611.png",
                "Background photo of an EV charging port"
              )}
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70 opacity-80" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Car className="w-16 h-16 mx-auto mb-6 text-electric-400 drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                EV Charger Installation Services
              </h1>
              <p className="text-xl text-electric-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Power Your Electric Vehicle with Confidence
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                As electric vehicles (EVs) become the future of transportation, having a reliable, 
                at-home or commercial charging solution is essential. At Berman Electric, we 
                specialize in EV charger installations for homes, businesses, and commercial 
                properties across Long Island.
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
      </div>
    </>
  );
};

export default EVCharger;
