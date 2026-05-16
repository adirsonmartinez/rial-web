"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Selection } from "@heroui/react";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  Label,
} from "@heroui/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Magnifier,
} from "@gravity-ui/icons";
import type {
  ClienteBillingCycleFilter,
  ClienteProviderFilter,
  ClienteRow,
  ClienteStatus,
  ClientesCycleCounts,
  ListClientesResult,
} from "@/lib/admin/clientes";
import { useClientesViewModel } from "./useClientesViewModel";

const GRID_COLS =
  "minmax(0, 2.4fr) minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 0.9fr)";

const BILLING_CYCLE_FILTER_LABELS: Record<ClienteBillingCycleFilter, string> = {
  all: "Todos los ciclos",
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  yearly: "Anual",
};

const STATUS_LABELS: Record<ClienteStatus, string> = {
  all: "Todos los estados",
  active: "Activos",
  expired: "Expirados",
  cancelled: "Cancelados",
};

const PROVIDER_FILTER_LABELS: Record<ClienteProviderFilter, string> = {
  all: "Todos los proveedores",
  google: "Google",
  apple: "Apple",
  venflow: "Venflow",
  stripe: "Stripe",
  manual: "Manual",
};

const PROVIDER_LABELS: Record<string, string> = {
  apple: "Apple",
  google: "Google",
  manual: "Manual",
  venflow: "Venflow",
};

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  yearly: "Anual",
};

const dateFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

function getInitial(row: ClienteRow): string {
  const source = (row.fullName?.trim() || row.email || "?").trim();
  return source.charAt(0).toUpperCase();
}

function statusChip(row: ClienteRow) {
  if (row.cancelAtPeriodEnd && row.status === "active") {
    return (
      <Chip color="warning" variant="soft" size="sm">
        <Chip.Label>Se cancela</Chip.Label>
      </Chip>
    );
  }
  if (row.status === "active") {
    return (
      <Chip color="success" variant="soft" size="sm">
        <Chip.Label>Activo</Chip.Label>
      </Chip>
    );
  }
  if (row.status === "expired") {
    return (
      <Chip color="danger" variant="soft" size="sm">
        <Chip.Label>Expirado</Chip.Label>
      </Chip>
    );
  }
  if (row.status === "cancelled") {
    return (
      <Chip color="default" variant="soft" size="sm">
        <Chip.Label>Cancelado</Chip.Label>
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="soft" size="sm">
      <Chip.Label>{row.status}</Chip.Label>
    </Chip>
  );
}

function ClienteAvatar({ row }: { row: ClienteRow }) {
  return (
    <Avatar size="md">
      <Avatar.Fallback>
        <span
          className="flex h-full w-full items-center justify-center rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--accent-soft-bg)",
            color: "var(--accent-soft-icon)",
          }}
        >
          {getInitial(row)}
        </span>
      </Avatar.Fallback>
    </Avatar>
  );
}

