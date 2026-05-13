import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    console.error("[cron expire-subscriptions] CRON_SECRET no configurado");
    return NextResponse.json(
      { error: "Cron no configurado" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: expiredSubs, error: queryErr } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("provider", "venflow")
    .eq("status", "active")
    .eq("cancel_at_period_end", true)
    .lte("current_period_end", nowIso);

  if (queryErr) {
    console.error("[cron expire-subscriptions] query failed", queryErr);
    return NextResponse.json(
      { error: "query_failed", message: queryErr.message },
      { status: 500 },
    );
  }

  if (!expiredSubs || expiredSubs.length === 0) {
    return NextResponse.json({ expired: 0 });
  }

  const subIds = expiredSubs.map((s) => s.id as string);
  const userIds = expiredSubs.map((s) => s.user_id as string);

  const { error: subUpdateErr } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .in("id", subIds);

  if (subUpdateErr) {
    console.error(
      "[cron expire-subscriptions] subscriptions update failed",
      subUpdateErr,
    );
    return NextResponse.json(
      { error: "subscriptions_update_failed", message: subUpdateErr.message },
      { status: 500 },
    );
  }

  const { error: userUpdateErr } = await supabase
    .from("users")
    .update({
      subscription_status: "cancelled",
      subscription_plan: "free",
      subscription_expires_at: null,
    })
    .in("id", userIds);

  if (userUpdateErr) {
    console.error(
      "[cron expire-subscriptions] users update failed",
      userUpdateErr,
    );
    return NextResponse.json(
      { error: "users_update_failed", message: userUpdateErr.message },
      { status: 500 },
    );
  }

  console.log(
    "[cron expire-subscriptions] expired",
    expiredSubs.length,
    "subscriptions",
  );

  return NextResponse.json({ expired: expiredSubs.length });
}
