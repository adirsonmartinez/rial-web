import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import {
  getStripeBillingCycle,
  getStripePriceId,
  isStripeCadenceAvailable,
} from "@/lib/stripe/plans";
import { allCadences, type Cadence } from "@/lib/venflow/plans";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud inválido" },
      { status: 400 },
    );
  }

  const cadence = (body as { cadence?: string } | null)?.cadence;
  if (!cadence || !allCadences.includes(cadence as Cadence)) {
    return NextResponse.json({ error: "Cadencia inválida" }, { status: 400 });
  }

  if (!isStripeCadenceAvailable(cadence as Cadence)) {
    return NextResponse.json(
      { error: "Esta cadencia aún no está disponible en Stripe" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const origin = new URL(request.url).origin;
  const stripe = getStripeClient();

  try {
    // 1. Reuse customer if the user already completed a Stripe checkout
    const { data: existing } = await admin
      .from("subscriptions")
      .select("provider_customer_id")
      .eq("user_id", user.id)
      .eq("provider", "stripe")
      .maybeSingle();

    let customerId =
      (existing?.provider_customer_id as string | null | undefined) ?? null;

    // 2. Else: look in Stripe for an orphan customer (previous abandoned
    //    checkout) by email + metadata.user_id to avoid creating duplicates.
    if (!customerId && user.email) {
      const found = await stripe.customers.list({
        email: user.email,
        limit: 10,
      });
      const match = found.data.find(
        (c) => c.metadata?.user_id === user.id && !c.deleted,
      );
      if (match) customerId = match.id;
    }

    // 3. Otherwise create a fresh one.
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          price: getStripePriceId(cadence as Cadence),
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/app/checkout/result?status=success`,
      cancel_url: `${origin}/app/checkout/result?status=cancelled`,
      subscription_data: {
        metadata: {
          user_id: user.id,
          cadence,
          billing_cycle: getStripeBillingCycle(cadence as Cadence),
        },
      },
      metadata: {
        user_id: user.id,
        cadence,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe no devolvió URL de checkout" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (err) {
    console.error("Stripe checkout error", err);
    const message =
      err instanceof Error ? err.message : "No pudimos iniciar el checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
