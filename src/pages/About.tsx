import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

const speakerBenefits = [
  "🌟 Global Recognition: Present your research to an international audience of experts",
  "🎤 Prestigious Speaking Opportunity: Deliver keynote and plenary talks alongside renowned professionals",
  "🌐 International Networking: Connect with leading researchers, institutions, and industry leaders",
  "📖 Publication Opportunities: Conference proceedings with ISBN and potential journal collaborations",
  "🏆 Awards & Honors: Best Speaker and Best Research Presentation Awards",
  "🎓 Academic Visibility: Enhance your professional profile and citation impact",
];

const scopeTopics = [
  "Advanced Solar Energy Systems & PV Technologies",
  "Wind, Hydro & Hybrid Renewable Systems",
  "Hydrogen Energy & Fuel Cell Innovations",
  "Energy Storage, Batteries & Grid Integration",
  "Smart Grids, AI & Digital Energy Systems",
  "Sustainable Energy Policies & Economics",
  "Climate Change Mitigation & Environmental Impact",
  "Green Buildings & Energy Efficiency",
  "Carbon Capture, Utilization & Storage (CCUS)",
  "Emerging Trends in Clean & Renewable Technologies",
];

const speakingOpportunities = [
  "Keynote Speakers – Deliver high-impact addresses on emerging trends and global challenges",
  "Plenary Speakers – Present comprehensive insights into advanced research and innovations",
  "Invited Speakers – Share specialised expertise within focused thematic sessions",
  "Oral Presenters – Present peer-reviewed research to an international audience",
];

const leadershipRoles = [
  "Session Chairs / Co-Chairs – Lead and moderate technical sessions",
  "Scientific Committee Members – Contribute to academic quality and the peer-review process",
  "Advisory Board Members – Provide strategic guidance and global perspective",
  "Editorial Board Members (Proceedings/Journals) – Support publication quality and standards",
];

const specialisedContributions = [
  "Workshop & Tutorial Speakers – Conduct in-depth sessions on emerging technologies",
  "Panel Discussion Experts – Engage in high-level discussions on policy, innovation, and industry trends",
  "Industry Speakers – Present real-world applications, case studies, and technological advancements",
  "Young Researcher Forum Speakers – Showcase innovative work from early-career scientists",
];

const conferenceHighlights = [
  "🎓 World-Class Keynote & Plenary Addresses",
  "📊 Technical, Parallel & Thematic Sessions",
  "🤝 Global Networking & Collaboration Opportunities",
  "💻 Fully Interactive Virtual Conference Platform",
  "📜 E-Certification & ISBN Proceedings",
  "🏅 Best Paper, Speaker & Young Researcher Awards",
  "🌍 Participation from Leading Global Institutions",
  "🎤 Invited Talks by Industry & Academic Experts",
  "🧑‍⚖️ Dedicated Session Chairs & Expert Panels",
  "🧠 Panel Discussions on Emerging Energy Trends",
  "🔬 Interdisciplinary & Multi-Track Sessions",
  "📢 Opportunities for High-Impact Research Visibility",
  "📝 Peer-Reviewed Abstracts & Presentations",
  "🎥 Access to Recorded Sessions & On-Demand Content",
  "🌐 Digital Networking & Virtual Meetups",
];

const audience = [
  "🎓 Professors, Academicians & Leading Researchers",
  "🔬 Scientists & Research Professionals in Energy & Sustainability",
  "🎤 Keynote Speakers, Plenary Speakers & Invited Experts",
  "🏭 Industry Leaders, Engineers & Technology Innovators",
  "💼 Energy Consultants, Analysts & Strategic Advisors",
  "🌍 Policy Makers, Government Officials & Regulatory Authorities",
  "🧑‍⚖️ Session Chairs, Scientific Committee & Advisory Board Members",
  "🎓 Postdoctoral Fellows, PhD Scholars & Graduate Researchers",
  "🏢 Corporate Executives, Startups & Clean Energy Entrepreneurs",
  "🤝 NGOs, Sustainability Advocates & International Organisations",
  "💡 Investors, Venture Capitalists & Energy Sector Stakeholders",
  "🌐 Professionals Seeking Global Collaboration & Research Partnerships.",
];

