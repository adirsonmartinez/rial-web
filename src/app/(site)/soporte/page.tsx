import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { SupportPageView } from "@/views/support/SupportPageView";

export const metadata: Metadata = {
  title: "Soporte",
  description:
    "Estamos para ayudarte. Escríbenos por el formulario o contáctanos directo por correo y redes sociales.",
};

export default function SoportePage() {
  return (
    <>
      <SupportPageView />
      <Footer />
    </>
  );
}
