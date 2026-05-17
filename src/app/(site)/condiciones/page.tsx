import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { TermsPageView } from "@/views/legal/TermsPageView";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Las condiciones que rigen el uso de Rial: registro, planes, facturación, privacidad, modificaciones y jurisdicción.",
};

export default function CondicionesPage() {
  return (
    <>
      <TermsPageView />
      <Footer />
    </>
  );
}
