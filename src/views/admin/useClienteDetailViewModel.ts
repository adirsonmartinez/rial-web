"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClienteDetail,
  ClienteRow,
} from "@/lib/admin/clientes";

const VALID_CYCLES = [
  "monthly",
  "quarterly",
  "semiannual",
  "yearly",
] as const;
type BillingCycle = (typeof VALID_CYCLES)[number];

function inferActiveSubscription(
  subs: ClienteRow[],
): ClienteRow | null {
  return (
    subs.find(
      (s) => s.status === "active" && !s.cancelAtPeriodEnd,
    ) ??
    subs.find((s) => s.status === "active") ??
    subs[0] ??
    null
  );
}

function pickPlanId(planName: string, detail: ClienteDetail): string | null {
  return detail.plans.find((p) => p.name === planName)?.id ?? null;
}

function isValidCycle(value: string): value is BillingCycle {
  return (VALID_CYCLES as readonly string[]).includes(value);
}

export type ClienteDetailViewModel = {
  detail: ClienteDetail;
  activeSubscription: ClienteRow | null;
  selectedPlanId: string;
  selectedBillingCycle: BillingCycle;
  isDirty: boolean;
  isSaving: boolean;
  isCancelling: boolean;
  error: string | null;
  success: string | null;
  setPlanId: (planId: string) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  save: () => Promise<void>;
  setCancelAtPeriodEnd: (value: boolean) => Promise<void>;
};

export function useClienteDetailViewModel(
  detail: ClienteDetail,
): ClienteDetailViewModel {
  const router = useRouter();
  const activeSubscription = useMemo(
    () => inferActiveSubscription(detail.subscriptions),
    [detail.subscriptions],
  );

  const initialPlanId = useMemo(() => {
    if (!activeSubscription) return detail.plans[0]?.id ?? "";
    return pickPlanId(activeSubscription.planName, detail) ?? "";
  }, [activeSubscription, detail]);

  const initialCycle: BillingCycle = (() => {
    const value = activeSubscription?.billingCycle ?? "monthly";
    return isValidCycle(value) ? value : "monthly";
  })();

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [selectedBillingCycle, setSelectedBillingCycle] =
    useState<BillingCycle>(initialCycle);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDirty =
    selectedPlanId !== initialPlanId ||
    selectedBillingCycle !== initialCycle;

  const save = async () => {
    if (!activeSubscription) {
      setError("No hay suscripción activa para actualizar.");
      return;
    }
    if (!isDirty) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/clientes/${detail.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: activeSubscription.subscriptionId,
          planId:
            selectedPlanId !== initialPlanId ? selectedPlanId : undefined,
          billingCycle:
            selectedBillingCycle !== initialCycle
              ? selectedBillingCycle
              : undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `Error ${res.status}`);
      }
      setSuccess("Cambios guardados.");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsSaving(false);
    }
  };

  const setCancelAtPeriodEnd = async (value: boolean) => {
    if (!activeSubscription) {
      setError("No hay suscripción activa.");
      return;
    }

    setIsCancelling(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/clientes/${detail.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: activeSubscription.subscriptionId,
          cancelAtPeriodEnd: value,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `Error ${res.status}`);
      }
      setSuccess(
        value
          ? "Suscripción marcada para cancelar al final del período."
          : "Suscripción reactivada.",
      );
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    detail,
    activeSubscription,
    selectedPlanId,
    selectedBillingCycle,
    isDirty,
    isSaving,
    isCancelling,
    error,
    success,
    setPlanId: setSelectedPlanId,
    setBillingCycle: setSelectedBillingCycle,
    save,
    setCancelAtPeriodEnd,
  };
}
