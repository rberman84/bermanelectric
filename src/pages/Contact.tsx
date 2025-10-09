
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ServicesList from "@/components/contact/ServicesList";
import { AiOnsiteTriage } from "@/components/contact/AiOnsiteTriage";
import { SmartBookingEstimator } from "@/components/contact/SmartBookingEstimator";
import GoogleMap from "@/components/shared/GoogleMap";
import NAP from "@/components/shared/NAP";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";

type TriageSummary = {
  triageId?: string | null;
  hazardLevel: string;
  urgencyLevel: string;
  summary: string;
  jobLengthMinutes?: number;
  serviceType?: string;
  zipCode: string;
};

const Contact = () => {
  const [triageSummary, setTriageSummary] = useState<TriageSummary | null>(null);

  return (
    <>
      <SEO
        title="Contact Berman Electric - Get Free Quote | Licensed Electrician Long Island"
        description="Contact Berman Electric for your electrical needs in Long Island, Suffolk County & Ronkonkoma NY. Free estimates, 24/7 emergency service. Call (516) 361-4068 or request a quote online. Licensed & insured electrician."
        keywords="contact electrician Long Island, electrical quote Suffolk County, emergency electrician Ronkonkoma NY, electrical estimate Nassau County, 24/7 electrical service"
        canonical="https://bermanelectrical.com/contact"
      />
      <Navbar />
      <div className="pt-20">
        <div className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 z-0 opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Professional electrical service"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact Berman Electric
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Reliable Electrical Services – One Call Away
              </p>
              <p className="text-lg text-gray-300">
                Whether you need electrical repairs, installations, upgrades, or emergency services, 
                Berman Electric is here to help. Our licensed and experienced electricians serve 
                homes and businesses across Long Island, ensuring top-quality service and customer satisfaction.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container space-y-10">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900">AI triage + Smart booking</h2>
              <p className="mt-3 text-lg text-slate-600">
                Upload a photo, get an electrician-grade safety readout, then lock the earliest crew slot with buffers and calendar invites.
              </p>
            </div>
            <div className="grid gap-10 xl:grid-cols-2">
              <AiOnsiteTriage onRecommendation={(payload) => setTriageSummary(payload)} />
              <SmartBookingEstimator triageContext={triageSummary} />
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
