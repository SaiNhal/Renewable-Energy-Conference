import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Zap } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Conference", path: "/about" },
  { label: "Speakers", path: "/speakers" },
];

const abstractLinks = [
  { label: "Submit Abstract", path: "/abstract-submission#submit-abstract" },
  { label: "Scientific Sessions", path: "/abstract-submission#scientific-sessions" },
];

const informationLinks = [
  { label: "Speaker Guidelines", path: "/information#speaker-guidelines" },
  { label: "Publications & Indexing", path: "/information#publications-indexing" },
  { label: "Awards & Excellence", path: "/information#awards-excellence" },
  { label: "Registration Pricing", path: "/information#registration-pricing" },
  { label: "Registration Includes", path: "/information#registration-includes" },
  { label: "Cancellation & Refund Policy", path: "/information#cancellation-refund-policy" },
  { label: "Terms & Conditions", path: "/information#terms-conditions" },
  { label: "Frequently Asked Questions", path: "/information#frequently-asked-questions" },
  { label: "Contact Us", path: "/information#contact-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getSection } = useWebsiteContent();
  const brand = getSection("site_brand", { title: "Renewable Energy", content: "Conference 2027" });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-hero-bg/95 shadow-lg shadow-black/10 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="gold-gradient flex h-11 w-11 items-center justify-center rounded-md text-hero-bg shadow-md shadow-gold/25">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="hidden font-display text-base font-black uppercase leading-tight text-hero-foreground sm:block">
              {brand.title}
              <span className="block text-xs font-extrabold tracking-[0.18em] text-gold">{brand.content}</span>
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
            <div className="group relative">
              <Link
                to="/information"
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition-colors ${
                  location.pathname === "/information"
                    ? "text-gold"
                    : "text-hero-foreground/80 hover:text-gold"
                }`}
              >
                Information
                <ChevronDown size={14} />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 border border-border bg-card p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {informationLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block rounded-md px-4 py-3 text-sm font-bold text-card-foreground transition-colors hover:bg-teal/10 hover:text-teal"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="group relative">
              <Link
                to="/abstract-submission"
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition-colors ${
                  location.pathname === "/abstract-submission"
                    ? "text-gold"
                    : "text-hero-foreground/80 hover:text-gold"
                }`}
              >
                Abstract Submission
                <ChevronDown size={14} />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-2 border border-border bg-card p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {abstractLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block rounded-md px-4 py-3 text-sm font-bold text-card-foreground transition-colors hover:bg-teal/10 hover:text-teal"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/registration"
              className={`rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition-colors ${
                location.pathname === "/registration"
                  ? "text-gold"
                  : "text-hero-foreground/80 hover:text-gold"
              }`}
            >
              Registration
            </Link>
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
            <Link
              to="/information"
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                location.pathname === "/information"
                  ? "text-gold bg-white/5"
                  : "text-hero-foreground/80 hover:text-gold hover:bg-white/5"
              }`}
            >
              Information
            </Link>
            <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
              {informationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-hero-foreground/70 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              to="/abstract-submission"
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                location.pathname === "/abstract-submission"
                  ? "text-gold bg-white/5"
                  : "text-hero-foreground/80 hover:text-gold hover:bg-white/5"
              }`}
            >
              Abstract Submission
            </Link>
            <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
              {abstractLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-hero-foreground/70 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              to="/registration"
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                location.pathname === "/registration"
                  ? "text-gold bg-white/5"
                  : "text-hero-foreground/80 hover:text-gold hover:bg-white/5"
              }`}
            >
              Registration
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
