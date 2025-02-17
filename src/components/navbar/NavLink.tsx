
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, children, isScrolled, onClick }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "nav-link",
        isScrolled ? "text-gray-200 hover:text-electric-400" : "text-gray-700 hover:text-electric-600"
      )}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default NavLink;
