"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Chip, Tabs } from "@heroui/react";
import { ArrowLeft, Check } from "@gravity-ui/icons";
import type { BillingCycle, SubscriptionInfo } from "@/lib/subscription";

export type Cadence = "mensual" | "trimestral" | "semestral" | "anual";

export const billingCycleToCadence: Record<BillingCycle, Cadence> = {
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

export function formatPeriodEnd(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return periodEndFormatter.format(date);
}

export type CadenceInfo = {
  id: Cadence;
  tabLabel: string;
  monthlyEquivalent: string;
  totalPrice: string;
  helper: string;
  discountPct?: number;
  available: boolean;
};

export const cadences: CadenceInfo[] = [
  {
    id: "mensual",
    tabLabel: "Mensual",
    monthlyEquivalent: "$4,99",
    totalPrice: "$4,99",
    helper: "/mes · facturado mensualmente",
    available: true,
  },
  {
    id: "trimestral",
    tabLabel: "Trimestral",
    monthlyEquivalent: "$4,49",
    totalPrice: "$13,49",
    helper: "/mes · $13,49 cada 3 meses",
    discountPct: 10,
    available: false,
  },
  {
    id: "semestral",
    tabLabel: "Semestral",
    monthlyEquivalent: "$3,99",
    totalPrice: "$23,99",
    helper: "/mes · $23,99 cada 6 meses",
    discountPct: 20,
    available: false,
  },
  {
    id: "anual",
    tabLabel: "Anual",
    monthlyEquivalent: "$3,49",
    totalPrice: "$41,99",
    helper: "/mes · $41,99 al año",
    discountPct: 30,
    available: false,
  },
];

const freePlan = {
  chipLabel: "Free",
  tagline: "Para empezar a organizar tus finanzas.",
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
  chipLabel: "Plus",
  tagline: "Finanzas sin límites.",
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

function PlanChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </span>
  );
}

function PriceBlock({
  amount,
  helper,
  trailing,
}: {
  amount: string;
  helper: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-1.5">
        <span
          className="display-heading text-5xl leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          {amount}
        </span>
        <span
          className="mt-1 text-xs font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          USD
        </span>
        {trailing && <div className="ml-auto self-center">{trailing}</div>}
      </div>
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
        {helper}
      </span>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Check
        width={16}
        height={16}
        style={{ color: "var(--text-primary)", marginTop: 2 }}
      />
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
        {text}
      </span>
    </li>
  );
}

export function FreePlanCard({ isCurrent }: { isCurrent: boolean }) {
  return (
    <article
      className="flex h-full flex-col gap-7 rounded-[30px] p-8"
      style={{ backgroundColor: "var(--card-bg-subtle)" }}
    >
      <PlanChip label={freePlan.chipLabel} />
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {freePlan.tagline}
      </p>
      <PriceBlock amount="$0" helper="/mes" />

      {isCurrent ? (
        <div
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <Check width={16} height={16} />
          <span>Plan actual</span>
        </div>
      ) : (
        <div
          className="flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <span>Plan gratuito</span>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {freePlan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} />
        ))}
      </ul>
    </article>
  );
}

export function PlusPlanCard({
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
  const checkoutHref = `/app/checkout?cadence=${cadence.id}`;
  const bannerLabel = isCurrent ? "Tu plan" : "Más popular";

  const trailingChip =
    cadence.available && cadence.discountPct ? (
      <Chip color="success" variant="soft" size="sm">
        Ahorra {cadence.discountPct}%
      </Chip>
    ) : !cadence.available ? (
      <Chip color="warning" variant="soft" size="sm">
        Próximamente
      </Chip>
    ) : null;

  return (
    <div
      className="flex h-full flex-col rounded-[30px]"
      style={{ backgroundColor: "var(--accent-soft-icon)" }}
    >
      <div
        className="py-2.5 text-center text-sm font-semibold"
        style={{ color: "var(--bg-primary)" }}
      >
        {bannerLabel}
      </div>
      <article
        className="flex flex-1 flex-col gap-7 rounded-[28px] p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          marginInline: "2px",
          marginBottom: "2px",
        }}
      >
        <PlanChip label={plusPlan.chipLabel} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {plusPlan.tagline}
        </p>
        <PriceBlock
          amount={cadence.monthlyEquivalent}
          helper={cadence.helper}
          trailing={trailingChip}
        />

        {isCurrent ? (
          <div className="flex flex-col gap-1.5">
            <div
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
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
            fullWidth
            className="h-11 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            }}
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
          <Button
            fullWidth
            isDisabled
            className="h-11 rounded-full text-sm font-semibold"
          >
            Próximamente
          </Button>
        )}

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
    </div>
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
  const defaultCadence: Cadence = currentCadence ?? "mensual";

  const [cadenceId, setCadenceId] = useState<Cadence>(defaultCadence);
  const cadence =
    cadences.find((c) => c.id === cadenceId) ?? cadences[0];

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

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
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
