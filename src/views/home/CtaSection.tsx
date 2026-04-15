"use client";

export function CtaSection() {
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col overflow-hidden rounded-[30px] lg:flex-row" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--border) 0px 0px 0px 1px" }}>
          {/* Left: text + CTA */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-10 text-center lg:items-start lg:p-16 lg:text-left">
            <h2 className="display-heading text-[clamp(1.75rem,3vw,2.5rem)] max-w-md">
              Toma el control de tus finanzas hoy
            </h2>
            <p className="max-w-sm text-sm lg:text-base" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Si estás buscando una forma simple de organizar tu dinero en Venezuela, el primer paso es descargar Rial.
            </p>
            <a href="#" className="btn-pill btn-primary inline-flex items-center gap-2 text-sm" style={{ padding: "10px 20px" }}>
              Descargar Rial
              <span>→</span>
            </a>
          </div>

          {/* Right: image placeholder */}
          <div className="relative flex h-[250px] items-center justify-center lg:h-auto lg:w-[45%]" style={{ backgroundColor: "var(--card-bg-subtle)" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
