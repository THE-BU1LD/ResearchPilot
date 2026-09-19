import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import JourneySection from "@/components/landing/JourneySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import EthicsSection from "@/components/landing/EthicsSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <JourneySection />
        <FeaturesSection />
        <EthicsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
