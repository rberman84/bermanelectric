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
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        {/* Main Content Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Your Trusted Licensed Electrician<br />
              <span className="text-electric-600">Serving Long Island for Over 20 Years</span>
            </h2>
            <div className="w-24 h-1 bg-electric-600 mx-auto"></div>
          </div>
          
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - About */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-electric-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">About Berman Electric</h3>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Berman Electric</strong> has been Long Island's premier electrical contractor since 2003, providing reliable, safe, and professional electrical services to homeowners and businesses throughout Suffolk County and Nassau County.
                </p>
                
                <p>
                  Based in Ronkonkoma, our licensed electricians bring decades of experience to every project, from simple outlet repairs to complex commercial electrical installations.
                </p>
                
                <p>
                  Whether you need emergency electrical repairs, panel upgrades, lighting installation, or cutting-edge EV charger installation, we deliver quality workmanship with a commitment to safety and customer satisfaction.
                </p>
              </div>
            </div>
            
            {/* Right Column - Why Choose */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-electric-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Why Choose Us</h3>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We understand that electrical issues can be stressful and potentially dangerous. That's why we offer <strong className="text-gray-900">24/7 emergency services</strong> and guarantee transparent, upfront pricing with no hidden fees.
                </p>
                
                <p>
                  Our licensed electricians are fully insured and committed to completing every job safely and to code. Our team stays current with the latest electrical codes and technologies to ensure your electrical systems are safe, efficient, and compliant.
                </p>
                
                <p>
                  From smart home automation and energy-efficient LED lighting to backup generator installations and electrical safety inspections, we handle all your electrical needs with professionalism and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Electrical Services</h2>
            <p className="text-lg text-gray-600">Professional solutions for all your electrical needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className="group p-6 bg-white rounded-xl hover:shadow-lg transition-all border border-gray-200 hover:border-electric-600 hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-electric-600 transition-colors">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Long Island Trusts Berman Electric</h2>
            <p className="text-lg text-gray-600">Commitment to excellence in every project</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {signal.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{signal.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-electric-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Serving Long Island Communities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Proudly serving Suffolk County and Nassau County with professional electrical services. Based in Ronkonkoma, we provide fast, reliable service throughout Long Island.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-electric-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                Don't see your area? <a href="tel:+15163614068" className="text-electric-600 hover:text-electric-700 font-bold transition-colors">
                  Call (516) 361-4068
                </a> to check if we service your location!
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-gradient-to-br from-electric-600 to-electric-700 text-white p-12 rounded-2xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-electric-50 max-w-2xl mx-auto leading-relaxed">
              Get a free estimate on your electrical project today. Licensed, insured, and ready to serve Long Island.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+15163614068"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-electric-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg hover:scale-105"
              >
                Call (516) 361-4068
              </a>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-electric-800 text-white rounded-xl hover:bg-electric-900 transition-all font-bold text-lg hover:scale-105 border-2 border-white/20"
              >
                Request Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;