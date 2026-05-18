"use client";

import { useEffect, useState } from "react";
import {
  AVATAR_BG_CSS,
  resolveAvatarSrc,
  type LoreleiAvatarOptions,
} from "@/lib/avatar";

type Phase = "enter" | "idle" | "exit" | "done";

type Props = {
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  avatarOptions: LoreleiAvatarOptions | null;
};

function getFirstName(userName: string, userEmail: string): string {
  const trimmed = (userName || "").trim();
  if (trimmed) {
    const first = trimmed.split(/\s+/)[0];
    if (first) return first;
  }
  const emailLocal = userEmail.split("@")[0] ?? "";
  if (emailLocal) {
    return emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1);
  }
  return "";
}

export function DashboardIntroOverlay({
  userName,
  userEmail,
  avatarUrl,
  avatarOptions,
}: Props) {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const toIdle = setTimeout(() => setPhase("idle"), 700);
    const toExit = setTimeout(() => setPhase("exit"), 2200);
    const toDone = setTimeout(() => setPhase("done"), 3400);
    return () => {
      clearTimeout(toIdle);
      clearTimeout(toExit);
      clearTimeout(toDone);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  if (phase === "done") return null;

  const contentVisible = phase !== "enter";
  const isExiting = phase === "exit";
  const avatarSrc = resolveAvatarSrc(avatarUrl, avatarOptions);
  const firstName = getFirstName(userName, userEmail);
  const initial = (firstName || userEmail || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
      style={{
        backgroundColor: "#161616",
        transform: isExiting ? "translateX(100%)" : "translateX(0)",
        transition: "transform 1200ms cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      <div
        className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
        style={{
          backgroundColor: AVATAR_BG_CSS,
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={firstName || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="text-3xl font-semibold"
            style={{ color: "var(--accent-soft-icon)" }}
          >
            {initial}
          </span>
        )}
      </div>

      <p
        className="text-lg font-medium"
        style={{
          color: "#FFFFFF",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(12px)",
          transition:
            "opacity 700ms ease-out 120ms, transform 700ms ease-out 120ms",
        }}
      >
        {firstName ? `Hola, ${firstName}` : "Hola"}
      </p>
    </div>
  );
}
