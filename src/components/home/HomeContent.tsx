import { CheckCircle2, Star, Clock, Shield, Award } from "lucide-react";
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
    <div className="py-32 bg-background">
      <div className="container">
        {/* Main Content Section */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground leading-[1.15]">
              Your Trusted <span className="text-electric-600">Licensed</span><br />
              Electrician on Long Island
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Serving Suffolk County with excellence for over 20 years
            </p>
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
                  <strong className="text-gray-900">Berman Electric</strong> has been Long Island's premier electrical contractor since 2003, providing reliable, safe, and professional electrical services to homeowners and businesses throughout <Link to="/electrician-suffolk-county" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">Suffolk County</Link> and Nassau County.
                </p>
                
                <p>
                  Based in <Link to="/electrician-ronkonkoma" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">Ronkonkoma</Link>, our <strong className="text-gray-900">licensed electricians</strong> bring decades of experience to every project, from simple outlet repairs to complex <Link to="/commercial" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">commercial electrical installations</Link>.
                </p>
                
                <p>
                  Whether you need <Link to="/emergency" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">emergency electrical repairs</Link>, panel upgrades, lighting installation, or cutting-edge <Link to="/ev-charger" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">EV charger installation</Link>, we deliver quality workmanship with a commitment to safety and customer satisfaction.
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
                  We understand that electrical issues can be stressful and potentially dangerous. That's why we offer <Link to="/emergency" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors"><strong className="text-gray-900">24/7 emergency services</strong></Link> and guarantee transparent, upfront pricing with no hidden fees.
                </p>
                
                <p>
                  Our <strong className="text-gray-900">licensed electricians</strong> are fully insured and committed to completing every job safely and to code. Our team stays current with the latest electrical codes and technologies to ensure your electrical systems are safe, efficient, and compliant.
                </p>
                
                <p>
                  From smart home automation and energy-efficient LED lighting to <Link to="/projects" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">backup generator installations</Link> and electrical safety inspections, we handle all your electrical needs with professionalism and expertise. Read our <Link to="/testimonials" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">customer testimonials</Link> to see why Long Island trusts Berman Electric.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">Our <span className="text-electric-600">Services</span></h2>
            <p className="text-xl text-muted-foreground font-light">Professional solutions for all your electrical needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className="group p-10 bg-card rounded-3xl hover:shadow-lg transition-all border border-border hover:border-electric-600"
              >
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-electric-600 transition-colors">{service.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">Why Choose <span className="text-electric-600">Berman</span></h2>
            <p className="text-xl text-muted-foreground font-light">Commitment to excellence in every project</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => (
              <div key={index} className="bg-card rounded-3xl p-8 text-center border border-border hover:border-electric-600 transition-all">
                <div className="flex justify-center mb-6">
                  {signal.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{signal.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-light">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-12 border border-border">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Serving <span className="text-electric-600">Long Island</span></h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Proudly serving Suffolk County and Nassau County with professional electrical services
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-3 bg-cream-100 rounded-2xl border border-border">
                  <CheckCircle2 className="w-4 h-4 text-electric-600 flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-8 border-t border-border">
              <p className="text-lg text-muted-foreground font-light">
                Don't see your area? <a href="tel:+15163614068" className="text-electric-600 hover:text-electric-700 font-semibold transition-colors">
                  Call (516) 361-4068
                </a> to check if we service your location!
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center bg-electric-600 text-white p-16 rounded-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Ready to Get <span className="text-electric-100">Started?</span></h2>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Get a free estimate on your electrical project today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+15163614068"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-electric-600 rounded-full hover:bg-cream-200 transition-all font-semibold text-lg hover:scale-105"
              >
                Call (516) 361-4068
              </a>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-transparent text-white rounded-full hover:bg-electric-700 transition-all font-semibold text-lg border-2 border-white"
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