"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Chip, Tabs } from "@heroui/react";
import {
  ArrowLeft,
  Check,
  Sparkles,
  CrownDiamond,
} from "@gravity-ui/icons";
import type { BillingCycle, SubscriptionInfo } from "@/lib/subscription";

type Cadence = "mensual" | "trimestral" | "semestral" | "anual";

const billingCycleToCadence: Record<BillingCycle, Cadence> = {
  monthly: "mensual",
  quarterly: "trimestral",
  semiannual: "semestral",
  yearly: "anual",
};

const periodEndFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatPeriodEnd(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return periodEndFormatter.format(date);
}

type CadenceInfo = {
  id: Cadence;
  tabLabel: string;
  monthlyEquivalent: string;
  totalPrice: string;
  helper: string;
  discountPct?: number;
  available: boolean;
};

const cadences: CadenceInfo[] = [
  {
    id: "mensual",
    tabLabel: "Mensual",
    monthlyEquivalent: "$4,99",
    totalPrice: "$4,99",
    helper: "USD / mes · facturado mensualmente",
    available: true,
  },
  {
    id: "trimestral",
    tabLabel: "Trimestral",
    monthlyEquivalent: "$4,50",
    totalPrice: "$13,49",
    helper: "USD / mes · facturado trimestralmente ($13,49)",
    discountPct: 10,
    available: false,
  },
  {
    id: "semestral",
    tabLabel: "Semestral",
    monthlyEquivalent: "$4,00",
    totalPrice: "$23,99",
    helper: "USD / mes · facturado semestralmente ($23,99)",
    discountPct: 20,
    available: false,
  },
  {
    id: "anual",
    tabLabel: "Anual",
    monthlyEquivalent: "$3,50",
    totalPrice: "$41,99",
    helper: "USD / mes · facturado anualmente ($41,99)",
    discountPct: 30,
    available: false,
  },
];

const freePlan = {
  id: "free" as const,
  name: "Plan Free",
  tagline: "Para empezar a organizar tus finanzas.",
  icon: Sparkles,
  features: [
    "Hasta 5 cuentas (3 nacionales + 2 internacionales). Efectivo USD y VES no cuentan",
    "30 transacciones al mes",
    "Categorías ilimitadas + creación y categorización con IA",
    "Hasta 5 pagos recurrentes manuales de registro rápido",
    "Hasta 5 pagos recurrentes programados",
    "5 registros por voz al mes + 1 dictado masivo",
    "Calculadora de tasas completa",
    "Tasas del día: BCV dólar, BCV euro, USD/EUR, USDT",
    "Historial de 1 mes de movimientos",
    "Presupuestos ilimitados",
    "Metas de ahorro ilimitadas",
    "3 listas mensuales (20 ítems c/u)",
  ],
};

const plusPlan = {
  id: "plus" as const,
  name: "Plan Plus",
  tagline: "Finanzas sin límites.",
  icon: CrownDiamond,
  ctaLabel: "Elegir Plus",
  featuresIntro: "Todo lo de Free, además:",
  features: [
    "Cuentas ilimitadas",
    "Transacciones ilimitadas",
    "Pagos recurrentes ilimitados",
    "Registro por voz sin límite + dictado masivo ilimitado",
    "Historial de movimientos completo",
    "Lista de compras completa e ilimitada",
  ],
};

function FreePlanCard({ isCurrent }: { isCurrent: boolean }) {
  const Icon = freePlan.icon;
  return (
    <article
      className="relative flex h-full flex-col gap-6 rounded-[30px] p-8"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <header className="flex flex-col gap-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--accent-soft-bg)",
            color: "var(--accent-soft-icon)",
          }}
        >
          <Icon width={20} height={20} />
        </span>
        <div>
          <h2
            className="display-heading text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            {freePlan.name}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {freePlan.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="display-heading text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            $0
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            para siempre
          </span>
        </div>
      </header>

      {isCurrent ? (
        <div
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--accent-soft-bg)",
            color: "var(--accent-soft-icon)",
          }}
        >
          <Check width={16} height={16} />
          <span>Plan actual</span>
        </div>
      ) : (
        <div
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <span>Plan gratuito</span>
        </div>
      )}

      <div
        className="h-px w-full"
        style={{ backgroundColor: "var(--border)" }}
      />

      <ul className="flex flex-col gap-3">
        {freePlan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} />
        ))}
      </ul>
    </article>
  );
}

