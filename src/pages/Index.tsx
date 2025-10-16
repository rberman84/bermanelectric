
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeContent from "@/components/home/HomeContent";

import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import WebsiteSchema from "@/components/schema/WebsiteSchema";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import HomeFAQSchema from "@/components/schema/HomeFAQSchema";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import StructuredData from "@/components/town/StructuredData";

const GoogleReviews = lazy(() => import("@/components/shared/GoogleReviews"));
const AiHelpChat = lazy(() => import("@/components/shared/AiHelpChat").then(m => ({ default: m.AiHelpChat })));


const Index = () => {
  // Fetch Google reviews for aggregate rating
  const { data: reviews } = useGoogleReviews();
  
  // Calculate aggregate rating
  const aggregateRating = reviews && reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric"
    },
    "ratingValue": (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    "reviewCount": reviews.length,
    "bestRating": "5",
    "worstRating": "1"
  } : null;

  // Safety unlock in case a component left the body locked
  useEffect(() => {
    const unlock = () => {
      const html = document.documentElement;
      const body = document.body;

      // clear inline styles
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.overflowY = "";
      body.style.overflowY = "";
      body.style.position = "";
      body.style.width = "";

      // remove common lock classes
      html.classList.remove("overflow-hidden", "no-scroll", "fixed", "menu-open");
      body.classList.remove("overflow-hidden", "no-scroll", "fixed", "menu-open");
    };

    unlock();                   // on mount
    const t1 = setTimeout(unlock, 100);   // after first paint
    const t2 = setTimeout(unlock, 800);   // after lazy mounts

    // safety on visibility + hash/nav changes
    const onVis = () => { if (!document.hidden) unlock(); };
    window.addEventListener("hashchange", unlock);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("hashchange", unlock);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const [showReviews, setShowReviews] = useState(false);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = reviewsRef.current;
    if (!el || showReviews) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShowReviews(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [showReviews]);
  const [showChat, setShowChat] = useState(false);
  useEffect(() => {
    const run = () => setShowChat(true);
    // Load after idle or a short delay to keep it off the critical path
    // @ts-ignore
    if (window.requestIdleCallback) {
      // @ts-ignore
      window.requestIdleCallback(run, { timeout: 3000 });
    } else {
      setTimeout(run, 3000);
    }
  }, []);

  return (
    <div className="min-h-[100svh] overflow-x-hidden flex flex-col">
      <SEO 
        title="Berman Electric - Licensed Electrician Long Island NY"
        description="Trusted licensed electrician serving Long Island, Suffolk County & Ronkonkoma NY. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, EV charger installation. Call (516) 361-4068"
        keywords="electrician Long Island, licensed electrician Suffolk County, electrical services Ronkonkoma NY, emergency electrician Nassau County, panel upgrades, lighting installation, EV charger installation, generator installation, electrical repairs"
        canonical="https://bermanelectrical.com/"
      />
      <WebsiteSchema />
      <OrganizationSchema />
      <HomeFAQSchema />
      {aggregateRating && <StructuredData data={aggregateRating} id="aggregate-rating-schema" />}
      <Navbar />
      {/* <ScrollDoctor /> */}
      <main className="grow">
        <Hero />
        <section className="cv-auto"><HomeContent /></section>
        <div ref={reviewsRef} />
        {showReviews ? (
          <Suspense fallback={<div className="py-16 text-center"><div className="animate-pulse">Loading...</div></div>}>
            <GoogleReviews />
          </Suspense>
        ) : null}
        <section className="cv-auto">
          <CTASection
            variant="emergency"
            title="Need Emergency Electrical Service?"
            subtitle="Available 24/7 for electrical emergencies across Long Island"
            showUrgency={true}
          />
        </section>
      </main>
      <Footer />
      {showChat ? (
        <Suspense fallback={null}>
          <AiHelpChat />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Index;
