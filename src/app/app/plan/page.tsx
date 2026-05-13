import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionInfo } from "@/lib/subscription";
import { PlanView } from "@/views/dashboard/PlanView";

export const metadata: Metadata = {
  title: "Planes",
  description: "Elige el plan de Rial que se adapta a ti",
};

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subscription = await getSubscriptionInfo(supabase, user.id);

  return <PlanView subscription={subscription} />;
}
