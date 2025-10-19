
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/shared/LoadingScreen";

// Keep Index eager loaded (it's the homepage)
import Index from "./pages/Index";

// Lazy load all other pages for code splitting
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const Residential = lazy(() => import("./pages/Residential"));
const Commercial = lazy(() => import("./pages/Commercial"));
const Emergency = lazy(() => import("./pages/Emergency"));
const EVCharger = lazy(() => import("./pages/EVCharger"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const Resources = lazy(() => import("./pages/Resources"));
const ElectricianRonkonkoma = lazy(() => import("./pages/ElectricianRonkonkoma"));
const ElectricianSuffolkCounty = lazy(() => import("./pages/ElectricianSuffolkCounty"));
const ElectricianLongIsland = lazy(() => import("./pages/ElectricianLongIsland"));
const RonkonkomaServiceUpgradeCaseStudy = lazy(() => import("./pages/RonkonkomaServiceUpgradeCaseStudy"));
const GoogleReviewsSetup = lazy(() => import("./pages/GoogleReviewsSetup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TownIndex = lazy(() => import("./pages/TownIndex"));
const TownPage = lazy(() => import("./pages/TownPage"));
const SuffolkCounty = lazy(() => import("./pages/SuffolkCounty"));
const NassauCounty = lazy(() => import("./pages/NassauCounty"));
const ServiceLocation = lazy(() => import("./pages/ServiceLocation"));

const queryClient = new QueryClient();

// Main App Component
const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/residential" element={<Residential />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/ev-charger" element={<EVCharger />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/category/:category" element={<BlogCategory />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/electrician-ronkonkoma" element={<ElectricianRonkonkoma />} />
          <Route path="/electrician-suffolk-county" element={<ElectricianSuffolkCounty />} />
          <Route path="/electrician-long-island" element={<ElectricianLongIsland />} />
          <Route path="/locations" element={<TownIndex />} />
          <Route path="/locations/suffolk-county" element={<SuffolkCounty />} />
          <Route path="/locations/nassau-county" element={<NassauCounty />} />
          <Route path="/locations/:townSlug" element={<TownPage />} />
          <Route path="/services/:serviceSlug/:townSlug" element={<ServiceLocation />} />
          <Route path="/case-study-ronkonkoma-200-amp-service-upgrade" element={<RonkonkomaServiceUpgradeCaseStudy />} />
          <Route path="/google-reviews-setup" element={<GoogleReviewsSetup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
