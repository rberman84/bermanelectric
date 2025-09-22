
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Testimonials from "./pages/Testimonials";  
import Contact from "./pages/Contact";
import Residential from "./pages/Residential";
import Commercial from "./pages/Commercial";
import Emergency from "./pages/Emergency";
import EVCharger from "./pages/EVCharger";
import ElectricianRonkonkoma from "./pages/ElectricianRonkonkoma";
import ElectricianSuffolkCounty from "./pages/ElectricianSuffolkCounty";
import ElectricianLongIsland from "./pages/ElectricianLongIsland";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/residential" element={<Residential />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/ev-charger" element={<EVCharger />} />
          <Route path="/electrician-ronkonkoma" element={<ElectricianRonkonkoma />} />
          <Route path="/electrician-suffolk-county" element={<ElectricianSuffolkCounty />} />
          <Route path="/electrician-long-island" element={<ElectricianLongIsland />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
