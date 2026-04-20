import type { Metadata } from "next";
import { LoginView } from "@/views/login/LoginView";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresa a tu cuenta de Rial",
};

export default function LoginPage() {
  return <LoginView />;
}
