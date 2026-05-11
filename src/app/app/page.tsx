import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardView,
  type DashboardData,
} from "@/views/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tu panel de finanzas en Rial",
};

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date();
  const monthStartIso = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();

  const [accountsRes, txRes, ratesRes] = await Promise.all([
    supabase
      .from("accounts")
      .select("currency, balance")
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase
      .from("transactions")
      .select("type, amount_usd")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .neq("excluded_from_stats", true)
      .in("type", ["income", "expense"])
      .gte("date", monthStartIso),
    supabase
      .from("currency_rates")
      .select("currency_pair, price, price_yesterday, source")
      .eq("is_active", true)
      .order("order", { ascending: true, nullsFirst: false }),
  ]);

  const ratesByPair = new Map<string, number>();
  for (const r of ratesRes.data ?? []) {
    ratesByPair.set(r.currency_pair as string, Number(r.price ?? 0));
  }
  const usdVes = ratesByPair.get("USD/VES") ?? 0;
  const eurUsd = ratesByPair.get("EUR/USD") ?? null;

  function toUsd(currency: string, amount: number): number {
    if (currency === "USD" || currency === "USDT") return amount;
    if (currency === "VES") return usdVes > 0 ? amount / usdVes : 0;
    if (currency === "EUR") return eurUsd && eurUsd > 0 ? amount * eurUsd : 0;
    return 0;
  }

  let totalUsd = 0;
  const balanceByCurrency = new Map<string, { balance: number; balanceUsd: number }>();
  for (const a of accountsRes.data ?? []) {
    const currency = a.currency ?? "USD";
    const balance = Number(a.balance ?? 0);
    const usd = toUsd(currency, balance);
    const entry = balanceByCurrency.get(currency) ?? { balance: 0, balanceUsd: 0 };
    entry.balance += balance;
    entry.balanceUsd += usd;
    totalUsd += usd;
    balanceByCurrency.set(currency, entry);
  }

  let income = 0;
  let expense = 0;
  for (const t of txRes.data ?? []) {
    const amount = Number(t.amount_usd ?? 0);
    if (t.type === "income") income += amount;
    else if (t.type === "expense") expense += amount;
  }

  const currencyOrder = ["VES", "USD", "EUR"];
  const balances = Array.from(balanceByCurrency.entries())
    .map(([currency, v]) => ({ currency, balance: v.balance, balanceUsd: v.balanceUsd }))
    .sort((a, b) => {
      const ai = currencyOrder.indexOf(a.currency);
      const bi = currencyOrder.indexOf(b.currency);
      if (ai === -1 && bi === -1) return a.currency.localeCompare(b.currency);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const rates = (ratesRes.data ?? [])
    .filter((r) => (r.currency_pair as string).endsWith("/VES"))
    .map((r) => ({
      code: (r.currency_pair as string).split("/")[0],
      price: Number(r.price ?? 0),
      priceYesterday:
        r.price_yesterday !== null && r.price_yesterday !== undefined
          ? Number(r.price_yesterday)
          : null,
      source: r.source ?? "",
    }));

  const data: DashboardData = {
    balances,
    income,
    expense,
    rates,
    totalUsd,
    eurUsd,
  };

  return <DashboardView data={data} />;
}
