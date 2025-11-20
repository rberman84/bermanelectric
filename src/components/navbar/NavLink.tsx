
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ to, children, onClick }: NavLinkProps) => {
  const isHashLink = to.startsWith('#');
  
  if (isHashLink) {
    return (
      <a
        href={to}
        className="nav-link text-white/90 hover:text-electric-400 focus-visible:ring-offset-[hsl(0,0%,20%)]"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className="nav-link text-white/90 hover:text-electric-400 focus-visible:ring-offset-[hsl(0,0%,20%)]"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
