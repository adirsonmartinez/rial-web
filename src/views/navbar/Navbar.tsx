"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/views/shared/ThemeSwitcher";

export function Navbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 lg:top-6">
      <nav
        className="mx-auto flex h-20 w-full max-w-[1100px] items-center justify-between rounded-full px-3 pl-6 backdrop-blur-md"
        style={{
          backgroundColor: "var(--navbar-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
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

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Link
            href="/login"
            className="btn-pill btn-primary cursor-pointer text-sm no-underline"
            style={{ padding: "8px 18px" }}
          >
            Ingresar
          </Link>
        </div>
      </nav>
    </header>
  );
}
