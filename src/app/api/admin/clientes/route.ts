import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole, isAdminRole } from "@/lib/admin";
import {
  CLIENTES_PAGE_SIZE,
  listClientes,
  type ClienteBillingCycleFilter,
  type ClienteProviderFilter,
  type ClienteStatus,
} from "@/lib/admin/clientes";

const ALLOWED_STATUSES: ClienteStatus[] = [
  "all",
  "active",
  "expired",
  "cancelled",
];
const ALLOWED_CYCLES: ClienteBillingCycleFilter[] = [
  "all",
  "monthly",
  "quarterly",
  "semiannual",
  "yearly",
];
const ALLOWED_PROVIDERS: ClienteProviderFilter[] = [
  "all",
  "google",
  "apple",
  "venflow",
  "stripe",
  "manual",
];

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const rawCycle = (searchParams.get("cycle") ??
    "all") as ClienteBillingCycleFilter;
  const rawStatus = (searchParams.get("status") ?? "all") as ClienteStatus;
  const rawProvider = (searchParams.get("provider") ??
    "all") as ClienteProviderFilter;
  const billingCycle = ALLOWED_CYCLES.includes(rawCycle) ? rawCycle : "all";
  const status = ALLOWED_STATUSES.includes(rawStatus) ? rawStatus : "all";
  const provider = ALLOWED_PROVIDERS.includes(rawProvider)
    ? rawProvider
    : "all";
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  try {
    const admin = createAdminClient();
    const result = await listClientes(admin, {
      search,
      billingCycle,
      status,
      provider,
      page,
      pageSize: CLIENTES_PAGE_SIZE,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
