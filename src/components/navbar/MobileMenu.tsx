
import { Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAttribution } from "@/hooks/useAttribution";

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, isScrolled, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { trackingNumber } = useAttribution();
  
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

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleSignIn = () => {
    navigate('/auth');
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
        {user && (
          <NavLink to="/dashboard" isScrolled={isScrolled} onClick={onClose}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/about" isScrolled={isScrolled} onClick={onClose}>
          About
        </NavLink>
        <NavLink to="/projects" isScrolled={isScrolled} onClick={onClose}>
          Projects
        </NavLink>
        <NavLink to="/blog" isScrolled={isScrolled} onClick={onClose}>
          Blog
        </NavLink>
        <NavLink to="/testimonials" isScrolled={isScrolled} onClick={onClose}>
          Testimonials
        </NavLink>
        <NavLink to="/contact" isScrolled={isScrolled} onClick={onClose}>
          Contact
        </NavLink>
        <a
          href={`tel:${trackingNumber.value}`}
          className={cn(
            "inline-flex items-center text-sm font-medium transition-colors",
            isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
          )}
          onClick={onClose}
        >
          <Phone className="mr-2 h-4 w-4" />
          {trackingNumber.display}
        </a>
        {user ? (
          <button
            onClick={handleSignOut}
            className={cn(
              "inline-flex items-center text-sm font-medium transition-colors w-full",
              isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className={cn(
              "inline-flex items-center text-sm font-medium transition-colors w-full",
              isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </button>
        )}
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
