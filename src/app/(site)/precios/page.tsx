import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { PricingPageView } from "@/views/pricing/PricingPageView";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes de Rial que crecen contigo. Empieza gratis o desbloquea todo con Plus desde 4,99 USD al mes.",
};

export default function PreciosPage() {
  return (
    <>
      <PricingPageView />
      <Footer />
    </>
  );
}
