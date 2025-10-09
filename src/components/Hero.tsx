
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ServicesDropdown from "./navbar/ServicesDropdown";
import ResponsiveImage from "@/components/media/ResponsiveImage";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = ({ title, subtitle, description }: HeroProps = {}) => {
  const [isScrolled] = useState(false);

  // Use default content for home page, custom content for other pages
  const isHomePage = !title && !subtitle && !description;

  return (
    <div className="relative min-h-[100svh] md:min-h-[85svh] flex items-center">
      {/* Background with overlay */}
      <div className="pointer-events-none select-none absolute inset-0" aria-hidden="true">
        <ResponsiveImage
          src="/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
          alt="Professional electrician wearing safety gear inspecting electrical panel"
          wrapperClassName="absolute inset-0"
          className="w-full h-full object-cover"
          sizes="100vw"
      <div className="pointer-events-none select-none absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" aria-hidden="true">
        <img
          src="/lovable-uploads/hero-electrical-background.jpg"
          alt="Professional electrical services with dramatic lightning power effect"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="container relative pt-32">
        <div className="max-w-3xl fade-in">
          {isHomePage && (
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-electric-600 bg-white rounded-full">
              20+ Years of Excellence
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title || "Reliable Electrical Solutions in Ronkonkoma"}
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {subtitle || description || "Experience top-notch electrical services with Berman Electric, your local expert for over 20 years. We provide comprehensive solutions for both residential and commercial needs."}
          </p>
          {description && subtitle && (
            <p className="text-lg md:text-xl text-white mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {description}
            </p>
          )}
          {isHomePage && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="button-primary"
              >
                Get a Free Quote
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <div className="relative">
                <ServicesDropdown isScrolled={isScrolled} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {isHomePage && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in">
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Scroll to explore</span>
            <div className="w-0.5 h-8 bg-white/50 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
