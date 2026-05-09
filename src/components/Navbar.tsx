import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Conference", path: "/about" },
  { label: "Scientific Sessions", path: "/sessions" },
  { label: "Speakers", path: "/speakers" },
  { label: "Information", path: "/information" },
  { label: "Abstract Submission", path: "/abstract-submission" },
  { label: "Registration", path: "/registration" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-hero-bg/95 shadow-lg shadow-black/10 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="gold-gradient flex h-11 w-11 items-center justify-center rounded-md text-hero-bg shadow-md shadow-gold/25">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="hidden font-display text-base font-black uppercase leading-tight text-hero-foreground sm:block">
              Renewable Energy
              <span className="block text-xs font-extrabold tracking-[0.18em] text-gold">Conference 2027</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition-colors ${
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-hero-foreground/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-hero-foreground hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                  location.pathname === link.path
                    ? "text-gold bg-white/5"
                    : "text-hero-foreground/80 hover:text-gold hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
