import { MapPin, Phone, Clock, Shield, CheckCircle2, Zap, Home, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const ElectricianRonkonkoma = () => {
  const services = [
    "Emergency Electrical Repairs",
    "Panel Upgrades & Installations", 
    "Lighting Installation & LED Upgrades",
    "EV Charger Installation",
    "Generator Installation & Repair",
    "Electrical Safety Inspections",
    "Smart Home Automation",
    "Surge Protection Systems"
  ];

  const neighborhoods = [
    "Downtown Ronkonkoma",
    "Lake Ronkonkoma Area", 
    "Bohemia Border",
    "Oakdale Border",
    "Holbrook Border",
    "Centereach Border"
  ];

  return (
    <>
      <SEO 
        title="Electrician Ronkonkoma NY - Local Licensed Electrical Services"
        description="Professional electrician serving Ronkonkoma NY and surrounding areas. Licensed electrical contractor with 20+ years experience. Panel upgrades, emergency repairs, EV charger installation. Call (516) 361-4068"
        keywords="electrician Ronkonkoma NY, licensed electrician Ronkonkoma, electrical services Ronkonkoma, emergency electrician Ronkonkoma, panel upgrades Ronkonkoma, Lake Ronkonkoma electrician"
        canonical="https://bermanelectrical.com/electrician-ronkonkoma"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24 bg-gradient-to-b from-electric-900 to-electric-800">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-electric-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Licensed Electrician in Ronkonkoma, NY
              </h1>
              <p className="text-xl text-electric-100 mb-8">
                Your Local Electrical Experts - Serving Ronkonkoma & Lake Ronkonkoma for Over 20 Years
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call (516) 361-4068
                </a>
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-600 transition-colors font-semibold"
                >
                  Get Free Estimate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Local Content */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none mb-12">
                <h2 className="text-3xl font-bold mb-6">Ronkonkoma's Trusted Electrical Contractor</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Berman Electric</strong> is proud to be Ronkonkoma's premier electrical contractor, 
                      serving residents and businesses in this vibrant Suffolk County community for over 20 years. 
                      Located right here in Ronkonkoma, we understand the unique electrical needs of our 
                      neighbors, from historic homes near Lake Ronkonkoma to modern developments throughout the area.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      Our licensed electricians provide comprehensive electrical services to Ronkonkoma residents, 
                      including emergency repairs, panel upgrades, lighting installations, and the latest in 
                      EV charger technology. We're familiar with local building codes and work closely with 
                      Ronkonkoma homeowners to ensure all electrical work meets or exceeds safety standards.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      Whether you live near the beautiful Lake Ronkonkoma, in the bustling downtown area, or 
                      in one of the residential neighborhoods bordering Bohemia, Oakdale, or Holbrook, our 
                      team is ready to handle all your electrical needs. From vintage homes that need rewiring 
                      to new constructions requiring complete electrical installations, we've got Ronkonkoma covered.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Why choose a local Ronkonkoma electrician?</strong> Fast response times, 
                      knowledge of local properties, and the peace of mind that comes from working with 
                      your neighbors. We're available 24/7 for electrical emergencies and always provide 
                      upfront, honest pricing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Services for Ronkonkoma */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Electrical Services for Ronkonkoma Residents</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Areas */}
              <div className="mb-12 bg-electric-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Ronkonkoma Areas We Serve</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {neighborhoods.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-electric-600" />
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Trust Factors */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Licensed in NY</h3>
                  <p className="text-gray-600">Fully licensed and insured to work in Ronkonkoma and all of Suffolk County</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Local Response</h3>
                  <p className="text-gray-600">Based in Ronkonkoma for fastest response times to your electrical emergency</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Local Knowledge</h3>
                  <p className="text-gray-600">20+ years experience with Ronkonkoma homes and electrical systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-electric-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need an Electrician in Ronkonkoma?</h2>
              <p className="text-xl text-electric-100 mb-8">
                Your local electrical experts are just a phone call away. Licensed, insured, and ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+15163614068"
                  className="inline-flex items-center px-8 py-4 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call (516) 361-4068 Now
                </a>
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold text-lg"
                >
                  Schedule Service Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectricianRonkonkoma;