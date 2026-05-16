import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClienteDetail } from "@/lib/admin/clientes";
import { ClienteDetailView } from "@/views/admin/ClienteDetailView";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const admin = createAdminClient();
  const detail = await getClienteDetail(admin, id);
  const title = detail?.user.fullName?.trim() || detail?.user.email || "Cliente";
  return { title: `${title} · Admin` };
}

export default async function AdminClienteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const admin = createAdminClient();
  const detail = await getClienteDetail(admin, id);
  if (!detail) notFound();
  return <ClienteDetailView detail={detail} />;
}
