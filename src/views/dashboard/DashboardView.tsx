"use client";

import { useState } from "react";
import Link from "next/link";
import type { Selection } from "@heroui/react";
import { Button, Chip, Dropdown, Label } from "@heroui/react";
import {
  Eye,
  EyeSlash,
  CaretUp,
  CaretDown,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "@gravity-ui/icons";

type CurrencyCode = "USD" | "EUR" | "USDT";

const currencySymbol: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  USDT: "$",
};

const currencyOrder: CurrencyCode[] = ["USD", "EUR", "USDT"];

function CurrencyIcon({ code }: { code: CurrencyCode }) {
  if (code === "USD")
    return <span className="text-base leading-none">🇺🇸</span>;
  if (code === "EUR")
    return <span className="text-base leading-none">🇪🇺</span>;
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#26A17B] text-xs font-bold text-white">
      ₮
    </div>
  );
}

type BalanceCardItem = {
  code: string;
  flag: string;
  currency: string;
  amount: string;
  equivalent?: string;
  href: string;
};

type MoneyFlow = {
  type: "income" | "expense";
  label: string;
  amount: string;
  href: string;
};

type ExchangeRate = {
  code: CurrencyCode;
  label: string;
  rate: string;
};

export type DashboardData = {
  balances: { currency: string; balance: number; balanceUsd: number }[];
  income: number;
  expense: number;
  rates: {
    code: string;
    price: number;
    priceYesterday: number | null;
    source: string;
  }[];
  totalUsd: number;
  eurUsd: number | null;
};

const currencyMeta: Record<string, { flag: string; label: string; href: string }> = {
  VES: { flag: "🇻🇪", label: "Bolívares", href: "/app/cuentas/ves" },
  USD: { flag: "🇺🇸", label: "Dólares", href: "/app/cuentas/usd" },
  EUR: { flag: "🇪🇺", label: "Euros", href: "/app/cuentas/eur" },
};

const rateLabels: Record<string, string> = {
  USD: "Dólar",
  EUR: "Euro",
  USDT: "Tether",
};

const vesFormatter = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const usdFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const eurFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatBalance(currency: string, value: number): string {
  if (currency === "VES") return `Bs ${vesFormatter.format(value)}`;
  if (currency === "EUR") return `€ ${eurFormatter.format(value)}`;
  return `$ ${usdFormatter.format(value)}`;
}

function formatUsd(value: number): string {
  return `$ ${usdFormatter.format(value)}`;
}

function buildBalances(items: DashboardData["balances"]): BalanceCardItem[] {
  return items.map((item) => {
    const meta = currencyMeta[item.currency] ?? {
      flag: "💱",
      label: item.currency,
      href: "/app/cuentas",
    };
    const card: BalanceCardItem = {
      code: item.currency,
      flag: meta.flag,
      currency: meta.label,
      amount: formatBalance(item.currency, item.balance),
      href: meta.href,
    };
    if (item.currency !== "USD") {
      card.equivalent = `≈ ${formatUsd(item.balanceUsd)}`;
    }
    return card;
  });
}

function buildMoneyFlows(data: DashboardData): MoneyFlow[] {
  return [
    {
      type: "income",
      label: "Ingresos",
      amount: formatUsd(data.income),
      href: "/app/movimientos?tipo=ingresos",
    },
    {
      type: "expense",
      label: "Gastos",
      amount: formatUsd(data.expense),
      href: "/app/movimientos?tipo=gastos",
    },
  ];
}

function buildExchangeRates(rates: DashboardData["rates"]): ExchangeRate[] {
  return rates
    .filter(
      (
        r,
      ): r is {
        code: CurrencyCode;
        price: number;
        priceYesterday: number | null;
        source: string;
      } => r.code === "USD" || r.code === "EUR" || r.code === "USDT",
    )
    .map((r) => ({
      code: r.code,
      label: rateLabels[r.code] ?? r.code,
      rate: `Bs ${vesFormatter.format(r.price)}`,
    }));
}

function computeHero(
  data: DashboardData,
  code: CurrencyCode,
): { balance: number; changePct: number } {
  const targetRate = data.rates.find((r) => r.code === code);
  const changePct =
    targetRate && targetRate.priceYesterday && targetRate.priceYesterday > 0
      ? ((targetRate.price - targetRate.priceYesterday) / targetRate.priceYesterday) *
        100
      : 0;

  let total = 0;
  for (const b of data.balances) {
    if (b.currency === "VES") {
      if (targetRate && targetRate.price > 0) {
        total += b.balance / targetRate.price;
      }
      continue;
    }
    if (b.currency === "USD") {
      if (code === "USD" || code === "USDT") {
        total += b.balance;
      } else if (code === "EUR" && data.eurUsd && data.eurUsd > 0) {
        total += b.balance / data.eurUsd;
      }
      continue;
    }
    if (b.currency === "EUR") {
      if (code === "EUR") {
        total += b.balance;
      } else if ((code === "USD" || code === "USDT") && data.eurUsd) {
        total += b.balance * data.eurUsd;
      }
      continue;
    }
  }

  return { balance: total, changePct };
}

