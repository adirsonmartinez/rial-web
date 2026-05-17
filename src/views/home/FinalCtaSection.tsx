"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useQrSpotlight } from "@/views/shared/useQrSpotlight";

export function FinalCtaSection() {
  const { open: openQrSpotlight } = useQrSpotlight();

  const handleDownloadClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openQrSpotlight();
  };

  return (
    <section
      className="relative w-full py-20 lg:py-24"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2
          className="display-heading text-[clamp(2rem,4vw,3rem)]"
          style={{ lineHeight: 1.1 }}
        >
          Empieza a organizar tus riales hoy mismo
        </h2>
        <p
          className="mt-5 max-w-xl text-base lg:text-lg"
          style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
        >
          Descarga Rial gratis y toma el control de tus finanzas en bolívares, dólares y euros.
        </p>

        <Link
          href="/descargar"
          onClick={handleDownloadClick}
          className="group mt-10 inline-flex items-center gap-2 rounded-full p-1.5 pl-7 transition-colors"
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
