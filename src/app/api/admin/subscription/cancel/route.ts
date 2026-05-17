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

  // Read existing metadata so we merge instead of overwriting
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("metadata")
    .eq("user_id", userId)
    .eq("provider", "venflow")
    .eq("status", "active")
    .maybeSingle();

  const existingMetadata =
    (existing?.metadata as Record<string, unknown> | null) ?? {};

  const { data: sub, error: subErr } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      cancelled_at: nowIso,
      metadata: {
        ...existingMetadata,
        admin_action: { type: "cancel", at: nowIso },
      },
    })
    .eq("user_id", userId)
    .eq("provider", "venflow")
    .eq("status", "active")
    .select("id, user_id, status, cancel_at_period_end, current_period_end")
    .maybeSingle();

  if (subErr) {
    console.error("[admin cancel] subscription update failed", subErr);
    return NextResponse.json(
      { error: "subscription_update_failed", message: subErr.message },
      { status: 500 },
    );
  }

  if (!sub) {
    return NextResponse.json(
      { error: "Suscripción activa no encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, subscription: sub });
}
