"use client";

import Image from "next/image";
import { useUserCount, formatMilestone } from "@/views/shared/useUserCount";

const AVATARS = [
  "https://api.dicebear.com/9.x/notionists/svg?seed=Sofia&backgroundColor=ACE524",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Daniel&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Andrea&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Luis&backgroundColor=b6e3f4",
];

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5A524">
      <path d="M12 2l2.9 6.9L22 9.7l-5.5 4.7L18 22l-6-3.5L6 22l1.5-7.6L2 9.7l7.1-.8L12 2z" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section
      className="w-full py-20 lg:py-28"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: "var(--card-bg-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <Star size={12} />
            Testimonios
          </span>

          <h2
            className="display-heading text-[clamp(2rem,4vw,3rem)]"
            style={{ lineHeight: 1.05 }}
          >
            Reseñas de nuestros Rialuos
          </h2>

          <div className="mt-2 flex items-center gap-5">
            <div className="flex -space-x-3">
              {AVATARS.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border-2 object-cover"
                  style={{ borderColor: "var(--bg-primary)" }}
                />
              ))}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} />
                ))}
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                +400 reseñas
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.8fr]">
          <StatCard />
          <FeaturedReview />
        </div>
      </div>
    </section>
  );
}

function StatCard() {
  const count = useUserCount();
  return (
    <div
      className="flex h-full min-h-[220px] flex-col justify-between rounded-[32px] p-6 lg:min-h-[360px] lg:p-10"
      style={{
        backgroundColor: "var(--accent)",
        color: "var(--accent-foreground)",
      }}
    >
      <div>
        <p
          className="font-[family-name:var(--font-sora)] text-[clamp(3rem,9vw,7rem)] font-extrabold leading-none"
        >
          {formatMilestone(count)}
        </p>
        <p className="mt-4 max-w-xs text-base leading-snug lg:mt-6 lg:text-xl">
          Personas registrando sus finanzas en Rial.
        </p>
      </div>
      <p className="mt-6 text-sm font-semibold lg:mt-10">
        Usuarios activos en la app
      </p>
    </div>
  );
}

function FeaturedReview() {
  return (
    <div
      className="flex h-full flex-col rounded-[32px] p-8 lg:p-10"
      style={{
        backgroundColor: "var(--card-bg-subtle)",
        minHeight: 360,
      }}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={20} />
        ))}
      </div>

      <h3
        className="mt-6 font-[family-name:var(--font-sora)] text-2xl font-extrabold leading-snug lg:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        Rial es la forma más simple de ver todo mi dinero en un solo lugar.
      </h3>

      <p
        className="mt-5 text-base lg:text-lg"
        style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
      >
        Antes tenía un Excel para los bolívares y otra app para los dólares. Con Rial veo el balance total, mis metas y los gastos del mes sin saltar entre pantallas. Es lo más parecido a tener un asistente financiero personal.
      </p>

      <div className="mt-auto flex items-end justify-between pt-8">
        <div className="flex items-center gap-3">
          <Image
            src="https://api.dicebear.com/9.x/lorelei/svg?seed=Valentina&backgroundColor=c0aede"
            alt="Andrea Méndez"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p
              className="font-[family-name:var(--font-sora)] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Andrea Méndez
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Diseñadora · Caracas
            </p>
          </div>
        </div>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          12 mar, 2026
        </p>
      </div>
    </div>
  );
}
