
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeContent from "@/components/home/HomeContent";
import GoogleReviews from "@/components/shared/GoogleReviews";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import { AiHelpChat } from "@/components/shared/AiHelpChat";
import { useEffect } from "react";

const Index = () => {
  // Safety unlock in case a component left the body locked
  useEffect(() => {
    const unlock = () => {
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflowY = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.classList.remove("overflow-hidden", "no-scroll", "fixed", "menu-open");
    };
    unlock();
    const t = setTimeout(unlock, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100svh] overflow-x-hidden flex flex-col">
      <SEO 
        title="Berman Electric - Licensed Electrician Long Island NY"
        description="Trusted licensed electrician serving Long Island, Suffolk County & Ronkonkoma NY. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, EV charger installation. Call (516) 361-4068"
        keywords="electrician Long Island, licensed electrician Suffolk County, electrical services Ronkonkoma NY, emergency electrician Nassau County, panel upgrades, lighting installation, EV charger installation, generator installation, electrical repairs"
        canonical="https://bermanelectrical.com/"
      />
      <Navbar />
      <main className="grow">
        <Hero />
        <HomeContent />
        <GoogleReviews />
        <CTASection
          variant="emergency"
          title="Need Emergency Electrical Service?"
          subtitle="Available 24/7 for electrical emergencies across Long Island"
          showUrgency={true}
        />
      </main>
      <Footer />
      <AiHelpChat />
    </div>
  );
};

export default Index;
