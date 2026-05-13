"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip, Modal } from "@heroui/react";
import { Person, Lock, CrownDiamond } from "@gravity-ui/icons";
import type { BillingCycle, SubscriptionInfo } from "@/lib/subscription";

export type SettingsSectionId = "perfil" | "seguridad" | "suscripcion";
type SectionId = SettingsSectionId;

const billingCycleLabel: Record<BillingCycle, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  yearly: "Anual",
};

const billingCyclePrice: Record<BillingCycle, string> = {
  monthly: "$4,99 / mes",
  quarterly: "$13,49 / trimestre",
  semiannual: "$23,99 / semestre",
  yearly: "$41,99 / año",
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

type Section = {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
};

const sections: Section[] = [
  { id: "perfil", label: "Perfil", icon: Person },
  { id: "seguridad", label: "Cuenta y seguridad", icon: Lock },
  { id: "suscripcion", label: "Suscripción", icon: CrownDiamond },
];

function SectionNav({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <aside
      className="flex w-[220px] shrink-0 flex-col gap-1 p-4"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <h2
        className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        Configuración
      </h2>
      {sections.map(({ id, label, icon: Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-full px-3 text-left text-sm font-medium transition-colors ${
              isActive ? "" : "hover:bg-[var(--card-bg-hover)]"
            }`}
            style={{
              backgroundColor: isActive ? "var(--card-bg-subtle)" : undefined,
              color: "var(--text-primary)",
            }}
          >
            <Icon width={18} height={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
}

function ProfileSection() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Perfil
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Tu información personal visible en Rial.
        </p>
      </header>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Próximamente vas a poder editar tu nombre, foto y datos de contacto.
      </p>
    </div>
  );
}

function SubscriptionSection({
  subscription,
}: {
  subscription: SubscriptionInfo;
}) {
  const isPlus = subscription.plan === "plus";
  const cycle = subscription.billingCycle;
  const periodEnd = formatPeriodEnd(subscription.currentPeriodEnd);

  const planName = isPlus ? "Plan Plus" : "Plan Free";
  const tagline = isPlus
    ? "Finanzas sin límites."
    : "Lo esencial para llevar tus finanzas.";
  const priceLabel = isPlus
    ? cycle
      ? billingCyclePrice[cycle]
      : "Plan activo"
    : "$0 / mes";

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Suscripción
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {isPlus
            ? "Detalles de tu plan activo."
            : "Tu plan actual y opciones de mejora."}
        </p>
      </header>

      <article
        className="flex flex-col gap-4 rounded-[30px] p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: isPlus ? "2px solid var(--accent)" : "1px solid var(--border)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
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
            <div>
              <div className="flex items-center gap-2">
                <p
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {planName}
                </p>
                {isPlus && (
                  <Chip color="success" variant="soft" size="sm">
                    Activo
                  </Chip>
                )}
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {tagline}
              </p>
            </div>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            {priceLabel}
          </span>
        </div>

        {isPlus && (cycle || periodEnd) && (
          <div className="flex flex-col gap-2 text-sm">
            {cycle && (
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--text-muted)" }}>Facturación</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {billingCycleLabel[cycle]}
                </span>
              </div>
            )}
            {periodEnd && (
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--text-muted)" }}>
                  {subscription.cancelAtPeriodEnd
                    ? "Cancela el"
                    : "Próxima renovación"}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {periodEnd}
                </span>
              </div>
            )}
          </div>
        )}

        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--border)" }}
        />

        <Button
          render={(props) => (
            <Link
              {...(props as unknown as React.ComponentProps<typeof Link>)}
              href="/app/plan"
            />
          )}
        >
          {isPlus ? "Gestionar suscripción" : "Ver planes y mejorar"}
        </Button>
      </article>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Cuenta y seguridad
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Gestiona tu contraseña y sesiones activas.
        </p>
      </header>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Próximamente vas a poder cambiar tu contraseña, revisar sesiones
        activas y eliminar tu cuenta.
      </p>
    </div>
  );
}

type SettingsModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: SectionId;
  subscription: SubscriptionInfo;
};

export function SettingsModal({
  isOpen,
  onOpenChange,
  initialSection = "perfil",
  subscription,
}: SettingsModalProps) {
  const [active, setActive] = useState<SectionId>(initialSection);

  useEffect(() => {
    if (isOpen) setActive(initialSection);
  }, [isOpen, initialSection]);

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="h-[80vh] overflow-hidden p-0 sm:h-[560px] sm:max-w-[820px]">
          <Modal.CloseTrigger />
          <div className="flex h-full">
            <SectionNav active={active} onSelect={setActive} />
            <main className="flex-1 overflow-y-auto p-8">
              {active === "perfil" && <ProfileSection />}
              {active === "seguridad" && <SecuritySection />}
              {active === "suscripcion" && (
                <SubscriptionSection subscription={subscription} />
              )}
            </main>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
