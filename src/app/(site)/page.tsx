import { HeroSectionV2 } from "@/views/home/HeroSectionV2";
import { BrandsBanner } from "@/views/home/BrandsBanner";
import { SolutionSection } from "@/views/home/SolutionSection";
import { FeaturesSection } from "@/views/home/FeaturesSection";
import { StatsSection } from "@/views/home/StatsSection";
import { TeamSection } from "@/views/home/TeamSection";
import { TestimonialsSection } from "@/views/home/TestimonialsSection";
import { FaqSection } from "@/views/home/FaqSection";
import { CtaSection } from "@/views/home/CtaSection";
import { Footer } from "@/views/home/Footer";
import { IntroOverlay } from "@/views/home/IntroOverlay";

export default function Home() {
  return (
    <div className="flex-1">
      <IntroOverlay />
      <HeroSectionV2 />
      <BrandsBanner />
      <SolutionSection />
      <FeaturesSection />
      <StatsSection />
      <TeamSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
