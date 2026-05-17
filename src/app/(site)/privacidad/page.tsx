import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { PrivacyPageView } from "@/views/legal/PrivacyPageView";

export const metadata: Metadata = {
  title: "Políticas de privacidad",
  description:
    "Cómo recolectamos, usamos y protegemos tu información en Rial. Conoce tus derechos y cómo ejercerlos.",
};

export default function PrivacidadPage() {
  return (
    <>
      <PrivacyPageView />
      <Footer />
    </>
  );
}
