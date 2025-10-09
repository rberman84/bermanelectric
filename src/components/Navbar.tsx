import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NavLink from "./navbar/NavLink";
import ServicesDropdown from "./navbar/ServicesDropdown";
import MobileMenu from "./navbar/MobileMenu";
import { DynamicPhone } from "@/components/shared/DynamicPhone";

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
            className="flex items-center group"
          >
            <img 
              src="/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png" 
              alt="Berman Electric Logo"
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
            <NavLink to="/blog" isScrolled={isScrolled}>Blog</NavLink>
            <NavLink to="/testimonials" isScrolled={isScrolled}>Testimonials</NavLink>
            <NavLink to="/contact" isScrolled={isScrolled}>Contact</NavLink>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <DynamicPhone
                eventName="navbar_phone_click"
                className={cn(
                  "inline-flex items-center text-sm font-medium transition-colors",
                  isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
                )}
              >
                {({ displayNumber }) => (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="whitespace-nowrap">{displayNumber}</span>
                  </>
                )}
              </DynamicPhone>
              {user ? (
                <button
                  onClick={signOut}
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-md",
                    isScrolled ? "text-gray-200 hover:text-electric-400 hover:bg-white/10" : "text-gray-700 hover:text-electric-600 hover:bg-gray-100"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className={cn(
                    "inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-md",
                    isScrolled ? "text-gray-200 hover:text-electric-400 hover:bg-white/10" : "text-gray-700 hover:text-electric-600 hover:bg-gray-100"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
              <Link
                to="/contact"
                className="button-primary bg-green-600 hover:bg-green-700"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 transition-colors",
              isScrolled ? "text-white" : "text-gray-700"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <MobileMenu 
          isOpen={isOpen}
          isScrolled={isScrolled}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
