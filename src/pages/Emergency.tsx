
import { 
  BellRing,
  Power,
  Zap,
  AlertTriangle,
  CloudLightning,
  Lightbulb,
  FlaskConical,
  CheckCircle2,
  Phone,  
  Mail,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/media/ResponsiveImage";

const Emergency = () => {
  const services = [{
    title: "Power Outages & Electrical Failures",
    icon: <Power className="w-6 h-6 text-red-600" />,
    items: [
      "Immediate troubleshooting to restore lost power",
      "Breaker panel issues & blown fuses",
      "Sudden loss of electricity in homes, offices, & businesses"
    ]
  }, {
    title: "Electrical Fire Hazards & Overheating",
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    items: [
      "Diagnosing & repairing sparking outlets or burning smells",
      "Addressing overloaded circuits & electrical overheating",
      "Faulty wiring that poses a fire risk"
    ]
  }, {
    title: "Storm Damage & Flooded Electrical Systems",
    icon: <CloudLightning className="w-6 h-6 text-red-600" />,
    items: [
      "Post-storm electrical safety inspections",
      "Repairing downed power lines & damaged electrical panels",
      "Restoring power after floods & severe weather events"
    ]
  }, {
    title: "Flickering Lights & Power Surges",
    icon: <Lightbulb className="w-6 h-6 text-red-600" />,
    items: [
      "Identifying inconsistent power issues",
      "Installing whole-home surge protection",
      "Repairing damaged appliances or overloaded circuits"
    ]
  }, {
    title: "Generator Failures & Backup Power Issues",
    icon: <Zap className="w-6 h-6 text-red-600" />,
    items: [
      "Emergency generator repairs & troubleshooting",
      "Ensuring backup power solutions are operational",
      "Installing temporary power solutions for businesses"
    ]
  }, {
    title: "Exposed or Damaged Wiring",
    icon: <FlaskConical className="w-6 h-6 text-red-600" />,
    items: [
      "Immediate wiring repairs to prevent safety hazards",
      "Fixing damaged electrical panels or outdated wiring",
      "Code compliance checks for commercial & residential properties"
    ]
  }];

  const benefits = [
    "24/7 Rapid Response – We're available anytime, day or night",
    "Licensed & Insured Experts – Certified electricians for safe, professional repairs",
    "Fast Troubleshooting & Repairs – We diagnose and fix problems on the spot",
    "Honest, Upfront Pricing – No hidden fees or unexpected charges",
    "Emergency Service for Homes & Businesses – We handle all electrical emergencies"
  ];

  const safetyTips = [
    "If you smell burning wires or see sparks, turn off power immediately and call us.",
    "If your home or business experiences a sudden power failure, do not attempt DIY repairs—our licensed electricians will assess and fix the issue safely."
  ];

  return (
    <>
      <SEO 
        title="24/7 Emergency Electrician Long Island - Emergency Electrical Repairs" 
        description="24/7 emergency electrician serving Long Island. Fast response for electrical emergencies, power outages, sparking outlets, electrical fires. Licensed emergency electrical repairs Suffolk & Nassau County. Call (516) 361-4068"
        keywords="emergency electrician Long Island, 24/7 electrical repairs Suffolk County, electrical emergency Nassau County, power outage repair, electrical fire safety, emergency electrical service"
        canonical="https://bermanelectrical.com/emergency"
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png"
              alt="Emergency electrical service vehicle ready for rapid response"
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover"
              sizes="(min-width: 1280px) 60vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70 opacity-80" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <BellRing className="w-16 h-16 mx-auto mb-6 text-red-400 animate-pulse drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                Emergency Electrical Services
              </h1>
              <p className="text-xl text-red-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                24/7 Emergency Electricians – Fast, Reliable, and Ready When You Need Us
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                Electrical emergencies can happen at any time—power outages, faulty wiring, sparking outlets, 
                or electrical failures can disrupt your home or business and pose serious safety risks. At 
                Berman Electric, we provide 24/7 emergency electrical services across Long Island to ensure 
                your safety and restore power quickly.
              </p>
              <a
                href="tel:+15163614068"
                className="inline-flex items-center px-8 py-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors animate-pulse"
              >
                <Phone className="w-6 h-6 mr-2" />
                Call Now: (516) 361-4068
              </a>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative py-24">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png"
              alt="Emergency electrical repair being performed"
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover"
              sizes="(min-width: 1280px) 60vw, 100vw"
            />
            <div className="absolute inset-0 bg-white/[0.94]" />
          </div>
          <div className="container relative">
            <h2 className="text-3xl font-bold text-center mb-16">Emergency Electrical Issues We Handle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="card p-6 hover:translate-y-[-4px] bg-white/90 backdrop-blur-sm border-red-100">
                  <div className="flex items-center gap-4 mb-4">
                    {service.icon}
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="py-24 bg-red-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">What to Do in an Electrical Emergency?</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg border-l-4 border-red-600 shadow-sm">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-24 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Berman Electric for Emergency Services?</h2>
            <div className="max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-red-600">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Call Now for Immediate Help!
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Fast, Reliable, and Always Available – Trust Berman Electric to Handle Your Electrical Emergencies!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="tel:+15163614068" 
                  className="inline-flex items-center px-6 py-3 text-red-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Hotline: (516) 361-4068
                </a>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-6 py-3 text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request Emergency Service Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Emergency;
