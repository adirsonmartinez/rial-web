import Image from "next/image";

export function BrandsBanner() {
  return (
    <section
      className="relative w-full -mt-44 pb-20 lg:-mt-72 lg:pb-24"
      style={{ backgroundColor: "transparent", zIndex: 5 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden rounded-[40px] pt-44 pb-12 lg:pt-72 lg:pb-14"
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
                  GESTIONA TUS RIALES ·
                </p>
                <p
                  className="shrink-0 pr-[0.3em] font-[family-name:var(--font-sora)] text-[9vw] font-extrabold uppercase leading-none"
                  style={{
                    color: "rgba(22, 22, 22, 0.10)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  GESTIONA TUS RIALES ·
                </p>
              </div>
            </div>

            {/* Separator — sits right below the marquee */}
            <div
              className="mx-auto mt-3 h-px w-3/4 max-w-3xl lg:mt-4"
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

            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16 [&_img]:brightness-0 [&_img]:opacity-60">
              <Image
                src="/logos/innoven-black.svg"
                alt="innoven"
                width={140}
                height={28}
                className="h-7 w-auto lg:h-9"
              />
              <Image
                src="/logos/venflow-black.png"
                alt="Venflow"
                width={140}
                height={28}
                className="h-6 w-auto lg:h-8"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                width={140}
                height={28}
                className="h-7 w-auto lg:h-9"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
