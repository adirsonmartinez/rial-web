import { HeroSection } from "@/views/home/HeroSection";
import { FeaturesSection } from "@/views/home/FeaturesSection";

export default function Home() {
  return (
    <div className="flex-1">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
