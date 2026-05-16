import type { AdminSupabaseClient } from "@/lib/supabase/admin";

export type ClienteStatus = "all" | "active" | "expired" | "cancelled";
export type ClienteBillingCycleFilter =
  | "all"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "yearly";
export type ClienteProviderFilter =
  | "all"
  | "google"
  | "apple"
  | "venflow"
  | "stripe"
  | "manual";

export type ClienteRow = {
  subscriptionId: string;
  userId: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  planName: string;
  planDisplayName: string;
  status: string;
  billingCycle: string | null;
  provider: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  startedAt: string | null;
  createdAt: string | null;
};

export type ListClientesParams = {
  search?: string;
  billingCycle?: ClienteBillingCycleFilter;
  status?: ClienteStatus;
  provider?: ClienteProviderFilter;
  page?: number;
  pageSize?: number;
};

export type ListClientesResult = {
  rows: ClienteRow[];
  total: number;
  page: number;
  pageSize: number;
};

export const CLIENTES_PAGE_SIZE = 25;

export type ClientesCycleCounts = {
  monthly: number;
  quarterly: number;
  semiannual: number;
  yearly: number;
  total: number;
};

export async function getClientesCycleCounts(
  supabase: AdminSupabaseClient,
): Promise<ClientesCycleCounts> {
  const { data: plansData, error: plansError } = await supabase
    .from("subscription_plans")
    .select("id, name")
    .neq("name", "free");

  if (plansError) {
    throw new Error(`No se pudieron cargar los planes: ${plansError.message}`);
  }

  const paidPlanIds = ((plansData ?? []) as { id: string; name: string }[]).map(
    (p) => p.id,
  );

  const empty: ClientesCycleCounts = {
    monthly: 0,
    quarterly: 0,
    semiannual: 0,
    yearly: 0,
    total: 0,
  };

  if (paidPlanIds.length === 0) return empty;

  const cycles: Array<keyof Omit<ClientesCycleCounts, "total">> = [
    "monthly",
    "quarterly",
    "semiannual",
    "yearly",
  ];

  const counts = await Promise.all(
    cycles.map(async (cycle) => {
      const { count, error } = await supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .in("plan_id", paidPlanIds)
        .eq("billing_cycle", cycle);
      if (error) {
        throw new Error(
          `Error al contar suscripciones ${cycle}: ${error.message}`,
        );
      }
      return [cycle, count ?? 0] as const;
    }),
  );

  const result: ClientesCycleCounts = { ...empty };
  for (const [cycle, value] of counts) {
    result[cycle] = value;
    result.total += value;
  }
  return result;
}

type PlanRow = { id: string; name: string };
type EmbeddedPlan = { name: string; display_name: string | null };
type EmbeddedUser = {
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};
type SubscriptionRow = {
  id: string;
  user_id: string;
  status: string;
  billing_cycle: string | null;
  provider: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  started_at: string | null;
  created_at: string | null;
  plan: EmbeddedPlan | EmbeddedPlan[] | null;
  user: EmbeddedUser | EmbeddedUser[] | null;
};

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

export async function listClientes(
  supabase: AdminSupabaseClient,
  params: ListClientesParams = {},
): Promise<ListClientesResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? CLIENTES_PAGE_SIZE;
  const search = (params.search ?? "").trim();
  const billingCycle = params.billingCycle ?? "all";
  const status = params.status ?? "all";
  const provider = params.provider ?? "all";

  const { data: plansData, error: plansError } = await supabase
    .from("subscription_plans")
    .select("id, name")
    .neq("name", "free");

  if (plansError) {
    throw new Error(`No se pudieron cargar los planes: ${plansError.message}`);
  }

  const allowedPlanIds = ((plansData ?? []) as PlanRow[]).map((p) => p.id);
  if (allowedPlanIds.length === 0) {
    return { rows: [], total: 0, page, pageSize };
  }

  let matchingUserIds: string[] | null = null;
  if (search) {
    const safe = search.replace(/[%_,()]/g, "");
    if (safe.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id")
        .or(`email.ilike.%${safe}%,full_name.ilike.%${safe}%`)
        .limit(500);

      if (usersError) {
        throw new Error(`Error en búsqueda: ${usersError.message}`);
      }

      matchingUserIds = ((usersData ?? []) as { id: string }[]).map((u) => u.id);
      if (matchingUserIds.length === 0) {
        return { rows: [], total: 0, page, pageSize };
      }
    }
  }

  let query = supabase
    .from("subscriptions")
    .select(
      `
        id, user_id, status, billing_cycle, provider, current_period_end,
        cancel_at_period_end, started_at, created_at,
        plan:subscription_plans!inner(name, display_name),
        user:users(email, full_name, avatar_url)
      `,
      { count: "exact" },
    )
    .in("plan_id", allowedPlanIds)
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (billingCycle !== "all") {
    query = query.eq("billing_cycle", billingCycle);
  }
  if (provider !== "all") {
    query = query.eq("provider", provider);
  }
  if (matchingUserIds) {
    query = query.in("user_id", matchingUserIds);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw new Error(`Error al listar clientes: ${error.message}`);
  }

  const rows: ClienteRow[] = ((data ?? []) as unknown as SubscriptionRow[]).map(
    (row) => {
      const plan = pickOne(row.plan);
      const userRow = pickOne(row.user);
      return {
        subscriptionId: row.id,
        userId: row.user_id,
        email: userRow?.email ?? null,
        fullName: userRow?.full_name ?? null,
        avatarUrl: userRow?.avatar_url ?? null,
        planName: plan?.name ?? "",
        planDisplayName: plan?.display_name ?? plan?.name ?? "",
        status: row.status,
        billingCycle: row.billing_cycle,
        provider: row.provider,
        currentPeriodEnd: row.current_period_end,
        cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
        startedAt: row.started_at,
        createdAt: row.created_at,
      };
    },
  );

  return { rows, total: count ?? 0, page, pageSize };
}

