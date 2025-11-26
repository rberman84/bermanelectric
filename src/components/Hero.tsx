import { Link } from "react-router-dom";
import { useState } from "react";
import SocialProofInline from "./shared/SocialProofInline";
import RiskReversalBadges from "./shared/RiskReversalBadges";
import BitcoinPayment from "./shared/BitcoinPayment";
import { Phone } from "lucide-react";
import heroHeader from "@/assets/hero-header.png";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = ({ title, subtitle, description }: HeroProps = {}) => {
  const [showBitcoinModal, setShowBitcoinModal] = useState(false);
  // Use default content for home page, custom content for other pages
  const isHomePage = !title && !subtitle && !description;

  return (
    <div className="relative min-h-[70svh] md:min-h-[85svh] flex items-center overflow-hidden">
      {/* Hero Header Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={heroHeader} 
          alt="Berman Electric - We Keep The Lights On"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="container relative py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal text-foreground mb-6 leading-[1] tracking-tight">
            {title || "Professional Electrical Services in Suffolk County, NY"}
          </h1>
          
          {/* Social Proof - Moved Up */}
          {isHomePage && (
            <div className="flex justify-center mb-6">
              <SocialProofInline />
            </div>
          )}
          
          {isHomePage && (
            <>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed font-normal max-w-4xl mx-auto">
                Licensed electrician providing{" "}
                <span className="inline-block px-3 py-1 rounded-full bg-[hsl(15,100%,95%)] text-[hsl(15,80%,40%)] font-medium text-sm sm:text-base">
                  panel upgrades
                </span>{" "}
                <span className="inline-block px-3 py-1 rounded-full bg-[hsl(25,100%,95%)] text-[hsl(25,80%,40%)] font-medium text-sm sm:text-base">
                  EV charger installation
                </span>{" "}
                <span className="inline-block px-3 py-1 rounded-full bg-[hsl(200,100%,95%)] text-[hsl(200,80%,40%)] font-medium text-sm sm:text-base">
                  emergency repairs
                </span>{" "}
                and complete{" "}
                <span className="inline-block px-3 py-1 rounded-full bg-[hsl(280,100%,95%)] text-[hsl(280,60%,50%)] font-medium text-sm sm:text-base">
                  electrical solutions
                </span>{" "}
                across Long Island.
              </p>

              {/* Split CTAs - Emergency vs Scheduled */}
              <div className="space-y-4 mb-10">
                {/* Primary CTA - Emergency */}
                <div className="bg-red-600 text-white rounded-2xl p-6 max-w-2xl mx-auto">
                  <p className="text-sm font-semibold mb-2 uppercase tracking-wide">⚡ EMERGENCY SERVICE</p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Power Out? Electrical Fire? Call NOW</h3>
                  <a
                    href="tel:+15163614068"
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 text-xl font-bold bg-white text-red-600 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
                  >
                    <Phone className="w-6 h-6" />
                    (516) 361-4068
                  </a>
                  <p className="text-sm mt-3 opacity-90">60-minute response time guarantee</p>
                </div>

                {/* Secondary CTA - Scheduled */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105 shadow-lg"
                  >
                    Get Free Quote
                  </Link>
                  <button
                    onClick={() => setShowBitcoinModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-full hover:bg-gray-100 transition-all border-2 border-gray-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
                    </svg>
                    Bitcoin Accepted
                  </button>
                </div>
              </div>

              {/* Risk Reversal Badges */}
              <div className="mb-10">
                <RiskReversalBadges />
              </div>

              <BitcoinPayment open={showBitcoinModal} onOpenChange={setShowBitcoinModal} />

              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center text-sm md:text-base text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(15,100%,60%)]" />
                  24/7 Emergency Service
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(45,100%,60%)]" />
                  Licensed & Insured
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(200,100%,60%)]" />
                  Serving Long Island
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
