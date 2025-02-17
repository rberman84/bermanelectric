
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
        <img
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80"
          alt="Professional electrician in hard hat"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="container relative pt-32">
        <div className="max-w-3xl fade-in">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-electric-600 bg-white rounded-full">
            20+ Years of Excellence
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Reliable Electrical Solutions in Ronkonkoma
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">
            Experience top-notch electrical services with Berman Electric, your
            local expert for over 20 years. We provide comprehensive solutions for
            both residential and commercial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="button-primary"
            >
              Get a Free Quote
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in">
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-white/50 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
