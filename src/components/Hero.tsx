import { Link } from "react-router-dom";

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
