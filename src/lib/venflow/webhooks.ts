import type { AdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  PaymentFailedEvent,
  PaymentSuccessEvent,
  SubscriptionCancelledEvent,
  VenflowWebhookEvent,
} from "./types";

type BillingCycle = "monthly" | "quarterly" | "biannual" | "annual";

function isBillingCycle(value: unknown): value is BillingCycle {
  return (
    value === "monthly" ||
    value === "quarterly" ||
    value === "biannual" ||
    value === "annual"
  );
}

function computePeriodEnd(start: Date, billingCycle: BillingCycle): Date {
  const end = new Date(start);
  switch (billingCycle) {
    case "quarterly":
      end.setMonth(end.getMonth() + 3);
      break;
    case "biannual":
      end.setMonth(end.getMonth() + 6);
      break;
    case "annual":
      end.setFullYear(end.getFullYear() + 1);
      break;
    case "monthly":
      end.setMonth(end.getMonth() + 1);
      break;
  }
  return end;
}

async function resolveUserId(
  supabase: AdminSupabaseClient,
  event: VenflowWebhookEvent,
): Promise<string | null> {
  if (
    (event.eventType === "PAYMENT_SUCCESS_EVENT" ||
      event.eventType === "PAYMENT_FAILED_EVENT") &&
    event.session?.metadata
  ) {
    const metaUserId = event.session.metadata.user_id;
    if (typeof metaUserId === "string" && metaUserId.length > 0) {
      return metaUserId;
    }
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  return (data?.user_id as string | undefined) ?? null;
}

async function getPlusPlanId(
  supabase: AdminSupabaseClient,
): Promise<string | null> {
  const { data } = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("name", "plus")
    .maybeSingle();
  return (data?.id as string | undefined) ?? null;
}

export async function handlePaymentSuccess(
  event: PaymentSuccessEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const userId = await resolveUserId(supabase, event);
  if (!userId) {
    console.warn("[venflow] PAYMENT_SUCCESS_EVENT: usuario no resuelto", {
      client_id: event.client.id,
      session_id: event.session?.id,
    });
    return;
  }

  const plusPlanId = await getPlusPlanId(supabase);
  if (!plusPlanId) {
    console.error("[venflow] PAYMENT_SUCCESS_EVENT: plan 'plus' no existe");
    return;
  }

  const metaCycle = event.session?.metadata?.billing_cycle;
  const billingCycle: BillingCycle = isBillingCycle(metaCycle)
    ? metaCycle
    : "monthly";

  const now = new Date();
  const periodEnd = computePeriodEnd(now, billingCycle);

  const { data: upsertedSub, error: subErr } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: plusPlanId,
        status: "active",
        billing_cycle: billingCycle,
        provider: "venflow",
        provider_customer_id: event.client.id,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancelled_at: null,
        cancel_at_period_end: false,
        metadata: {
          last_payment_id: event.payment.id,
          last_session_id: event.session?.id ?? null,
          gateway_uuid: event.payment.gatewayUUID,
        },
      },
      { onConflict: "provider,provider_customer_id" },
    )
    .select("id")
    .single();

  if (subErr || !upsertedSub) {
    console.error("[venflow] Failed to upsert subscription", subErr);
    throw subErr ?? new Error("subscription upsert returned no row");
  }

  const { error: payErr } = await supabase
    .from("subscription_payments")
    .upsert(
      {
        subscription_id: upsertedSub.id,
        user_id: userId,
        amount: event.payment.amount,
        currency: "USD",
        status: "paid",
        provider: "venflow",
        provider_payment_id: event.payment.id,
        paid_at: now.toISOString(),
        metadata: {
          gateway_uuid: event.payment.gatewayUUID,
          retries: event.payment.retries,
          session_id: event.session?.id ?? null,
        },
      },
      { onConflict: "provider,provider_payment_id" },
    );

  if (payErr) {
    console.error("[venflow] Failed to upsert payment", payErr);
    throw payErr;
  }

  const { error: userErr } = await supabase
    .from("users")
    .update({
      subscription_plan: "plus",
      subscription_status: "active",
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq("id", userId);

  if (userErr) {
    console.error("[venflow] Failed to update user plan", userErr);
    throw userErr;
  }
}

export async function handleSubscriptionCancelled(
  event: SubscriptionCancelledEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const userId = await resolveUserId(supabase, event);
  if (!userId) {
    console.warn(
      "[venflow] SUBSCRIPTION_CANCELLED_EVENT: usuario no resuelto",
      { client_id: event.client.id },
    );
    return;
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      cancelled_at: now,
      cancel_at_period_end: true,
      metadata: {
        cancellation_reason_type: event.subscription.cancellationReason.type,
        cancellation_reason_message:
          event.subscription.cancellationReason.message ?? null,
        scheduled_date:
          event.subscription.cancellationReason.scheduledDate ?? null,
      },
    })
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id);

  if (error) {
    console.error("[venflow] Failed to mark subscription cancelled", error);
    throw error;
  }
}

export async function handlePaymentFailed(
  event: PaymentFailedEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const userId = await resolveUserId(supabase, event);

  console.warn("[venflow] PAYMENT_FAILED_EVENT", {
    user_id: userId,
    client_id: event.client.id,
    payment_id: event.payment.id,
    retries: event.payment.retries,
    error: event.payment.errorMessage,
  });

  if (!userId) return;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  if (!sub?.id) return;

  await supabase.from("subscription_payments").upsert(
    {
      subscription_id: sub.id,
      user_id: userId,
      amount: event.payment.amount,
      currency: "USD",
      status: "failed",
      provider: "venflow",
      provider_payment_id: event.payment.id,
      metadata: {
        gateway_uuid: event.payment.gatewayUUID,
        retries: event.payment.retries,
        error_message: event.payment.errorMessage,
        session_id: event.session?.id ?? null,
      },
    },
    { onConflict: "provider,provider_payment_id" },
  );
}
