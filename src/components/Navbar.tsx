import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NavLink from "./navbar/NavLink";
import ServicesDropdown from "./navbar/ServicesDropdown";
import AboutDropdown from "./navbar/AboutDropdown";
import MobileMenu from "./navbar/MobileMenu";
import bermanLogo from "@/assets/berman-logo-graffiti.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50"
          : "bg-white/80 backdrop-blur-md"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-28 md:h-32">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img
              src={bermanLogo}
              alt="Berman Electrical Services"
              width="280"
              height="100"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="h-20 w-auto md:h-24 lg:h-28 transition-transform duration-300 group-hover:scale-105 object-contain drop-shadow-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
            <ServicesDropdown />
            <AboutDropdown />
            <NavLink to="/locations">Service Areas</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+15163614068"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">(516) 361-4068</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-foreground rounded-full hover:bg-foreground/90 transition-all hover:scale-105 shadow-lg shadow-foreground/20"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="tel:+15163614068"
              className="inline-flex items-center justify-center w-10 h-10 text-foreground"
              aria-label="Call us"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              className="inline-flex items-center justify-center w-10 h-10 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              type="button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </nav>
  );
};

export default Navbar;
