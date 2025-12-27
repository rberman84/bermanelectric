import { 
  Phone, 
  User, 
  Home, 
  Building2, 
  Zap, 
  Car, 
  Users, 
  FolderOpen, 
  BookOpen, 
  Star, 
  MapPin, 
  Mail, 
  LayoutDashboard,
  ChevronRight,
  Send,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const servicesDropdown = [
    { name: "Residential", href: "/residential", icon: Home },
    { name: "Commercial", href: "/commercial", icon: Building2 },
    { name: "Emergency Services", href: "/emergency", icon: Zap },
    { name: "EV Charger Installation", href: "/ev-charger", icon: Car },
  ];

  const aboutDropdown = [
    { name: "About Us", href: "/about", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Testimonials", href: "/testimonials", icon: Star },
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

  return (
    <div
      id="mobile-navigation"
      className={cn(
        "md:hidden overflow-hidden transition-all duration-300 ease-out",
        isOpen 
          ? "max-h-[80vh] opacity-100 visible" 
          : "max-h-0 opacity-0 invisible"
      )}
      role="menu"
      aria-label="Mobile navigation"
    >
      <div className="flex flex-col space-y-1 pb-6 bg-[hsl(0,0%,16%)] shadow-2xl rounded-lg px-3 py-4 mt-3 border border-white/10 overflow-y-auto max-h-[70vh]">
        {/* Services Section */}
        <div className="text-xs font-semibold text-electric-400 uppercase tracking-wider px-3 py-2">
          Services
        </div>
        {servicesDropdown.map((item, index) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
        
        {/* Divider */}
        <div className="h-px bg-white/10 my-2" />
        
        {/* About Section */}
        <div className="text-xs font-semibold text-electric-400 uppercase tracking-wider px-3 py-2">
          About
        </div>
        {aboutDropdown.map((item, index) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${(index + 4) * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
        
        {/* Divider */}
        <div className="h-px bg-white/10 my-2" />
        
        {/* Other Links */}
        {user && (
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </Link>
        )}
        
        <Link
          to="/locations"
          onClick={onClose}
          className="flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group animate-fade-in"
          style={{ animationDelay: '450ms' }}
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Service Areas</span>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link
          to="/contact"
          onClick={onClose}
          className="flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Contact</span>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
        </Link>
        
        {/* Divider */}
        <div className="h-px bg-white/10 my-2" />
        
        {/* Quick Actions */}
        <a
          href="tel:+15163614068"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-electric-600/20 transition-all duration-200 group animate-fade-in"
          style={{ animationDelay: '550ms' }}
          onClick={onClose}
        >
          <Phone className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">(516) 361-4068</span>
        </a>
        
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group w-full text-left animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
            <User className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group w-full text-left animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
            <User className="h-5 w-5 text-electric-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col gap-2 pt-3 animate-fade-in" style={{ animationDelay: '650ms' }}>
          <button
            onClick={handleSubmitLead}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <Send className="h-4 w-4" />
            Submit Lead
          </button>
          <button
            onClick={handleGetQuote}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4" />
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
