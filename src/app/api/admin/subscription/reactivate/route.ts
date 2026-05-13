import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveTargetUserId, requireAdminAuth } from "../_helpers";

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminAuth(request);
  if (unauthorized) return unauthorized;

  let body: { email?: string; user_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const userId = await resolveTargetUserId(supabase, body);
  if (!userId) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const nowIso = new Date().toISOString();

  const { data: sub, error: subErr } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: false,
      cancelled_at: null,
      status: "active",
      metadata: {
        admin_action: { type: "reactivate", at: nowIso },
      },
    })
    .eq("user_id", userId)
    .eq("provider", "venflow")
    .select("id, user_id, status, cancel_at_period_end, current_period_end")
    .maybeSingle();

  if (subErr) {
    console.error("[admin reactivate] subscription update failed", subErr);
    return NextResponse.json(
      { error: "subscription_update_failed", message: subErr.message },
      { status: 500 },
    );
  }

  if (!sub) {
    return NextResponse.json(
      { error: "Suscripción no encontrada" },
      { status: 404 },
    );
  }

  const { error: userErr } = await supabase
    .from("users")
    .update({
      subscription_status: "active",
      subscription_plan: "plus",
      subscription_expires_at: sub.current_period_end as string | null,
    })
    .eq("id", userId);

  if (userErr) {
    console.error("[admin reactivate] users update failed", userErr);
    return NextResponse.json(
      { error: "users_update_failed", message: userErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, subscription: sub });
}
