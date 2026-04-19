"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const FEATURES = [
  {
    title: "Cuentas multimoneda",
    description: "Gestiona bolívares, dólares y euros desde un solo lugar.",
  },
  {
    title: "Metas de ahorro",
    description: "Define objetivos financieros y haz seguimiento de tu progreso.",
  },
  {
    title: "Presupuestos inteligentes",
    description: "Crea presupuestos y recibe alertas antes de exceder tus límites.",
  },
  {
    title: "Registro por voz",
    description: "Registra gastos con un simple mensaje de voz.",
  },
  {
    title: "Calculadora de tasas",
    description: "Convierte entre monedas al instante con tasas actualizadas.",
  },
  {
    title: "Plantillas de transacciones",
    description: "Automatiza tus transacciones recurrentes con un solo toque.",
  },
];

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-10">
          {/* Left: heading + description */}
          <div className="flex flex-col gap-6 lg:w-[35%] lg:shrink-0 lg:pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Funcionalidades
              </p>
            </div>

            <h2 className="display-heading text-[clamp(2rem,4vw,3.5rem)]">
              Herramientas para cada rial.
            </h2>

            <p className="text-base lg:text-lg" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Todo lo que necesitas para organizar, ahorrar y hacer crecer tu dinero — en una sola app.
            </p>

            <a href="#" className="btn-pill btn-primary inline-flex items-center gap-2 self-start text-sm" style={{ padding: "10px 20px" }}>
              Ver todo
              <span>→</span>
            </a>
          </div>

          {/* Right: horizontal scroll cards */}
          <div className="flex flex-col gap-6 lg:w-[65%]">
            <div
              ref={scrollRef}
              className="relative flex gap-4 overflow-x-auto py-1 pb-4 px-1 select-none"
              style={{ scrollbarWidth: "none", cursor: isDragging ? "grabbing" : "grab" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="relative flex-shrink-0 w-[260px] lg:w-[280px] rounded-[24px] overflow-hidden"
                  style={{ boxShadow: "var(--border) 0px 0px 0px 1px" }}
                >
                  {/* Image placeholder */}
                  <div className="relative flex h-[240px] lg:h-[280px] items-center justify-center" style={{ backgroundColor: "var(--card-bg-subtle)" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="p-5" style={{ backgroundColor: "var(--bg-card)" }}>
                    <h3 className="font-[family-name:var(--font-sora)] text-base font-[800]" style={{ color: "var(--text-primary)" }}>
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ lineHeight: 1.5, color: "var(--text-muted)" }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: "var(--border)" }}>
              <div
                className="h-full rounded-full bg-[#ACE524] transition-all duration-150"
                style={{ width: "30%", marginLeft: `${scrollProgress * 70}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
