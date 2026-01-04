import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, Phone, ChevronRight, CheckCircle2, Zap, Shield, Clock, Star } from "lucide-react";
import { towns, nassauTowns, buildTownPath } from "@/lib/townContent";
import StructuredData from "@/components/town/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import ServiceAreaGeoSchema from "@/components/schema/ServiceAreaGeoSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TownIndex = () => {
  // FAQ data for the location hub
  const locationFaqs = [
    {
      question: "What areas of Long Island does Berman Electric service?",
      answer: "Berman Electric provides licensed electrical services throughout Long Island, covering both Suffolk County and Nassau County. We service over 30 towns from Garden City and Great Neck in the west to Riverhead and the Hamptons in the east. Our centrally located Ronkonkoma headquarters allows us to reach any location on Long Island within 45 minutes."
    },
    {
      question: "Do you charge extra for service calls outside of Ronkonkoma?",
      answer: "No, we do not charge mileage or travel fees for service calls anywhere in Nassau or Suffolk County. Our pricing is the same whether you're in Garden City, Smithtown, or Riverhead. We believe in transparent, upfront pricing for all Long Island residents."
    },
    {
      question: "How quickly can you respond to electrical emergencies in my town?",
      answer: "We provide 24/7 emergency electrical service with typical response times of 30-60 minutes depending on your location. Our emergency hotline at (516) 361-4068 is staffed around the clock, and we have electricians on call throughout Long Island to ensure rapid response to urgent situations."
    },
    {
      question: "Are you familiar with the electrical codes in my specific town?",
      answer: "Yes! Our master electricians are fully versed in the electrical codes and permit requirements for every town in Nassau and Suffolk County. We maintain relationships with local building departments and handle all permit applications, inspections, and code compliance on your behalf."
    },
    {
      question: "Do I need a permit for electrical work in Suffolk or Nassau County?",
      answer: "Most electrical work beyond simple repairs requires a permit. Panel upgrades, new circuits, service changes, and electrical installations all require permits from your local building department. Berman Electric handles all permitting as part of our service, ensuring your project is fully code-compliant."
    },
    {
      question: "What makes Berman Electric different from other Long Island electricians?",
      answer: "With over 20 years of experience serving Long Island exclusively, we understand the unique electrical challenges of the region—from waterfront corrosion in coastal towns to outdated knob-and-tube wiring in historic homes. We're licensed, insured, and provide upfront pricing with no hidden fees. Our 4.9-star rating reflects our commitment to quality and customer satisfaction."
    }
  ];

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.bermanelectrical.com/locations",
    name: "Licensed Electricians Serving Suffolk & Nassau Counties, Long Island",
    description: "Professional electrical services across all of Long Island. Licensed electricians serving 30+ towns in Suffolk County and Nassau County. Emergency service, panel upgrades, EV chargers.",
    url: "https://www.bermanelectrical.com/locations",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        ...towns.map((town, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebPage",
            name: `${town.name} Electrician`,
            url: `https://www.bermanelectrical.com${buildTownPath(town.slug)}`,
            description: town.seo.description
          }
        })),
        ...nassauTowns.map((town, index) => ({
          "@type": "ListItem",
          position: towns.length + index + 1,
          item: {
            "@type": "WebPage",
            name: `${town.name} Electrician`,
            url: `https://www.bermanelectrical.com${buildTownPath(town.slug)}`,
            description: town.seo.description
          }
        }))
      ]
    },
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://www.bermanelectrical.com/#organization",
      name: "Berman Electric",
      telephone: "+1-516-361-4068",
      address: {
        "@type": "PostalAddress",
        streetAddress: "26 Railroad Avenue",
        addressLocality: "Ronkonkoma",
        addressRegion: "NY",
        postalCode: "11779",
        addressCountry: "US"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Licensed Electricians Serving Suffolk & Nassau Counties, Long Island | Berman Electric</title>
        <meta
          name="description"
          content="Professional electrical services across Long Island. Licensed electricians serving 30+ towns in Suffolk County and Nassau County. Panel upgrades, EV chargers, emergency repairs. Call (516) 361-4068."
        />
        <meta name="keywords" content="electrician Long Island, Suffolk County electrician, Nassau County electrician, licensed electrician near me, Long Island electrical services, emergency electrician Long Island" />
        <link rel="canonical" href="https://www.bermanelectrical.com/locations" />
        <meta property="og:title" content="Licensed Electricians Serving Suffolk & Nassau Counties, Long Island" />
        <meta property="og:description" content="Professional electrical services across all of Long Island. Licensed electricians serving 30+ towns in Suffolk County and Nassau County. Emergency service, panel upgrades, EV chargers." />
        <meta property="og:url" content="https://www.bermanelectrical.com/locations" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="Long Island, New York" />
      </Helmet>

      <StructuredData data={collectionPageSchema} id="town-collection-schema" />
      <FAQSchema faqs={locationFaqs} />
      <ServiceAreaGeoSchema />
      <BreadcrumbSchema items={[{ name: "Service Areas", url: "/locations" }]} />
      
      <Navbar />
      <Breadcrumb items={[{ label: "Service Areas" }]} />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-16">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">4.9 Star Rating • 127+ Reviews</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                Licensed Electricians Serving Suffolk & Nassau Counties, Long Island
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional electrical services for homes and businesses across all of Long Island. 
                From Garden City to the Hamptons, our master electricians deliver quality work with upfront pricing.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Get Free Estimate
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="bg-muted py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6">Our Long Island Service Area</h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798893802!2d-73.97968099999999!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e821390bedc46d%3A0x95c68fe3a8c13b72!2sLong%20Island%2C%20NY!5e0!3m2!1sen!2sus!4v1704000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Berman Electric Long Island Service Area Map"
                />
              </div>
              <p className="text-center text-muted-foreground mt-4 text-sm">
                Based in Ronkonkoma, we serve all of Nassau County and Suffolk County with fast response times.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-12 bg-card border-y border-border">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">Licensed & Insured</p>
                  <p className="text-sm text-muted-foreground">NY License #ME-44927</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">24/7 Emergency</p>
                  <p className="text-sm text-muted-foreground">Always on call</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Zap className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">Same-Day Service</p>
                  <p className="text-sm text-muted-foreground">When you need it</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">20+ Years Experience</p>
                  <p className="text-sm text-muted-foreground">Long Island experts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background py-16">
          <div className="container">
            {/* County Introduction */}
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6">Electrical Services Across All of Long Island</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Berman Electric has been the trusted name in electrical services for Long Island homeowners and businesses 
                for over two decades. From our centrally located headquarters in Ronkonkoma, our team of licensed master 
                electricians serves every community across Suffolk County and Nassau County. Whether you need an emergency 
                repair, a panel upgrade, or a complete home rewiring, we bring the same commitment to quality, safety, 
                and fair pricing to every job.
              </p>
            </div>

            {/* Suffolk County Section */}
            <section className="mb-16" aria-labelledby="suffolk-heading">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 id="suffolk-heading" className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-primary" />
                    Suffolk County
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    From Huntington to the Hamptons, we provide comprehensive electrical services for Suffolk County's 
                    diverse communities. Our electricians understand the unique needs of waterfront properties, 
                    historic homes, and modern developments throughout the county.
                  </p>
                </div>
                <Link 
                  to="/locations/suffolk-county" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold whitespace-nowrap"
                >
                  Suffolk County Overview
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {towns.map((town) => (
                  <Link
                    to={buildTownPath(town.slug)}
                    key={town.slug}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                        {town.name} Electrician
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ZIP: {town.zipCodes[0]}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Nassau County Section */}
            <section className="mb-16" aria-labelledby="nassau-heading">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 id="nassau-heading" className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-primary" />
                    Nassau County
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    Serving Nassau County's established neighborhoods from Garden City to Great Neck. 
                    Our electricians specialize in the panel upgrades, smart home installations, and 
                    historic home rewiring that Nassau County homeowners need.
                  </p>
                </div>
                <Link 
                  to="/locations/nassau-county" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold whitespace-nowrap"
                >
                  Nassau County Overview
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {nassauTowns.map((town) => (
                  <Link
                    to={buildTownPath(town.slug)}
                    key={town.slug}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                        {town.name} Electrician
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ZIP: {town.zipCodes[0]}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Our Services Section */}
            <section className="mb-16 bg-muted rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Electrical Services Available in Every Town</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/residential" className="bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Residential Electrical</h3>
                  <p className="text-sm text-muted-foreground">Panel upgrades, rewiring, lighting, smart home installation for Long Island homes.</p>
                </Link>
                <Link to="/commercial" className="bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Commercial Electrical</h3>
                  <p className="text-sm text-muted-foreground">Office, retail, restaurant, and warehouse electrical services across Long Island.</p>
                </Link>
                <Link to="/ev-charger" className="bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">EV Charger Installation</h3>
                  <p className="text-sm text-muted-foreground">Level 2 home and commercial EV charging stations installed by certified electricians.</p>
                </Link>
                <Link to="/emergency" className="bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Emergency Services</h3>
                  <p className="text-sm text-muted-foreground">24/7 emergency electrical repairs and power restoration throughout Long Island.</p>
                </Link>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16 max-w-4xl mx-auto" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-bold text-center mb-8">
                Frequently Asked Questions About Our Long Island Service Areas
              </h2>
              <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
                {locationFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border last:border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 text-left">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* CTA Section */}
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Need an Electrician in Your Town?
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                Whether you're in Huntington, Garden City, Smithtown, or any other Long Island community, 
                Berman Electric is ready to help. Call us now for same-day service or schedule a free estimate.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-8 py-4 bg-card text-primary rounded-full font-semibold hover:bg-card/90 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/30 rounded-full font-semibold hover:bg-primary-foreground/20 transition-colors"
                >
                  Request Free Estimate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TownIndex;
