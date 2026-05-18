import type Stripe from "stripe";

export type StripeEventName =
  | "checkout.session.completed"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.paid"
  | "invoice.payment_failed";

export const HANDLED_STRIPE_EVENTS: ReadonlySet<StripeEventName> = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

export type StripeSubscriptionLike = Stripe.Subscription;
export type StripeCheckoutSessionLike = Stripe.Checkout.Session;
export type StripeInvoiceLike = Stripe.Invoice;
