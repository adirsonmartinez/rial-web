"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Selection } from "@heroui/react";
import { Button, Dropdown, Label } from "@heroui/react";
import { ArrowLeft, Check, ChevronDown, Copy } from "@gravity-ui/icons";
import type {
  ClienteDetail,
  ClienteRow,
  PaymentRow,
} from "@/lib/admin/clientes";
import { useClienteDetailViewModel } from "./useClienteDetailViewModel";

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  yearly: "Anual",
};

const PROVIDER_LABELS: Record<string, string> = {
  apple: "Apple",
  google: "Google",
  manual: "Manual",
  venflow: "Venflow",
};

const dateFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateTimeFormatter.format(d);
}

type StatusKind = "active" | "cancelling" | "expired" | "cancelled" | "other";

function statusKind(row: ClienteRow): StatusKind {
  if (row.cancelAtPeriodEnd && row.status === "active") return "cancelling";
  if (row.status === "active") return "active";
  if (row.status === "expired") return "expired";
  if (row.status === "cancelled") return "cancelled";
  return "other";
}

const STATUS_DOT_COLOR: Record<StatusKind, string> = {
  active: "#16a34a",
  cancelling: "#d97706",
  expired: "#dc2626",
  cancelled: "#6b7280",
  other: "#6b7280",
};

const STATUS_LABEL: Record<StatusKind, string> = {
  active: "Activo",
  cancelling: "Cancela al final del período",
  expired: "Expirado",
  cancelled: "Cancelado",
  other: "Desconocido",
};

function StatusDot({ row }: { row: ClienteRow }) {
  const kind = statusKind(row);
  return (
    <span
      className="inline-flex items-center gap-2 text-sm font-medium"
      style={{ color: "var(--text-primary)" }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: STATUS_DOT_COLOR[kind] }}
      />
      {STATUS_LABEL[kind]}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-semibold uppercase tracking-wide"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore copy failures
        }
      }}
      aria-label={copied ? "Copiado" : "Copiar"}
      className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[var(--card-bg-hover)]"
      style={{ color: copied ? "#16a34a" : "var(--text-muted)" }}
    >
      {copied ? (
        <Check width={12} height={12} />
      ) : (
        <Copy width={12} height={12} />
      )}
    </button>
  );
}

function MetaItem({
  label,
  value,
  mono,
  copyValue,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  copyValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`break-all text-sm ${mono ? "font-mono" : "font-medium"}`}
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>
        {copyValue && <CopyButton value={copyValue} />}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full" style={{ backgroundColor: "var(--border)" }} />
  );
}

