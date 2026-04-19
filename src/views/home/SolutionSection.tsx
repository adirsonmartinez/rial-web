"use client";

import Image from "next/image";
import { useState } from "react";

const SEGMENTS = [
  {
    id: "organizar",
    label: "Organizar",
    description:
      "Registra y visualiza todos tus ingresos y gastos en un solo lugar. Sabe exactamente a dónde va cada rial.",
    image: "https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Planificador con pluma sobre un escritorio",
  },
  {
    id: "ahorrar",
    label: "Ahorrar",
    description:
      "Define metas, crea presupuestos y haz seguimiento de tu progreso para alcanzar tus objetivos financieros.",
    image: "https://images.unsplash.com/photo-1488398729765-41b1c297157d?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Alcancía blanca junto a monedas apiladas",
  },
  {
    id: "convertir",
    label: "Convertir",
    description:
      "Gestiona bolívares, dólares y euros con tasas actualizadas. Siempre sabrás cuánto vale tu dinero.",
    image: "https://images.unsplash.com/photo-1764865988307-a7abe207fa1d?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Billetes de dólares y euros sobre una superficie",
  },
];

export function SolutionSection() {
  const [activeId, setActiveId] = useState("organizar");
  const active = SEGMENTS.find((s) => s.id === activeId)!;

  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="relative mx-auto max-w-7xl px-6 lg:min-h-[720px]">
        {/* Title — top left */}
        <div className="flex items-center gap-2 mb-10">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>¿Qué puedes hacer con Rial?</p>
        </div>

        {/* Image — top right, aligned with title */}
        <div className="relative mb-10 lg:absolute lg:top-0 lg:right-6 lg:w-[48%] lg:mb-0">
          <div className="relative w-full overflow-hidden rounded-[30px] h-[450px] lg:h-[720px]" style={{ backgroundColor: "var(--card-bg-subtle)" }}>
            {SEGMENTS.map((segment) => (
              <Image
                key={segment.id}
                src={segment.image}
                alt={segment.imageAlt}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                priority={segment.id === "organizar"}
                className="object-cover transition-opacity duration-500 ease-out"
                style={{ opacity: segment.id === activeId ? 1 : 0 }}
              />
            ))}
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
