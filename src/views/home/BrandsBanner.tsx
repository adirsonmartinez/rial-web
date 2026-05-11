const PLACEHOLDER_LOGOS = [
  "Logoipsum",
  "logo · ipsum",
  "Logoipsum",
  "IPSUM",
  "Logoipsum",
];

export function BrandsBanner() {
  return (
    <section
      className="relative w-full -mt-44 pb-20 lg:-mt-72 lg:pb-24"
      style={{ backgroundColor: "transparent", zIndex: 5 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden rounded-[40px] pt-48 pb-12 lg:pt-80 lg:pb-14"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {/* Watermark + separator — animated marquee, faded edges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-10 lg:top-20"
          >
            <div
              className="overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              }}
            >
              <div className="flex animate-scroll whitespace-nowrap">
                <p
                  className="shrink-0 pr-[0.3em] font-[family-name:var(--font-sora)] text-[9vw] font-extrabold uppercase leading-none"
                  style={{
                    color: "rgba(22, 22, 22, 0.10)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  GESTIONA · TU DINERO · CON RIAL ·
                </p>
                <p
                  className="shrink-0 pr-[0.3em] font-[family-name:var(--font-sora)] text-[9vw] font-extrabold uppercase leading-none"
                  style={{
                    color: "rgba(22, 22, 22, 0.10)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  GESTIONA · TU DINERO · CON RIAL ·
                </p>
              </div>
            </div>

            {/* Separator — sits right below the marquee */}
            <div
              className="mx-auto mt-12 h-px w-3/4 max-w-3xl lg:mt-16"
              style={{
                backgroundColor: "rgba(22, 22, 22, 0.18)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 px-6 pt-0 lg:pt-2">
            <p
              className="max-w-2xl text-center text-xl lg:text-3xl"
              style={{
                color: "var(--accent-foreground)",
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              En alianza con marcas que están revolucionando los servicios financieros.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
              {PLACEHOLDER_LOGOS.map((name, i) => (
                <span
                  key={i}
                  className="font-[family-name:var(--font-sora)] text-base font-bold uppercase tracking-wide lg:text-lg"
                  style={{
                    color: "var(--accent-foreground)",
                    opacity: 0.55,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
