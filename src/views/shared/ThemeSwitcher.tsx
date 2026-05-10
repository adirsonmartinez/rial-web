"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@heroui/react";
import { Sun, Moon, Display } from "@gravity-ui/icons";

type ThemeMode = "light" | "dark" | "system";
const STORAGE_KEY = "theme-mode";

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", resolveIsDark(mode));
}

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system";
    setMode(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const handleChange = (key: React.Key) => {
    const next = String(key) as ThemeMode;
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  if (!mounted) return <div className="h-10 w-[120px]" />;

  return (
    <Tabs selectedKey={mode} onSelectionChange={handleChange}>
      <Tabs.ListContainer>
        <Tabs.List aria-label="Tema">
          <Tabs.Tab id="light" aria-label="Claro">
            <Sun />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="dark" aria-label="Oscuro">
            <Moon />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="system" aria-label="Sistema">
            <Display />
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