function ExchangeRatesCard({
  rates,
  source,
}: {
  rates: ExchangeRate[];
  source: string;
}) {
  return (
    <article
      className="rounded-[30px] p-6"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <header className="mb-4 flex items-baseline justify-between">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Tasas de cambio
        </h3>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {source}
        </span>
      </header>
      <ul className="flex flex-col gap-3">
        {rates.map((item) => (
          <li
            key={item.code}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <CurrencyIcon code={item.code} />
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.code}
                </span>
                <span
                  className="text-xs leading-tight"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.label}
                </span>
              </div>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {item.rate}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MoneyFlowCard({ item }: { item: MoneyFlow }) {
  const isIncome = item.type === "income";
  const Icon = isIncome ? ArrowUp : ArrowDown;
  return (
    <Link
      href={item.href}
      className="flex flex-col gap-3 rounded-full p-6 no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: isIncome ? "#22c55e" : "#ef4444" }}
          >
            <Icon width={18} height={18} />
          </div>
          <span
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {item.label}
          </span>
        </div>
        <ChevronRight
          width={18}
          height={18}
          style={{ color: "var(--text-muted)" }}
        />
      </header>
      <p
        className="display-heading text-2xl"
        style={{ color: "var(--text-primary)" }}
      >
        {item.amount}
      </p>
    </Link>
  );
}

function BalanceAccountCard({ item }: { item: BalanceCardItem }) {
  return (
    <article
      className="flex h-full flex-col rounded-[30px] p-4"
      style={{ backgroundColor: "var(--card-bg-subtle)" }}
    >
      <header className="mb-4 flex items-center gap-3 px-2">
        <div
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-xl leading-none"
          aria-hidden
        >
          <span>{item.flag}</span>
        </div>
        <span
          className="text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {item.currency}
        </span>
      </header>

      <div
        className="flex flex-1 flex-col rounded-xl p-5"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <p
          className="display-heading text-[clamp(1.5rem,2.5vw,2rem)]"
          style={{ color: "var(--text-primary)" }}
        >
          {item.amount}
        </p>
        {item.equivalent && (
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {item.equivalent}
          </p>
        )}

        <div className="mt-auto">
          <div
            className="mb-4 h-px w-full"
            style={{ backgroundColor: "var(--border)" }}
          />
          <Link
            href={item.href}
            className="flex items-center justify-between text-sm font-medium no-underline"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Detalles</span>
            <ChevronRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DashboardView({ data }: { data: DashboardData }) {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set<CurrencyCode>(["USD"])
  );

  const balanceCards = buildBalances(data.balances);
  const moneyFlows = buildMoneyFlows(data);
  const exchangeRates = buildExchangeRates(data.rates);
  const ratesSource = data.rates[0]?.source ?? "BCV";

  const selectedCode =
    (selectedKeys !== "all" &&
      (Array.from(selectedKeys)[0] as CurrencyCode)) ||
    "USD";
  const current = computeHero(data, selectedCode);
  const symbol = "$";
  const isPositive = current.changePct >= 0;
  const TrendIcon = isPositive ? CaretUp : CaretDown;

  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Mi balance
            </span>
            <button
              type="button"
              onClick={() => setIsVisible((v) => !v)}
              aria-label={isVisible ? "Ocultar balance" : "Mostrar balance"}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--card-bg-hover)]"
              style={{ color: "var(--text-muted)" }}
            >
              {isVisible ? (
                <Eye width={16} height={16} />
              ) : (
                <EyeSlash width={16} height={16} />
              )}
            </button>
          </div>

          <Dropdown>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Cambiar moneda de visualización"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
              }}
            >
              {selectedCode}
              <ChevronDown />
            </Button>
            <Dropdown.Popover className="min-w-[200px]" placement="bottom end">
              <Dropdown.Menu
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                {currencyOrder.map((code) => (
                  <Dropdown.Item key={code} id={code} textValue={code}>
                    <CurrencyIcon code={code} />
                    <Label>{code}</Label>
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        <div className="flex items-center gap-3">
          <span className="display-heading text-[clamp(2rem,4vw,3rem)]">
            {isVisible
              ? `${symbol} ${current.balance.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : `${symbol} ••••••`}
          </span>
          <Chip
            color={isPositive ? "success" : "danger"}
            variant="soft"
            size="sm"
          >
            <TrendIcon />
            <Chip.Label>
              {isPositive ? "+" : ""}
              {current.changePct.toFixed(1)}%
            </Chip.Label>
          </Chip>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Mis Balances
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {balanceCards.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Aún no tienes cuentas registradas.
            </p>
          ) : (
            balanceCards.map((item) => (
              <BalanceAccountCard key={item.code} item={item} />
            ))
          )}
        </div>
      </section>
      </div>

      <aside className="flex flex-col gap-4">
        {moneyFlows.map((item) => (
          <MoneyFlowCard key={item.type} item={item} />
        ))}
        <ExchangeRatesCard rates={exchangeRates} source={ratesSource} />
      </aside>
    </div>
  );
}
