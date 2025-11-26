
import { Phone, User } from "lucide-react";
import NavLink from "./NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const servicesDropdown = [
    { name: "Residential", href: "/residential" },
    { name: "Commercial", href: "/commercial" },
    { name: "Emergency Services", href: "/emergency" },
    { name: "EV Charger Installation", href: "/ev-charger" },
  ];

  const aboutDropdown = [
    { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Testimonials", href: "/testimonials" },
  ];

  const handleGetQuote = () => {
    navigate('/contact');
    onClose();
  };

  const handleSubmitLead = () => {
    navigate('/lead-intake');
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="mobile-navigation"
      className="md:hidden transition-all duration-300 ease-in-out h-auto opacity-100 visible"
      role="menu"
      aria-label="Mobile navigation"
    >
      <div className="flex flex-col space-y-4 pb-6 bg-[hsl(0,0%,18%)] shadow-2xl rounded-lg px-4 py-6 mt-4 border border-white/10">
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Services</div>
        {servicesDropdown.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
          >
            {item.name}
          </NavLink>
        ))}
        
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mt-4 mb-2">About</div>
        {aboutDropdown.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
          >
            {item.name}
          </NavLink>
        ))}
        
        {user && (
          <NavLink to="/dashboard" onClick={onClose}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/locations" onClick={onClose}>
          Service Areas
        </NavLink>
        <NavLink to="/contact" onClick={onClose}>
          Contact
        </NavLink>
        <a
          href="tel:+15163614068"
          className="inline-flex items-center text-sm font-medium transition-colors text-white/90 hover:text-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]"
          onClick={onClose}
        >
          <Phone className="mr-2 h-4 w-4" />
          (516) 361-4068
        </a>
        {user ? (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center text-sm font-medium transition-colors w-full text-white/90 hover:text-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]"
          >
            <User className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="inline-flex items-center text-sm font-medium transition-colors w-full text-white/90 hover:text-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </button>
        )}
        <button
          onClick={handleSubmitLead}
          className="button-primary w-full text-center bg-electric-600 hover:bg-electric-700 text-white focus-visible:ring-offset-[hsl(0,0%,18%)] shadow-lg"
        >
          Submit Lead
        </button>
        <button
          onClick={handleGetQuote}
          className="button-primary w-full text-center bg-electric-600 hover:bg-electric-700 text-white focus-visible:ring-offset-[hsl(0,0%,18%)] shadow-lg"
        >
          Get a Quote
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
