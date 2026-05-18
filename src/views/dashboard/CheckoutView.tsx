"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  ArrowLeft,
  Check,
  CircleDollar,
  CrownDiamond,
  Globe,
  ShieldCheck,
} from "@gravity-ui/icons";

type Cadence = "mensual" | "trimestral" | "semestral" | "anual";

type CadencePricing = {
  id: Cadence;
  label: string;
  cadenceLabel: string;
  totalUsd: number;
  monthlyEquivalent: string;
  renewalCopy: string;
};

const cadenceCatalog: Record<Cadence, CadencePricing> = {
  mensual: {
    id: "mensual",
    label: "Mensual",
    cadenceLabel: "Se renueva cada mes",
    totalUsd: 4.99,
    monthlyEquivalent: "$4,99 / mes",
    renewalCopy: "Se renueva automáticamente cada mes hasta que canceles.",
  },
  trimestral: {
    id: "trimestral",
    label: "Trimestral",
    cadenceLabel: "Se renueva cada 3 meses",
    totalUsd: 13.49,
    monthlyEquivalent: "$4,49 / mes",
    renewalCopy:
      "Se renueva automáticamente cada 3 meses hasta que canceles.",
  },
  semestral: {
    id: "semestral",
    label: "Semestral",
    cadenceLabel: "Se renueva cada 6 meses",
    totalUsd: 23.99,
    monthlyEquivalent: "$3,99 / mes",
    renewalCopy:
      "Se renueva automáticamente cada 6 meses hasta que canceles.",
  },
  anual: {
    id: "anual",
    label: "Anual",
    cadenceLabel: "Se renueva cada año",
    totalUsd: 41.99,
    monthlyEquivalent: "$3,49 / mes",
    renewalCopy: "Se renueva automáticamente cada año hasta que canceles.",
  },
};

type PaymentCurrencyId = "bolivares" | "otra";

type PaymentCurrencyOption = {
  id: PaymentCurrencyId;
  name: string;
  description: string;
  icon: typeof CircleDollar;
  badge?: string;
  disabled?: boolean;
};

const paymentCurrencies: PaymentCurrencyOption[] = [
  {
    id: "bolivares",
    name: "Suscribirse con Bolívares",
    description:
      "Domiciliación con tu cuenta bancaria local. Cancela cuando quieras.",
    icon: CircleDollar,
    badge: "Recomendado",
  },
  {
    id: "otra",
    name: "Suscribirse con otra moneda",
    description:
      "Paga en USD desde cualquier país con tarjeta internacional.",
    icon: Globe,
  },
];

const formatUsd = (value: number) =>
  `$${value.toFixed(2).replace(".", ",")}`;

function PaymentCurrencyCard({
  option,
  isSelected,
  onSelect,
}: {
  option: PaymentCurrencyOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={option.disabled ? undefined : onSelect}
      aria-pressed={isSelected}
      aria-disabled={option.disabled}
      disabled={option.disabled}
      className={`flex w-full items-start gap-4 rounded-2xl p-5 text-left transition-colors ${
        option.disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
      style={{
        backgroundColor: isSelected
          ? "var(--accent-soft-bg)"
          : "var(--bg-card)",
        border: `1.5px solid ${isSelected ? "var(--accent-soft-icon)" : "var(--border)"}`,
      }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: isSelected
            ? "var(--accent-soft-bg)"
            : "var(--card-bg-subtle)",
          color: isSelected
            ? "var(--accent-soft-icon)"
            : "var(--text-primary)",
        }}
      >
        <Icon width={18} height={18} />
      </span>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {option.name}
          </span>
          {option.badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "var(--accent-soft-bg)",
                color: "var(--accent-soft-icon)",
              }}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {option.description}
        </p>
      </div>

      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isSelected ? "text-white dark:text-black" : ""}`}
        style={{
          backgroundColor: isSelected ? "var(--accent-soft-icon)" : "transparent",
          border: `1.5px solid ${isSelected ? "var(--accent-soft-icon)" : "var(--border)"}`,
        }}
      >
        {isSelected && <Check width={12} height={12} />}
      </span>
    </button>
  );
}

