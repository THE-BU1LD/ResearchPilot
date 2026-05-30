import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import JourneySection from "@/components/landing/JourneySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhyUsSection from "@/components/landing/WhyUsSection";
import EthicsSection from "@/components/landing/EthicsSection";
import FounderSection from "@/components/landing/FounderSection";
import CTASection from "@/components/landing/CTASection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyUsSection />
        <JourneySection />
        <FeaturesSection />
        <TestimonialsSection />
        <EthicsSection />
        <FounderSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
