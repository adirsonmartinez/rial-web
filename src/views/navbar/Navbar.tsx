"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/views/shared/ThemeToggle";

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "backdrop-blur-md" : "bg-transparent"}`}
      style={scrolled ? { backgroundColor: "var(--navbar-bg)", borderBottom: "1px solid var(--border)" } : { borderBottom: "1px solid var(--border)" }}
    >
      <nav className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="no-underline">
            <Image
              src="/logos/logo-dark.png"
              alt="Rial"
              width={90}
              height={36}
              className="block dark:hidden h-auto"
              priority
            />
            <Image
              src="/logos/logo-light.png"
              alt="Rial"
              width={90}
              height={36}
              className="hidden dark:block h-auto"
              priority
            />
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className="btn-pill btn-secondary cursor-pointer text-sm no-underline" style={{ padding: "8px 16px" }}>
            Ingresar
          </Link>
          <Link href="/signup" className="btn-pill btn-primary cursor-pointer text-sm no-underline" style={{ padding: "8px 20px" }}>
            Crear cuenta
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>
    </header>

    <div
      className={`fixed inset-0 top-20 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    />
    <div
      className="fixed left-0 right-0 top-20 z-50 px-6 pb-6 rounded-b-[30px] md:hidden"
      style={{
        clipPath: mobileMenuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 300ms ease-in-out",
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--border) 0px 0px 0px 1px",
      }}
    >
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-3">
            <Link href="/login" className="btn-pill btn-secondary w-full cursor-pointer text-sm text-center no-underline" style={{ padding: "12px 16px" }}>
              Ingresar
            </Link>
            <Link href="/signup" className="btn-pill btn-primary w-full cursor-pointer text-sm text-center no-underline" style={{ padding: "12px 20px" }}>
              Crear cuenta
            </Link>
          </div>
        </div>
    </div>
    </>
  );
}
