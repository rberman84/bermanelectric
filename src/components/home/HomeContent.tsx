import { CheckCircle2, Star, MapPin, Clock, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HomeContent = () => {
  const services = [
    {
      title: "Residential Electrical Services",
      description: "Complete home electrical solutions from panel upgrades to smart home installations",
      link: "/residential"
    },
    {
      title: "Commercial Electrical Services", 
      description: "Professional electrical services for businesses, offices, and industrial facilities",
      link: "/commercial"
    },
    {
      title: "Emergency Electrical Repairs",
      description: "24/7 emergency electrical services across Long Island for urgent electrical issues",
      link: "/emergency"
    },
    {
      title: "EV Charger Installation",
      description: "Professional electric vehicle charging station installation with permits and upgrades",
      link: "/ev-charger"
    }
  ];

  const trustSignals = [
    {
      icon: <Award className="w-8 h-8 text-electric-600" />,
      title: "20+ Years Experience",
      description: "Over two decades serving Long Island with reliable electrical solutions"
    },
    {
      icon: <Shield className="w-8 h-8 text-electric-600" />,
      title: "Licensed & Insured",
      description: "Fully licensed electricians with comprehensive insurance coverage"
    },
    {
      icon: <Star className="w-8 h-8 text-electric-600" />,
      title: "5-Star Rated Service",
      description: "Consistently rated 5 stars by satisfied customers across Suffolk County"
    },
    {
      icon: <Clock className="w-8 h-8 text-electric-600" />,
      title: "24/7 Emergency Service",
      description: "Available around the clock for electrical emergencies and urgent repairs"
    }
  ];

  const serviceAreas = [
    "Ronkonkoma", "Huntington", "Massapequa", "Smithtown", "Babylon", 
    "Bay Shore", "Commack", "Deer Park", "East Islip", "Farmingdale"
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container">
        {/* Main Content Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Your Trusted Licensed Electrician Serving Long Island for Over 20 Years
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  <strong>Berman Electric</strong> has been Long Island's premier electrical contractor since 2003, 
                  providing reliable, safe, and professional electrical services to homeowners and businesses 
                  throughout Suffolk County and Nassau County. Based in Ronkonkoma, our licensed electricians 
                  bring decades of experience to every project, from simple outlet repairs to complex commercial 
                  electrical installations.
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  Whether you need emergency electrical repairs, panel upgrades, lighting installation, or 
                  cutting-edge EV charger installation, we deliver quality workmanship with a commitment to 
                  safety and customer satisfaction. Our team stays current with the latest electrical codes 
                  and technologies to ensure your electrical systems are safe, efficient, and compliant.
                </p>
              </div>
              
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  <strong>Why choose Berman Electric?</strong> We understand that electrical issues can be 
                  stressful and potentially dangerous. That's why we offer 24/7 emergency services and 
                  guarantee transparent, upfront pricing with no hidden fees. Our licensed electricians 
                  are fully insured and committed to completing every job safely and to code.
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  From smart home automation and energy-efficient LED lighting to backup generator 
                  installations and electrical safety inspections, we handle all your electrical needs 
                  with professionalism and expertise. Trust the electrical contractor that Long Island 
                  has relied on for over two decades.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Electrical Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className="p-6 bg-gray-50 rounded-lg hover:bg-electric-50 transition-colors border border-gray-200 hover:border-electric-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Long Island Trusts Berman Electric</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSignals.map((signal, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {signal.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{signal.title}</h3>
                <p className="text-gray-600">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16 bg-gray-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <MapPin className="w-8 h-8 text-electric-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Serving Long Island Communities</h2>
            <p className="text-lg text-gray-700">
              Proudly serving Suffolk County and Nassau County with professional electrical services. 
              Based in Ronkonkoma, we provide fast, reliable service throughout Long Island.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {serviceAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-600" />
                <span className="text-gray-700">{area}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't see your area? <a href="tel:+15163614068" className="text-electric-600 hover:text-electric-700 font-semibold">
                Call (516) 361-4068
              </a> to check if we service your location!
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-electric-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-electric-100">
            Get a free estimate on your electrical project today. Licensed, insured, and ready to serve Long Island.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+15163614068"
              className="inline-flex items-center px-6 py-3 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Call (516) 361-4068
            </a>
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold"
            >
              Request Free Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;