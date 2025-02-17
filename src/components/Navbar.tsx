
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const servicesDropdown = [
    { name: "Residential", href: "#residential" },
    { name: "Commercial", href: "#commercial" },
    { name: "Emergency Services", href: "#emergency" },
    { name: "EV Charger Installation", href: "#ev-charger" },
  ];

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
          <a 
            href="/" 
            className={cn(
              "text-2xl font-bold transition-colors duration-300",
              isScrolled ? "text-white" : "text-gray-900"
            )}
          >
            Berman Electric
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Services Dropdown */}
            <div className="relative group">
              <button 
                className={cn(
                  "nav-link inline-flex items-center",
                  isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
                )}
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2 bg-white rounded-lg shadow-xl border border-gray-100">
                  {servicesDropdown.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-electric-600"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a 
              href="#about" 
              className={cn(
                "nav-link",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
            >
              About
            </a>
            <a 
              href="#projects" 
              className={cn(
                "nav-link",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
            >
              Projects
            </a>
            <a 
              href="#testimonials" 
              className={cn(
                "nav-link",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
            >
              Testimonials
            </a>
            <a 
              href="#contact" 
              className={cn(
                "nav-link",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
            >
              Contact
            </a>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <a
                href="tel:+15163614068"
                className={cn(
                  "inline-flex items-center text-sm font-medium transition-colors",
                  isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
                )}
              >
                <Phone className="mr-2 h-4 w-4" />
                (516) 361-4068
              </a>
              <a
                href="#contact"
                className="button-primary bg-green-600 hover:bg-green-700"
              >
                Get a Quote
              </a>
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

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out",
            isOpen ? "h-auto opacity-100 visible" : "h-0 opacity-0 invisible"
          )}
        >
          <div className="flex flex-col space-y-4 pb-6">
            {servicesDropdown.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#about"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#projects"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
              onClick={() => setIsOpen(false)}
            >
              Projects
            </a>
            <a
              href="#testimonials"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <a
              href="tel:+15163614068"
              className={cn(
                "inline-flex items-center text-sm font-medium transition-colors",
                isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
              )}
              onClick={() => setIsOpen(false)}
            >
              <Phone className="mr-2 h-4 w-4" />
              (516) 361-4068
            </a>
            <a
              href="#contact"
              className="button-primary w-full text-center bg-green-600 hover:bg-green-700"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
