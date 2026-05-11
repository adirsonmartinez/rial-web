"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import {
  CircleCheck,
  CircleExclamation,
  CircleXmark,
  Clock,
} from "@gravity-ui/icons";

export type CheckoutResultStatus = "success" | "pending" | "error" | "cancelled";

type StatusConfig = {
  icon: typeof CircleCheck;
  iconBg: string;
  iconColor: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const statusConfig: Record<CheckoutResultStatus, StatusConfig> = {
  success: {
    icon: CircleCheck,
    iconBg: "var(--accent-soft-bg)",
    iconColor: "var(--accent-soft-icon)",
    eyebrow: "Pago confirmado",
    title: "¡Bienvenido a Rial Plus!",
    description:
      "Ya tienes acceso a todas las funciones premium. Te enviamos el comprobante por correo.",
    primaryCta: { label: "Ir al dashboard", href: "/app" },
  },
  pending: {
    icon: Clock,
    iconBg: "var(--accent-soft-bg)",
    iconColor: "var(--accent-soft-icon)",
    eyebrow: "Pago en proceso",
    title: "Estamos verificando tu pago",
    description:
      "Esto puede tardar unos segundos. Activaremos tu suscripción automáticamente cuando el banco confirme la operación.",
    primaryCta: { label: "Ir al dashboard", href: "/app" },
  },
  error: {
    icon: CircleExclamation,
    iconBg: "rgba(239, 68, 68, 0.12)",
    iconColor: "rgb(220, 38, 38)",
    eyebrow: "Pago no completado",
    title: "No pudimos procesar tu pago",
    description:
      "Tu banco rechazó la operación o se interrumpió la autorización. Puedes intentarlo de nuevo o probar con otro método.",
    primaryCta: { label: "Reintentar", href: "/app/plan" },
    secondaryCta: { label: "Volver al dashboard", href: "/app" },
  },
  cancelled: {
    icon: CircleXmark,
    iconBg: "var(--card-bg-subtle)",
    iconColor: "var(--text-muted)",
    eyebrow: "Pago cancelado",
    title: "Cancelaste el proceso de pago",
    description:
      "No realizamos ningún cargo. Cuando quieras retomar tu suscripción, vuelve a la página de planes.",
    primaryCta: { label: "Ver planes", href: "/app/plan" },
    secondaryCta: { label: "Volver al dashboard", href: "/app" },
  },
};

export function CheckoutResultView({
  status,
}: {
  status: CheckoutResultStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 py-16 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: config.iconBg, color: config.iconColor }}
      >
        <Icon width={32} height={32} />
      </span>

      <span
        className="mt-6 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {config.eyebrow}
      </span>

      <h1
        className="display-heading mt-2 text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        {config.title}
      </h1>

      <p
        className="mt-3 max-w-[420px] text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {config.description}
      </p>

      <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
        <Button
          variant="primary"
          fullWidth
          className="h-12"
          render={(props) => (
            <Link
              {...(props as unknown as React.ComponentProps<typeof Link>)}
              href={config.primaryCta.href}
            />
          )}
        >
          {config.primaryCta.label}
        </Button>

        {config.secondaryCta && (
          <Button
            variant="secondary"
            fullWidth
            className="h-12"
            render={(props) => (
              <Link
                {...(props as unknown as React.ComponentProps<typeof Link>)}
                href={config.secondaryCta!.href}
              />
            )}
          >
            {config.secondaryCta.label}
          </Button>
        )}
      </div>
    </div>
  );
}