const BulletList = ({ items, columns = true }: { items: string[]; columns?: boolean }) => (
  <ul className={columns ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-muted-foreground font-body leading-relaxed">
        <span className="text-gold font-bold">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Section = ({
  eyebrow,
  title,
  children,
  tinted = false,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  tinted?: boolean;
}) => (
  <section className={tinted ? "bg-muted/50 py-14" : "bg-background py-14"}>
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_2fr] gap-8 lg:gap-12">
        <div>
          {eyebrow ? <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">{eyebrow}</p> : null}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">{children}</div>
      </div>
    </div>
  </section>
);

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 hero-gradient py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-gold-light font-body mb-3">Renewable Energy – 2027</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gold font-display mb-5">About the Conference</h1>
          <p className="text-hero-foreground/80 font-body text-lg max-w-3xl">
            World Conference on Renewable Energy & Sustainable Energy
          </p>
        </div>
      </div>

      <Section eyebrow="🔷 About" title="About the Conference">
        <div className="space-y-5 text-muted-foreground font-body leading-relaxed">
          <p>
            The World Conference on Renewable Energy & Sustainable Energy (Renewable Energy – 2027) is a distinguished
            global forum designed to convene leading scientists, keynote speakers, industry pioneers, and policy leaders
            in the field of energy and sustainability.
          </p>
          <p>
            This high-impact virtual conference aims to showcase cutting-edge research, foster interdisciplinary dialogue,
            and drive strategic collaborations that accelerate the transition toward a low-carbon and sustainable energy
            future.
          </p>
          <p>
            Renewable Energy – 2027 offers an exclusive platform for thought leaders to present transformative ideas,
            engage with an international audience, and contribute to shaping the global energy agenda.
          </p>
        </div>
      </Section>

      <Section eyebrow="🎯 Speaker Value" title="Why Participate as a Speaker" tinted>
        <BulletList items={speakerBenefits} />
      </Section>

      <Section eyebrow="🔬 Scientific Scope" title="Scientific Scope & Key Topics">
        <div className="space-y-5">
          <p className="text-muted-foreground font-body leading-relaxed">The conference will cover, but is not limited to:</p>
          <BulletList items={scopeTopics} />
        </div>
      </Section>

      <Section eyebrow="🎤 Leadership" title="Call for Distinguished Speakers & Scientific Leadership Roles" tinted>
        <div className="space-y-8">
          <div className="space-y-5 text-muted-foreground font-body leading-relaxed">
            <p>
              The World Conference on Renewable Energy & Sustainable Energy (Renewable Energy – 2027) cordially invites
              eminent academicians, senior researchers, industry leaders, and policy experts to contribute to the
              scientific programme in prestigious speaking and leadership capacities.
            </p>
            <p>We welcome expressions of interest for the following roles:</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div>
              <h3 className="font-display text-xl font-bold text-card-foreground mb-4">🌟 Speaking Opportunities</h3>
              <BulletList items={speakingOpportunities} columns={false} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-card-foreground mb-4">🏛 Scientific & Leadership Roles</h3>
              <BulletList items={leadershipRoles} columns={false} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-card-foreground mb-4">🎓 Specialised Contributions</h3>
              <BulletList items={specialisedContributions} columns={false} />
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="🌐 Highlights" title="Conference Highlights">
        <BulletList items={conferenceHighlights} />
      </Section>

      <Section eyebrow="👥 Audience" title="Who Should Attend" tinted>
        <div className="space-y-5">
          <p className="text-muted-foreground font-body leading-relaxed">
            The conference is designed for a diverse and distinguished global audience, including:
          </p>
          <BulletList items={audience} />
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default About;
