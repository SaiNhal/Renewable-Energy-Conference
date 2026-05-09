import { Link } from "react-router-dom";
import { Building2, ChevronRight, Globe2, Lightbulb, Users, Zap } from "lucide-react";

const profiles = [
  {
    icon: Building2,
    title: "Research & Industry Profile",
    text: "Solar, wind, hydrogen, storage, grid systems, clean mobility, smart cities, policy, finance, and sustainable energy solutions.",
  },
  {
    icon: Users,
    title: "Participant Profile",
    text: "Researchers, academicians, students, engineers, policy leaders, consultants, innovators, investors, and clean energy professionals.",
  },
];

const highlights = [
  { icon: Zap, value: "300+", label: "Expert Speakers" },
  { icon: Users, value: "100+", label: "Expected Delegates" },
  { icon: Globe2, value: "30+", label: "Countries" },
  { icon: Lightbulb, value: "30+", label: "Sessions" },
];

const HomeHighlights = () => {
  return (
    <>
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-teal/10">
              <img
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80"
                alt="Renewable energy infrastructure at sunset"
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div>
              <p className="section-kicker mb-2">Welcome</p>
              <h2 className="mb-5 max-w-3xl font-display text-3xl font-black uppercase leading-tight text-foreground md:text-5xl">
                Energy Innovation, Research, and Global Collaboration
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Renewable Energy 2027 brings together clean-energy researchers, technology leaders, institutions,
                  and policy voices for a focused virtual conference on practical pathways to sustainable power.
                </p>
                <p>
                  The experience is designed to feel direct, credible, and active: strong scientific sessions, clear
                  registration paths, publication visibility, and international networking for presenters and delegates.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {profiles.map((item) => (
                  <div key={item.title} className="conference-card p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-teal/10">
                      <item.icon className="text-teal" size={24} />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-black text-card-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="expo-band py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-md border border-white/15 bg-white/95 p-6 text-center shadow-xl shadow-black/10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-gold text-hero-bg">
                  <item.icon size={26} />
                </div>
                <p className="font-display text-4xl font-black text-red-600">{item.value}</p>
                <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur md:flex-row">
            <p className="max-w-2xl text-center text-base font-semibold text-white md:text-left">
              Present your work, connect with clean-energy professionals, and build visibility for your research.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/registration"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-hero-bg"
              >
                Registration <ChevronRight size={18} />
              </Link>
              <Link
                to="/abstract-submission"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-white/10"
              >
                Submit Abstract <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHighlights;
