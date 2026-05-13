import { NextResponse, type NextRequest } from "next/server";
import type { AdminSupabaseClient } from "@/lib/supabase/admin";

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) {
    console.error("[admin] ADMIN_SECRET no configurado");
    return NextResponse.json(
      { error: "Admin no configurado" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function resolveTargetUserId(
  supabase: AdminSupabaseClient,
  body: { email?: string; user_id?: string },
): Promise<string | null> {
  if (body.user_id) return body.user_id;
  if (!body.email) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", body.email)
    .maybeSingle();

  if (error) {
    console.error("[admin] resolveTargetUserId failed", error);
    return null;
  }

  return (data?.id as string | undefined) ?? null;
}
