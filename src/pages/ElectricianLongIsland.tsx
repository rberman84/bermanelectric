import { MapPin, Phone, Clock, Shield, CheckCircle2, Anchor, Building2, Home, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useTrackingNumber } from "@/hooks/useTrackingNumber";
import { DynamicPhone } from "@/components/shared/DynamicPhone";

const ElectricianLongIsland = () => {
  const { displayNumber } = useTrackingNumber();
  const services = [
    "Residential Electrical Services",
    "Commercial Electrical Installations", 
    "Emergency Electrical Repairs",
    "Panel Upgrades & Modernization",
    "EV Charger Installation",
    "Backup Generator Systems",
    "Smart Home Automation",
    "Electrical Safety Inspections",
    "Marine & Dock Electrical Work",
    "Pool & Spa Electrical Installation"
  ];

  const regions = [
    {
      name: "Nassau County",
      areas: ["Garden City", "Hempstead", "Levittown", "Freeport", "Hicksville"]
    },
    {
      name: "Suffolk County", 
      areas: ["Ronkonkoma", "Huntington", "Babylon", "Smithtown", "Massapequa"]
    },
    {
      name: "North Shore",
      areas: ["Port Jefferson", "Northport", "Cold Spring Harbor", "Oyster Bay"]
    },
    {
      name: "South Shore",
      areas: ["Bay Shore", "Islip", "Patchogue", "Sayville", "Fire Island"]
    }
  ];

  const specialties = [
    {
      icon: <Anchor className="w-8 h-8 text-electric-600" />,
      title: "Coastal Properties",
      description: "Specialized electrical work for waterfront homes and marine environments"
    },
    {
      icon: <Home className="w-8 h-8 text-electric-600" />,
      title: "Historic Homes",
      description: "Expert rewiring and electrical upgrades for Long Island's historic properties"
    },
    {
      icon: <Building2 className="w-8 h-8 text-electric-600" />,
      title: "Modern Developments",
      description: "Complete electrical services for new construction and modern communities"
    },
    {
      icon: <Zap className="w-8 h-8 text-electric-600" />,
      title: "Hurricane Preparedness",
      description: "Generator installations and electrical protection for Long Island weather"
    }
  ];

  return (
    <>
      <SEO
        title="Electrician Long Island NY - Licensed Electrical Contractor Nassau & Suffolk"
        description={`Professional licensed electrician serving all of Long Island NY including Nassau County and Suffolk County. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, marine electrical. Call ${displayNumber}`}
        keywords="electrician Long Island NY, licensed electrician Nassau County, electrician Suffolk County, Long Island electrical contractor, marine electrician Long Island, coastal electrical services"
        canonical="https://bermanelectrical.com/electrician-long-island"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24 bg-gradient-to-b from-electric-900 to-electric-800">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-electric-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Licensed Electrician Serving All of Long Island, NY
              </h1>
              <p className="text-xl text-electric-100 mb-8">
                Professional Electrical Services from Montauk to Queens - Nassau & Suffolk Counties - 20+ Years Trusted
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicPhone
                  eventName="longisland_hero_phone_click"
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
                  Get Island-Wide Service
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
                <h2 className="text-3xl font-bold mb-6">Long Island's Premier Electrical Contractor</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Berman Electric</strong> has proudly served Long Island for over 20 years, 
                      providing comprehensive electrical services from the western Nassau County border 
                      to the eastern tip of Suffolk County in Montauk. As Long Island's trusted electrical 
                      contractor, we understand the unique challenges and opportunities that come with 
                      living and working on the island.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      Long Island presents distinctive electrical needs - from coastal properties requiring 
                      specialized marine electrical work and hurricane-resistant installations to historic 
                      homes needing careful electrical upgrades that preserve architectural integrity. 
                      Our team is experienced with all aspects of Long Island electrical work, including 
                      the unique challenges of sandy soil, salt air, and seasonal weather patterns.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      Whether you're in a Gold Coast mansion in Nassau County, a beach house in the 
                      Hamptons, a suburban development in central Suffolk County, or a waterfront 
                      property on the North or South Shore, we bring decades of Long Island electrical 
                      expertise to every project. We're familiar with local building codes, work with 
                      municipal inspectors throughout the island, and maintain relationships with 
                      suppliers from Hempstead to Montauk.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Why choose Berman Electric for Long Island electrical services?</strong> 
                      We're not just contractors - we're Long Island neighbors who understand the 
                      island lifestyle, seasonal demands, and the importance of reliable electrical 
                      systems whether you're year-round residents or seasonal visitors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Long Island Specialties */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Long Island Electrical Specialties</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {specialties.map((specialty, index) => (
                    <div key={index} className="text-center p-6 bg-electric-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        {specialty.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{specialty.title}</h3>
                      <p className="text-gray-600 text-sm">{specialty.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Long Island Electrical Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Island Regions */}
              <div className="mb-12 bg-electric-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Long Island Regions We Serve</h2>
                <p className="text-center text-gray-600 mb-8">
                  Professional electrical services available throughout Nassau County and Suffolk County
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {regions.map((region, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <h3 className="font-semibold text-electric-600 mb-3">{region.name}</h3>
                      <div className="space-y-1">
                        {region.areas.map((area, areaIndex) => (
                          <div key={areaIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-electric-600" />
                            <span className="text-gray-600">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Serving all Long Island communities from Queens border to Montauk Point.
                    <DynamicPhone
                      className="text-electric-600 hover:text-electric-700 font-semibold ml-1"
                      prefix={<span>Call </span>}
                      suffix={<span> for any Long Island location.</span>}
                    />
                  </p>
                </div>
              </div>

              {/* Long Island Benefits */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Island-Wide Licensed</h3>
                  <p className="text-gray-600">Licensed to work throughout Nassau and Suffolk Counties with comprehensive insurance</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Island-Wide Response</h3>
                  <p className="text-gray-600">Strategic Long Island location for rapid response from Montauk to Queens</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <Anchor className="w-12 h-12 mx-auto mb-4 text-electric-600" />
                  <h3 className="text-xl font-semibold mb-2">Island Expertise</h3>
                  <p className="text-gray-600">20+ years specializing in Long Island's unique electrical challenges and opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-electric-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Long Island Electrical Services</h2>
              <p className="text-xl text-electric-100 mb-8">
                From Nassau County to Suffolk County - Your trusted Long Island electrical contractor for over 20 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicPhone
                  eventName="longisland_footer_phone_click"
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
                  Request Island Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectricianLongIsland;