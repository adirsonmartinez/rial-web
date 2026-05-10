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

type CurrencyInfo = {
  symbol: string;
  balance: number;
  changePct: number;
};

const currencies: Record<CurrencyCode, CurrencyInfo> = {
  USD: { symbol: "$", balance: 230.32, changePct: 5.3 },
  EUR: { symbol: "€", balance: 213.45, changePct: -1.2 },
  USDT: { symbol: "$", balance: 230.3, changePct: 0.05 },
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

const balances: BalanceCardItem[] = [
  {
    code: "VES",
    flag: "🇻🇪",
    currency: "Bolívares",
    amount: "Bs 115.127,51",
    equivalent: "≈ $230.32",
    href: "/app/cuentas/ves",
  },
  {
    code: "USD",
    flag: "🇺🇸",
    currency: "Dólares",
    amount: "$ 0.00",
    href: "/app/cuentas/usd",
  },
];

type MoneyFlow = {
  type: "income" | "expense";
  label: string;
  amount: string;
  href: string;
};

const moneyFlows: MoneyFlow[] = [
  {
    type: "income",
    label: "Ingresos",
    amount: "$ 0.00",
    href: "/app/movimientos?tipo=ingresos",
  },
  {
    type: "expense",
    label: "Gastos",
    amount: "$ 10.00",
    href: "/app/movimientos?tipo=gastos",
  },
];

type ExchangeRate = {
  code: CurrencyCode;
  label: string;
  rate: string;
};

const exchangeRates: ExchangeRate[] = [
  { code: "USD", label: "Dólar", rate: "Bs 36,50" },
  { code: "EUR", label: "Euro", rate: "Bs 39,20" },
  { code: "USDT", label: "Tether", rate: "Bs 38,10" },
];

function ExchangeRatesCard() {
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
          BCV
        </span>
      </header>
      <ul className="flex flex-col gap-3">
        {exchangeRates.map((item) => (
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

export function DashboardView() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set<CurrencyCode>(["USD"])
  );

  const selectedCode =
    (selectedKeys !== "all" &&
      (Array.from(selectedKeys)[0] as CurrencyCode)) ||
    "USD";
  const current = currencies[selectedCode];
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
              ? `${current.symbol} ${current.balance.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : `${current.symbol} ••••••`}
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
          {balances.map((item) => (
            <BalanceAccountCard key={item.code} item={item} />
          ))}
        </div>
      </section>
      </div>

      <aside className="flex flex-col gap-4">
        {moneyFlows.map((item) => (
          <MoneyFlowCard key={item.type} item={item} />
        ))}
        <ExchangeRatesCard />
      </aside>
    </div>
  );
}
