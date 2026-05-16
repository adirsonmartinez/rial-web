import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole, isAdminRole } from "@/lib/admin";

const ALLOWED_CYCLES = [
  "monthly",
  "quarterly",
  "semiannual",
  "yearly",
] as const;
type BillingCycle = (typeof ALLOWED_CYCLES)[number];

type PatchBody = {
  subscriptionId?: string;
  planId?: string;
  billingCycle?: BillingCycle;
  cancelAtPeriodEnd?: boolean;
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: userId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = await getUserRole(supabase, user.id);
  if (!isAdminRole(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.subscriptionId) {
    return NextResponse.json(
      { error: "subscriptionId requerido" },
      { status: 400 },
    );
  }

  const updates: Record<string, unknown> = {};
  if (body.planId) updates.plan_id = body.planId;
  if (body.billingCycle) {
    if (!ALLOWED_CYCLES.includes(body.billingCycle)) {
      return NextResponse.json(
        { error: "billingCycle inválido" },
        { status: 400 },
      );
    }
    updates.billing_cycle = body.billingCycle;
  }
  const nowForCancel = new Date().toISOString();
  if (typeof body.cancelAtPeriodEnd === "boolean") {
    updates.cancel_at_period_end = body.cancelAtPeriodEnd;
    if (body.cancelAtPeriodEnd) {
      updates.cancelled_at = nowForCancel;
    } else {
      updates.cancelled_at = null;
      updates.status = "active";
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Sin cambios para aplicar" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  if (body.planId) {
    const { data: plan, error: planError } = await admin
      .from("subscription_plans")
      .select("id, name")
      .eq("id", body.planId)
      .maybeSingle();
    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }
    if (!plan || plan.name === "free") {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }
  }

  const nowIso = new Date().toISOString();
  const adminActionType =
    body.cancelAtPeriodEnd === true
      ? "cancel"
      : body.cancelAtPeriodEnd === false
        ? "reactivate"
        : "update_plan";
  const adminAction = {
    type: adminActionType,
    at: nowIso,
    actor: user.id,
    changes: {
      ...(body.planId ? { planId: body.planId } : {}),
      ...(body.billingCycle ? { billingCycle: body.billingCycle } : {}),
      ...(typeof body.cancelAtPeriodEnd === "boolean"
        ? { cancelAtPeriodEnd: body.cancelAtPeriodEnd }
        : {}),
    },
  };

  const { data: updated, error: updateError } = await admin
    .from("subscriptions")
    .update({ ...updates, metadata: { admin_action: adminAction } })
    .eq("id", body.subscriptionId)
    .eq("user_id", userId)
    .select(
      `
        id, user_id, status, billing_cycle, provider, current_period_end,
        cancel_at_period_end, started_at, created_at,
        plan:subscription_plans!inner(name, display_name)
      `,
    )
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json(
      { error: "Suscripción no encontrada" },
      { status: 404 },
    );
  }

  const updatedPlan = Array.isArray(updated.plan) ? updated.plan[0] : updated.plan;
  if (body.planId && updatedPlan?.name) {
    await admin
      .from("users")
      .update({ subscription_plan: updatedPlan.name })
      .eq("id", userId);
  }

  return NextResponse.json({ ok: true, subscription: updated });
}
