"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useUserCount, formatMilestone } from "@/views/shared/useUserCount";

const STAT_AVATARS = [
  "/founders/adirson-martinez.png",
  "/founders/anselmo-velazco.png",
  "/founders/inaki-umerez.png",
];

export function HeroSectionV2() {
  const count = useUserCount();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: normalizedY * -8, y: normalizedX * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Subtle grid pattern — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: "0 100%",
          maskImage:
            "radial-gradient(ellipse 50% 50% at 15% 85%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 50% 50% at 15% 85%, black 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-8 pb-24 lg:grid-cols-[1.3fr_1.5fr_0.7fr] lg:gap-10 lg:pt-12 lg:pb-32">
        {/* Left: heading + CTA */}
        <div className="flex flex-col gap-12">
          <h2 className="display-heading text-[clamp(2.75rem,7vw,5rem)]">
            <span className="block">Empieza a</span>
            <span className="block">gestionar</span>
            <span className="block">tu dinero</span>
            <span className="mt-3 flex items-center gap-5">
              <span
                aria-hidden="true"
                className="hidden h-px w-16 shrink-0 sm:block lg:w-24"
                style={{ backgroundColor: "var(--text-muted)" }}
              />
              <span
                className="text-[clamp(2rem,5vw,3.75rem)]"
                style={{ color: "var(--text-muted)", fontWeight: 600 }}
              >
                con Rial
              </span>
            </span>
          </h2>

          <div>
            <Link
              href="#descargar"
              className="group inline-flex items-center gap-2 rounded-full p-1.5 pl-7 transition-colors"
              style={{ backgroundColor: "var(--accent-soft-bg)" }}
            >
              <span
                className="text-base font-medium lg:text-lg"
                style={{ color: "var(--accent-soft-icon)" }}
              >
                Empieza gratis
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Middle: device mockup */}
        <div
          className="relative order-last flex h-[460px] items-center justify-center sm:h-[580px] lg:order-none lg:h-[900px] lg:translate-y-[18%]"
          style={{ perspective: "1500px", zIndex: 30 }}
        >
          {/* Float wrapper — idle bobbing */}
          <div
            className="relative h-full w-full"
            style={{ animation: "float 6s ease-in-out infinite" }}
          >
            {/* Tilt wrapper — follows cursor */}
            <div
              className="relative h-full w-full"
              style={{
                transform: `rotate(8deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <Image
                src="/iPhone 15.png"
                alt="App Rial en iPhone"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 40px 60px rgba(0, 0, 0, 0.25))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: description + stat */}
        <div className="flex flex-col gap-10 lg:gap-14">
          <div className="flex flex-col gap-6">
            <CrosshairMark />
            <p
              className="text-lg lg:text-xl"
              style={{ lineHeight: 1.45, color: "var(--text-primary)" }}
            >
              Simplifica tu vida financiera. Nuestra app intuitiva hace que gestionar tu dinero sea fácil.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {STAT_AVATARS.map((src) => (
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
              <p
                className="font-[family-name:var(--font-sora)] text-4xl font-extrabold tabular-nums lg:text-5xl"
                style={{ color: "var(--text-primary)" }}
              >
                {formatMilestone(count)}
              </p>
            </div>
            <p
              className="text-sm lg:text-base"
              style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
            >
              Miles de personas en Venezuela ya confían en Rial para organizar su dinero.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CrosshairMark() {
  return (
    <svg
      aria-hidden="true"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="var(--accent-soft-icon)"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="24" y1="6" x2="24" y2="20" />
      <line x1="24" y1="28" x2="24" y2="42" />
      <line x1="6" y1="24" x2="20" y2="24" />
      <line x1="28" y1="24" x2="42" y2="24" />
    </svg>
  );
}
