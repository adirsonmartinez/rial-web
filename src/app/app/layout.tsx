import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionInfo } from "@/lib/subscription";
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
  const displayName = metadataName || email.split("@")[0] || "Usuario";

  const subscription = await getSubscriptionInfo(supabase, user.id);

  return (
    <DashboardShell
      userEmail={email}
      userName={displayName}
      subscription={subscription}
    >
      {children}
    </DashboardShell>
  );
}
