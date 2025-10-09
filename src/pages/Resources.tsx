import { ExternalLink, Download, Phone, Shield, Award, Users, Building, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import CTASection from "@/components/shared/CTASection";
import SEO from "@/components/SEO";
import { useTrackingNumber } from "@/hooks/useAttribution";

const Resources = () => {
  const safetyResources = [
    {
      title: "Electrical Safety Foundation International (ESFI)",
      description: "Comprehensive electrical safety information for homeowners and businesses",
      url: "https://www.esfi.org/",
      type: "External Link"
    },
    {
      title: "National Electrical Code (NEC) Guide",
      description: "Understanding electrical codes and safety standards for Long Island properties",
      url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70",
      type: "External Link"
    },
    {
      title: "Home Electrical Safety Checklist",
      description: "Downloadable checklist for Long Island homeowners to assess electrical safety",
      url: "/resources/electrical-safety-checklist.pdf",
      type: "PDF Download"
    },
    {
      title: "OSHA Electrical Safety Guidelines",
      description: "Workplace electrical safety standards for Long Island businesses",
      url: "https://www.osha.gov/electrical",
      type: "External Link"
    }
  ];

  const industryPartners = [
    {
      name: "National Electrical Contractors Association (NECA)",
      description: "Professional electrical contractors organization",
      website: "https://www.necanet.org/",
      logo: null,
      services: "Industry standards, training, and advocacy"
    },
    {
      name: "International Brotherhood of Electrical Workers (IBEW)",
      description: "Electrical workers union promoting safety and excellence",
      website: "https://www.ibew.org/",
      logo: null,
      services: "Skilled workforce, training programs"
    },
    {
      name: "Electrical Safety Foundation International",
      description: "Dedicated to promoting electrical safety awareness",
      website: "https://www.esfi.org/",
      logo: null,
      services: "Safety education, research, advocacy"
    },
    {
      name: "New York State Department of Labor",
      description: "Licensing and regulation of electrical contractors",
      website: "https://www.labor.ny.gov/",
      logo: null,
      services: "Licensing, inspections, code enforcement"
    }
  ];

  const localResources = [
    {
      title: "Suffolk County Building Department",
      description: "Permits, inspections, and code requirements for Suffolk County electrical work",
      url: "https://www.suffolkcountyny.gov/",
      phone: "(631) 853-4849",
      services: ["Electrical permits", "Inspections", "Code compliance"]
    },
    {
      title: "Nassau County Building Department", 
      description: "Building permits and electrical inspections for Nassau County projects",
      url: "https://www.nassaucountyny.gov/",
      phone: "(516) 571-3661",
      services: ["Building permits", "Electrical inspections", "Zoning information"]
    },
    {
      title: "PSEG Long Island",
      description: "Utility service, outages, and electrical service connections",
      url: "https://www.psegliny.com/",
      phone: "(800) 490-0025",
      services: ["Service connections", "Outage reporting", "Energy efficiency programs"]
    },
    {
      title: "Town of Ronkonkoma Building Department",
      description: "Local building permits and electrical inspections in Ronkonkoma",
      url: "https://www.townofislip.com/",
      phone: "(631) 224-5400", 
      services: ["Local permits", "Inspections", "Code enforcement"]
    }
  ];

  const calculatorTools = [
    {
      title: "Electrical Load Calculator",
      description: "Calculate electrical load requirements for your Long Island home",
      url: "#calculator",
      type: "Interactive Tool"
    },
    {
      title: "Wire Size Calculator",
      description: "Determine proper wire gauge for electrical installations",
      url: "#wire-calculator", 
      type: "Interactive Tool"
    },
    {
      title: "Energy Cost Calculator",
      description: "Estimate energy costs for electrical appliances and systems",
      url: "#energy-calculator",
      type: "Interactive Tool"
    },
    {
      title: "EV Charging Cost Calculator",
      description: "Calculate the cost of charging your electric vehicle at home",
      url: "#ev-calculator",
      type: "Interactive Tool"
    }
  ];

  const emergencyContacts = [
    {
      service: "Berman Electric Emergency Line",
      phone: "",
      hours: "24/7 Emergency Service",
      description: "Licensed electrician for all electrical emergencies on Long Island"
    },
    {
      service: "PSEG Emergency Outages",
      phone: "(800) 490-0025", 
      hours: "24/7",
      description: "Report power outages and downed power lines"
    },
    {
      service: "Suffolk County Fire/Police/EMS",
      phone: "911",
      hours: "24/7",
      description: "Emergency services for electrical fires and emergencies"
    },
    {
      service: "Nassau County Fire/Police/EMS", 
      phone: "911",
      hours: "24/7",
      description: "Emergency services for electrical fires and emergencies"
    }
  ];

  const { display: phoneDisplay, href: phoneHref } = useTrackingNumber();
  const emergencyContactsWithDynamic = emergencyContacts.map((contact) =>
    contact.service === "Berman Electric Emergency Line"
      ? { ...contact, phone: phoneDisplay, href: phoneHref }
      : contact
  );

  return (
    <>
      <SEO 
        title="Electrical Resources & Tools - Berman Electric Long Island"
        description="Comprehensive electrical resources for Long Island homeowners and businesses. Safety guides, code information, calculators, and professional partners. Licensed electrician resources and emergency contacts."
        keywords="electrical resources Long Island, electrical safety guides, electrical calculators, Suffolk County permits, Nassau County building codes, electrical contractors, emergency electrician contacts"
        canonical="https://bermanelectrical.com/resources"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="py-16 bg-gradient-to-b from-electric-900 to-electric-800 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Electrical Resources & Tools
              </h1>
              <p className="text-xl text-electric-100 mb-8">
                Comprehensive resources for Long Island homeowners, businesses, and electrical professionals. 
                Safety guides, calculators, partner information, and emergency contacts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  View Blog
                </Link>
                <a
                  href={phoneHref}
                  className="inline-flex items-center px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-600 transition-colors font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {`Emergency: ${phoneDisplay}`}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Resources */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-electric-600" />
              <h2 className="text-3xl font-bold mb-4">Electrical Safety Resources</h2>
              <p className="text-lg text-gray-600">
                Essential safety information and guidelines for Long Island electrical work
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {safetyResources.map((resource, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                    <span className="text-xs bg-electric-100 text-electric-700 px-2 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 font-semibold"
                  >
                    {resource.type === "PDF Download" ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    {resource.type === "PDF Download" ? "Download" : "Visit Resource"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Partners */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-electric-600" />
              <h2 className="text-3xl font-bold mb-4">Industry Partners & Organizations</h2>
              <p className="text-lg text-gray-600">
                Professional organizations we work with to maintain the highest standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {industryPartners.map((partner, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                      <p className="text-gray-600 mb-3">{partner.description}</p>
                      <p className="text-sm text-electric-600">{partner.services}</p>
                    </div>
                  </div>
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Local Resources */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <Building className="w-12 h-12 mx-auto mb-4 text-electric-600" />
              <h2 className="text-3xl font-bold mb-4">Long Island Local Resources</h2>
              <p className="text-lg text-gray-600">
                Local government offices, utilities, and services for Long Island electrical projects
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {localResources.map((resource, index) => (
                <div key={index} className="p-6 bg-electric-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {resource.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-electric-600 rounded-full"></div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                    <a 
                      href={`tel:${resource.phone}`}
                      className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      {resource.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculators & Tools */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-electric-600" />
              <h2 className="text-3xl font-bold mb-4">Electrical Calculators & Tools</h2>
              <p className="text-lg text-gray-600">
                Helpful calculators and tools for electrical planning and estimation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {calculatorTools.map((tool, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-electric-100 text-electric-700 px-2 py-1 rounded-full">
                      {tool.type}
                    </span>
                    <span className="text-electric-600 text-sm font-semibold">Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="py-16 bg-red-50">
          <div className="container">
            <div className="text-center mb-12">
              <Phone className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h2 className="text-3xl font-bold mb-4 text-red-900">Emergency Contacts</h2>
              <p className="text-lg text-red-700">
                Important phone numbers for electrical emergencies on Long Island
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {emergencyContactsWithDynamic.map((contact, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-red-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{contact.service}</h3>
                    <span className="text-sm text-gray-500">{contact.hours}</span>
                  </div>
                  <a
                    href={contact.href ? contact.href : `tel:${contact.phone}`}
                    className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-2"
                  >
                    {contact.phone}
                  </a>
                  <p className="text-gray-600 text-sm">{contact.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-red-600 text-white rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">⚠️ Electrical Emergency Safety</h3>
              <p className="mb-4">
                If you smell burning wires, see sparks, or experience electrical shocks, 
                turn off power at the main breaker and call for help immediately.
              </p>
              <a
                href={phoneHref}
                className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                <Phone className="w-5 h-5 mr-2" />
                {`Emergency: ${phoneDisplay}`}
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <CTASection 
          variant="service"
          title="Need Professional Electrical Assistance?"
          subtitle="Don't navigate electrical challenges alone. Get expert help from Long Island's trusted licensed electrician."
          showTrustSignals={true}
        />
      </div>
      <Footer />
    </>
  );
};

export default Resources;