import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

const speakerGuidelines = [
  "Present original, research-driven or industry-relevant insights",
  "Maintain academic integrity and clarity",
  "Engage with an international audience of researchers and professionals",
  "Contribute to meaningful scientific discussion",
];

const publicationDetails = [
  "Conference Proceedings (ISBN, MDPI, Short Abstracts)",
  "Indexed Journals (based on quality & review)",
  "Scopus (selected papers)",
  "Google Scholar",
  "International Journals",
];

const awards = [
  { icon: "🥇", title: "Best Speaker Award", details: "For outstanding presentation and delivery" },
  { icon: "🥈", title: "Best Research Paper Award", details: "For exceptional research quality" },
  { icon: "🥉", title: "Best Student Presentation", details: "For outstanding student research" },
  { icon: "🌟", title: "Young Researcher Award", details: "For early-career researchers" },
];

const faqs = [
  {
    q: "Is this conference fully virtual?",
    a: "Yes, it is 100% online.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes, all participants receive a certificate.",
  },
  {
    q: "Can I present without a paper?",
    a: "Yes, poster/presentation-only options are available.",
  },
  {
    q: "Is publication guaranteed?",
    a: "Subject to peer review.",
  },
  {
    q: "How do I join the conference?",
    a: "A meeting link will be shared via email.",
  },
];

const registrationIncludes = {
  inPerson: [
    "Full access to all conference sessions and presentations",
    "Opportunity to present your research in front of an international audience",
    "Conference kit (name badge & program booklet)",
    "E-copy of the Abstract Book",
    "Lunch and coffee breaks during the conference days",
    "Official Certificate of Participation/Presentation",
    "Publication of accepted papers in Conference Proceedings (with ISBN/e-ISBN)",
  ],
  virtual: [
    "Present your research from anywhere (home or workplace)",
    "Access to all live/recorded conference sessions",
    "E-copy of the Abstract Book and Program",
    "E-Certificate of Participation/Presentation",
    "Publication of accepted papers in Conference Proceedings (with ISBN/e-ISBN)",
  ],
};

const pricingTable = [
  { category: "Speaker", earlyBird: "$149", midterm: "$179", onSpot: "$199" },
  { category: "Poster", earlyBird: "$99", midterm: "$129", onSpot: "$149" },
  { category: "Student (Listener)", earlyBird: "$59", midterm: "$79", onSpot: "$99" },
  { category: "Delegate", earlyBird: "$49", midterm: "$69", onSpot: "$89" },
];

