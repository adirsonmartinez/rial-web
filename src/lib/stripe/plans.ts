import type { Cadence } from "@/lib/venflow/plans";

const cadenceToBillingCycle: Record<Cadence, string> = {
  mensual: "monthly",
  trimestral: "quarterly",
  semestral: "semiannual",
  anual: "yearly",
};

function priceIdEnv(cadence: Cadence): string | undefined {
  switch (cadence) {
    case "mensual":
      return process.env.STRIPE_PRICE_MONTHLY;
    case "trimestral":
      return process.env.STRIPE_PRICE_QUARTERLY;
    case "semestral":
      return process.env.STRIPE_PRICE_SEMIANNUAL;
    case "anual":
      return process.env.STRIPE_PRICE_YEARLY;
  }
}

export function getStripePriceId(cadence: Cadence): string {
  const id = priceIdEnv(cadence);
  if (!id) {
    throw new Error(
      `No hay price de Stripe configurado para la cadencia "${cadence}"`,
    );
  }
  return id;
}

export function isStripeCadenceAvailable(cadence: Cadence): boolean {
  return Boolean(priceIdEnv(cadence));
}

export function getStripeBillingCycle(cadence: Cadence): string {
  return cadenceToBillingCycle[cadence];
}

export function getCadenceFromPriceId(priceId: string): Cadence | null {
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return "mensual";
  if (priceId === process.env.STRIPE_PRICE_QUARTERLY) return "trimestral";
  if (priceId === process.env.STRIPE_PRICE_SEMIANNUAL) return "semestral";
  if (priceId === process.env.STRIPE_PRICE_YEARLY) return "anual";
  return null;
}
