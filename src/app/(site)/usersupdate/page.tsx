import type { Metadata } from "next";
import { Footer } from "@/views/home/Footer";
import { UsersUpdateView } from "@/views/usersupdate/UsersUpdateView";

export const metadata: Metadata = {
  title: "Usuarios registrados",
  description:
    "Número actual de usuarios registrados en Rial, la app multimoneda para Venezuela.",
};

export default function UsersUpdatePage() {
  return (
    <>
      <UsersUpdateView />
      <Footer />
    </>
  );
}
