import { Building2, Plug, Lightbulb, Shield, Wrench, Power, CheckCircle2, Phone, Mail, Factory } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const Commercial = () => {
  const services = [{
    title: "Electrical Installations & Upgrades",
    icon: <Plug className="w-6 h-6 text-electric-600" />,
    items: ["Complete wiring for new commercial builds & renovations", "Electrical panel upgrades to meet increased power demands", "Dedicated circuits & electrical load balancing", "Office, warehouse, & retail electrical fit-outs"]
  }, {
    title: "Lighting & Energy Efficiency Solutions",
    icon: <Lightbulb className="w-6 h-6 text-electric-600" />,
    items: ["Custom LED lighting installations for cost savings & sustainability", "Security & emergency lighting installation", "Motion sensors & automated lighting controls", "Parking lot lighting & exterior building illumination"]
  }, {
    title: "Electrical Maintenance & Repairs",
    icon: <Wrench className="w-6 h-6 text-electric-600" />,
    items: ["Troubleshooting & electrical system diagnostics", "Preventative maintenance to reduce downtime", "Repairing faulty outlets, switches, & power surges", "24/7 emergency electrical repairs to keep your business running"]
  }, {
    title: "Backup Power & Surge Protection",
    icon: <Power className="w-6 h-6 text-electric-600" />,
    items: ["Commercial generator installation & maintenance", "Uninterrupted power supply (UPS) solutions", "Surge protection for sensitive commercial equipment"]
  }, {
    title: "Code Compliance & Safety Inspections",
    icon: <Shield className="w-6 h-6 text-electric-600" />,
    items: ["Full commercial electrical safety inspections", "NEC compliance for permits & electrical certifications", "Fire alarm & smoke detector wiring", "GFCI & AFCI protection installations"]
  }, {
    title: "Specialized Services",
    icon: <Factory className="w-6 h-6 text-electric-600" />,
    items: ["EV charging station installations for businesses", "Data cabling & structured wiring for offices & tech facilities", "Temporary power solutions for construction sites & events"]
  }];
  const industries = ["Offices & Corporate Buildings", "Retail Stores & Shopping Centers", "Restaurants, Bars, & Cafés", "Warehouses & Industrial Facilities", "Healthcare & Medical Centers", "Schools, Colleges, & Universities", "Hotels & Hospitality", "Multi-Unit Residential Buildings"];
  const benefits = ["Over 20 Years of Commercial Experience – Trusted by top businesses across Long Island", "Licensed, Insured & Certified Electricians – Ensuring quality & safety", "Fast, Reliable, & Scalable Solutions – Minimize downtime & maximize efficiency", "Upfront Pricing & Custom Quotes – Competitive, transparent pricing with no hidden costs", "Emergency Service Available 24/7 – We're always ready when you need us"];
  return <>
      <SEO 
        title="Commercial Electrical Services Long Island - Licensed Business Electrician"
        description="Professional commercial electrical contractor serving Long Island businesses. Licensed electrician for office buildings, retail spaces, warehouses, restaurants. Emergency repairs, installations, maintenance. Suffolk & Nassau County. Call (516) 361-4068"
        keywords="commercial electrician Long Island, business electrical services Suffolk County, commercial electrical contractor Nassau County, office electrical installation, retail lighting, warehouse electrical, restaurant electrical"
        canonical="https://bermanelectrical.com/commercial"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70">
            <img src="/lovable-uploads/c867126f-321b-4d27-b41c-c3b7b160cd63.png" alt="Modern commercial building representing our commitment to business electrical solutions" className="w-full h-full object-cover opacity-70" loading="lazy" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Building2 className="w-16 h-16 mx-auto mb-6 text-electric-400 drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                Commercial Electrical Services
              </h1>
              <p className="text-xl text-electric-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Reliable Power Solutions for Your Business
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                At Berman Electric, we specialize in providing top-tier commercial electrical services for businesses 
                across Long Island. Our expert electricians ensure that your commercial space is safe, energy-efficient, 
                and up to code—so you can focus on running your business. Whether you need new installations, upgrades, 
                maintenance, or emergency repairs, we've got you covered.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative py-24">
          <div className="absolute inset-0">
            <img src="/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png" alt="Professional electrician installing commercial electrical equipment" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/[0.54]"></div>
          </div>
          <div className="container relative">
            <h2 className="text-3xl font-bold text-center mb-16">Our Commercial Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => <div key={index} className="card p-6 hover:translate-y-[-4px] bg-white/90 backdrop-blur-sm border-electric-100">
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

        {/* Industries We Serve */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Industries We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mb-3" />
                  <p className="text-lg text-gray-700">{industry}</p>
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
                Get a Custom Quote for Your Business
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Need a reliable and efficient commercial electrical contractor? Berman Electric is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="tel:+15163614068" className="inline-flex items-center px-6 py-3 text-electric-600 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone className="w-5 h-5 mr-2" />
                  (516) 361-4068
                </a>
                <Link to="/contact" className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors">
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Quote Online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Final Tagline */}
        <div className="py-12 bg-gray-50">
          <div className="container text-center">
            <p className="text-2xl font-semibold text-gray-900">
              Powering Your Business with Expertise – Choose Berman Electric!
            </p>
          </div>
        </div>
      </div>
    </>;
};
export default Commercial;