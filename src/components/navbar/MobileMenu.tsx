
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, isScrolled, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  
  const servicesDropdown = [
    { name: "Residential", href: "/residential" },
    { name: "Commercial", href: "/commercial" },
    { name: "Emergency Services", href: "/emergency" },
    { name: "EV Charger Installation", href: "/ev-charger" },
  ];

  const handleGetQuote = () => {
    navigate('/contact');
    onClose();
  };

  return (
    <div
      className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "h-auto opacity-100 visible" : "h-0 opacity-0 invisible"
      )}
    >
      <div className="flex flex-col space-y-4 pb-6">
        {servicesDropdown.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            isScrolled={isScrolled}
            onClick={onClose}
          >
            {item.name}
          </NavLink>
        ))}
        <NavLink to="/about" isScrolled={isScrolled} onClick={onClose}>
          About
        </NavLink>
        <NavLink to="/projects" isScrolled={isScrolled} onClick={onClose}>
          Projects
        </NavLink>
        <NavLink to="/testimonials" isScrolled={isScrolled} onClick={onClose}>
          Testimonials
        </NavLink>
        <NavLink to="/contact" isScrolled={isScrolled} onClick={onClose}>
          Contact
        </NavLink>
        <a
          href="tel:+15163614068"
          className={cn(
            "inline-flex items-center text-sm font-medium transition-colors",
            isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
          )}
          onClick={onClose}
        >
          <Phone className="mr-2 h-4 w-4" />
          (516) 361-4068
        </a>
        <button
          onClick={handleGetQuote}
          className="button-primary w-full text-center bg-green-600 hover:bg-green-700"
        >
          Get a Quote
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
