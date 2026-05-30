import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeHighlights from "@/components/HomeHighlights";
import AboutSection from "@/components/AboutSection";
import ImportantDates from "@/components/ImportantDates";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakersSection from "@/components/SpeakersSection";
import MediaPartnersSection from "@/components/MediaPartnersSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HomeHighlights />
      <AboutSection />
      <ImportantDates />
      <ScheduleSection />
      <SpeakersSection showEmptyState={false} />
      <MediaPartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
