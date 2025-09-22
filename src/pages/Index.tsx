
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeContent from "@/components/home/HomeContent";
import ReviewsSection from "@/components/shared/ReviewsSection";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="relative">
      <SEO 
        title="Berman Electric - Licensed Electrician Long Island NY"
        description="Trusted licensed electrician serving Long Island, Suffolk County & Ronkonkoma NY. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, EV charger installation. Call (516) 361-4068"
        keywords="electrician Long Island, licensed electrician Suffolk County, electrical services Ronkonkoma NY, emergency electrician Nassau County, panel upgrades, lighting installation, EV charger installation, generator installation, electrical repairs"
        canonical="https://bermanelectrical.com/"
      />
      <Navbar />
      <Hero />
      <HomeContent />
      <ReviewsSection 
        title="Why Long Island Trusts Berman Electric"
        subtitle="Over 100 satisfied customers across Nassau & Suffolk Counties"
        showSchema={true}
      />
      <CTASection 
        variant="emergency"
        title="Need Emergency Electrical Service?"
        subtitle="Available 24/7 for electrical emergencies across Long Island"
        showUrgency={true}
      />
      <Footer />
    </div>
  );
};

export default Index;
