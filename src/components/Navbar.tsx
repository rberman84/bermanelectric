
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="text-2xl font-bold text-gray-900">
            Berman Electric
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#testimonials" className="nav-link">
              Testimonials
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
            <a href="#contact" className="button-primary">
              Get a Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "h-64" : "h-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col space-y-4 pb-6">
            <a
              href="#services"
              className="text-gray-700 hover:text-electric-600"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-electric-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-electric-600"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-electric-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <a
              href="#contact"
              className="button-primary w-full text-center"
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
