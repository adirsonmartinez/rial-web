import type { Metadata } from "next";
import { DashboardView } from "@/views/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tu panel de finanzas en Rial",
};

export default function AppPage() {
  return <DashboardView />;
}
