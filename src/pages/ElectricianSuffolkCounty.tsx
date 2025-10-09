import { MapPin, Phone, Clock, Shield, CheckCircle2, Users, Building, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useTrackingNumber } from "@/hooks/useTrackingNumber";
import { DynamicPhone } from "@/components/shared/DynamicPhone";

const ElectricianSuffolkCounty = () => {
  const { displayNumber } = useTrackingNumber();
  const services = [
    "Residential Electrical Services",
    "Commercial Electrical Installations", 
    "Emergency Electrical Repairs",
    "Panel Upgrades & Replacements",
    "EV Charger Installation",
    "Generator Installation",
    "Lighting Design & Installation",
    "Electrical Safety Inspections"
  ];

  const towns = [
    "Ronkonkoma", "Huntington", "Smithtown", "Babylon", "Massapequa",
    "Bay Shore", "Commack", "Deer Park", "East Islip", "Farmingdale",
    "Hauppauge", "Lindenhurst", "Patchogue", "West Islip", "Copiague"
  ];

  const projectTypes = [
    {
      icon: <Home className="w-6 h-6 text-electric-600" />,
      title: "Residential Projects",
      description: "Home rewiring, panel upgrades, smart home installations throughout Suffolk County"
    },
    {
      icon: <Building className="w-6 h-6 text-electric-600" />,
      title: "Commercial Projects", 
      description: "Office buildings, retail spaces, warehouses, and industrial facilities"
    },
    {
      icon: <Users className="w-6 h-6 text-electric-600" />,
      title: "Community Services",
      description: "Schools, healthcare facilities, and municipal buildings across the county"
    }
  ];

  return (
    <>
      <SEO
        title="Electrician Suffolk County NY - Licensed Electrical Contractor"
        description={`Professional licensed electrician serving all of Suffolk County NY. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, EV chargers. Call ${displayNumber}`}
        keywords="electrician Suffolk County NY, licensed electrician Suffolk County, electrical contractor Suffolk County, emergency electrician Suffolk County, electrical services Long Island"
        canonical="https://bermanelectrical.com/electrician-suffolk-county"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24 bg-gradient-to-b from-electric-900 to-electric-800">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-electric-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Licensed Electrician Serving Suffolk County, NY
              </h1>
              <p className="text-xl text-electric-100 mb-8">
                Professional Electrical Services Across All Suffolk County Communities - 20+ Years Trusted Experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicPhone
                  eventName="suffolk_hero_phone_click"
                  className="inline-flex items-center px-6 py-3 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  {({ displayNumber: number }) => (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      <span className="whitespace-nowrap">Call {number}</span>
                    </>
                  )}
                </DynamicPhone>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-600 transition-colors font-semibold"
                >
                  Get County-Wide Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none mb-12">
                <h2 className="text-3xl font-bold mb-6">Suffolk County's Premier Electrical Contractor</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Berman Electric</strong> has been Suffolk County's trusted electrical contractor 
                      for over 20 years, providing comprehensive electrical services from Montauk Point to 
                      the Nassau County border. Based in Ronkonkoma at the heart of Suffolk County, we're 
                      strategically positioned to serve all communities throughout the county with fast, 
                      reliable electrical services.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      From the North Shore communities like Huntington and Smithtown to South Shore towns 
                      like Babylon and Massapequa, our licensed electricians understand the diverse electrical 
                      needs across Suffolk County. Whether you're in a historic home in Bay Shore or a modern 
                      development in Hauppauge, we bring the same commitment to quality and safety.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      Suffolk County presents unique electrical challenges - from coastal properties requiring 
                      specialized surge protection to older inland communities needing electrical upgrades. 
                      Our team is experienced with all types of Suffolk County properties, from waterfront 
                      homes to commercial facilities in industrial parks.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Why choose Berman Electric for Suffolk County?</strong> We understand local 
                      building codes, work with county inspectors, and maintain relationships with suppliers 
                      throughout the region. This local expertise translates to faster project completion 
                      times and smoother permit processes for our Suffolk County clients.
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Types */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Suffolk County Electrical Projects</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {projectTypes.map((project, index) => (
                    <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        {project.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Electrical Services Throughout Suffolk County</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-electric-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suffolk County Towns */}
              <div className="mb-12 bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Suffolk County Communities We Serve</h2>
                <p className="text-center text-gray-600 mb-6">
                  Professional electrical services available in all Suffolk County towns and villages
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {towns.map((town, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-electric-600" />
                      <span className="text-gray-700">{town}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Serving all Suffolk County communities.
                    <DynamicPhone
                      className="text-electric-600 hover:text-electric-700 font-semibold ml-1"
                      prefix={<span>Call </span>}
                      suffix={<span> to confirm service in your area.</span>}
                    />
                  </p>
                </div>
              </div>

              {/* County-Specific Benefits */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">County Licensed</h3>
                  <p className="text-gray-600">Licensed to work throughout Suffolk County with full insurance coverage</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Fast County-Wide Service</h3>
                  <p className="text-gray-600">Rapid response times across all Suffolk County communities</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                  <p className="text-gray-600">20+ years serving Suffolk County properties and businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-electric-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Suffolk County Electrical Services</h2>
              <p className="text-xl text-electric-100 mb-8">
                Professional electrical contractor serving all Suffolk County communities. Licensed, insured, and ready to serve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicPhone
                  eventName="suffolk_footer_phone_click"
                  className="inline-flex items-center px-8 py-4 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  {({ displayNumber: number }) => (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      <span className="whitespace-nowrap">Call {number}</span>
                    </>
                  )}
                </DynamicPhone>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold text-lg"
                >
                  Request County Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectricianSuffolkCounty;