import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionInfo } from "@/lib/subscription";
import type { LoreleiAvatarOptions } from "@/lib/avatar";
import { DashboardShell } from "@/views/dashboard/DashboardShell";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const metadataName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);

  const [{ data: profile }, subscription] = await Promise.all([
    supabase
      .from("users")
      .select("full_name, avatar_url, avatar_options")
      .eq("id", user.id)
      .maybeSingle(),
    getSubscriptionInfo(supabase, user.id),
  ]);

  const displayName =
    (profile?.full_name as string | null | undefined) ||
    metadataName ||
    email.split("@")[0] ||
    "Usuario";

  const avatarUrl = (profile?.avatar_url as string | null | undefined) ?? null;
  const avatarOptions =
    (profile?.avatar_options as LoreleiAvatarOptions | null | undefined) ??
    null;

  return (
    <DashboardShell
      userEmail={email}
      userName={displayName}
      avatarUrl={avatarUrl}
      avatarOptions={avatarOptions}
      subscription={subscription}
    >
      {children}
    </DashboardShell>
  );
}
