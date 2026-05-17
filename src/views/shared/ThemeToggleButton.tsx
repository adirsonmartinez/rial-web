"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@gravity-ui/icons";

type ThemeMode = "light" | "dark" | "system";
const STORAGE_KEY = "theme-mode";

function readIsDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system";
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(readIsDark());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  if (!mounted) return <div className="h-10 w-10" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer hover:opacity-80"
      style={{
        color: "var(--text-primary)",
        backgroundColor: "var(--card-bg-subtle)",
      }}
    >
      {isDark ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
    </button>
  );
}
