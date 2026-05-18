import type { AdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  InvoiceCreateEvent,
  InvoiceUpdateEvent,
  PaymentFailedEvent,
  PaymentSuccessEvent,
  SubscriptionCancelledEvent,
  SubscriptionCreateEvent,
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

  // Read existing row to preserve started_at, merge metadata, and pull
  // the invoice ID stored by handleInvoiceCreate (if any)
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
  const pendingInvoiceId =
    typeof existingMetadata.last_invoice_id === "string"
      ? (existingMetadata.last_invoice_id as string)
      : null;

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
        provider_invoice_id: pendingInvoiceId,
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

  // Move the subscription to past_due if it was still active/trialing.
  // A subsequent PAYMENT_SUCCESS_EVENT will bring it back to active.
  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("id", sub.id)
    .in("status", ["active", "trialing"]);
}

export async function handleSubscriptionCreate(
  event: SubscriptionCreateEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, metadata")
    .eq("provider", "venflow")
    .eq("provider_customer_id", event.client.id)
    .maybeSingle();

  if (!existing) {
    // PAYMENT_SUCCESS_EVENT hasn't fired yet — the row will be created
    // there. Venflow may resend events out of order, so we skip and rely
    // on the next SUBSCRIPTION_CREATE_EVENT (or a backfill) to populate.
    console.warn(
      "[venflow] SUBSCRIPTION_CREATE_EVENT: subscription row not yet created",
      {
        client_id: event.client.id,
        subscription_id: event.subscription.id,
      },
    );
    return;
  }

  const existingMetadata =
    (existing.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("subscriptions")
    .update({
      provider_subscription_id: event.subscription.id,
      provider_product_id: event.subscription.externalId ?? null,
      metadata: {
        ...existingMetadata,
        subscription_external_id: event.subscription.externalId ?? null,
      },
    })
    .eq("id", existing.id as string);

  if (error) {
    console.error(
      "[venflow] SUBSCRIPTION_CREATE_EVENT: failed to update IDs",
      error,
    );
    throw error;
  }
}

async function storeInvoiceOnSubscription(
  supabase: AdminSupabaseClient,
  clientId: string,
  invoiceId: string,
  invoiceStatus: string,
  source: "INVOICE_CREATE_EVENT" | "INVOICE_UPDATE_EVENT",
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, metadata")
    .eq("provider", "venflow")
    .eq("provider_customer_id", clientId)
    .maybeSingle();

  if (!existing) {
    console.warn(`[venflow] ${source}: subscription not found`, {
      client_id: clientId,
      invoice_id: invoiceId,
    });
    return null;
  }

  const existingMetadata =
    (existing.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("subscriptions")
    .update({
      metadata: {
        ...existingMetadata,
        last_invoice_id: invoiceId,
        last_invoice_status: invoiceStatus,
      },
    })
    .eq("id", existing.id as string);

  if (error) {
    console.error(
      `[venflow] ${source}: failed to store invoice id on subscription`,
      error,
    );
    throw error;
  }

  return existing.id as string;
}

async function backfillPaymentInvoiceId(
  supabase: AdminSupabaseClient,
  subscriptionId: string,
  invoiceId: string,
): Promise<void> {
  // Back-fill the most recent payment for this subscription if it doesn't
  // already have a provider_invoice_id. Covers the case where INVOICE events
  // arrive before/after PAYMENT_SUCCESS_EVENT and out of order with each other.
  const { data: payments } = await supabase
    .from("subscription_payments")
    .select("id, provider_invoice_id")
    .eq("subscription_id", subscriptionId)
    .order("created_at", { ascending: false })
    .limit(1);

  const latest = payments?.[0];
  if (!latest || latest.provider_invoice_id) return;

  const { error } = await supabase
    .from("subscription_payments")
    .update({ provider_invoice_id: invoiceId })
    .eq("id", latest.id as string);

  if (error) {
    console.error(
      "[venflow] failed to back-fill provider_invoice_id on payment",
      error,
    );
    throw error;
  }
}

export async function handleInvoiceCreate(
  event: InvoiceCreateEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  await storeInvoiceOnSubscription(
    supabase,
    event.client.id,
    event.invoice.id,
    event.invoice.status,
    "INVOICE_CREATE_EVENT",
  );
}

export async function handleInvoiceUpdate(
  event: InvoiceUpdateEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const subscriptionId = await storeInvoiceOnSubscription(
    supabase,
    event.client.id,
    event.invoice.id,
    event.invoice.status,
    "INVOICE_UPDATE_EVENT",
  );

  // INVOICE_UPDATE typically fires AFTER PAYMENT_SUCCESS, so there's likely a
  // payment row that's missing provider_invoice_id (because the create event
  // arrived before the subscription existed). Back-fill it.
  if (subscriptionId) {
    await backfillPaymentInvoiceId(
      supabase,
      subscriptionId,
      event.invoice.id,
    );
  }
}
