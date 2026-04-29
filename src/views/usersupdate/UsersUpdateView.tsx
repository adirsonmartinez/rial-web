"use client";

import Image from "next/image";
import { useUserCount, formatExactCount } from "@/views/shared/useUserCount";

export function UsersUpdateView() {
  const count = useUserCount();
  const updatedAt = new Date().toLocaleString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, var(--hero-glow-1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <Image
          src="/logos/logo-dark.png"
          alt="Rial"
          width={120}
          height={48}
          className="block dark:hidden h-auto"
          priority
        />
        <Image
          src="/logos/logo-light.png"
          alt="Rial"
          width={120}
          height={48}
          className="hidden dark:block h-auto"
          priority
        />

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            En vivo
          </span>
        </div>

        <h1 className="display-heading text-[clamp(2rem,4vw,3.5rem)]">
          Usuarios registrados
        </h1>

        <p
          className="font-[family-name:var(--font-sora)] tabular-nums font-[800] text-[clamp(4rem,12vw,9rem)]"
          style={{ lineHeight: 1, color: "var(--text-primary)" }}
        >
          {formatExactCount(count)}
        </p>

        <p
          className="max-w-xl text-base lg:text-lg"
          style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}
        >
          Cada cifra representa a una persona que está tomando el control de
          sus finanzas en bolívares, dólares y euros con Rial.
        </p>

        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Actualizado: {updatedAt}
        </p>
      </div>
    </section>
  );
}