export type AdminUserSummary = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  createdAt: string | null;
  userType: string;
};

export type PaidPlanOption = {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
};

export type PaymentRow = {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string | null;
  status: string;
  provider: string | null;
  providerPaymentId: string | null;
  providerInvoiceId: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string | null;
};

export type ClienteDetail = {
  user: AdminUserSummary;
  subscriptions: ClienteRow[];
  payments: PaymentRow[];
  plans: PaidPlanOption[];
};

export async function getClienteDetail(
  supabase: AdminSupabaseClient,
  userId: string,
): Promise<ClienteDetail | null> {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select(
      "id, email, full_name, avatar_url, phone_code, phone_number, created_at, user_type",
    )
    .eq("id", userId)
    .maybeSingle();

  if (userError) {
    throw new Error(`Error al cargar usuario: ${userError.message}`);
  }
  if (!userData) return null;

  const { data: plansData, error: plansError } = await supabase
    .from("subscription_plans")
    .select("id, name, display_name, is_active, sort_order")
    .neq("name", "free")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (plansError) {
    throw new Error(`Error al cargar planes: ${plansError.message}`);
  }

  const plans: PaidPlanOption[] = (
    (plansData ?? []) as {
      id: string;
      name: string;
      display_name: string | null;
      is_active: boolean | null;
    }[]
  ).map((p) => ({
    id: p.id,
    name: p.name,
    displayName: p.display_name ?? p.name,
    isActive: Boolean(p.is_active),
  }));

  const paidPlanIds = plans.map((p) => p.id);
  let subscriptions: ClienteRow[] = [];
  if (paidPlanIds.length > 0) {
    const { data: subsData, error: subsError } = await supabase
      .from("subscriptions")
      .select(
        `
          id, user_id, status, billing_cycle, provider, current_period_end,
          cancel_at_period_end, started_at, created_at,
          plan:subscription_plans!inner(name, display_name)
        `,
      )
      .eq("user_id", userId)
      .in("plan_id", paidPlanIds)
      .order("created_at", { ascending: false });

    if (subsError) {
      throw new Error(`Error al cargar suscripciones: ${subsError.message}`);
    }

    subscriptions = ((subsData ?? []) as unknown as SubscriptionRow[]).map(
      (row) => {
        const plan = pickOne(row.plan);
        return {
          subscriptionId: row.id,
          userId: row.user_id,
          email: userData.email as string | null,
          fullName: userData.full_name as string | null,
          avatarUrl: userData.avatar_url as string | null,
          planName: plan?.name ?? "",
          planDisplayName: plan?.display_name ?? plan?.name ?? "",
          status: row.status,
          billingCycle: row.billing_cycle,
          provider: row.provider,
          currentPeriodEnd: row.current_period_end,
          cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
          startedAt: row.started_at,
          createdAt: row.created_at,
        };
      },
    );
  }

  const user: AdminUserSummary = {
    id: userData.id as string,
    email: (userData.email as string | null) ?? null,
    fullName: (userData.full_name as string | null) ?? null,
    avatarUrl: (userData.avatar_url as string | null) ?? null,
    phoneCode: (userData.phone_code as string | null) ?? null,
    phoneNumber: (userData.phone_number as string | null) ?? null,
    createdAt: (userData.created_at as string | null) ?? null,
    userType: (userData.user_type as string) ?? "customer",
  };

  const { data: paymentsData, error: paymentsError } = await supabase
    .from("subscription_payments")
    .select(
      "id, subscription_id, amount, currency, status, provider, provider_payment_id, provider_invoice_id, paid_at, refunded_at, created_at",
    )
    .eq("user_id", userId)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (paymentsError) {
    throw new Error(`Error al cargar pagos: ${paymentsError.message}`);
  }

  const payments: PaymentRow[] = (
    (paymentsData ?? []) as {
      id: string;
      subscription_id: string;
      amount: number | string;
      currency: string | null;
      status: string;
      provider: string | null;
      provider_payment_id: string | null;
      provider_invoice_id: string | null;
      paid_at: string | null;
      refunded_at: string | null;
      created_at: string | null;
    }[]
  ).map((p) => ({
    id: p.id,
    subscriptionId: p.subscription_id,
    amount: typeof p.amount === "string" ? Number(p.amount) : p.amount,
    currency: p.currency,
    status: p.status,
    provider: p.provider,
    providerPaymentId: p.provider_payment_id,
    providerInvoiceId: p.provider_invoice_id,
    paidAt: p.paid_at,
    refundedAt: p.refunded_at,
    createdAt: p.created_at,
  }));

  return { user, subscriptions, payments, plans };
}
