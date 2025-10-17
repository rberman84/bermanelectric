
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

interface ServicesDropdownProps {
  isScrolled: boolean;
}

const ServicesDropdown = ({ isScrolled }: ServicesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openedViaKeyboard = useRef(false);

  const servicesDropdown = [
    { name: "Residential", href: "/residential" },
    { name: "Commercial", href: "/commercial" },
    { name: "Emergency Services", href: "/emergency" },
    { name: "EV Charger Installation", href: "/ev-charger" },
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
        className={cn(
          "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105",
          isScrolled ? "focus-visible:ring-offset-foreground" : "focus-visible:ring-offset-cream-50"
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggleMenu}
        onKeyDown={handleButtonKeyDown}
        type="button"
      >
        Services
        <ChevronDown className="ml-1 h-4 w-4" />
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
        <div className="py-2 bg-card rounded-2xl shadow-xl border border-border">
          {servicesDropdown.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-cream-200 hover:text-electric-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-colors"
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

export default ServicesDropdown;
