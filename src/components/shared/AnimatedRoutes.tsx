import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy } from "react";
import PageTransition from "./PageTransition";

// Keep Index eager loaded (it's the homepage)
import Index from "@/pages/Index";

// Lazy load all other pages for code splitting
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const About = lazy(() => import("@/pages/About"));
const Projects = lazy(() => import("@/pages/Projects"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Contact = lazy(() => import("@/pages/Contact"));
const Residential = lazy(() => import("@/pages/Residential"));
const Commercial = lazy(() => import("@/pages/Commercial"));
const Emergency = lazy(() => import("@/pages/Emergency"));
const EVCharger = lazy(() => import("@/pages/EVCharger"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const BlogCategory = lazy(() => import("@/pages/BlogCategory"));
const Resources = lazy(() => import("@/pages/Resources"));
const ElectricianRonkonkoma = lazy(() => import("@/pages/ElectricianRonkonkoma"));
const ElectricianSuffolkCounty = lazy(() => import("@/pages/ElectricianSuffolkCounty"));
const ElectricianLongIsland = lazy(() => import("@/pages/ElectricianLongIsland"));
const RonkonkomaServiceUpgradeCaseStudy = lazy(() => import("@/pages/RonkonkomaServiceUpgradeCaseStudy"));
const GoogleReviewsSetup = lazy(() => import("@/pages/GoogleReviewsSetup"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const TownIndex = lazy(() => import("@/pages/TownIndex"));
const TownPage = lazy(() => import("@/pages/TownPage"));
const SuffolkCounty = lazy(() => import("@/pages/SuffolkCounty"));
const NassauCounty = lazy(() => import("@/pages/NassauCounty"));
const ServiceLocation = lazy(() => import("@/pages/ServiceLocation"));
const ServiceLocationProblem = lazy(() => import("@/pages/ServiceLocationProblem"));
const SubmitReview = lazy(() => import("@/pages/SubmitReview"));
const LeadIntake = lazy(() => import("@/pages/LeadIntake"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const FirecrawlTools = lazy(() => import("@/pages/FirecrawlTools"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/residential" element={<PageTransition><Residential /></PageTransition>} />
        <Route path="/commercial" element={<PageTransition><Commercial /></PageTransition>} />
        <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />
        <Route path="/ev-charger" element={<PageTransition><EVCharger /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/category/:category" element={<PageTransition><BlogCategory /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/electrician-ronkonkoma" element={<PageTransition><ElectricianRonkonkoma /></PageTransition>} />
        <Route path="/electrician-suffolk-county" element={<PageTransition><ElectricianSuffolkCounty /></PageTransition>} />
        <Route path="/electrician-long-island" element={<PageTransition><ElectricianLongIsland /></PageTransition>} />
        <Route path="/locations" element={<PageTransition><TownIndex /></PageTransition>} />
        <Route path="/locations/suffolk-county" element={<PageTransition><SuffolkCounty /></PageTransition>} />
        <Route path="/locations/nassau-county" element={<PageTransition><NassauCounty /></PageTransition>} />
        <Route path="/locations/:townSlug" element={<PageTransition><TownPage /></PageTransition>} />
        <Route path="/services/:serviceSlug/:townSlug/:problemSlug" element={<PageTransition><ServiceLocationProblem /></PageTransition>} />
        <Route path="/services/:serviceSlug/:townSlug" element={<PageTransition><ServiceLocation /></PageTransition>} />
        <Route path="/review/:serviceRequestId" element={<PageTransition><SubmitReview /></PageTransition>} />
        <Route path="/lead-intake" element={<PageTransition><LeadIntake /></PageTransition>} />
        <Route path="/case-study-ronkonkoma-200-amp-service-upgrade" element={<PageTransition><RonkonkomaServiceUpgradeCaseStudy /></PageTransition>} />
        <Route path="/google-reviews-setup" element={<PageTransition><GoogleReviewsSetup /></PageTransition>} />
        <Route path="/admin/firecrawl" element={<PageTransition><FirecrawlTools /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
