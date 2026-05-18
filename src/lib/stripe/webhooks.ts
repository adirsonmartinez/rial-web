import type Stripe from "stripe";
import type { AdminSupabaseClient } from "@/lib/supabase/admin";
import { getStripeClient } from "./client";
import { getCadenceFromPriceId, getStripeBillingCycle } from "./plans";

type DbCycle = "monthly" | "quarterly" | "semiannual" | "yearly";

function unixToIso(seconds: number | null | undefined): string | null {
  if (seconds === null || seconds === undefined) return null;
  return new Date(seconds * 1000).toISOString();
}

function nowIso(): string {
  return new Date().toISOString();
}

function inferBillingCycle(
  sub: Stripe.Subscription,
): DbCycle {
  const priceId =
    typeof sub.items.data[0]?.price === "string"
      ? sub.items.data[0]?.price
      : sub.items.data[0]?.price.id;
  const cadence = priceId ? getCadenceFromPriceId(priceId) : null;
  return (cadence ? getStripeBillingCycle(cadence) : "monthly") as DbCycle;
}

function inferPriceId(sub: Stripe.Subscription): string | null {
  const first = sub.items.data[0];
  if (!first) return null;
  return typeof first.price === "string" ? first.price : first.price.id;
}

function getPeriodEnd(sub: Stripe.Subscription): number | null {
  const item = sub.items.data[0];
  return item?.current_period_end ?? null;
}

function getPeriodStart(sub: Stripe.Subscription): number | null {
  const item = sub.items.data[0];
  return item?.current_period_start ?? null;
}

function mapStatus(
  status: Stripe.Subscription.Status,
): "active" | "trialing" | "past_due" | "cancelled" | "expired" | "paused" {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "paused":
      return status;
    case "canceled":
      return "cancelled";
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
      return "past_due";
    default:
      return "expired";
  }
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

async function resolveUserIdFromCustomer(
  supabase: AdminSupabaseClient,
  customerId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .maybeSingle();

  if (data?.user_id) return data.user_id as string;

  // Fallback: ask Stripe for the customer's metadata.user_id (set at creation)
  try {
    const customer = await getStripeClient().customers.retrieve(customerId);
    if (!customer.deleted) {
      const metaUserId = customer.metadata?.user_id;
      if (typeof metaUserId === "string" && metaUserId.length > 0) {
        return metaUserId;
      }
    }
  } catch (err) {
    console.warn("[stripe] customer retrieve failed", err);
  }
  return null;
}

export async function handleCheckoutSessionCompleted(
  event: Stripe.CheckoutSessionCompletedEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const session = event.data.object;

  if (session.mode !== "subscription" || !session.subscription) {
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  if (!customerId || !subscriptionId) {
    console.warn(
      "[stripe] checkout.session.completed: missing customer/subscription",
      { session_id: session.id },
    );
    return;
  }

  const userId =
    (typeof session.client_reference_id === "string" &&
      session.client_reference_id) ||
    (typeof session.metadata?.user_id === "string" &&
      session.metadata.user_id) ||
    (await resolveUserIdFromCustomer(supabase, customerId));

  if (!userId) {
    console.warn("[stripe] checkout.session.completed: user_id no resuelto", {
      session_id: session.id,
      customer_id: customerId,
    });
    return;
  }

  const plusPlanId = await getPlusPlanId(supabase);
  if (!plusPlanId) {
    console.error("[stripe] plan 'plus' no existe en subscription_plans");
    return;
  }

  const sub = await getStripeClient().subscriptions.retrieve(subscriptionId);
  const billingCycle = inferBillingCycle(sub);
  const priceId = inferPriceId(sub);
  const status = mapStatus(sub.status);
  const startIso = unixToIso(sub.start_date) ?? nowIso();
  const periodStartIso = unixToIso(getPeriodStart(sub)) ?? nowIso();
  const periodEndIso = unixToIso(getPeriodEnd(sub));

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, started_at, metadata")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .maybeSingle();

  const startedAt =
    (existing?.started_at as string | null | undefined) ?? startIso;
  const existingMetadata =
    (existing?.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: plusPlanId,
        status,
        billing_cycle: billingCycle,
        provider: "stripe",
        provider_customer_id: customerId,
        provider_subscription_id: subscriptionId,
        provider_product_id: priceId,
        started_at: startedAt,
        current_period_start: periodStartIso,
        current_period_end: periodEndIso,
        expires_at: periodEndIso,
        cancel_at_period_end: Boolean(sub.cancel_at_period_end),
        cancelled_at: unixToIso(sub.canceled_at),
        metadata: {
          ...existingMetadata,
          source: "stripe",
          checkout_session_id: session.id,
          last_event_id: event.id,
        },
      },
      { onConflict: "provider,provider_customer_id" },
    );

  if (error) {
    console.error("[stripe] checkout.session.completed upsert failed", error);
    throw error;
  }

  // Record the first payment here (instead of waiting for invoice.paid)
  // because Stripe may deliver invoice.paid BEFORE this handler finishes,
  // causing the invoice.paid handler to skip with a "subscription not found"
  // warning. Doing it here guarantees the payment is recorded.
  const invoiceId =
    typeof session.invoice === "string"
      ? session.invoice
      : session.invoice?.id;
  if (invoiceId) {
    try {
      const invoice = await getStripeClient().invoices.retrieve(invoiceId);
      await insertPaymentRowIfMissing(
        supabase,
        userId,
        customerId,
        invoice,
        event.id,
      );
    } catch (err) {
      console.warn(
        "[stripe] failed to record initial invoice payment",
        err,
      );
    }
  }
}

