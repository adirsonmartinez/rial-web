"use client";

import { useState } from "react";

const SEGMENTS = [
  {
    id: "personas",
    label: "Personas",
    description:
      "Organiza tus ingresos y gastos en bolívares, dólares y euros desde un solo lugar. Con Rial tienes el control total de tu dinero sin importar la moneda.",
  },
  {
    id: "emprendedores",
    label: "Emprendedores",
    description:
      "Lleva las finanzas de tu negocio con claridad. Separa lo personal de lo profesional, registra ingresos por cliente y controla cada bolívar que entra y sale.",
  },
  {
    id: "familias",
    label: "Familias",
    description:
      "Gestiona el presupuesto familiar entre todos. Define metas de ahorro compartidas, asigna presupuestos por categoría y mantén a todos en la misma página.",
  },
];

export function SolutionSection() {
  const [activeId, setActiveId] = useState("personas");
  const active = SEGMENTS.find((s) => s.id === activeId)!;

  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="relative mx-auto max-w-7xl px-6 lg:min-h-[720px]">
        {/* Title — top left */}
        <p className="text-sm font-medium mb-10" style={{ color: "var(--text-muted)" }}>¿Para quién es Rial?</p>

        {/* Image — top right, aligned with title */}
        <div className="relative mb-10 lg:absolute lg:top-0 lg:right-6 lg:w-[48%] lg:mb-0">
          <div className="relative flex w-full rounded-[30px] h-[450px] lg:h-[720px] items-center justify-center" style={{ backgroundColor: "var(--card-bg-subtle)" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        {/* Left content — pushed to the bottom */}
        <div className="flex flex-col justify-end gap-8 lg:w-[48%] lg:min-h-[660px]">
          {/* Segment tabs */}
          <div className="flex flex-col gap-2">
            {SEGMENTS.map((segment) => (
              <button
                key={segment.id}
                onClick={() => setActiveId(segment.id)}
                className="text-left font-[family-name:var(--font-sora)] font-[800] cursor-pointer transition-all duration-300 ease-out origin-left text-4xl lg:text-5xl"
                style={{
                  lineHeight: 1.2,
                  color: segment.id === activeId ? "var(--text-primary)" : "var(--text-muted)",
                  transform: segment.id === activeId ? "scale(1.1)" : "scale(1)",
                }}
              >
                {segment.label}
              </button>
            ))}
          </div>

          {/* Description */}
          <p className="max-w-md text-base lg:text-lg" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {active.description}
          </p>

          <a href="#" className="btn-pill btn-secondary inline-flex items-center gap-2 self-start text-sm">
            Conoce más
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