const BulletList = ({ items, columns = true }: { items: string[]; columns?: boolean }) => (
  <ul className={columns ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-muted-foreground font-body leading-relaxed">
        <span className="text-teal font-bold">•</span>
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
          {eyebrow ? <p className="text-teal text-sm uppercase tracking-wider font-body mb-2">{eyebrow}</p> : null}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">{children}</div>
      </div>
    </div>
  </section>
);

const Information = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 hero-gradient py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-gold-light font-body mb-3">Conference Information</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gold font-display mb-5">Information & Guidelines</h1>
          <p className="text-hero-foreground/80 font-body text-lg max-w-3xl">
            Essential information for speakers, participants, and presenters at Renewable Energy – 2027.
          </p>
        </div>
      </div>

      <Section eyebrow="🌟 Speaker" title="Speaker Guidelines">
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Speaker Role & Expectations</h3>
            <BulletList items={speakerGuidelines} columns={false} />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Presentation Structure</h3>
            <div className="space-y-3 text-muted-foreground font-body">
              <p>
                <span className="font-bold text-card-foreground">Total Duration:</span> 30–35 minutes
              </p>
              <p>
                <span className="font-bold text-card-foreground">Presentation:</span> 25–30 minutes
              </p>
              <p>
                <span className="font-bold text-card-foreground">Q&A Session:</span> 10 minutes
              </p>
              <div className="pt-3">
                <p className="font-bold text-card-foreground mb-2">Recommended flow:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Introduction & background</li>
                  <li>• Methodology / Approach</li>
                  <li>• Results / Findings</li>
                  <li>• Conclusion & future scope</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Presentation Requirements</h3>
            <div className="space-y-3 text-muted-foreground font-body">
              <p>
                <span className="font-bold text-card-foreground">Format:</span> PowerPoint (PPT/PPTX) or PDF
              </p>
              <p>
                <span className="font-bold text-card-foreground">Language:</span> English (mandatory)
              </p>
              <p className="font-bold text-card-foreground">Slides should be:</p>
              <ul className="space-y-2 ml-4">
                <li>• Clear, concise, and visually professional</li>
                <li>• Properly cited (figures, data, references)</li>
                <li>• Free from plagiarism</li>
              </ul>
              <p className="font-bold text-card-foreground mt-3">📌 Company/Institution logo and speaker affiliation must be included.</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Pre-Conference Submission</h3>
            <div className="space-y-2 text-muted-foreground font-body">
              <p>• Submit final presentation 20 days before the conference</p>
              <p>• Share a short speaker bio (100–150 words)</p>
              <p>• Provide a professional photograph (for website & promotion)</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Technical Guidelines</h3>
            <div className="space-y-2 text-muted-foreground font-body">
              <p className="font-bold text-card-foreground">To ensure a smooth virtual session:</p>
              <p>• Use a stable high-speed internet connection</p>
              <p>• Join via laptop/desktop (recommended)</p>
              <p className="font-bold text-card-foreground mt-3">Ensure:</p>
              <p className="ml-4">• Working microphone</p>
              <p className="ml-4">• HD camera (optional but preferred)</p>
              <p className="font-bold text-card-foreground mt-3">🕒 Join your session at least 15 minutes in advance for technical checks</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Session Protocol</h3>
            <div className="space-y-2 text-muted-foreground font-body">
              <p>• Sessions will be hosted via Zoom / Microsoft Teams</p>
              <p>• All sessions may be recorded for academic and promotional purposes</p>
              <p>• Speakers are requested to remain available during Q&A</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Recognition & Certification</h3>
            <div className="space-y-2 text-muted-foreground font-body">
              <p>🎓 Official Speaker Certificate</p>
              <p>🌍 Global recognition on conference website</p>
              <p>🏅 Eligibility for Best Speaker Award</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Ethics & Professional Conduct</h3>
            <div className="space-y-2 text-muted-foreground font-body">
              <p>• Present authentic and unpublished work</p>
              <p>• Avoid promotional or sales-oriented content</p>
              <p>• Respect diversity, inclusivity, and academic standards</p>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="📖 Academic" title="Publications & Indexing" tinted>
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Publication Opportunities</h3>
            <p className="text-muted-foreground font-body mb-4">All accepted abstracts/papers will be published in:</p>
            <BulletList items={publicationDetails} columns={false} />
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground font-body italic">
              Note: Publication depends on peer-review quality and journal scope.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="🏆 Recognition" title="Awards & Excellence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awards.map((award) => (
            <div key={award.title} className="p-4 rounded-lg border border-border bg-muted/50">
              <div className="text-3xl mb-2">{award.icon}</div>
              <h3 className="font-display font-bold text-card-foreground mb-2">{award.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{award.details}</p>
              <p className="text-xs text-muted-foreground mt-3">Winners receive: Certificate of Excellence, Digital recognition, Featured on website</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="💰 Pricing" title="Registration Pricing" tinted>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-bold text-card-foreground">Category</th>
                <th className="text-left py-3 px-2 font-bold text-card-foreground">Early Bird</th>
                <th className="text-left py-3 px-2 font-bold text-card-foreground">Midterm</th>
                <th className="text-left py-3 px-2 font-bold text-card-foreground">On Spot</th>
              </tr>
            </thead>
            <tbody>
              {pricingTable.map((row) => (
                <tr key={row.category} className="border-b border-border">
                  <td className="py-3 px-2 text-muted-foreground font-body">{row.category}</td>
                  <td className="py-3 px-2 text-muted-foreground font-body">{row.earlyBird}</td>
                  <td className="py-3 px-2 text-muted-foreground font-body">{row.midterm}</td>
                  <td className="py-3 px-2 text-muted-foreground font-body">{row.onSpot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="📋 What's Included" title="Registration Includes">
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">For In-Person Speakers & Participants</h3>
            <BulletList items={registrationIncludes.inPerson} columns={false} />
          </div>
          <div className="border-t border-border pt-8">
            <h3 className="font-display text-lg font-bold text-card-foreground mb-4">For Virtual Speakers & Participants</h3>
            <BulletList items={registrationIncludes.virtual} columns={false} />
          </div>
        </div>
      </Section>

      <Section eyebrow="❌ Cancellation" title="Cancellation & Refund Policy" tinted>
        <div className="space-y-6">
          <div className="space-y-3 text-muted-foreground font-body">
            <p>
              <span className="font-bold text-card-foreground">Cancellation before 50 days:</span> 50% refund
            </p>
            <p>
              <span className="font-bold text-card-foreground">Cancellation before 40 days:</span> 30% refund
            </p>
            <p>
              <span className="font-bold text-card-foreground">Cancellation within 30 days:</span> No refund
            </p>
          </div>
          <div className="border-t border-border pt-6 space-y-3 text-muted-foreground font-body">
            <p className="font-bold text-card-foreground">🔄 Registration Transfer</p>
            <p>Registration can be transferred to another person</p>
            <p>Refunds will be processed within 4 weeks after the conference ends</p>
          </div>
          <div className="border-t border-border pt-6 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
            <p className="text-sm text-card-foreground font-body">
              <span className="font-bold">Important:</span> If the conference is postponed due to unavoidable situations (like natural disasters or other major events), refunds will not be applicable. However, your registration will be safely transferred to a future event.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="📋 Terms" title="Terms & Conditions">
        <div className="space-y-4 text-muted-foreground font-body">
          <p>By registering, you agree to the conference terms and policies</p>
          <p>The organizers may adjust the schedule, venue, or dates if required</p>
          <p>In rare cases (beyond control), the event may be postponed or cancelled</p>
          <div className="border-l-4 border-teal pl-4 bg-teal/5 p-4 rounded">
            <p className="text-card-foreground font-bold mb-2">If postponed:</p>
            <p>Your registration will remain valid for the next edition</p>
          </div>
          <p>Please check the official conference website regularly for updates</p>
          <p>The organizers are not responsible for personal loss, injury, or damage during the event</p>
        </div>
      </Section>

      <Section eyebrow="❓ FAQ" title="Frequently Asked Questions" tinted>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className={idx > 0 ? "border-t border-border pt-6" : ""}>
              <h3 className="font-bold text-card-foreground mb-2">{faq.q}</h3>
              <p className="text-muted-foreground font-body">✔️ {faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="📞 Support" title="Contact Us">
        <div className="space-y-4 text-muted-foreground font-body">
          <p className="text-lg font-bold text-card-foreground">We're here to help you!</p>
          <div className="space-y-3 text-lg">
            <p>📧 Email: <span className="text-teal font-semibold">info@yourconference.com</span></p>
            <p>📱 Phone: <span className="text-teal font-semibold">+91 XXXXX XXXXX</span></p>
            <p>🌐 Website: <span className="text-teal font-semibold">www.yourconference.com</span></p>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Information;
