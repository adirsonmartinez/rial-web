import type { SupabaseClient } from "@supabase/supabase-js";

export type UserRole = "admin" | "customer" | string;

export function isAdminRole(
  role: UserRole | null | undefined,
): boolean {
  return role === "admin";
}

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[admin] getUserRole failed", error.message);
    return null;
  }

  return (data?.user_type as UserRole | undefined) ?? null;
}
