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
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-28">

      <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
        <h1 className="display-heading text-[clamp(2.5rem,5vw,6rem)]">
          Toma el control de tu dinero con Rial!
        </h1>
        <p className="max-w-md text-lg text-[#2D3B44]" style={{ lineHeight: 1.5 }}>
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
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
            <div className="h-8 w-px bg-[#EEEEEE]" />
            <p className="text-sm font-medium text-[#161616] lg:text-lg">+40K usuarios registrados</p>
          </div>
          <p className="text-sm text-[#8E9399]">
            Acelerados por{" "}
            <a href="https://squareonecap.com/innoven" target="_blank" rel="noopener noreferrer" className="font-medium text-[#161616] underline hover:text-[#ACE524]">
              Innoven
            </a>
          </p>
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

        <div className="absolute -left-16 top-1/3 z-20 scale-75 rounded-[30px] bg-white p-4 sm:-left-14 sm:scale-90 lg:-left-6 lg:top-1/2 lg:-translate-y-1/2 lg:scale-100" style={{ animation: "float 3s ease-in-out infinite", boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
          <p className="text-xs text-[#8E9399]">Ahorros</p>
          <p className="text-xl font-medium text-[#161616]">$1,980.00</p>
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

        <div className="absolute -right-16 bottom-16 z-20 scale-75 rounded-[30px] bg-white p-4 sm:-right-14 sm:scale-90 lg:-right-6 lg:bottom-20 lg:scale-100" style={{ animation: "float-delayed 3s ease-in-out infinite", boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
          <p className="text-xs text-[#8E9399]">Ingresos · 30 días</p>
          <p className="text-2xl font-medium text-[#161616]">$12,000</p>
        </div>
      </div>
      </div>
      <LogoCarousel />
    </section>
  );
}