function ClienteTableRow({ row }: { row: ClienteRow }) {
  const providerLabel = row.provider
    ? PROVIDER_LABELS[row.provider] ?? row.provider
    : "—";
  const cycleLabel = row.billingCycle
    ? BILLING_CYCLE_LABELS[row.billingCycle] ?? row.billingCycle
    : "";

  return (
    <Link
      href={`/admin/clientes/${row.userId}`}
      className="grid cursor-pointer items-center gap-4 px-6 py-4 no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
      style={{ gridTemplateColumns: GRID_COLS }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <ClienteAvatar row={row} />
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {row.fullName?.trim() || "Sin nombre"}
          </p>
          <p
            className="truncate text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {row.email ?? "—"}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p
          className="truncate text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {row.planDisplayName}
        </p>
        {cycleLabel && (
          <p
            className="truncate text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {cycleLabel}
          </p>
        )}
      </div>

      <div>{statusChip(row)}</div>

      <div
        className="text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {formatDate(row.currentPeriodEnd)}
      </div>

      <div>
        <Chip variant="soft" size="sm" color="default">
          <Chip.Label>{providerLabel}</Chip.Label>
        </Chip>
      </div>
    </Link>
  );
}

function TableHeader() {
  return (
    <div
      className="grid gap-4 px-6 py-3"
      style={{ gridTemplateColumns: GRID_COLS }}
    >
      {["Cliente", "Plan", "Estado", "Próximo cobro", "Proveedor"].map(
        (label) => (
          <span
            key={label}
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
        ),
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full" style={{ backgroundColor: "var(--border)" }} />
  );
}

type FilterDropdownProps<T extends string> = {
  ariaLabel: string;
  selected: T;
  options: { key: T; label: string }[];
  onChange: (value: T) => void;
};

function FilterDropdown<T extends string>({
  ariaLabel,
  selected,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const selectedKeys = useMemo<Selection>(
    () => new Set<string>([selected]),
    [selected],
  );
  const selectedLabel =
    options.find((o) => o.key === selected)?.label ?? selected;

  return (
    <Dropdown>
      <Button
        variant="ghost"
        size="sm"
        aria-label={ariaLabel}
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        {selectedLabel}
        <ChevronDown />
      </Button>
      <Dropdown.Popover className="min-w-[220px]" placement="bottom start">
        <Dropdown.Menu
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys === "all") return;
            const next = Array.from(keys)[0];
            if (typeof next === "string") onChange(next as T);
          }}
        >
          {options.map((opt) => (
            <Dropdown.Item key={opt.key} id={opt.key} textValue={opt.label}>
              <Label>{opt.label}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

type CycleStat = {
  key: Exclude<ClienteBillingCycleFilter, "all">;
  label: string;
  value: number;
};

function CycleStatCard({
  stat,
  isActive,
  onSelect,
}: {
  stat: CycleStat;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className="flex h-full cursor-pointer flex-col rounded-2xl p-2 text-left transition-opacity hover:opacity-90"
      style={{
        backgroundColor: "var(--bg-card-outer)",
        border: isActive
          ? "1px solid var(--accent-soft-icon)"
          : "1px solid var(--border)",
      }}
    >
      <header className="px-3 pt-2 pb-3">
        <span
          className="text-base font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {stat.label}
        </span>
      </header>
      <div
        className="flex flex-1 items-end rounded-xl px-5 py-5"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <span
          className="display-heading text-[clamp(1.5rem,2.5vw,2rem)]"
          style={{ color: "var(--text-primary)" }}
        >
          {stat.value.toLocaleString("es-VE")}
        </span>
      </div>
    </button>
  );
}

export type ClientesViewProps = {
  initialData: ListClientesResult;
  cycleCounts: ClientesCycleCounts;
};

export function ClientesView({
  initialData,
  cycleCounts,
}: ClientesViewProps) {
  const vm = useClientesViewModel({ initialData });

  const cycleStats: CycleStat[] = [
    { key: "monthly", label: "Mensuales", value: cycleCounts.monthly },
    { key: "quarterly", label: "Trimestrales", value: cycleCounts.quarterly },
    {
      key: "semiannual",
      label: "Semestrales",
      value: cycleCounts.semiannual,
    },
    { key: "yearly", label: "Anuales", value: cycleCounts.yearly },
  ];
  const data = vm.data ?? initialData;
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const showingFrom = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const showingTo = Math.min(data.page * data.pageSize, data.total);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Admin
        </span>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1
            className="display-heading text-[clamp(1.75rem,3vw,2.25rem)]"
            style={{ color: "var(--text-primary)" }}
          >
            Clientes
          </h1>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {cycleCounts.total.toLocaleString("es-VE")} suscripciones pagas
          </span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cycleStats.map((stat) => (
          <CycleStatCard
            key={stat.key}
            stat={stat}
            isActive={vm.billingCycle === stat.key}
            onSelect={() =>
              vm.setBillingCycle(
                vm.billingCycle === stat.key ? "all" : stat.key,
              )
            }
          />
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="relative flex h-10 flex-1 min-w-[260px] items-center gap-2 rounded-full px-4"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <Magnifier
            width={16}
            height={16}
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="search"
            value={vm.search}
            onChange={(e) => vm.setSearch(e.target.value)}
            placeholder="Buscar por nombre o email…"
            aria-label="Buscar clientes"
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:opacity-70"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        <FilterDropdown<ClienteBillingCycleFilter>
          ariaLabel="Filtrar por ciclo de facturación"
          selected={vm.billingCycle}
          onChange={vm.setBillingCycle}
          options={[
            { key: "all", label: BILLING_CYCLE_FILTER_LABELS.all },
            { key: "monthly", label: BILLING_CYCLE_FILTER_LABELS.monthly },
            { key: "quarterly", label: BILLING_CYCLE_FILTER_LABELS.quarterly },
            {
              key: "semiannual",
              label: BILLING_CYCLE_FILTER_LABELS.semiannual,
            },
            { key: "yearly", label: BILLING_CYCLE_FILTER_LABELS.yearly },
          ]}
        />
        <FilterDropdown<ClienteStatus>
          ariaLabel="Filtrar por estado"
          selected={vm.status}
          onChange={vm.setStatus}
          options={[
            { key: "all", label: STATUS_LABELS.all },
            { key: "active", label: STATUS_LABELS.active },
            { key: "expired", label: STATUS_LABELS.expired },
            { key: "cancelled", label: STATUS_LABELS.cancelled },
          ]}
        />
        <FilterDropdown<ClienteProviderFilter>
          ariaLabel="Filtrar por proveedor"
          selected={vm.provider}
          onChange={vm.setProvider}
          options={[
            { key: "all", label: PROVIDER_FILTER_LABELS.all },
            { key: "google", label: PROVIDER_FILTER_LABELS.google },
            { key: "apple", label: PROVIDER_FILTER_LABELS.apple },
            { key: "venflow", label: PROVIDER_FILTER_LABELS.venflow },
            { key: "stripe", label: PROVIDER_FILTER_LABELS.stripe },
            { key: "manual", label: PROVIDER_FILTER_LABELS.manual },
          ]}
        />
      </div>

      <header className="flex flex-col gap-1">
        <h2
          className="text-base font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Suscripciones
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Listado de clientes con suscripción paga activa
        </p>
      </header>

      <section
        className="rounded-2xl p-2"
        style={{
          backgroundColor: "var(--bg-card-outer)",
          border: "1px solid var(--border)",
        }}
      >
        <TableHeader />
        <article
          className="overflow-hidden rounded-xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
        {vm.error ? (
          <div
            className="px-6 py-10 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {vm.error}
          </div>
        ) : data.rows.length === 0 ? (
          <div
            className="px-6 py-10 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {vm.loading
              ? "Cargando…"
              : "No se encontraron clientes con esos filtros."}
          </div>
        ) : (
          <div
            className={`flex flex-col ${vm.loading ? "opacity-60" : ""}`}
            aria-busy={vm.loading}
          >
            {data.rows.map((row, idx) => (
              <div key={row.subscriptionId}>
                {idx > 0 && <Divider />}
                <ClienteTableRow row={row} />
              </div>
            ))}
          </div>
        )}
        </article>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {data.total === 0
            ? "0 resultados"
            : `Mostrando ${showingFrom.toLocaleString("es-VE")}–${showingTo.toLocaleString("es-VE")} de ${data.total.toLocaleString("es-VE")}`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Página anterior"
            isDisabled={data.page <= 1 || vm.loading}
            onPress={() => vm.goToPage(data.page - 1)}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <ChevronLeft />
          </Button>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Página {data.page} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Página siguiente"
            isDisabled={data.page >= totalPages || vm.loading}
            onPress={() => vm.goToPage(data.page + 1)}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <ChevronRight />
          </Button>
        </div>
      </footer>
    </div>
  );
}
