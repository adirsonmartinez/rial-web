import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CLIENTES_PAGE_SIZE,
  getClientesCycleCounts,
  listClientes,
} from "@/lib/admin/clientes";
import { ClientesView } from "@/views/admin/ClientesView";

export const metadata: Metadata = {
  title: "Clientes · Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const admin = createAdminClient();
  const [initialData, cycleCounts] = await Promise.all([
    listClientes(admin, { page: 1, pageSize: CLIENTES_PAGE_SIZE }),
    getClientesCycleCounts(admin),
  ]);

  return <ClientesView initialData={initialData} cycleCounts={cycleCounts} />;
}
