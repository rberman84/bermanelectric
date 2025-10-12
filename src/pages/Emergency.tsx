
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
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import { generateAltText } from "@/lib/utils";
import ServiceSchema from "@/components/schema/ServiceSchema";
import logoOptimized from "@/assets/logo-optimized.webp";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import RelatedServices from "@/components/service/RelatedServices";
import ServiceCluster from "@/components/service/ServiceCluster";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { getReviewStats, transformGoogleReviews, defaultReviews } from "@/components/shared/ReviewsSection";

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

  const faqs = [
    {
      question: "What qualifies as an electrical emergency?",
      answer: "Electrical emergencies include sparking outlets, burning smells from electrical sources, complete power loss, exposed wiring, electrical shocks from appliances, smoke from outlets or panels, frequent circuit breaker trips, and any situation that poses immediate fire or safety risks."
    },
    {
      question: "How fast can you respond to an emergency electrical call?",
      answer: "We provide 24/7 emergency response with technicians on call around the clock. Response times vary by location and time, but we prioritize emergency calls and typically arrive within 1-2 hours for urgent situations across Long Island."
    },
    {
      question: "Do you charge more for emergency electrical services?",
      answer: "Emergency service rates may be higher than standard rates due to after-hours response, but we provide upfront pricing before starting work. We never surprise you with hidden fees—you'll know the cost before we begin repairs."
    },
    {
      question: "Should I turn off my main breaker before you arrive?",
      answer: "If you smell burning, see smoke, or suspect an electrical fire, yes—turn off the main breaker if it's safe to access. For other emergencies, you can wait for our guidance. Our emergency dispatcher will provide safety instructions when you call."
    },
    {
      question: "Can you help with storm damage electrical repairs?",
      answer: "Yes! We handle all types of storm-related electrical damage including downed power lines (coordinating with utility companies), flooded electrical systems, damaged panels, and full electrical safety inspections after severe weather events."
    }
  ];

  const { data: googleReviews } = useGoogleReviews();
  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : defaultReviews;
  const { averageRating, totalReviews } = getReviewStats(reviews);

  return (
    <>
      <SEO
        title="24/7 Emergency Electrician Long Island - Emergency Electrical Repairs" 
        description="24/7 emergency electrician serving Long Island. Fast response for electrical emergencies, power outages, sparking outlets, electrical fires. Licensed emergency electrical repairs Suffolk & Nassau County. Call (516) 361-4068"
        keywords="emergency electrician Long Island, 24/7 electrical repairs Suffolk County, electrical emergency Nassau County, power outage repair, electrical fire safety, emergency electrical service"
        canonical="https://bermanelectrical.com/emergency"
      />
      <ServiceSchema
        serviceName="24/7 Emergency Electrical Services"
        serviceType="EmergencyService"
        description="24/7 emergency electrical services for homes and businesses across Long Island. Rapid response for power outages, electrical fires, sparking outlets, storm damage, and all urgent electrical repairs. Licensed emergency electricians available around the clock."
        url="https://bermanelectrical.com/emergency"
        averageRating={averageRating}
        reviewCount={totalReviews}
        additionalOffers={services.map(service => ({
          name: service.title,
          description: service.items.join(". ")
        }))}
      />
      <Navbar />
      <BreadcrumbSchema items={[{ name: "Emergency Electrical Services" }]} />
      <div className="pt-4">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70" aria-hidden="true">
            <img
              src="/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png"
              alt={generateAltText(
                "/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png",
                "Background image of an emergency electrical response vehicle"
              )}
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
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
                className="inline-flex items-center px-8 py-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors animate-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700"
              >
                <Phone className="w-6 h-6 mr-2" />
                Call Now: (516) 361-4068
              </a>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative py-24">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={logoOptimized}
              alt={generateAltText(
                logoOptimized,
                "Background illustration of emergency electrical repair"
              )}
              width="512"
              height="512"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/[0.94]"></div>
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
                  className="inline-flex items-center px-6 py-3 text-red-700 bg-white rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-red-700"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Hotline: (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request Emergency Service Online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <ServiceFAQ 
          title="Emergency Electrical Services FAQ"
          faqs={faqs}
        />

        {/* Topic Cluster */}
        <ServiceCluster
          title="Emergency Electrical Resources"
          description="Essential information for electrical emergencies across Long Island"
          links={[
            { title: "Residential Emergency Service", url: "/residential", description: "Home electrical emergency repairs" },
            { title: "Commercial Emergency Service", url: "/commercial", description: "24/7 business electrical emergencies" },
            { title: "Storm Damage Repair", url: "/emergency", description: "Post-storm electrical assessments" }
          ]}
          blogPosts={[
            { title: "Hurricane Electrical Preparedness", url: "/blog/hurricane-electrical-preparedness-long-island" },
            { title: "Electrical Safety Tips", url: "/blog/electrical-safety-tips-long-island-homeowners" },
            { title: "5 Electrical Mistakes to Avoid", url: "/blog/5-electrical-mistakes-homeowners-make-cost-thousands" }
          ]}
        />

        {/* Related Services */}
        <RelatedServices currentService="emergency" />
      </div>
      <Footer />
    </>
  );
};

export default Emergency;