export function CheckoutView({ cadence }: { cadence: Cadence }) {
  const pricing = cadenceCatalog[cadence];
  const [selectedCurrency, setSelectedCurrency] =
    useState<PaymentCurrencyId>("bolivares");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = pricing.totalUsd;
  const appliesIva = selectedCurrency === "bolivares";
  const taxRate = appliesIva ? 0.16 : 0;
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  async function handleContinue() {
    setIsSubmitting(true);
    setErrorMessage(null);
    const endpoint =
      selectedCurrency === "bolivares"
        ? "/api/venflow/checkout"
        : "/api/stripe/checkout";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadence }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setErrorMessage(data.error ?? "No pudimos iniciar el checkout");
        setIsSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMessage("Error de red. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <Link
        href="/app/plan"
        aria-label="Volver a planes"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
        style={{ color: "var(--text-primary)" }}
      >
        <ArrowLeft width={20} height={20} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Columna izquierda — resumen */}
        <aside className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--accent-soft-bg)",
                color: "var(--accent-soft-icon)",
              }}
            >
              <CrownDiamond width={20} height={20} />
            </span>
            <div className="flex flex-col">
              <span
                className="text-xs uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Suscribirse a
              </span>
              <span
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Rial Plus
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="display-heading text-5xl"
              style={{ color: "var(--text-primary)" }}
            >
              {formatUsd(pricing.totalUsd)}
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              USD
            </span>
          </div>
          <span
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {pricing.cadenceLabel} · {pricing.monthlyEquivalent}
          </span>

          <div
            className="h-px w-full"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex flex-col gap-3">
            <SummaryRow
              label={`Plan Plus · ${pricing.label}`}
              value={formatUsd(subtotal)}
            />
            {appliesIva && (
              <SummaryRow
                label="IVA (16%)"
                value={formatUsd(tax)}
                muted
              />
            )}
          </div>

          <div
            className="h-px w-full"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Total a pagar hoy
            </span>
            <span
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {formatUsd(total)} USD
            </span>
          </div>

          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {pricing.renewalCopy}
          </p>
        </aside>

        {/* Columna derecha — método de pago */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1
              className="display-heading text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              Método de pago
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Elige cómo quieres pagar tu suscripción.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {paymentCurrencies.map((option) => (
              <PaymentCurrencyCard
                key={option.id}
                option={option}
                isSelected={selectedCurrency === option.id}
                onSelect={() => setSelectedCurrency(option.id)}
              />
            ))}
          </div>

          <Button
            variant="primary"
            fullWidth
            className="h-12"
            onClick={handleContinue}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Redirigiendo…" : "Continuar"}
          </Button>

          {errorMessage && (
            <p
              className="text-xs"
              style={{ color: "rgb(220, 38, 38)" }}
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          {selectedCurrency === "bolivares" && (
            <div
              className="flex items-center justify-center gap-1.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span>Powered by</span>
              <a
                href="https://www.venflow.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center opacity-60 transition-opacity hover:opacity-90"
                aria-label="Venflow"
              >
                <Image
                  src="/logos/venflow-black.png"
                  alt="Venflow"
                  width={60}
                  height={16}
                  className="block h-auto dark:hidden"
                />
                <Image
                  src="/logos/venflow-white.png"
                  alt="Venflow"
                  width={60}
                  height={16}
                  className="hidden h-auto dark:block"
                />
              </a>
            </div>
          )}

          <div
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <ShieldCheck width={14} height={14} />
            <span>
              Pago procesado de forma segura. Puedes cancelar cuando quieras.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="text-sm"
        style={{ color: muted ? "var(--text-muted)" : "var(--text-primary)" }}
      >
        {label}
      </span>
      <span
        className="text-sm"
        style={{ color: muted ? "var(--text-muted)" : "var(--text-primary)" }}
      >
        {value}
      </span>
    </div>
  );
}
