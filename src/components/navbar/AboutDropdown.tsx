
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

interface AboutDropdownProps {}

const AboutDropdown = ({}: AboutDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openedViaKeyboard = useRef(false);

  const aboutDropdown = [
    { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Testimonials", href: "/testimonials" },
  ];

  useEffect(() => {
    if (!isOpen || !openedViaKeyboard.current) {
      return;
    }

    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();
    openedViaKeyboard.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: Event) => {
      const keyEvent = event as globalThis.KeyboardEvent;
      if (keyEvent.key === "Escape") {
        setIsOpen(false);
        (containerRef.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => {
    openedViaKeyboard.current = false;
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    openedViaKeyboard.current = false;
    setIsOpen(true);
  };
  const handleMouseLeave = () => setIsOpen(false);

  const handleFocus = () => setIsOpen(true);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      openedViaKeyboard.current = true;
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <button
        className="nav-link inline-flex items-center gap-1 text-white/90 hover:text-electric-400 focus-visible:ring-offset-[hsl(0,0%,20%)]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggleMenu}
        onKeyDown={handleButtonKeyDown}
        type="button"
      >
        About
        <ChevronDown className="h-4 w-4" />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-0 mt-2 w-56 transition-all duration-200 transform",
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
        )}
      >
        <div className="py-2 bg-[hsl(0,0%,18%)] rounded-2xl shadow-2xl border border-white/10 backdrop-blur-lg">
          {aboutDropdown.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)] transition-colors border-l-4 border-transparent hover:border-electric-400"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutDropdown;
