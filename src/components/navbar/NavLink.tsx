
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
            ? "text-white hover:text-electric-400 focus-visible:ring-offset-foreground"
            : "text-muted-foreground hover:text-electric-600 focus-visible:ring-offset-cream-50"
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
          ? "text-white hover:text-electric-400 focus-visible:ring-offset-foreground"
          : "text-muted-foreground hover:text-electric-600 focus-visible:ring-offset-cream-50"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
