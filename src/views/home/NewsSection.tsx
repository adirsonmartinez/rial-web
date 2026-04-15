"use client";

const NEWS = [
  {
    tag: "Producto",
    title: "Rial lanza cuentas multimoneda para gestionar bolívares, dólares y euros",
    date: "15 Abr 2026",
  },
  {
    tag: "Comunidad",
    title: "Más de 40,000 usuarios ya confían en Rial para organizar sus finanzas",
    date: "10 Abr 2026",
  },
  {
    tag: "Actualización",
    title: "Nuevo registro por voz: registra tus gastos hablando con Rial",
    date: "02 Abr 2026",
  },
];

export function NewsSection() {
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Noticias
              </p>
            </div>
            <h2 className="display-heading text-[clamp(2rem,4vw,3rem)]">
              Lo último de Rial
            </h2>
          </div>
          <a href="#" className="btn-pill btn-secondary inline-flex items-center gap-2 self-start text-sm lg:self-auto" style={{ padding: "8px 16px" }}>
            Ver todas
            <span>→</span>
          </a>
        </div>

        {/* Articles grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {NEWS.map((article) => (
            <a
              key={article.title}
              href="#"
              className="group flex flex-col overflow-hidden rounded-[24px] transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--border) 0px 0px 0px 1px" }}
            >
              {/* Image placeholder */}
              <div
                className="relative flex h-[200px] items-center justify-center"
                style={{ backgroundColor: "var(--card-bg-subtle)" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: "var(--card-bg-subtle)", color: "var(--text-muted)" }}
                  >
                    {article.tag}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {article.date}
                  </span>
                </div>
                <h3
                  className="font-[family-name:var(--font-sora)] text-base font-[800] lg:text-lg group-hover:text-[#ACE524] transition-colors"
                  style={{ color: "var(--text-primary)", lineHeight: 1.3 }}
                >
                  {article.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
