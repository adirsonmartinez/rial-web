"use client";

import Image from "next/image";
import { AppStoreBadge, GooglePlayBadge } from "./StoreBadges";
import { LogoCarousel } from "./LogoCarousel";

const AVATARS = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=4",
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Green glow accents */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 70% 30%, var(--hero-glow-1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 20% 80%, var(--hero-glow-2) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-32 pb-20 lg:flex-row lg:pt-36 lg:pb-28">

        <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Acelerados por</span>
            <a href="https://squareonecap.com/innoven" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <Image
                src="/logos/innoven-black.svg"
                alt="Innoven"
                width={80}
                height={20}
                className="block dark:hidden"
              />
              <Image
                src="/logos/innoven-white.svg"
                alt="Innoven"
                width={80}
                height={20}
                className="hidden dark:block"
              />
            </a>
          </div>
          <h1 className="display-heading text-[clamp(2.25rem,4vw,4.5rem)]">
            Tus riales.<br />Tu control.<br />Una sola app.
          </h1>
          <p className="max-w-md text-lg" style={{ lineHeight: 1.5, color: "var(--text-secondary)" }}>
            Rial te ayuda a organizar, ahorrar y gestionar tu dinero en bolívares, dólares y euros desde un solo lugar.
          </p>
          <div className="flex justify-center gap-3 lg:justify-start">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
          <div className="flex flex-col items-center gap-4 pt-4 lg:items-start">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {AVATARS.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[#ACE524]"
                  />
                ))}
              </div>
              <div className="h-8 w-px" style={{ backgroundColor: "var(--border)" }} />
              <p className="text-sm font-medium lg:text-lg" style={{ color: "var(--text-primary)" }}>+40K usuarios registrados</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 justify-center">
          <div className="relative h-[350px] w-[280px] overflow-hidden rounded-[40px] bg-[#ACE524] px-4 sm:h-[400px] sm:w-[320px] sm:px-6 lg:h-[580px] lg:w-[480px]">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
                `,
                backgroundSize: "20px 30px",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
              }}
            />
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[30px]">
              <Image
                src="/hero-img.avif"
                alt="Persona usando Rial"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="absolute -left-16 top-1/3 z-20 scale-75 rounded-[30px] p-4 backdrop-blur-xl sm:-left-14 sm:scale-90 lg:-left-6 lg:top-1/2 lg:-translate-y-1/2 lg:scale-100" style={{ animation: "float 3s ease-in-out infinite", backgroundColor: "var(--glass-bg)", boxShadow: "var(--glass-border) 0px 0px 0px 1px" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ahorros</p>
            <p className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>$1,980.00</p>
            <div className="mt-2 flex items-end gap-1">
              {[40, 60, 45, 70, 55, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-4 rounded-sm bg-[#ACE524]"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>
          </div>

          <div className="absolute -right-16 bottom-16 z-20 scale-75 rounded-[30px] p-4 backdrop-blur-xl sm:-right-14 sm:scale-90 lg:-right-6 lg:bottom-20 lg:scale-100" style={{ animation: "float-delayed 3s ease-in-out infinite", backgroundColor: "var(--glass-bg)", boxShadow: "var(--glass-border) 0px 0px 0px 1px" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ingresos · 30 días</p>
            <p className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>$12,000</p>
          </div>
        </div>
      </div>
      <LogoCarousel />
    </section>
  );
}
