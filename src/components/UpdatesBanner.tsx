import { Link } from "react-router-dom";

const quickLinks = [
  { label: "SCIENTIFIC SESSIONS", href: "/sessions" },
  { label: "ABSTRACT SUBMISSION", href: "/abstract-submission" },
  { label: "REGISTRATION", href: "/registration" },
];

const UpdatesBanner = () => {
  return (
    <section className="bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 -mt-20 flex flex-col overflow-hidden rounded-md border border-border bg-white shadow-2xl shadow-teal/15 md:flex-row">
          <div className="flex items-center justify-center bg-teal px-6 py-4">
            <span className="text-sm font-extrabold uppercase tracking-wider text-white">New Updates</span>
          </div>
          <div className="flex flex-1 items-center px-6 py-4">
            <p className="text-sm font-semibold text-card-foreground">
              Abstract Submission and Early Bird Registration Slots are Open Now...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickLinks.map((link, i) => {
            const colors = [
              "bg-[#126c70] hover:bg-[#0f5c60]",
              "bg-teal hover:bg-teal/85",
              "bg-gold hover:bg-gold-light text-hero-bg",
            ];
            const isExternal = link.href.startsWith("#");
            const className = `${colors[i]} text-white text-center py-6 px-4 rounded-md font-extrabold text-sm uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5`;

            if (isExternal) {
              return (
                <a key={i} href={link.href} className={className}>
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={i} to={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpdatesBanner;