function PlusPlanCard({
  cadence,
  isCurrent,
  periodEndLabel,
  cancelAtPeriodEnd,
}: {
  cadence: CadenceInfo;
  isCurrent: boolean;
  periodEndLabel: string | null;
  cancelAtPeriodEnd: boolean;
}) {
  const Icon = plusPlan.icon;
  const checkoutHref = `/app/checkout?cadence=${cadence.id}`;
  return (
    <article
      className="relative flex h-full flex-col gap-6 rounded-[30px] p-8"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "2px solid var(--accent)",
      }}
    >
      <span
        className="absolute -top-3 right-8 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
        }}
      >
        {isCurrent ? "Activo" : "Popular"}
      </span>

      <header className="flex flex-col gap-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--accent-soft-bg)",
            color: "var(--accent-soft-icon)",
          }}
        >
          <Icon width={20} height={20} />
        </span>
        <div>
          <h2
            className="display-heading text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            {plusPlan.name}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {plusPlan.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="display-heading text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {cadence.monthlyEquivalent}
            </span>
            {cadence.available && cadence.discountPct && (
              <Chip color="success" variant="soft" size="sm">
                Ahorra {cadence.discountPct}%
              </Chip>
            )}
            {!cadence.available && (
              <Chip color="warning" variant="soft" size="sm">
                Próximamente
              </Chip>
            )}
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {cadence.helper}
          </span>
        </div>
      </header>

      {isCurrent ? (
        <div className="flex flex-col gap-1">
          <div
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: "var(--accent-soft-bg)",
              color: "var(--accent-soft-icon)",
            }}
          >
            <Check width={16} height={16} />
            <span>Plan actual</span>
          </div>
          {periodEndLabel && (
            <span
              className="text-center text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {cancelAtPeriodEnd
                ? `Cancela el ${periodEndLabel}`
                : `Renueva el ${periodEndLabel}`}
            </span>
          )}
        </div>
      ) : cadence.available ? (
        <Button
          variant="primary"
          fullWidth
          className="h-11"
          render={(props) => (
            <Link
              {...(props as unknown as React.ComponentProps<typeof Link>)}
              href={checkoutHref}
            />
          )}
        >
          {plusPlan.ctaLabel}
        </Button>
      ) : (
        <Button variant="primary" fullWidth className="h-11" isDisabled>
          Próximamente
        </Button>
      )}

      <div
        className="h-px w-full"
        style={{ backgroundColor: "var(--border)" }}
      />

      <ul className="flex flex-col gap-3">
        <li
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {plusPlan.featuresIntro}
        </li>
        {plusPlan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} />
        ))}
      </ul>
    </article>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--accent-soft-bg)",
          color: "var(--accent-soft-icon)",
        }}
      >
        <Check width={12} height={12} />
      </span>
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
        {text}
      </span>
    </li>
  );
}

export function PlanView({
  subscription,
}: {
  subscription: SubscriptionInfo;
}) {
  const isPlus = subscription.plan === "plus";
  const currentCadence: Cadence | null =
    isPlus && subscription.billingCycle
      ? billingCycleToCadence[subscription.billingCycle]
      : null;
  const defaultCadence: Cadence = currentCadence ?? "trimestral";

  const [cadenceId, setCadenceId] = useState<Cadence>(defaultCadence);
  const cadence =
    cadences.find((c) => c.id === cadenceId) ?? cadences[1];

  const isCurrentPlusCard = isPlus && cadence.id === currentCadence;
  const periodEndLabel = formatPeriodEnd(subscription.currentPeriodEnd);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <Link
        href="/app"
        aria-label="Volver al dashboard"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
        style={{ color: "var(--text-primary)" }}
      >
        <ArrowLeft width={20} height={20} />
      </Link>

      <header className="mt-6 flex flex-col items-center gap-6 text-center">
        <h1
          className="display-heading text-[clamp(2rem,4vw,2.75rem)]"
          style={{ color: "var(--text-primary)" }}
        >
          {isPlus ? "Tu plan Rial Plus" : "Planes que crecen contigo"}
        </h1>

        <Tabs
          selectedKey={cadenceId}
          onSelectionChange={(key) => setCadenceId(String(key) as Cadence)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Cadencia de facturación">
              {cadences.map((c) => (
                <Tabs.Tab key={c.id} id={c.id}>
                  {c.tabLabel}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </header>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <FreePlanCard isCurrent={!isPlus} />
        <PlusPlanCard
          cadence={cadence}
          isCurrent={isCurrentPlusCard}
          periodEndLabel={periodEndLabel}
          cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
        />
      </div>

      <p
        className="mx-auto mt-10 max-w-3xl text-center text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Precios en USD. Aplica IVA 16%. Los precios y los planes están sujetos
        a cambios sin previo aviso.
      </p>
    </div>
  );
}
