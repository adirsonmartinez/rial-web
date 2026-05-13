"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Modal } from "@heroui/react";
import { Person, CrownDiamond, Sparkles } from "@gravity-ui/icons";
import type { SubscriptionInfo } from "@/lib/subscription";
import { formatPeriodEnd } from "./PlanView";

export type SettingsSectionId = "perfil" | "suscripcion";
type SectionId = SettingsSectionId;

const SUPPORT_EMAIL = "soporte@somosrial.com";

type Section = {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
};

const sections: Section[] = [
  { id: "perfil", label: "Perfil", icon: Person },
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

function AccountRow({
  label,
  value,
  action,
}: {
  label: React.ReactNode;
  value?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </span>
        {value && (
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {value}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

function OutlineButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      className="shrink-0"
      style={{
        backgroundColor: "transparent",
        color: "var(--text-primary)",
        border: "1px solid var(--text-primary)",
      }}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}

function ProfileSection({
  userName,
  userEmail,
  onComingSoon,
}: {
  userName: string;
  userEmail: string;
  onComingSoon: (label: string) => void;
}) {
  const initial = (userName || userEmail || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  const username = userEmail.split("@")[0] || userName;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Cuenta
        </h3>
        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--border)" }}
        />
      </header>

      <div className="flex flex-col gap-6">
        <AccountRow
          label={
            <div className="flex items-center gap-3">
              <Avatar size="md">
                <Avatar.Fallback>
                  <span
                    className="flex h-full w-full items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--accent-soft-bg)",
                      color: "var(--accent-soft-icon)",
                    }}
                  >
                    {initial}
                  </span>
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userName}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {username}
                </span>
              </div>
            </div>
          }
          action={
            <OutlineButton onPress={() => onComingSoon("Cambiar avatar")}>
              Cambiar avatar
            </OutlineButton>
          }
        />

        <AccountRow
          label="Nombre completo"
          value={userName}
          action={
            <OutlineButton
              onPress={() => onComingSoon("Cambiar nombre completo")}
            >
              Cambiar nombre completo
            </OutlineButton>
          }
        />

        <AccountRow
          label="Usuario"
          value={username}
          action={
            <OutlineButton
              onPress={() => onComingSoon("Cambiar nombre de usuario")}
            >
              Cambiar nombre de usuario
            </OutlineButton>
          }
        />

        <AccountRow label="E-mail" value={userEmail} />
      </div>
    </div>
  );
}