function Card({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title?: string;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasHeader = Boolean(title || subtitle || rightSlot);
  return (
    <section
      className="rounded-2xl p-2"
      style={{
        backgroundColor: "var(--bg-card-outer)",
        border: "1px solid var(--border)",
      }}
    >
      {hasHeader && (
        <header className="flex items-start justify-between gap-3 px-3 pt-2 pb-3">
          <div className="min-w-0">
            {title && (
              <h2
                className="text-base font-semibold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {rightSlot}
        </header>
      )}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function CycleDropdown({
  value,
  onChange,
}: {
  value: keyof typeof BILLING_CYCLE_LABELS;
  onChange: (
    cycle: "monthly" | "quarterly" | "semiannual" | "yearly",
  ) => void;
}) {
  const selectedKeys = useMemo<Selection>(
    () => new Set<string>([value]),
    [value],
  );
  return (
    <Dropdown>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Seleccionar ciclo"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        {BILLING_CYCLE_LABELS[value] ?? value}
        <ChevronDown />
      </Button>
      <Dropdown.Popover className="min-w-[200px]" placement="bottom start">
        <Dropdown.Menu
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys === "all") return;
            const next = Array.from(keys)[0];
            if (
              typeof next === "string" &&
              (next === "monthly" ||
                next === "quarterly" ||
                next === "semiannual" ||
                next === "yearly")
            ) {
              onChange(next);
            }
          }}
        >
          {(
            ["monthly", "quarterly", "semiannual", "yearly"] as const
          ).map((cycle) => (
            <Dropdown.Item
              key={cycle}
              id={cycle}
              textValue={BILLING_CYCLE_LABELS[cycle]}
            >
              <Label>{BILLING_CYCLE_LABELS[cycle]}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function PlanDropdown({
  plans,
  value,
  onChange,
}: {
  plans: ClienteDetail["plans"];
  value: string;
  onChange: (planId: string) => void;
}) {
  const selectedKeys = useMemo<Selection>(
    () => new Set<string>([value]),
    [value],
  );
  const selectedLabel =
    plans.find((p) => p.id === value)?.displayName ?? "Seleccionar plan";
  return (
    <Dropdown>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Seleccionar plan"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        {selectedLabel}
        <ChevronDown />
      </Button>
      <Dropdown.Popover className="min-w-[240px]" placement="bottom start">
        <Dropdown.Menu
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys === "all") return;
            const next = Array.from(keys)[0];
            if (typeof next === "string") onChange(next);
          }}
        >
          {plans.map((plan) => (
            <Dropdown.Item
              key={plan.id}
              id={plan.id}
              textValue={plan.displayName}
            >
              <Label>{plan.displayName}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  succeeded: "#16a34a",
  paid: "#16a34a",
  refunded: "#6b7280",
  failed: "#dc2626",
  pending: "#d97706",
  processing: "#d97706",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  succeeded: "Cobrado",
  paid: "Cobrado",
  refunded: "Reembolsado",
  failed: "Fallido",
  pending: "Pendiente",
  processing: "Procesando",
};

function formatAmount(amount: number, currency: string | null): string {
  const code = currency ?? "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}

function PaymentRowItem({ payment }: { payment: PaymentRow }) {
  const status = payment.status?.toLowerCase() ?? "";
  const dotColor = PAYMENT_STATUS_COLOR[status] ?? "#6b7280";
  const statusLabel = PAYMENT_STATUS_LABEL[status] ?? payment.status;
  const isRefunded = Boolean(payment.refundedAt);
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {formatAmount(payment.amount, payment.currency)}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            · {statusLabel}
            {isRefunded ? " (devuelto)" : ""}
          </span>
        </div>
        <span
          className="truncate text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {formatDate(payment.paidAt ?? payment.createdAt)}
          {payment.provider
            ? ` · ${PROVIDER_LABELS[payment.provider] ?? payment.provider}`
            : ""}
          {payment.providerPaymentId ? ` · ${payment.providerPaymentId}` : ""}
        </span>
      </div>
      {payment.providerInvoiceId && (
        <span
          className="hidden font-mono text-xs sm:inline"
          style={{ color: "var(--text-muted)" }}
        >
          {payment.providerInvoiceId}
        </span>
      )}
    </div>
  );
}

function SubscriptionHistoryRow({ row }: { row: ClienteRow }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-col gap-0.5">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {row.planDisplayName} ·{" "}
          {row.billingCycle
            ? BILLING_CYCLE_LABELS[row.billingCycle] ?? row.billingCycle
            : "—"}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {formatDate(row.startedAt ?? row.createdAt)} →{" "}
          {formatDate(row.currentPeriodEnd)}
        </span>
      </div>
      <StatusDot row={row} />
    </div>
  );
}

function getInitial(name: string | null, email: string | null): string {
  const source = (name?.trim() || email || "?").trim();
  return source.charAt(0).toUpperCase();
}

export function ClienteDetailView({ detail }: { detail: ClienteDetail }) {
  const vm = useClienteDetailViewModel(detail);
  const { user, subscriptions } = detail;
  const active = vm.activeSubscription;
  const historical = subscriptions.filter(
    (s) => s.subscriptionId !== active?.subscriptionId,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-6 py-8">
      <Link
        href="/admin/clientes"
        className="inline-flex items-center gap-1.5 text-sm no-underline transition-colors hover:opacity-80"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft width={14} height={14} />
        Clientes
      </Link>

      <header className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold"
          style={{
            backgroundColor: "var(--accent-soft-bg)",
            color: "var(--accent-soft-icon)",
          }}
        >
          {getInitial(user.fullName, user.email)}
        </div>
        <div className="min-w-0 flex-1">
          <h1
            className="display-heading text-[clamp(1.25rem,2vw,1.75rem)] leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {user.fullName?.trim() || "Sin nombre"}
          </h1>
          <p
            className="truncate text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {user.email ?? "—"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Card
            title="Suscripción"
            subtitle="Plan activo, ciclo de facturación y acciones rápidas"
            rightSlot={active ? <StatusDot row={active} /> : null}
          >
            {active ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-6 py-5">
                  <MetaItem label="Plan" value={active.planDisplayName} />
                  <MetaItem
                    label="Ciclo"
                    value={
                      active.billingCycle
                        ? BILLING_CYCLE_LABELS[active.billingCycle] ??
                          active.billingCycle
                        : "—"
                    }
                  />
                  <MetaItem
                    label="Próximo cobro"
                    value={formatDate(active.currentPeriodEnd)}
                  />
                  <MetaItem
                    label="Inició"
                    value={formatDate(active.startedAt ?? active.createdAt)}
                  />
                  <MetaItem
                    label="Proveedor"
                    value={
                      active.provider
                        ? PROVIDER_LABELS[active.provider] ?? active.provider
                        : "—"
                    }
                  />
                  <MetaItem
                    label="ID suscripción"
                    value={active.subscriptionId}
                    mono
                    copyValue={active.subscriptionId}
                  />
                </div>
                <Divider />

                <div className="flex flex-col gap-4 px-6 py-5">
                  <SectionHeader>
                    {detail.plans.length > 1
                      ? "Cambiar plan y ciclo"
                      : "Cambiar ciclo"}
                  </SectionHeader>
                  <div className="flex flex-wrap items-end gap-3">
                    {detail.plans.length > 1 && (
                      <div className="flex flex-col gap-1">
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Plan
                        </span>
                        <PlanDropdown
                          plans={detail.plans}
                          value={vm.selectedPlanId}
                          onChange={vm.setPlanId}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Ciclo
                      </span>
                      <CycleDropdown
                        value={vm.selectedBillingCycle}
                        onChange={vm.setBillingCycle}
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={!vm.isDirty || vm.isSaving}
                      onPress={() => {
                        void vm.save();
                      }}
                    >
                      {vm.isSaving ? "Guardando…" : "Guardar"}
                    </Button>
                  </div>
                  {vm.error && (
                    <p className="text-sm" style={{ color: "#dc2626" }}>
                      {vm.error}
                    </p>
                  )}
                  {vm.success && !vm.error && (
                    <p className="text-sm" style={{ color: "#16a34a" }}>
                      {vm.success}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p
                className="px-6 py-8 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Este cliente no tiene suscripciones pagas.
              </p>
            )}
          </Card>

          {active && (
            <Card
              title="Zona de peligro"
              subtitle={
                active.cancelAtPeriodEnd
                  ? `La suscripción está marcada para cancelarse el ${formatDate(active.currentPeriodEnd)}.`
                  : `Al cancelar, el cliente conserva acceso hasta ${formatDate(active.currentPeriodEnd)}.`
              }
            >
              <div className="flex flex-col gap-3 px-6 py-5">
                <div>
                  <Button
                    variant={
                      active.cancelAtPeriodEnd ? "primary" : "secondary"
                    }
                    size="sm"
                    isDisabled={vm.isCancelling}
                    onPress={() => {
                      const willCancel = !active.cancelAtPeriodEnd;
                      const confirmMsg = willCancel
                        ? "¿Cancelar esta suscripción al final del período?"
                        : "¿Reactivar esta suscripción?";
                      if (window.confirm(confirmMsg)) {
                        void vm.setCancelAtPeriodEnd(willCancel);
                      }
                    }}
                    style={
                      !active.cancelAtPeriodEnd
                        ? {
                            backgroundColor: "transparent",
                            border: "1px solid #dc2626",
                            color: "#dc2626",
                          }
                        : undefined
                    }
                  >
                    {vm.isCancelling
                      ? "Procesando…"
                      : active.cancelAtPeriodEnd
                        ? "Reactivar"
                        : "Cancelar suscripción"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card
            title="Pagos"
            subtitle="Cobros realizados a este cliente"
            rightSlot={
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {detail.payments.length === 0
                  ? "Sin pagos"
                  : `${detail.payments.length} ${
                      detail.payments.length === 1 ? "pago" : "pagos"
                    }`}
              </span>
            }
          >
            {detail.payments.length === 0 ? (
              <p
                className="px-6 py-8 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                No hay pagos registrados para este cliente.
              </p>
            ) : (
              <div className="flex flex-col">
                {detail.payments.map((payment, idx) => (
                  <div key={payment.id}>
                    {idx > 0 && <Divider />}
                    <PaymentRowItem payment={payment} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {historical.length > 0 && (
            <Card
              title="Historial"
              subtitle="Suscripciones anteriores de este cliente"
            >
              <div className="flex flex-col">
                {historical.map((row, idx) => (
                  <div key={row.subscriptionId}>
                    {idx > 0 && <Divider />}
                    <SubscriptionHistoryRow row={row} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <Card
            title="Cliente"
            subtitle="Datos personales y contacto"
          >
            <div className="flex flex-col gap-5 px-6 py-5">
              <MetaItem
                label="Email"
                value={user.email ?? "—"}
                copyValue={user.email ?? undefined}
              />
              <MetaItem
                label="Teléfono"
                value={
                  user.phoneNumber
                    ? `${user.phoneCode ?? ""} ${user.phoneNumber}`.trim()
                    : "—"
                }
              />
              <MetaItem
                label="Registrado"
                value={formatDateTime(user.createdAt)}
              />
              <MetaItem label="Tipo" value={user.userType} />
              <MetaItem label="ID" value={user.id} mono copyValue={user.id} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
