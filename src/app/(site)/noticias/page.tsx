import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { NewsPageView } from "@/views/news/NewsPageView";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Actualizaciones de producto, historias de nuestra comunidad y guías prácticas para sacar el máximo provecho a tu dinero.",
};

export default function NoticiasPage() {
  return (
    <>
      <NewsPageView />
      <Footer />
    </>
  );
}
