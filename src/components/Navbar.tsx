import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { cn, generateAltText } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NavLink from "./navbar/NavLink";
import ServicesDropdown from "./navbar/ServicesDropdown";
import MobileMenu from "./navbar/MobileMenu";

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
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-white/90 backdrop-blur-sm shadow-sm"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <img
              src="/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png"
              alt={generateAltText(
                "/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png",
                "Berman Electric company logo"
              )}
              width="500"
              height="500"
              className={cn(
                "h-32 w-auto transition-all duration-300",
                isScrolled ? "brightness-0 invert" : "brightness-100",
                "animate-[wiggle_3s_ease-in-out_infinite]"
              )}
              style={{
                animation: `
                  scale 4s ease-in-out infinite,
                  colorize 4s ease-in-out infinite
              `
            }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <ServicesDropdown isScrolled={isScrolled} />
            {user && <NavLink to="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>}
            <NavLink to="/about" isScrolled={isScrolled}>About</NavLink>
            <NavLink to="/projects" isScrolled={isScrolled}>Projects</NavLink>
            <NavLink to="/locations" isScrolled={isScrolled}>Service Areas</NavLink>
            <NavLink to="/blog" isScrolled={isScrolled}>Blog</NavLink>
            <NavLink to="/testimonials" isScrolled={isScrolled}>Testimonials</NavLink>
            <NavLink to="/contact" isScrolled={isScrolled}>Contact</NavLink>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <a
                href="tel:+15163614068"
                className={cn(
                  "inline-flex items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
                  isScrolled
                    ? "text-slate-50 hover:text-electric-200 focus-visible:ring-offset-slate-900"
                    : "text-slate-800 hover:text-electric-700 focus-visible:ring-offset-white"
                )}
              >
                <Phone className="mr-2 h-4 w-4" />
                (516) 361-4068
              </a>
              {user ? (
                <button
                  onClick={signOut}
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
                    isScrolled
                      ? "text-slate-50 hover:text-electric-200 hover:bg-white/10 focus-visible:ring-offset-slate-900"
                      : "text-slate-800 hover:text-electric-700 hover:bg-gray-100 focus-visible:ring-offset-white"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
                    isScrolled
                      ? "text-slate-50 hover:text-electric-200 hover:bg-white/10 focus-visible:ring-offset-slate-900"
                      : "text-slate-800 hover:text-electric-700 hover:bg-gray-100 focus-visible:ring-offset-white"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
              <Link
                to="/contact"
                className={cn(
                  "button-primary bg-green-600 hover:bg-green-700",
                  isScrolled ? "focus-visible:ring-offset-slate-900" : "focus-visible:ring-offset-white"
                )}
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
              isScrolled
                ? "text-slate-50 focus-visible:ring-offset-slate-900"
                : "text-slate-800 focus-visible:ring-offset-white"
            )}
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
