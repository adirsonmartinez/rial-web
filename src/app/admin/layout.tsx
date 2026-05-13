import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, isAdminRole } from "@/lib/admin";
import { AdminShell } from "@/views/admin/AdminShell";

export default async function AdminLayout({
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

  const role = await getUserRole(supabase, user.id);
  if (!isAdminRole(role)) {
    redirect("/app");
  }

  const email = user.email ?? "";
  const metadataName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const displayName = metadataName || email.split("@")[0] || "Admin";

  return (
    <AdminShell userEmail={email} userName={displayName}>
      {children}
    </AdminShell>
  );
}
