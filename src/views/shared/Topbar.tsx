"use client";

import { useEffect, useState } from "react";
import { LayoutSideContent } from "@gravity-ui/icons";
import { ThemeToggleButton } from "@/views/shared/ThemeToggleButton";

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

type TopbarProps = {
  userName: string;
  onToggleSidebar: () => void;
};

export function Topbar({ userName, onToggleSidebar }: TopbarProps) {
  const [greeting, setGreeting] = useState("Hola");

  useEffect(() => {
    void Promise.resolve().then(() => {
      setGreeting(greetingForHour(new Date().getHours()));
    });
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 px-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Mostrar u ocultar navegación"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--card-bg-hover)]"
        style={{ color: "var(--text-primary)" }}
      >
        <LayoutSideContent width={20} height={20} />
      </button>
      <h1
        className="text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {greeting}, {userName.trim().split(/\s+/)[0]}
      </h1>
      <div className="ml-auto">
        <ThemeToggleButton />
      </div>
    </header>
  );
}
