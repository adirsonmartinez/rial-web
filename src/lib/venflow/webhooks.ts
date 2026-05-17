import type { AdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  PaymentFailedEvent,
  PaymentSuccessEvent,
  SubscriptionCancelledEvent,
  VenflowWebhookEvent,
} from "./types";

// Venflow uses: monthly | quarterly | biannual | annual
// Supabase uses: monthly | quarterly | semiannual | yearly | lifetime
type VenflowCycle = "monthly" | "quarterly" | "biannual" | "annual";
type DbCycle = "monthly" | "quarterly" | "semiannual" | "yearly";

function isVenflowCycle(value: unknown): value is VenflowCycle {
  return (
    value === "monthly" ||
    value === "quarterly" ||
    value === "biannual" ||
    value === "annual"
  );
}

function toDbCycle(cycle: VenflowCycle): DbCycle {
  switch (cycle) {
    case "biannual":
      return "semiannual";
    case "annual":
      return "yearly";
    case "monthly":
    case "quarterly":
      return cycle;
  }
}

function computePeriodEnd(start: Date, cycle: VenflowCycle): Date {
  const end = new Date(start);
  switch (cycle) {
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

  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  if (error) {
    throw new Error(`resolveUserId fallback query failed: ${error.message}`);
  }
  return (data?.user_id as string | undefined) ?? null;
}

async function getPlusPlanId(
  supabase: AdminSupabaseClient,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("name", "plus")
    .maybeSingle();
  if (error) {
    throw new Error(`getPlusPlanId query failed: ${error.message}`);
  }
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
  const venflowCycle: VenflowCycle = isVenflowCycle(metaCycle)
    ? metaCycle
    : "monthly";
  const dbCycle = toDbCycle(venflowCycle);

  const now = new Date();
  const periodEnd = computePeriodEnd(now, venflowCycle);

  // Read existing row to preserve started_at and merge metadata
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("started_at, metadata")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  const existingMetadata =
    (existing?.metadata as Record<string, unknown> | null) ?? {};
  const startedAt =
    (existing?.started_at as string | null) ?? now.toISOString();

  const { data: upsertedSub, error: subErr } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: plusPlanId,
        status: "active",
        billing_cycle: dbCycle,
        provider: "venflow",
        provider_customer_id: event.client.id,
        started_at: startedAt,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        expires_at: periodEnd.toISOString(),
        cancelled_at: null,
        cancel_at_period_end: false,
        metadata: {
          ...existingMetadata,
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
        amount: Number(event.payment.amount),
        currency: "VES",
        status: "succeeded",
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

  // users.subscription_* is owned by the sync_user_subscription trigger
  // — no manual write here per docs/subscriptions-architecture.md
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

  // Read existing metadata so we merge instead of overwriting
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("metadata")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  const existingMetadata =
    (existing?.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("subscriptions")
    .update({
      cancelled_at: now,
      cancel_at_period_end: true,
      metadata: {
        ...existingMetadata,
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
      amount: Number(event.payment.amount),
      currency: "VES",
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
