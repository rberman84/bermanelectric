import { Building2, Plug, Lightbulb, Shield, Wrench, Power, CheckCircle2, Phone, Mail, Factory } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import ServiceSchema from "@/components/schema/ServiceSchema";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import RelatedServices from "@/components/service/RelatedServices";
import ServiceCluster from "@/components/service/ServiceCluster";
import ServiceTownLinks from "@/components/service/ServiceTownLinks";
import ServiceLongIslandSection from "@/components/service/ServiceLongIslandSection";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { getReviewStats, transformGoogleReviews, defaultReviews } from "@/components/shared/ReviewsSection";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CommercialFAQSchema from "@/components/schema/CommercialFAQSchema";
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema";
import ServiceWithPricingSchema, { ServicePricing } from "@/components/schema/ServiceWithPricingSchema";
import InternalLinkingSidebar from "@/components/seo/InternalLinkingSidebar";

const Commercial = () => {
  const pricedServices: ServicePricing[] = [
    { name: "Commercial Panel Upgrade", description: "Upgrade commercial electrical panel capacity", priceRange: "$3,000 - $10,000", priceCurrency: "USD", minPrice: 3000, maxPrice: 10000 },
    { name: "LED Lighting Retrofit", description: "Commercial LED lighting installation and retrofit", priceRange: "$50 - $150 per fixture", priceCurrency: "USD", minPrice: 50, maxPrice: 150 },
    { name: "Emergency Lighting Installation", description: "Install emergency exit and backup lighting", priceRange: "$200 - $500 per unit", priceCurrency: "USD", minPrice: 200, maxPrice: 500 },
    { name: "Dedicated Circuit Installation", description: "Install dedicated circuits for equipment", priceRange: "$300 - $800", priceCurrency: "USD", minPrice: 300, maxPrice: 800 },
    { name: "Commercial Generator Installation", description: "Backup generator installation for businesses", priceRange: "$5,000 - $20,000", priceCurrency: "USD", minPrice: 5000, maxPrice: 20000 },
    { name: "Data Cabling", description: "Structured data and network cabling", priceRange: "$100 - $250 per drop", priceCurrency: "USD", minPrice: 100, maxPrice: 250 },
  ];
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
  
  const faqs = [
    {
      question: "What types of commercial properties do you service?",
      answer: "We service all types of commercial properties including offices, retail stores, restaurants, warehouses, medical facilities, schools, hotels, and multi-unit residential buildings. Our team has over 20 years of experience with commercial electrical systems of all sizes."
    },
    {
      question: "Do you offer preventative maintenance contracts for businesses?",
      answer: "Yes! We offer comprehensive preventative maintenance contracts to keep your commercial electrical systems running smoothly and minimize unexpected downtime. Regular maintenance helps identify potential issues before they become costly emergencies."
    },
    {
      question: "How quickly can you respond to commercial electrical emergencies?",
      answer: "We provide 24/7 emergency service with rapid response times for commercial clients. We understand that electrical downtime can cost your business thousands of dollars, so we prioritize getting your operations back online as quickly as possible."
    },
    {
      question: "Are your commercial electrical services code compliant?",
      answer: "Absolutely. All our work meets or exceeds NEC (National Electrical Code) standards and local building codes. We handle all necessary permits and inspections to ensure your commercial property is fully compliant and safe."
    },
    {
      question: "Can you work during off-hours to avoid disrupting business operations?",
      answer: "Yes! We understand that many electrical upgrades and installations need to happen outside of business hours. We're flexible with scheduling and can work nights, weekends, or during your slowest business periods to minimize disruption."
    }
  ];

  const { data: googleReviews } = useGoogleReviews();
  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : defaultReviews;
  const { averageRating, totalReviews } = getReviewStats(reviews);

  return <>
      <SEO 
        title="Commercial Electrician Long Island | Business Services"
        description="Licensed commercial electrician for Long Island businesses. Offices, retail, warehouses & restaurants. 24/7 emergency repairs. Call (516) 361-4068"
        keywords="commercial electrician Long Island, business electrical services Suffolk County, commercial electrical contractor Nassau County, office electrical installation, retail lighting, warehouse electrical, restaurant electrical"
        canonical="https://bermanelectrical.com/commercial"
      />
      <ServiceSchema
        serviceName="Commercial Electrical Services"
        serviceType="ElectricalService"
        description="Professional commercial electrical contractor services for businesses across Long Island. Specializing in office buildings, retail spaces, warehouses, restaurants, healthcare facilities, and more. 24/7 emergency service, preventative maintenance, and code-compliant installations."
        url="https://bermanelectrical.com/commercial"
        averageRating={averageRating}
        reviewCount={totalReviews}
        additionalOffers={services.map(service => ({
          name: service.title,
          description: service.items.join(". ")
        }))}
      />
      <LocalBusinessSchema
        serviceName="Commercial Electrical Services"
        serviceDescription="Professional commercial electrical contractor serving Long Island businesses including offices, retail, warehouses, and restaurants. 24/7 emergency service, preventative maintenance, and code-compliant installations."
        pageUrl="/commercial"
        averageRating={averageRating}
        reviewCount={totalReviews}
      />
      <ServiceWithPricingSchema
        serviceName="Commercial Electrical Services"
        serviceType="ElectricalService"
        description="Commercial electrical contractor services with transparent pricing for Long Island businesses. Panel upgrades, LED retrofits, generators, and data cabling."
        url="/commercial"
        services={pricedServices}
        averageRating={averageRating}
        reviewCount={totalReviews}
      />
      <Navbar />
      <Breadcrumb items={[{ label: "Services", href: "/commercial" }, { label: "Commercial Electrical Services" }]} />
      <CommercialFAQSchema />
      <BreadcrumbSchema items={[{ name: "Commercial Electrical Services" }]} />
      <div className="pt-4">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-20">
            <div className="max-w-4xl mx-auto text-center">
              <Building2 className="w-16 h-16 mx-auto mb-6 text-foreground" />
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                Commercial Electrical Services on Long Island
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Reliable power solutions for Long Island businesses. Licensed electrician providing installations, upgrades, maintenance, and emergency repairs across Nassau and Suffolk County.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative py-24">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png"
              alt="Licensed electrician installing commercial electrical equipment panel upgrade Long Island business electrical services"
              className="w-full h-full object-cover"
              loading="lazy"
            />
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
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 text-electric-700 bg-white rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 focus-visible:ring-offset-2 focus-visible:ring-offset-electric-600"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-electric-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Quote Online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <ServiceFAQ 
          title="Commercial Electrical Services FAQ"
          faqs={faqs}
        />

        {/* Long Island Specific Content */}
        <ServiceLongIslandSection
          serviceType="commercial"
          issues={[
            { title: "Outdated Commercial Panels", description: "Many Long Island strip malls and office buildings from the 1970s-80s have undersized electrical services that can't support modern HVAC and equipment loads.", solution: "Commercial panel upgrade with load balancing" },
            { title: "Three-Phase Power Issues", description: "Industrial facilities experience phase imbalance and voltage drops that damage sensitive manufacturing equipment.", solution: "Three-phase power correction and monitoring systems" },
            { title: "Emergency Lighting Compliance", description: "Fire marshal inspections find emergency lighting and exit sign failures in older commercial buildings.", solution: "Emergency lighting system upgrades and testing programs" },
            { title: "Restaurant Kitchen Circuits", description: "Long Island restaurants struggle with tripped breakers and inadequate power for commercial kitchen equipment.", solution: "Dedicated circuits and panel upgrades for commercial kitchens" },
            { title: "Data Center Power", description: "Growing data needs require redundant power systems and UPS installations for business continuity.", solution: "Redundant power systems with generator backup" },
            { title: "Retail Lighting Retrofits", description: "Outdated fluorescent lighting increases energy costs and reduces merchandise appeal in retail spaces.", solution: "LED retrofit with dimming and smart controls" }
          ]}
        />

        {/* Town Links for Internal Linking */}
        <ServiceTownLinks 
          serviceName="Commercial Electrical Services"
          maxTowns={12}
        />

        {/* Topic Cluster */}
        <ServiceCluster
          title="Business Electrical Solutions"
          description="Comprehensive commercial electrical services for Long Island businesses"
          links={[
            { title: "Office Electrical Installation", url: "/commercial", description: "Complete electrical solutions for office buildings" },
            { title: "Retail Store Electrical", url: "/commercial", description: "Lighting and power for retail spaces" },
            { title: "Commercial EV Charging", url: "/ev-charger", description: "Multi-unit and workplace charging stations" }
          ]}
          blogPosts={[
            { title: "Licensed Electricians Save Money", url: "/blog/licensed-electricians-save-money" },
            { title: "Hurricane Electrical Preparedness", url: "/blog/hurricane-electrical-preparedness-long-island" }
          ]}
        />

        {/* Internal Linking Sidebar Section */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Commercial Electrical Expertise for Long Island Businesses</h2>
                <p className="text-gray-600 mb-4">
                  Your business deserves an electrical system that's reliable, efficient, and code-compliant. From retail stores to warehouses, 
                  restaurants to medical facilities, our commercial electricians understand the unique demands of business electrical systems.
                </p>
                <p className="text-gray-600">
                  We minimize downtime with flexible scheduling, including nights and weekends, and provide 24/7 emergency service 
                  to keep your operations running smoothly across Nassau and Suffolk County.
                </p>
              </div>
              <InternalLinkingSidebar
                currentContent="commercial business office retail warehouse restaurant industrial electrical contractor"
                currentSlug="/commercial"
                blogCategory="Commercial"
                blogTags={["commercial", "business", "office", "industrial"]}
              />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <RelatedServices currentService="commercial" />

        {/* Final Tagline */}
        <div className="py-12 bg-gray-50">
          <div className="container text-center">
            <p className="text-2xl font-semibold text-gray-900">
              Powering Your Business with Expertise – Choose Berman Electric!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>;
};
export default Commercial;