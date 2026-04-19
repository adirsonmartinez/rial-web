"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown, Label, Link } from "@heroui/react";
import { ChartColumn, CreditCard, Layers, Calculator, TargetDart, CircleQuestion, CircleInfo } from "@gravity-ui/icons";
import { ThemeToggle } from "@/views/shared/ThemeToggle";

const PRODUCT_ITEMS = [
  { id: "budgets", label: "Presupuestos", icon: ChartColumn },
  { id: "accounts", label: "Cuentas", icon: CreditCard },
  { id: "templates", label: "Plantillas", icon: Layers },
  { id: "calculator", label: "Calculadora", icon: Calculator },
  { id: "goals", label: "Metas", icon: TargetDart },
];

const LEARN_ITEMS = [
  { id: "faq", label: "Preguntas frecuentes", icon: CircleQuestion },
  { id: "help-center", label: "Centro de ayuda", icon: CircleInfo },
];

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "var(--text-muted)" }}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [productOpen, setProductOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
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
      style={scrolled ? { backgroundColor: "var(--navbar-bg)", boxShadow: "var(--border) 0px 0px 0px 1px" } : undefined}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Dropdown>
                <Dropdown.Trigger className="flex items-center gap-1 text-sm font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  Producto
                  <ChevronDown />
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={(key) => console.log(key)}>
                    {PRODUCT_ITEMS.map((item) => (
                      <Dropdown.Item key={item.id} id={item.id} textValue={item.label}>
                        <item.icon className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                        <Label>{item.label}</Label>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </li>
            <li>
              <Dropdown>
                <Dropdown.Trigger className="flex items-center gap-1 text-sm font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  Aprende
                  <ChevronDown />
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={(key) => console.log(key)}>
                    {LEARN_ITEMS.map((item) => (
                      <Dropdown.Item key={item.id} id={item.id} textValue={item.label}>
                        <item.icon className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                        <Label>{item.label}</Label>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </li>
            <li>
              <button className="flex items-center gap-1 text-sm font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                Nosotros
              </button>
            </li>
          </ul>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button className="btn-pill btn-secondary cursor-pointer text-sm" style={{ padding: "8px 16px" }}>
            Ingresar
          </button>
          <button className="btn-pill btn-primary cursor-pointer text-sm" style={{ padding: "8px 20px" }}>
            Crear cuenta
          </button>
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
      className={`fixed inset-0 top-16 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    />
    <div
      className="fixed left-0 right-0 top-16 z-50 px-6 pb-6 rounded-b-[30px] md:hidden"
      style={{
        clipPath: mobileMenuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 300ms ease-in-out",
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--border) 0px 0px 0px 1px",
      }}
    >
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <button
              className="flex w-full items-center justify-between py-2 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setProductOpen(!productOpen)}
            >
              Producto
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                className={`transition-transform ${productOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--text-muted)" }}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: productOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2 pl-4 pt-1">
                  {PRODUCT_ITEMS.map((item) => (
                    <button key={item.id} className="flex items-center gap-3 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <item.icon className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              className="flex w-full items-center justify-between py-2 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setLearnOpen(!learnOpen)}
            >
              Aprende
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                className={`transition-transform ${learnOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--text-muted)" }}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: learnOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2 pl-4 pt-1">
                  {LEARN_ITEMS.map((item) => (
                    <button key={item.id} className="flex items-center gap-3 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <item.icon className="size-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="py-2 text-left text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Nosotros
          </button>

          <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button className="btn-pill btn-secondary w-full cursor-pointer text-sm" style={{ padding: "12px 16px" }}>
              Ingresar
            </button>
            <button className="btn-pill btn-primary w-full cursor-pointer text-sm" style={{ padding: "12px 20px" }}>
              Crear cuenta
            </button>
          </div>
        </div>
    </div>
    </>
  );
}
