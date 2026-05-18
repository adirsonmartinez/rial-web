import type { SupabaseClient } from "@supabase/supabase-js";

export type SubscriptionPlan = "free" | "plus";

export type SubscriptionProvider =
  | "venflow"
  | "stripe"
  | "apple"
  | "google"
  | "revenuecat"
  | "manual"
  | "r4conecta";

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "yearly";

export type SubscriptionInfo = {
  plan: SubscriptionPlan;
  provider: SubscriptionProvider | null;
  billingCycle: BillingCycle | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export const FREE_SUBSCRIPTION: SubscriptionInfo = {
  plan: "free",
  provider: null,
  billingCycle: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export async function getSubscriptionInfo(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionInfo> {
  const { data } = await supabase
    .from("subscriptions")
    .select(
      "status, billing_cycle, current_period_end, cancel_at_period_end, provider",
    )
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return FREE_SUBSCRIPTION;
  }

  const currentPeriodEnd = (data.current_period_end as string | null) ?? null;
  const cancelAtPeriodEnd = Boolean(data.cancel_at_period_end);
  const periodEndDate = currentPeriodEnd ? new Date(currentPeriodEnd) : null;
  const isExpired =
    cancelAtPeriodEnd &&
    periodEndDate !== null &&
    !Number.isNaN(periodEndDate.getTime()) &&
    periodEndDate.getTime() <= Date.now();

  if (isExpired) {
    return FREE_SUBSCRIPTION;
  }

  return {
    plan: "plus",
    provider: (data.provider as SubscriptionProvider | null) ?? null,
    billingCycle: data.billing_cycle as BillingCycle | null,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  };
}
