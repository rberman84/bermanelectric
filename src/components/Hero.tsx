import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ServicesDropdown from "./navbar/ServicesDropdown";
const Hero = () => {
  const [isScrolled] = useState(false);
  return <div className="relative min-h-screen flex items-center">
      {/* Sky blue background with stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-600">
        {/* Star effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`
        }} />)}
        </div>
      </div>
      
      {/* Content */}
      <div className="container relative pt-32 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="max-w-xl fade-in z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-electric-600 bg-white rounded-full">
            20+ Years of Excellence
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Reliable 
Electrical 
Solutions in 
Ronkonkoma</h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">Experience top-notch electrical services 
with Berman Electric, your local expert for 
over 20 years. We provide comprehensive 
solutions for both residential and commercial 
needs.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact" className="button-primary">
              Get a Free Quote
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="relative">
              <ServicesDropdown isScrolled={isScrolled} />
            </div>
          </div>
        </div>
        
        {/* Electrician image */}
        <div className="flex items-center justify-center pointer-events-none">
          <img src="/lovable-uploads/hero-electrician-night.png" alt="Professional electrician working on electrical panel at night" className="w-full h-full object-contain max-w-2xl" loading="lazy" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in">
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-white/50 animate-pulse"></div>
        </div>
      </div>
    </div>;
};
export default Hero;