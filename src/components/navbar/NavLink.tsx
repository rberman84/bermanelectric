
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, children, isScrolled, onClick }: NavLinkProps) => {
  const isHashLink = to.startsWith('#');
  
  if (isHashLink) {
    return (
      <a
        href={to}
        className={cn(
          "nav-link",
          isScrolled
            ? "text-slate-50 hover:text-electric-200 focus-visible:ring-offset-slate-900"
            : "text-slate-800 hover:text-electric-700 focus-visible:ring-offset-white"
        )}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "nav-link",
        isScrolled
          ? "text-slate-50 hover:text-electric-200 focus-visible:ring-offset-slate-900"
          : "text-slate-800 hover:text-electric-700 focus-visible:ring-offset-white"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
