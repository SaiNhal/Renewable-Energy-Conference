import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UpdatesBanner from "@/components/UpdatesBanner";
import SpeakersSection from "@/components/SpeakersSection";
import MediaPartnersSection from "@/components/MediaPartnersSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UpdatesBanner />
      <SpeakersSection showEmptyState={false} />
      <MediaPartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
