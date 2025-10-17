import { Smartphone, Zap, Star } from "lucide-react";
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
    <div className="relative min-h-[90svh] flex items-center">
      {/* Content */}
      <div className="container relative py-32">
        <div className="max-w-5xl mx-auto text-center fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {title || (
              <>
                Power your home.<br />Light your life.
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {subtitle || description || (
              <>
                All your{" "}
                <span className="text-primary font-medium">electrical needs</span>{" "}
                <span className="text-accent font-medium">installations</span>{" "}
                <span className="text-accent font-medium">repairs</span>{" "}
                and{" "}
                <span className="text-accent font-medium">upgrades</span>{" "}
                in one place.
              </>
            )}
          </p>
          {isHomePage && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-foreground rounded-full hover:bg-foreground/90 transition-all"
                >
                  Get Free Quote
                </Link>
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-transparent rounded-full hover:bg-muted transition-all border-2 border-foreground"
                >
                  Call (516) 361-4068
                </a>
              </div>
              
              {/* Service Highlights */}
              <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <span className="text-sm md:text-base">24/7 Emergency Service</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm md:text-base">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="text-sm md:text-base">Serving Long Island</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
