"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars, Xmark } from "@gravity-ui/icons";
import { ThemeToggleButton } from "@/views/shared/ThemeToggleButton";

const NAV_LINKS = [
  { href: "/precios", label: "Precios" },
  { href: "/soporte", label: "Soporte" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 lg:top-6">
      <nav
        className="relative mx-auto flex h-20 w-full max-w-[1232px] items-center justify-between rounded-full px-3 pl-6 backdrop-blur-md"
        style={{
          backgroundColor: "var(--navbar-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="no-underline">
            <Image
              src="/logos/logo-dark.png"
              alt="Rial"
              width={82}
              height={32}
              className="block dark:hidden h-auto"
              priority
            />
            <Image
              src="/logos/logo-light.png"
              alt="Rial"
              width={82}
              height={32}
              className="hidden dark:block h-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors"
                  style={{
                    color: active
                      ? "var(--accent-soft-icon)"
                      : "var(--text-primary)",
                    backgroundColor: active
                      ? "var(--accent-soft-bg)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <Link
            href="/login"
            className="btn-pill btn-primary cursor-pointer text-sm no-underline"
            style={{ padding: "8px 18px" }}
          >
            Ingresar
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--card-bg-hover)] md:hidden"
            style={{ color: "var(--text-primary)" }}
          >
            {mobileOpen ? <Xmark width={20} height={20} /> : <Bars width={20} height={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`absolute left-0 right-0 top-full mt-3 origin-top transition-all duration-200 md:hidden ${
            mobileOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div
            className="mx-auto flex w-full max-w-[1232px] flex-col gap-1 rounded-3xl p-2 backdrop-blur-md"
            style={{
              backgroundColor: "var(--navbar-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium no-underline transition-colors"
                  style={{
                    color: active
                      ? "var(--accent-soft-icon)"
                      : "var(--text-primary)",
                    backgroundColor: active
                      ? "var(--accent-soft-bg)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
