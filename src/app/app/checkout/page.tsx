import type { Metadata } from "next";
import { CheckoutView } from "@/views/dashboard/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completa tu suscripción a Rial Plus",
};

type Cadence = "mensual" | "trimestral" | "semestral" | "anual";

const validCadences: Cadence[] = [
  "mensual",
  "trimestral",
  "semestral",
  "anual",
];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cadence?: string }>;
}) {
  const { cadence } = await searchParams;
  const selected = validCadences.includes(cadence as Cadence)
    ? (cadence as Cadence)
    : "trimestral";

  return <CheckoutView cadence={selected} />;
}
