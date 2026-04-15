"use client";

const LOGOS = [
  "Banesco",
  "Mercantil",
  "Provincial",
  "BNC",
  "Venezuela",
  "Bicentenario",
  "Exterior",
  "Sofitasa",
];

export function LogoCarousel() {
  return (
    <section className="relative z-10 w-full -mt-6 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex animate-scroll gap-16">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div
                key={i}
                className="flex h-10 shrink-0 items-center justify-center rounded-[16px] px-8"
                style={{ backgroundColor: "var(--card-bg-subtle)" }}
              >
                <span className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
