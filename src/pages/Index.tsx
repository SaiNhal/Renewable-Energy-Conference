import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UpdatesBanner from "@/components/UpdatesBanner";
import HomeHighlights from "@/components/HomeHighlights";
import AboutSection from "@/components/AboutSection";
import ImportantDates from "@/components/ImportantDates";
import SpeakersSection from "@/components/SpeakersSection";
import MediaPartnersSection from "@/components/MediaPartnersSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UpdatesBanner />
      <HomeHighlights />
      <AboutSection />
      <ImportantDates />
      <SpeakersSection showEmptyState={false} />
      <MediaPartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
