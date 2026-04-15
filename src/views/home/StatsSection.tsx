"use client";

const STATS = [
  { value: "+40K", label: "usuarios registrados" },
  { value: "3", label: "monedas soportadas" },
  { value: "10+", label: "bancos conectados" },
  { value: "24/7", label: "disponibilidad total" },
];

export function StatsSection() {
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header — centered */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          <h2 className="display-heading text-[clamp(2rem,4vw,3.5rem)]">
            Datos y cifras
          </h2>
          <p className="max-w-xl text-base lg:text-lg" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Rial es la app que los venezolanos eligen para organizar sus finanzas. Con valoraciones en{" "}
            <a href="#" className="font-medium underline" style={{ color: "var(--text-primary)" }}>App Store</a>
            {" "}y{" "}
            <a href="#" className="font-medium underline" style={{ color: "var(--text-primary)" }}>Google Play</a>
            {" "}que lo respaldan. Únete a miles de personas que ya confían en Rial.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-3 py-8 lg:py-0"
              style={i > 0 ? { borderLeft: "1px solid var(--border)" } : undefined}
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