async function insertPaymentRowIfMissing(
  supabase: AdminSupabaseClient,
  userId: string,
  customerId: string,
  invoice: Stripe.Invoice,
  eventId: string,
): Promise<void> {
  // Idempotency: skip if we already recorded this invoice.
  const { data: existingPayment } = await supabase
    .from("subscription_payments")
    .select("id")
    .eq("provider", "stripe")
    .eq("provider_invoice_id", invoice.id)
    .maybeSingle();
  if (existingPayment) return;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .maybeSingle();
  if (!sub) return;

  const amount = (invoice.amount_paid ?? 0) / 100;
  const currency = (invoice.currency ?? "usd").toUpperCase();

  const { error } = await supabase.from("subscription_payments").insert({
    subscription_id: sub.id as string,
    user_id: userId,
    amount,
    currency,
    status: "succeeded",
    provider: "stripe",
    provider_payment_id: invoice.id,
    provider_invoice_id: invoice.id,
    paid_at:
      unixToIso(invoice.status_transitions?.paid_at) ?? nowIso(),
    metadata: {
      hosted_invoice_url: invoice.hosted_invoice_url,
      number: invoice.number,
      last_event_id: eventId,
    },
  });

  if (error) {
    console.error("[stripe] subscription_payments insert failed", error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const sub = event.data.object;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  if (!customerId) return;

  const status = mapStatus(sub.status);
  const billingCycle = inferBillingCycle(sub);
  const priceId = inferPriceId(sub);
  const periodEndIso = unixToIso(getPeriodEnd(sub));

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, metadata")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .maybeSingle();

  if (!existing) {
    console.warn(
      "[stripe] customer.subscription.updated: subscription not found",
      { customer_id: customerId, subscription_id: sub.id },
    );
    return;
  }

  const existingMetadata =
    (existing.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status,
      billing_cycle: billingCycle,
      provider_subscription_id: sub.id,
      provider_product_id: priceId,
      current_period_start: unixToIso(getPeriodStart(sub)),
      current_period_end: periodEndIso,
      expires_at: periodEndIso,
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      cancelled_at: unixToIso(sub.canceled_at),
      metadata: {
        ...existingMetadata,
        last_event_id: event.id,
      },
    })
    .eq("id", existing.id as string);

  if (error) {
    console.error("[stripe] customer.subscription.updated update failed", error);
    throw error;
  }
}

export async function handleSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const sub = event.data.object;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  if (!customerId) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "expired",
      cancelled_at: unixToIso(sub.canceled_at) ?? nowIso(),
      cancel_at_period_end: false,
    })
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId);

  if (error) {
    console.error("[stripe] customer.subscription.deleted update failed", error);
    throw error;
  }
}

export async function handleInvoicePaid(
  event: Stripe.InvoicePaidEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const invoice = event.data.object;
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .maybeSingle();

  // If the subscription row doesn't exist yet (race with
  // checkout.session.completed), skip. The session handler will record the
  // first invoice payment itself, and subsequent renewals will re-fire
  // invoice.paid with the row already in place.
  if (!existing) {
    console.warn(
      "[stripe] invoice.paid: subscription not found yet, will be recorded by session handler",
      { customer_id: customerId, invoice_id: invoice.id },
    );
    return;
  }

  await insertPaymentRowIfMissing(
    supabase,
    existing.user_id as string,
    customerId,
    invoice,
    event.id,
  );
}

export async function handleInvoicePaymentFailed(
  event: Stripe.InvoicePaymentFailedEvent,
  supabase: AdminSupabaseClient,
): Promise<void> {
  const invoice = event.data.object;
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId);

  if (error) {
    console.error("[stripe] invoice.payment_failed update failed", error);
    throw error;
  }
}
