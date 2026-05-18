import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .eq("provider", "stripe")
    .maybeSingle();

  const customerId =
    (subRow?.provider_customer_id as string | null | undefined) ?? null;

  if (!customerId) {
    return NextResponse.json(
      { error: "No tienes una suscripción de Stripe activa" },
      { status: 404 },
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await getStripeClient().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/app`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error", err);
    const message =
      err instanceof Error ? err.message : "No pudimos abrir el portal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
