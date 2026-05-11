"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal } from "@heroui/react";
import { Person, Lock, CrownDiamond } from "@gravity-ui/icons";

export type SettingsSectionId = "perfil" | "seguridad" | "suscripcion";
type SectionId = SettingsSectionId;

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

function SubscriptionSection() {
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
          Tu plan actual y opciones de mejora.
        </p>
      </header>

      <article
        className="flex flex-col gap-4 rounded-[30px] p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
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
              <p
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Plan Free
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Lo esencial para llevar tus finanzas.
              </p>
            </div>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            $0 / mes
          </span>
        </div>

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
          Ver planes y mejorar
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
};

export function SettingsModal({
  isOpen,
  onOpenChange,
  initialSection = "perfil",
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
              {active === "suscripcion" && <SubscriptionSection />}
            </main>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
