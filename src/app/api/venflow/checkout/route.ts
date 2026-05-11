import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createCheckoutSession,
  VenflowApiError,
} from "@/lib/venflow/client";
import {
  allCadences,
  getBillingCycle,
  getVenflowPlanId,
  isCadenceAvailable,
  type Cadence,
} from "@/lib/venflow/plans";

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
    return NextResponse.json(
      { error: "Cadencia inválida" },
      { status: 400 },
    );
  }

  if (!isCadenceAvailable(cadence as Cadence)) {
    return NextResponse.json(
      { error: "Esta cadencia aún no está disponible" },
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

  const origin = new URL(request.url).origin;

  try {
    const session = await createCheckoutSession({
      plan: getVenflowPlanId(cadence as Cadence),
      redirect_url: `${origin}/app/checkout/result`,
      metadata: {
        user_id: user.id,
        cadence,
        billing_cycle: getBillingCycle(cadence as Cadence),
        email: user.email ?? null,
      },
    });

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
    });
  } catch (err) {
    if (err instanceof VenflowApiError) {
      console.error("Venflow checkout error", err.status, err.body);
      return NextResponse.json(
        { error: err.message },
        { status: err.status >= 500 ? 502 : err.status },
      );
    }
    console.error("Unexpected error creating Venflow session", err);
    return NextResponse.json(
      { error: "No pudimos iniciar el checkout" },
      { status: 500 },
    );
  }
}
