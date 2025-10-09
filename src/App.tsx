import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { initializeAnalytics } from "@/lib/analytics";
import { RouteAnalytics } from "@/components/analytics/RouteAnalytics";
// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Testimonials from "./pages/Testimonials";  
import Contact from "./pages/Contact";
import Residential from "./pages/Residential";
import Commercial from "./pages/Commercial";
import Emergency from "./pages/Emergency";
import EVCharger from "./pages/EVCharger";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import Resources from "./pages/Resources";
import ElectricianRonkonkoma from "./pages/ElectricianRonkonkoma";
import ElectricianSuffolkCounty from "./pages/ElectricianSuffolkCounty";
import ElectricianLongIsland from "./pages/ElectricianLongIsland";
import RonkonkomaServiceUpgradeCaseStudy from "./pages/RonkonkomaServiceUpgradeCaseStudy";
import GoogleReviewsSetup from "./pages/GoogleReviewsSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main App Component
const App = () => {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteAnalytics />
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
              <Route path="/case-study-ronkonkoma-200-amp-service-upgrade" element={<RonkonkomaServiceUpgradeCaseStudy />} />
              <Route path="/google-reviews-setup" element={<GoogleReviewsSetup />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
