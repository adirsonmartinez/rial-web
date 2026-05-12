import Image from "next/image";
import {
  Calculator,
  ChartPie,
  CircleDollar,
  Microphone,
  TargetDart,
} from "@gravity-ui/icons";

const FEATURES_TOP = [
  {
    icon: ChartPie,
    title: "Presupuestos",
    description: "Define límites por categoría y recibe alertas a tiempo.",
  },
  {
    icon: CircleDollar,
    title: "Multimoneda",
    description: "Bolívares, dólares y euros en un solo balance.",
  },
  {
    icon: TargetDart,
    title: "Metas de ahorro",
    description: "Define objetivos y sigue tu progreso cada semana.",
  },
];

const FEATURES_BOTTOM = [
  {
    icon: Microphone,
    title: "Registro por voz",
    description: "Anota un gasto con un mensaje de voz, sin escribir.",
  },
  {
    icon: Calculator,
    title: "Calculadora de tasas",
    description: "Convierte entre monedas al instante con tasas reales.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="funciones"
      className="relative w-full overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Watermark text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 select-none text-center opacity-15 dark:opacity-10"
        style={{
          color: "var(--accent-soft-icon)",
          fontFamily: "var(--font-sora), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(7rem, 18vw, 16rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          transform: "translateY(-30%)",
        }}
      >
        FUNCIONES
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2
          className="display-heading text-center text-[clamp(2rem,5vw,3.75rem)]"
          style={{ lineHeight: 1.1 }}
        >
          <span className="block">Hecho para llevar</span>
          <span className="block">tus riales más lejos</span>
        </h2>

        <div className="mt-14 flex flex-col items-center gap-5">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURES_TOP.map((feature) => (
              <FeaturePill key={feature.title} {...feature} />
            ))}
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:w-2/3 md:grid-cols-2">
            {FEATURES_BOTTOM.map((feature) => (
              <FeaturePill key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        {/* Phone mockup — half visible with fade at bottom */}
        <div className="relative mx-auto mt-16 h-[280px] w-full max-w-[560px] overflow-hidden sm:h-[380px] sm:max-w-[640px] lg:h-[480px] lg:max-w-[760px]">
          <div
            className="absolute inset-x-0 top-0 h-[200%]"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 95%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 95%)",
            }}
          >
            <Image
              src="/2.png"
              alt="App Rial"
              fill
              sizes="(max-width: 640px) 100vw, 760px"
              className="object-contain"
              style={{
                objectPosition: "top",
                filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.22))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type PillProps = {
  icon: React.ComponentType<{ width?: number; height?: number }>;
  title: string;
  description: string;
};

function FeaturePill({ icon: Icon, title, description }: PillProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-3xl bg-black/[0.025] p-4 dark:bg-white/[0.03] lg:p-5"
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: "var(--accent-soft-bg)",
          color: "var(--accent-soft-icon)",
        }}
      >
        <Icon width={22} height={22} />
      </span>
      <div className="min-w-0">
        <p
          className="font-[family-name:var(--font-sora)] text-base font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
