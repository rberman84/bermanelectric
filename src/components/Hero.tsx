import { ChevronRight } from "lucide-react";
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
    <div className="relative min-h-[90svh] flex items-center bg-cream-100">
      {/* Content */}
      <div className="container relative py-32">
        <div className="max-w-5xl mx-auto text-center fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1]">
            {title || (
              <>
                Reliable <span className="text-electric-600">Electrical</span><br />Solutions in Ronkonkoma
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            {subtitle || description || "Experience top-notch electrical services with Berman Electric, your local expert for over 20 years."}
          </p>
          {isHomePage && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:+15163614068"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground bg-white rounded-full hover:bg-cream-200 transition-all border border-border"
              >
                Call (516) 361-4068
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
