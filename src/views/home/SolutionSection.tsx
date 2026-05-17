"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  ChartPie,
  Clock,
  Sparkles,
  TargetDart,
} from "@gravity-ui/icons";
import { useQrSpotlight } from "@/views/shared/useQrSpotlight";

type FloatingPill = {
  icon: React.ComponentType<{ width?: number; height?: number }>;
  position: string;
  iconSize: number;
  /** parallax depth — bigger numbers move more with cursor */
  depth: number;
  /** float animation duration */
  duration: string;
  /** animation start delay */
  delay: string;
};

const FLOATING_PILLS: FloatingPill[] = [
  {
    icon: ChartPie,
    position: "top-6 left-4 lg:top-10 lg:left-16",
    iconSize: 56,
    depth: 14,
    duration: "6s",
    delay: "0s",
  },
  {
    icon: Clock,
    position: "top-40 right-4 lg:top-32 lg:right-16",
    iconSize: 56,
    depth: 10,
    duration: "7.5s",
    delay: "-2s",
  },
  {
    icon: TargetDart,
    position: "bottom-32 left-4 lg:bottom-24 lg:left-24",
    iconSize: 56,
    depth: 12,
    duration: "8s",
    delay: "-4s",
  },
  {
    icon: Sparkles,
    position: "bottom-6 right-4 lg:bottom-12 lg:right-16",
    iconSize: 56,
    depth: 16,
    duration: "6.5s",
    delay: "-1s",
  },
];

export function SolutionSection() {
  const { open: openQrSpotlight } = useQrSpotlight();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handleDownloadClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openQrSpotlight();
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x: normalizedX, y: normalizedY });
  };

  const handleMouseLeave = () => setPointer({ x: 0, y: 0 });

  return (
    <section
      id="solucion"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-14 lg:py-32"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 75%)",
          opacity: 0.5,
        }}
      />

      {/* Floating decorative pills */}
      {FLOATING_PILLS.map(
        ({ icon: Icon, position, iconSize, depth, duration, delay }, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`pointer-events-none absolute hidden sm:block ${position}`}
            style={{
              transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth}px, 0)`,
              transition: "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              willChange: "transform",
            }}
          >
            <div
              className="flex h-24 w-44 items-center justify-center rounded-full lg:h-28 lg:w-52"
              style={{
                backgroundColor: "var(--accent-soft-bg)",
                animation: `float ${duration} ease-in-out infinite`,
                animationDelay: delay,
              }}
            >
              <span style={{ color: "var(--accent-soft-icon)" }}>
                <Icon width={iconSize} height={iconSize} />
              </span>
            </div>
          </div>
        )
      )}

      {/* Center content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2
          className="display-heading text-[clamp(2rem,4vw,3rem)]"
          style={{ lineHeight: 1.1 }}
        >
          Nuestra app es la solución todo en uno para gestionar tu dinero y tus metas financieras.
        </h2>

        <div className="mt-8 flex w-full items-center justify-center gap-4 lg:mt-12 lg:gap-6">
          <span
            aria-hidden="true"
            className="h-px w-10 shrink-0 lg:w-16"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <p
            className="max-w-md text-sm lg:text-base"
            style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
          >
            Vive la tranquilidad de tener tus finanzas bajo control desde un solo lugar.
          </p>
          <span
            aria-hidden="true"
            className="h-px w-10 shrink-0 lg:w-16"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>

        <Link
          href="/descargar"
          onClick={handleDownloadClick}
          className="group mt-8 inline-flex items-center gap-2 rounded-full p-1.5 pl-7 transition-colors lg:mt-10"
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
    </section>
  );
}
