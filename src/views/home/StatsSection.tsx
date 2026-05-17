"use client";

import { useUserCount, formatMilestone } from "@/views/shared/useUserCount";

const STATIC_STATS = [
  { value: "3", label: "monedas soportadas" },
  { value: "100%", label: "gratis para empezar" },
  { value: "24/7", label: "disponibilidad total" },
];

export function StatsSection() {
  const count = useUserCount();

  const stats = [
    { value: formatMilestone(count), label: "usuarios registrados" },
    ...STATIC_STATS,
  ];

  return (
    <section className="relative w-full -mt-40 py-20 lg:-mt-60 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header — centered */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          <h2 className="display-heading text-[clamp(2rem,4vw,3rem)]">
            Datos y cifras
          </h2>
          <p className="max-w-xl text-base lg:text-lg" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Rial es la app que los venezolanos eligen para organizar sus finanzas. Con valoraciones en{" "}
            <a
              href="https://apps.apple.com/us/app/rial-finanzas-personales/id6755372307"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: "var(--text-primary)" }}
            >
              App Store
            </a>
            {" "}y{" "}
            <a
              href="https://play.google.com/store/apps/details?id=com.adimtnez.rial&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: "var(--text-primary)" }}
            >
              Google Play
            </a>
            {" "}que lo respaldan. Únete a miles de personas que ya confían en Rial.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative flex flex-col items-center gap-3 py-8 lg:py-0 ${
                i > 0
                  ? "before:absolute before:left-1/2 before:top-0 before:h-px before:w-12 before:-translate-x-1/2 before:bg-[color:var(--border)] before:content-[''] lg:before:left-0 lg:before:top-1/2 lg:before:h-12 lg:before:w-px lg:before:-translate-x-0 lg:before:-translate-y-1/2"
                  : ""
              }`}
            >
              <span
                className="font-[family-name:var(--font-sora)] text-4xl font-[800] lg:text-5xl"
                style={{ lineHeight: 1, color: "var(--text-primary)" }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-center" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
