
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ServicesDropdownProps {
  isScrolled: boolean;
}

const ServicesDropdown = ({ isScrolled }: ServicesDropdownProps) => {
  const servicesDropdown = [
    { name: "Residential", href: "/residential" },
    { name: "Commercial", href: "/commercial" },
    { name: "Emergency Services", href: "/emergency" },
    { name: "EV Charger Installation", href: "/ev-charger" },
  ];

  return (
    <div className="relative group">
      <button 
        className="button-primary inline-flex items-center"
      >
        Services
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
        <div className="py-2 bg-white rounded-lg shadow-xl border border-gray-100">
          {servicesDropdown.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-electric-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;
