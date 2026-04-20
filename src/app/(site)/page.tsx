import { HeroSection } from "@/views/home/HeroSection";
import { SolutionSection } from "@/views/home/SolutionSection";
import { FeaturesSection } from "@/views/home/FeaturesSection";
import { StatsSection } from "@/views/home/StatsSection";
import { TeamSection } from "@/views/home/TeamSection";
import { NewsSection } from "@/views/home/NewsSection";
import { FaqSection } from "@/views/home/FaqSection";
import { CtaSection } from "@/views/home/CtaSection";
import { Footer } from "@/views/home/Footer";

export default function Home() {
  return (
    <div className="flex-1">
      <HeroSection />
      <SolutionSection />
      <FeaturesSection />
      <StatsSection />
      <TeamSection />
      <NewsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
