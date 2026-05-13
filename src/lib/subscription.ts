import type { SupabaseClient } from "@supabase/supabase-js";

export type SubscriptionPlan = "free" | "plus";

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "yearly";

export type SubscriptionInfo = {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export const FREE_SUBSCRIPTION: SubscriptionInfo = {
  plan: "free",
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
    .select("status, billing_cycle, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .eq("provider", "venflow")
    .maybeSingle();

  if (!data || data.status !== "active") {
    return FREE_SUBSCRIPTION;
  }

  return {
    plan: "plus",
    billingCycle: data.billing_cycle as BillingCycle | null,
    currentPeriodEnd: data.current_period_end as string | null,
    cancelAtPeriodEnd: Boolean(data.cancel_at_period_end),
  };
}
