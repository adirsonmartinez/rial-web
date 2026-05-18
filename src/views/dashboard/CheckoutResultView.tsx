"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  CircleCheck,
  CircleExclamation,
  CircleXmark,
  Clock,
} from "@gravity-ui/icons";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";

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

const POLL_INTERVAL_MS = 2500;
const POLL_MAX_ATTEMPTS = 24; // ~60 seconds total

function fireConfetti() {
  const duration = 1500;
  const end = Date.now() + duration;
  const colors = ["#ACE524", "#709517", "#FFFFFF"];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      startVelocity: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      startVelocity: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Final celebratory burst
  confetti({
    particleCount: 80,
    spread: 90,
    origin: { y: 0.6 },
    colors,
  });
}

function usePlusActivationPolling(enabled: boolean, onActive: () => void) {
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    let cancelled = false;
    let attempts = 0;

    const tick = async () => {
      if (cancelled) return;
      attempts += 1;

      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (userId) {
        const { data } = await supabase
          .from("users")
          .select("subscription_plan, subscription_status, subscription_expires_at")
          .eq("id", userId)
          .maybeSingle();

        if (data && isPlusActive(data)) {
          onActiveRef.current();
          return;
        }
      }

      if (attempts >= POLL_MAX_ATTEMPTS) return;
      setTimeout(tick, POLL_INTERVAL_MS);
    };

    void tick();

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}

type SubscriptionRow = {
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
};

function isPlusActive(row: SubscriptionRow): boolean {
  if (row.subscription_plan !== "plus") return false;
  if (
    row.subscription_status !== "active" &&
    row.subscription_status !== "trialing"
  ) {
    return false;
  }
  if (row.subscription_expires_at) {
    if (new Date(row.subscription_expires_at).getTime() <= Date.now()) {
      return false;
    }
  }
  return true;
}

export function CheckoutResultView({
  status: initialStatus,
}: {
  status: CheckoutResultStatus;
}) {
  const [status, setStatus] = useState<CheckoutResultStatus>(initialStatus);
  const confettiFiredRef = useRef(false);
  const router = useRouter();

  usePlusActivationPolling(status === "pending", () => {
    setStatus("success");
  });

  useEffect(() => {
    if (status === "success" && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fireConfetti();
    }
  }, [status]);

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
          onPress={() => router.push(config.primaryCta.href)}
        >
          {config.primaryCta.label}
        </Button>

        {config.secondaryCta && (
          <Button
            variant="secondary"
            fullWidth
            className="h-12"
            onPress={() => router.push(config.secondaryCta!.href)}
          >
            {config.secondaryCta.label}
          </Button>
        )}
      </div>
    </div>
  );
}