function ComingSoonModal({
  label,
  onClose,
}: {
  label: string | null;
  onClose: () => void;
}) {
  return (
    <Modal.Backdrop
      isOpen={label !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[380px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon
              style={{
                backgroundColor: "var(--accent-soft-bg)",
                color: "var(--accent-soft-icon)",
              }}
            >
              <Sparkles className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{label}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p>
              Esta función está en desarrollo y estará disponible próximamente.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" className="w-full">
              Entendido
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

type SupportRequestKind = "cancel" | "reactivate";

function SupportRequestModal({
  kind,
  isOpen,
  onOpenChange,
  userEmail,
  periodEnd,
}: {
  kind: SupportRequestKind;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  periodEnd: string | null;
}) {
  const isCancel = kind === "cancel";
  const heading = isCancel ? "Cancelar suscripción" : "Reactivar suscripción";

  const description = isCancel
    ? "Por ahora la cancelación se hace por correo."
    : periodEnd
      ? `Tu suscripción está marcada para cancelarse el ${periodEnd}. Si querés mantenerla activa, podemos reactivarla.`
      : "Tu suscripción está marcada para cancelarse al final del período. Si querés mantenerla activa, podemos reactivarla.";

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      isCancel
        ? "Cancelar suscripción Rial Plus"
        : "Reactivar suscripción Rial Plus",
    );
    const body = encodeURIComponent(
      isCancel
        ? `Hola,\n\nQuiero cancelar mi suscripción a Rial Plus.\n\nCorreo de la cuenta: ${userEmail}\n\nGracias.`
        : `Hola,\n\nQuiero reactivar mi suscripción a Rial Plus${periodEnd ? ` (estaba programada para cancelarse el ${periodEnd})` : ""}.\n\nCorreo de la cuenta: ${userEmail}\n\nGracias.`,
    );
    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, [isCancel, userEmail, periodEnd]);

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[420px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon
              style={{
                backgroundColor: "var(--accent-soft-bg)",
                color: "var(--accent-soft-icon)",
              }}
            >
              <CrownDiamond className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{heading}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p>
              {description} Escríbenos a{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {SUPPORT_EMAIL}
              </span>{" "}
              y procesamos tu solicitud en menos de 24 horas. Te confirmamos por
              correo cuando esté lista.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              slot="close"
              className="flex-1"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--text-primary)",
              }}
            >
              Volver
            </Button>
            <Button
              className="flex-1"
              render={(props) => (
                <a
                  {...(props as unknown as React.ComponentProps<"a">)}
                  href={mailtoHref}
                />
              )}
            >
              Escribir a soporte
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function SubscriptionSection({
  subscription,
  userEmail,
}: {
  subscription: SubscriptionInfo;
  userEmail: string;
}) {
  const isPlus = subscription.plan === "plus";
  const isCancelling = isPlus && subscription.cancelAtPeriodEnd;
  const [supportKind, setSupportKind] = useState<SupportRequestKind | null>(
    null,
  );
  const periodEnd = formatPeriodEnd(subscription.currentPeriodEnd);

  const title = isPlus
    ? "Gracias por suscribirte a Rial"
    : "Estás en el plan Free";

  let subtitle: string;
  if (isPlus && subscription.cancelAtPeriodEnd && periodEnd) {
    subtitle = `Tu suscripción seguirá activa hasta el ${periodEnd}. Después de esa fecha pasarás al plan Free.`;
  } else if (isPlus && periodEnd) {
    subtitle = `Explora tus nuevas funciones Plus. Renueva el ${periodEnd}.`;
  } else if (isPlus) {
    subtitle = "Explora tus nuevas funciones Plus.";
  } else {
    subtitle = "Mejora a Plus para desbloquear todo.";
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Tu suscripción
        </h3>
        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--border)" }}
        />
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </p>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: isPlus
                  ? "var(--text-primary)"
                  : "var(--card-bg-subtle)",
                color: isPlus ? "var(--bg-primary)" : "var(--text-secondary)",
              }}
            >
              {isPlus ? "Plus" : "Free"}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {subtitle}{" "}
            <Link
              href="/app/plan"
              className="underline-offset-2 hover:underline"
              style={{ color: "var(--accent-soft-icon)" }}
            >
              Más información
            </Link>
          </p>
        </div>

        {isPlus ? (
          <Button
            className="shrink-0"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--text-primary)",
            }}
            onPress={() =>
              setSupportKind(isCancelling ? "reactivate" : "cancel")
            }
          >
            {isCancelling ? "Solicitar reactivación" : "Cancelar suscripción"}
          </Button>
        ) : (
          <Button
            variant="primary"
            className="shrink-0"
            render={(props) => (
              <Link
                {...(props as unknown as React.ComponentProps<typeof Link>)}
                href="/app/plan"
              />
            )}
          >
            Mejorar a Plus
          </Button>
        )}
      </div>

      <SupportRequestModal
        kind={supportKind ?? "cancel"}
        isOpen={supportKind !== null}
        onOpenChange={(open) => {
          if (!open) setSupportKind(null);
        }}
        userEmail={userEmail}
        periodEnd={periodEnd}
      />
    </div>
  );
}

type SettingsModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: SectionId;
  subscription: SubscriptionInfo;
  userEmail: string;
  userName: string;
};

export function SettingsModal({
  isOpen,
  onOpenChange,
  initialSection = "perfil",
  subscription,
  userEmail,
  userName,
}: SettingsModalProps) {
  const [active, setActive] = useState<SectionId>(initialSection);
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

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
              {active === "perfil" && (
                <ProfileSection
                  userName={userName}
                  userEmail={userEmail}
                  onComingSoon={setComingSoonLabel}
                />
              )}
              {active === "suscripcion" && (
                <SubscriptionSection
                  subscription={subscription}
                  userEmail={userEmail}
                />
              )}
            </main>
          </div>
          <ComingSoonModal
            label={comingSoonLabel}
            onClose={() => setComingSoonLabel(null)}
          />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
