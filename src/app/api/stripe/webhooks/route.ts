import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "@/lib/stripe/webhooks";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET no configurado");
    return NextResponse.json(
      { error: "Webhook no configurado" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Falta header stripe-signature" },
      { status: 400 },
    );
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] signature verification failed", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event, supabase);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event, supabase);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event, supabase);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event, supabase);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event, supabase);
        break;
      default:
        console.log("[stripe webhook] unhandled event type:", event.type);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] error processing", event.type, err);
    return NextResponse.json(
      { received: true, error: "processing_failed", message },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
