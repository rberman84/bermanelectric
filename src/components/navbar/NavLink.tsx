import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ to, children, onClick }: NavLinkProps) => {
  const isHashLink = to.startsWith('#');
  
  const className = "px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  
  if (isHashLink) {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;
