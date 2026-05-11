import type { Metadata } from "next";
import {
  CheckoutResultView,
  type CheckoutResultStatus,
} from "@/views/dashboard/CheckoutResultView";

export const metadata: Metadata = {
  title: "Resultado del pago",
  description: "Resultado de tu suscripción a Rial Plus",
};

const validStatuses: CheckoutResultStatus[] = [
  "success",
  "pending",
  "error",
  "cancelled",
];

function normalizeStatus(raw: string | undefined): CheckoutResultStatus {
  if (!raw) return "pending";
  const normalized = raw.toLowerCase();
  if (normalized === "succeeded" || normalized === "paid") return "success";
  if (normalized === "canceled") return "cancelled";
  if (normalized === "failed") return "error";
  if (normalized === "processing") return "pending";
  return validStatuses.includes(normalized as CheckoutResultStatus)
    ? (normalized as CheckoutResultStatus)
    : "pending";
}

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <CheckoutResultView status={normalizeStatus(status)} />;
}
