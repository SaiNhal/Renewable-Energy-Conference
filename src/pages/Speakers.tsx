import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpeakersSection from "@/components/SpeakersSection";

const Speakers = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">Scientific Committee</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">
            Where Ideas Meet Impact
          </h1>
          <p className="text-hero-foreground/80 font-body max-w-3xl mx-auto leading-8">
            The Scientific Committee of Renewable Energy – 2027 comprises a globally distinguished panel of leading academicians, researchers, and industry experts dedicated to advancing innovation in renewable and sustainable energy.
            With their profound expertise and strategic vision, the committee ensures the highest standards of scientific excellence, shaping a dynamic and impactful conference program that addresses global energy challenges and future opportunities.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8">
            <div className="rounded-3xl border border-border bg-card p-10">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gold font-display mb-4">
                    🎤 Speakers
                  </h2>
                  <h3 className="text-xl font-semibold text-gold mb-3">🌍 Where Ideas Meet Impact</h3>
                  <p className="text-muted-foreground leading-7">
                    At Renewable Energy – 2027, our speakers are not just presenters — they are the minds shaping the future of global energy.
                    From renowned professors and pioneering researchers to visionary industry leaders, each speaker brings a story of innovation, discovery, and real-world impact.
                    This is where knowledge goes beyond theory… and transforms into solutions for a sustainable future.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gold mb-3">✨ A Platform for Thought Leaders</h3>
                  <p className="text-muted-foreground leading-7 mb-4">
                    Every speaker at this conference is carefully selected for their contribution to science, technology, and sustainability.
                    Here, you will experience:
                  </p>
                  <ul className="space-y-3 text-muted-foreground list-disc list-inside leading-7">
                    <li>Research that challenges conventional thinking</li>
                    <li>Ideas that inspire global change</li>
                    <li>Conversations that lead to collaboration</li>
                  </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-3xl border border-border bg-surface p-6">
                    <h4 className="text-lg font-semibold text-gold mb-2">🌟 Plenary Speakers</h4>
                    <p className="text-muted-foreground leading-7">
                      Our plenary speakers are globally respected leaders whose work has influenced the direction of renewable energy research and policy.
                      Their sessions will not just inform — they will reshape perspectives, spark new questions, and open doors to future possibilities.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-surface p-6">
                    <h4 className="text-lg font-semibold text-gold mb-2">⭐ Keynote Speakers</h4>
                    <p className="text-muted-foreground leading-7">
                      Our keynote speakers bring powerful insights into where energy innovation is heading, how sustainability is evolving globally, and what the next decade of research will look like.
                      Their talks are designed to ignite curiosity and inspire action.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-surface p-6">
                    <h4 className="text-lg font-semibold text-gold mb-2">🎯 Invited Speakers</h4>
                    <p className="text-muted-foreground leading-7">
                      Our invited speakers bridge the gap between research and real-world implementation.
                      They will share breakthrough findings, practical applications, and industry-driven innovations that show how ideas become impact.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gold mb-3">💡 More Than Just Talks</h3>
                  <p className="text-muted-foreground leading-7 mb-4">
                    Being part of the speaker sessions means engaging with ideas that matter, connecting with global experts, exploring collaborations beyond borders, and being part of conversations that shape the future.
                  </p>
                  <p className="text-muted-foreground leading-7">
                    Because here… every talk has purpose, every idea has potential, every speaker has a story, and every participant becomes part of something bigger than just a conference.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gold mb-3">🚀 Join the Conversation</h3>
                  <p className="text-muted-foreground leading-7">
                    If you are passionate about renewable energy, innovation, and global impact — this is your stage, your audience, and your opportunity to be heard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SpeakersSection />
      <Footer />
    </div>
  );
};

export default Speakers;
