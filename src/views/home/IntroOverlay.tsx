"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Phase = "enter" | "idle" | "exit" | "done";

export function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const toIdle = setTimeout(() => setPhase("idle"), 600);
    const toExit = setTimeout(() => setPhase("exit"), 1100);
    const toDone = setTimeout(() => setPhase("done"), 2100);
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

  const logoVisible = phase !== "enter";
  const isExiting = phase === "exit";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#161616",
        transform: isExiting ? "translateX(100%)" : "translateX(0)",
        transition: "transform 1000ms cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      <Image
        src="/logos/logo-light.png"
        alt="Rial"
        width={140}
        height={56}
        priority
        className="h-auto"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      />
    </div>
  );
}
