import Navbar from "@/components/Navbar";
import SessionsSection from "@/components/SessionsSection";
import Footer from "@/components/Footer";

const Sessions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 hero-gradient py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-gold-light font-body mb-3">Scientific Programme</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gold font-display mb-5">Scientific Sessions</h1>
          <p className="text-hero-foreground/80 font-body text-lg max-w-3xl">
            Explore the full list of scientific tracks for Renewable Energy – 2027, including advanced technologies, policy, digital energy systems, and interdisciplinary research.
          </p>
        </div>
      </div>

      <SessionsSection />
      <Footer />
    </div>
  );
};

export default Sessions;
