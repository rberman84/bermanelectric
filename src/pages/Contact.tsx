
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/contact/ContactForm";
import ServicesList from "@/components/contact/ServicesList";
import GoogleMap from "@/components/shared/GoogleMap";
import NAP from "@/components/shared/NAP";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/shared/Breadcrumb";

const Contact = () => {

  return (
    <>
      <SEO
        title="Contact Us | Free Electrical Quote Long Island"
        description="Get a free electrical quote from Berman Electric. Serving Suffolk & Nassau County. 24/7 emergency service. Call (516) 361-4068 for fast response."
        keywords="contact electrician Long Island, electrical quote Suffolk County, emergency electrician Ronkonkoma NY, electrical estimate Nassau County, 24/7 electrical service"
        canonical="https://bermanelectrical.com/contact"
      />
      <Navbar />
      <Breadcrumb items={[{ label: "Contact Us" }]} />
      <div className="pt-20">
        <div className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                Contact Berman Electric
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Reliable electrical services – one call away. Licensed electricians serving Long Island homes and businesses with repairs, installations, upgrades, and emergency services.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2" id="contact-form">
                <h2 className="text-3xl font-bold mb-8">📩 Request a Quote</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below, and one of our electricians will get back to you 
                  within 24 hours to discuss your electrical needs.
                </p>
                <ContactForm />
              </div>
              
              <div className="space-y-8">
                <NAP variant="contact" showHours={true} />
                <ServicesList />
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Find Us & Our Service Area</h2>
                <p className="text-lg text-gray-600">
                  Located in Ronkonkoma, serving all of Long Island with professional electrical services
                </p>
              </div>
              <GoogleMap showDirectionsLink={true} />
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <CTASection 
          variant="service"
          title="Ready to Schedule Your Electrical Service?"
          subtitle="Get your free estimate today and experience the Berman Electric difference"
          showTrustSignals={true}
        />
      </div>
      <Footer />
    </>
  );
};

export default Contact;
