import { CheckCircle2, Star, Clock, Shield, Award, Zap, Home, Building2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import bermanElectrician from "@/assets/berman-electrician.jpeg";
import bermanVan from "@/assets/berman-van.jpeg";

const HomeContent = () => {
  const services = [
    {
      title: "Residential Electrical Services",
      description: "Complete home electrical solutions from panel upgrades to smart home installations",
      link: "/residential",
      icon: <Home className="w-12 h-12" />,
      bgColor: "bg-[hsl(15,85%,92%)]",
      iconColor: "text-[hsl(15,70%,45%)]"
    },
    {
      title: "Commercial Electrical Services", 
      description: "Professional electrical services for businesses, offices, and industrial facilities",
      link: "/commercial",
      icon: <Building2 className="w-12 h-12" />,
      bgColor: "bg-[hsl(200,75%,92%)]",
      iconColor: "text-[hsl(200,70%,45%)]"
    },
    {
      title: "Emergency Electrical Repairs",
      description: "24/7 emergency electrical services across Long Island for urgent electrical issues",
      link: "/emergency",
      icon: <AlertCircle className="w-12 h-12" />,
      bgColor: "bg-[hsl(0,75%,92%)]",
      iconColor: "text-[hsl(0,70%,50%)]"
    },
    {
      title: "EV Charger Installation",
      description: "Professional electric vehicle charging station installation with permits and upgrades",
      link: "/ev-charger",
      icon: <Zap className="w-12 h-12" />,
      bgColor: "bg-[hsl(280,75%,92%)]",
      iconColor: "text-[hsl(280,65%,50%)]"
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
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Column - About */}
            <div className="bg-[hsl(200,75%,94%)] rounded-[32px] p-10 hover:shadow-lg transition-all">
              <div className="mb-8">
                {/* Photo + Badge */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-[hsl(200,70%,88%)] overflow-hidden">
                      <img 
                        src={bermanElectrician} 
                        alt="Berman Electric licensed electrician"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Certification badge overlay */}
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-[hsl(200,70%,88%)]">
                      <Award className="w-5 h-5 text-[hsl(200,70%,40%)]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">About Berman Electric</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-[hsl(200,70%,40%)]">
                        <Shield className="w-3 h-3" />
                        Licensed
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-[hsl(200,70%,40%)]">
                        <Award className="w-3 h-3" />
                        20+ Years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Berman Electric</strong> has been Long Island's premier electrical contractor since 2003, providing reliable, safe, and professional electrical services to homeowners and businesses throughout <Link to="/electrician-suffolk-county" className="text-[hsl(200,70%,40%)] hover:text-[hsl(200,70%,30%)] font-semibold transition-colors underline decoration-2">Suffolk County</Link> and Nassau County.
                </p>
                
                <p>
                  Based in <Link to="/electrician-ronkonkoma" className="text-[hsl(200,70%,40%)] hover:text-[hsl(200,70%,30%)] font-semibold transition-colors underline decoration-2">Ronkonkoma</Link>, our <strong className="text-gray-900">licensed electricians</strong> bring decades of experience to every project, from simple outlet repairs to complex <Link to="/commercial" className="text-[hsl(200,70%,40%)] hover:text-[hsl(200,70%,30%)] font-semibold transition-colors underline decoration-2">commercial electrical installations</Link>.
                </p>
                
                <p>
                  Whether you need <Link to="/emergency" className="text-[hsl(200,70%,40%)] hover:text-[hsl(200,70%,30%)] font-semibold transition-colors underline decoration-2">emergency electrical repairs</Link>, panel upgrades, lighting installation, or cutting-edge <Link to="/ev-charger" className="text-[hsl(200,70%,40%)] hover:text-[hsl(200,70%,30%)] font-semibold transition-colors underline decoration-2">EV charger installation</Link>, we deliver quality workmanship with a commitment to safety and customer satisfaction.
                </p>
              </div>
            </div>
            
            {/* Right Column - Why Choose */}
            <div className="bg-[hsl(140,75%,94%)] rounded-[32px] p-10 hover:shadow-lg transition-all">
              <div className="mb-8">
                {/* Photo + Badge */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-[hsl(140,70%,88%)] overflow-hidden">
                      <img 
                        src={bermanVan} 
                        alt="Berman Electric service van and electrician"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Badge overlay */}
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-[hsl(140,70%,88%)]">
                      <Shield className="w-5 h-5 text-[hsl(140,60%,35%)]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-[hsl(140,60%,35%)]">
                        <Clock className="w-3 h-3" />
                        24/7 Available
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-[hsl(140,60%,35%)]">
                        <Star className="w-3 h-3" />
                        5-Star Rated
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We understand that electrical issues can be stressful and potentially dangerous. That's why we offer <Link to="/emergency" className="text-[hsl(140,60%,35%)] hover:text-[hsl(140,60%,25%)] font-semibold transition-colors underline decoration-2"><strong className="text-gray-900">24/7 emergency services</strong></Link> and guarantee transparent, upfront pricing with no hidden fees.
                </p>
                
                <p>
                  Our <strong className="text-gray-900">licensed electricians</strong> are fully insured and committed to completing every job safely and to code. Our team stays current with the latest electrical codes and technologies to ensure your electrical systems are safe, efficient, and compliant.
                </p>
                
                <p>
                  From smart home automation and energy-efficient LED lighting to <Link to="/projects" className="text-[hsl(140,60%,35%)] hover:text-[hsl(140,60%,25%)] font-semibold transition-colors underline decoration-2">backup generator installations</Link> and electrical safety inspections, we handle all your electrical needs with professionalism and expertise. Read our <Link to="/testimonials" className="text-[hsl(140,60%,35%)] hover:text-[hsl(140,60%,25%)] font-semibold transition-colors underline decoration-2">customer testimonials</Link> to see why Long Island trusts Berman Electric.
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
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className={`group p-10 ${service.bgColor} rounded-[32px] hover:shadow-lg transition-all`}
              >
                <div className="mb-6">
                  <div className={`inline-flex ${service.iconColor} mb-4`}>
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Removed redundant trust signals - now in hero as risk reversal badges */}

        {/* Service Areas */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-6 md:p-12 border border-border">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-foreground">Serving <span className="text-electric-600">Long Island</span></h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Proudly serving Suffolk County and Nassau County with professional electrical services
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-10">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-cream-100 rounded-2xl border border-border">
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-electric-600 flex-shrink-0" />
                  <span className="text-foreground text-xs md:text-sm font-medium break-words leading-tight">{area}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-6 md:pt-8 border-t border-border">
              <p className="text-base md:text-lg text-muted-foreground font-light">
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