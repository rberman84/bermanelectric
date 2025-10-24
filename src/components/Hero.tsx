import { Link } from "react-router-dom";
import ReviewBadge from "./shared/ReviewBadge";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = ({ title, subtitle, description }: HeroProps = {}) => {
  // Use default content for home page, custom content for other pages
  const isHomePage = !title && !subtitle && !description;

  return (
    <div className="relative min-h-[90svh] flex items-center overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left coral blob */}
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
        
        {/* Top right coral blob */}
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
        
        {/* Center white spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="container relative py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center fade-in">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-normal text-foreground mb-6 md:mb-8 leading-[0.95] tracking-tight">
            {title || "Professional Electrical Services in Suffolk County, NY"}
          </h1>
          
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold text-white bg-foreground rounded-full hover:bg-foreground/90 transition-all hover:scale-105 shadow-lg"
                >
                  Get Free Quote
                </Link>
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold text-foreground bg-transparent rounded-full hover:bg-foreground/5 transition-all border-2 border-foreground"
                >
                  Call (516) 361-4068
                </a>
              </div>

              {/* Social Proof Badge */}
              <div className="flex justify-center mb-8">
                <ReviewBadge />
              </div>

              {/* Bitcoin Acceptance Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(30,100%,50%)] to-[hsl(45,100%,50%)] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform animate-pulse">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
                  </svg>
                  <span>Bitcoin Accepted Here</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>

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
