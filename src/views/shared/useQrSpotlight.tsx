"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type QrSpotlightContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const QrSpotlightContext = createContext<QrSpotlightContextValue | null>(null);

export function QrSpotlightProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <QrSpotlightContext.Provider value={{ isOpen, open, close }}>
      {children}
    </QrSpotlightContext.Provider>
  );
}

export function useQrSpotlight(): QrSpotlightContextValue {
  const ctx = useContext(QrSpotlightContext);
  if (!ctx) {
    return { isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
