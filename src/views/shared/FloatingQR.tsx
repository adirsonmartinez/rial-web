"use client";

import { QRCodeSVG } from "qrcode.react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://somosrial.vercel.app";
const DOWNLOAD_URL = `${SITE_URL.replace(/\/$/, "")}/descargar`;

export function FloatingQR() {
  return (
    <aside
      aria-label="Descargar Rial"
      className="fixed bottom-5 right-5 z-40 hidden flex-col items-center gap-2 rounded-2xl p-3 backdrop-blur-md md:flex"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div
        className="rounded-lg p-2"
        style={{ backgroundColor: "#fff" }}
      >
        <QRCodeSVG
          value={DOWNLOAD_URL}
          size={92}
          level="M"
          bgColor="#ffffff"
          fgColor="#161616"
        />
      </div>
      <span
        className="text-[11px] font-medium leading-tight tracking-wide"
        style={{ color: "var(--text-primary)" }}
      >
        Escanea para
        <br />
        descargar Rial
      </span>
    </aside>
  );
}
