import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NavLink from "./navbar/NavLink";
import ServicesDropdown from "./navbar/ServicesDropdown";
import AboutDropdown from "./navbar/AboutDropdown";
import MobileMenu from "./navbar/MobileMenu";
import bermanLogo from "@/assets/berman-logo.png";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 0);
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[hsl(0,0%,20%)] backdrop-blur-md shadow-2xl border-b border-white/5"
          : "bg-[hsl(0,0%,25%)] backdrop-blur-sm border-b border-white/10"
      )}
      style={{
        backgroundImage: isScrolled 
          ? `
            linear-gradient(180deg, hsl(0,0%,20%) 0%, hsl(0,0%,18%) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)
          `
          : `
            linear-gradient(180deg, hsl(0,0%,25%) 0%, hsl(0,0%,22%) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)
          `,
        backgroundBlendMode: 'normal, overlay, overlay',
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)'
          : '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-24 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent mr-16 relative"
          >
            <div
              className="h-14 w-44 rounded-sm transition-transform duration-300 group-hover:scale-105 bg-center bg-cover relative overflow-hidden"
              style={{
                backgroundImage: `url(${bermanLogo})`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3)'
              }}
              aria-label="Berman Electric"
              role="img"
            >
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px),
                    repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)
                  `
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8 md:ml-auto">
            <ServicesDropdown />
            <AboutDropdown />
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            <NavLink to="/locations">Service Areas</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <a
                href="tel:+15163614068"
                className="inline-flex items-center text-sm font-medium transition-colors text-white/90 hover:text-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,20%)]"
              >
                <Phone className="mr-2 h-4 w-4" />
                (516) 361-4068
              </a>
              {user ? (
                <button
                  onClick={signOut}
                  className="inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-full text-white/90 hover:text-electric-400 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,20%)]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-full text-white/90 hover:text-electric-400 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,20%)]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
              <Link
                to="/lead-intake"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 text-white bg-electric-600 hover:bg-electric-700 focus-visible:ring-offset-[hsl(0,0%,20%)] shadow-lg"
              >
                Submit Lead
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105 focus-visible:ring-offset-[hsl(0,0%,20%)] shadow-lg"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,20%)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
