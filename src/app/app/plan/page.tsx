import type { Metadata } from "next";
import { PlanView } from "@/views/dashboard/PlanView";

export const metadata: Metadata = {
  title: "Planes",
  description: "Elige el plan de Rial que se adapta a ti",
};

export default function PlanPage() {
  return <PlanView />;
}
