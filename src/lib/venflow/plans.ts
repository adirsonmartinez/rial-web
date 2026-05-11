import type { VenflowPlanFrequency } from "./types";

export type Cadence = "mensual" | "trimestral" | "semestral" | "anual";

export const allCadences: Cadence[] = [
  "mensual",
  "trimestral",
  "semestral",
  "anual",
];

const cadenceToFrequency: Record<Cadence, VenflowPlanFrequency> = {
  mensual: "monthly",
  trimestral: "quarterly",
  semestral: "biannual",
  anual: "annual",
};

const cadenceToBillingCycle: Record<Cadence, string> = {
  mensual: "monthly",
  trimestral: "quarterly",
  semestral: "biannual",
  anual: "annual",
};

function planIdEnv(cadence: Cadence): string | undefined {
  switch (cadence) {
    case "mensual":
      return process.env.VENFLOW_PLAN_MENSUAL_ID;
    case "trimestral":
      return process.env.VENFLOW_PLAN_TRIMESTRAL_ID;
    case "semestral":
      return process.env.VENFLOW_PLAN_SEMESTRAL_ID;
    case "anual":
      return process.env.VENFLOW_PLAN_ANUAL_ID;
  }
}

export function getVenflowPlanId(cadence: Cadence): string {
  const id = planIdEnv(cadence);
  if (!id) {
    throw new Error(
      `No hay plan de Venflow configurado para la cadencia "${cadence}"`,
    );
  }
  return id;
}

export function isCadenceAvailable(cadence: Cadence): boolean {
  return Boolean(planIdEnv(cadence));
}

export function getBillingCycle(cadence: Cadence): string {
  return cadenceToBillingCycle[cadence];
}

export function getFrequency(cadence: Cadence): VenflowPlanFrequency {
  return cadenceToFrequency[cadence];
}
