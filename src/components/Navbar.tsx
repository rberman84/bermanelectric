import { useState, useEffect } from "react";
import { Menu, X, Phone, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
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
          ? "bg-foreground/95 backdrop-blur-md shadow-lg"
          : "bg-cream-50/90 backdrop-blur-sm border-b border-border"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isScrolled ? "bg-electric-600" : "bg-electric-600"
            )}>
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className={cn(
              "text-lg font-semibold tracking-tight transition-colors",
              isScrolled ? "text-white" : "text-foreground"
            )}>
              Berman<span className={cn(isScrolled ? "text-electric-400" : "text-electric-600")}>Electric</span>
            </span>
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
                    ? "text-white hover:text-electric-400 focus-visible:ring-offset-foreground"
                    : "text-muted-foreground hover:text-electric-600 focus-visible:ring-offset-cream-50"
                )}
              >
                <Phone className="mr-2 h-4 w-4" />
                (516) 361-4068
              </a>
              {user ? (
                <button
                  onClick={signOut}
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
                    isScrolled
                      ? "text-white hover:text-electric-400 hover:bg-white/10 focus-visible:ring-offset-foreground"
                      : "text-muted-foreground hover:text-electric-600 hover:bg-cream-200 focus-visible:ring-offset-cream-50"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2",
                    isScrolled
                      ? "text-white hover:text-electric-400 hover:bg-white/10 focus-visible:ring-offset-foreground"
                      : "text-muted-foreground hover:text-electric-600 hover:bg-cream-200 focus-visible:ring-offset-cream-50"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
              <Link
                to="/contact"
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105",
                  isScrolled ? "focus-visible:ring-offset-foreground" : "focus-visible:ring-offset-cream-50"
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
                ? "text-white focus-visible:ring-offset-foreground"
                : "text-foreground focus-visible:ring-offset-cream-50"
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
