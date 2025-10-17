import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ServicesDropdown from "./navbar/ServicesDropdown";
import { ConversionForm } from "./home/ConversionForm";
import { SocialProofRail } from "./home/SocialProofRail";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = ({ title, subtitle, description }: HeroProps = {}) => {
  const [isScrolled] = useState(false);

  const location = useLocation();
  const isHomePage = !title && !subtitle && !description;
  const isVariantB = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("variant")?.toUpperCase() === "B";
  }, [location.search]);
  const useExperiment = isHomePage && isVariantB;

  if (useExperiment) {
    return (
      <div className="relative min-h-[100svh] md:min-h-[85svh] flex items-center">
        <div className="pointer-events-none select-none absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" aria-hidden="true">
          <img
            src="/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
            alt="Professional electrician wearing safety gear inspecting electrical panel"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="container relative pt-32 pb-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] items-start">
            <div className="max-w-2xl text-white">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide backdrop-blur">
                Priority electricians on-call tonight
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Book a licensed Long Island electrician in under 60 seconds
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80">
                Share the issue, see your pre-quote instantly, and we’ll reserve the next available slot. Real humans confirm every appointment.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                <div className="rounded-xl bg-black/20 p-4 backdrop-blur">
                  <p className="font-semibold text-white">24/7 emergency response</p>
                  <p>Licensed & insured master electricians</p>
                </div>
                <div className="rounded-xl bg-black/20 p-4 backdrop-blur">
                  <p className="font-semibold text-white">Transparent pricing</p>
                  <p>Pre-quote shared before we dispatch</p>
                </div>
              </div>
            </div>
            <ConversionForm />
          </div>
        </div>

        <SocialProofRail />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] md:min-h-[85svh] flex items-center">
      {/* Background with overlay */}
      <div className="pointer-events-none select-none absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" aria-hidden="true">
        <img
          src="/hero-mobile-optimized.webp"
          srcSet="/hero-mobile-optimized.webp 600w, /hero-optimized-compressed.webp 1200w, /hero-electrical-optimized.webp 2000w"
          sizes="100vw"
          alt="Licensed Long Island electrician Berman Electric providing residential and commercial electrical services with lightning electrical power background"
          width="1920"
          height="1080"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
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
