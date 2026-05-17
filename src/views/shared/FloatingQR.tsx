"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "@heroui/react";
import { QRCodeSVG } from "qrcode.react";
import { AppStoreBadge, GooglePlayBadge } from "@/views/home/StoreBadges";
import { useQrSpotlight } from "./useQrSpotlight";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://somosrial.vercel.app";
const DOWNLOAD_URL = `${SITE_URL.replace(/\/$/, "")}/descargar`;

export function FloatingQR() {
  const { isOpen, close } = useQrSpotlight();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-[60] hidden bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:block ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-[230px] right-[230px] z-[70] hidden flex-col items-end gap-1 transition-all duration-500 md:flex ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <p
          className="font-[family-name:var(--font-caveat)] text-5xl font-bold leading-none"
          style={{ color: "#ACE524", transform: "rotate(-8deg)" }}
        >
          ¡Escanéame!
        </p>
        <svg
          width="120"
          height="90"
          viewBox="0 0 120 90"
          fill="none"
          className="-mt-1 mr-4"
          style={{ color: "#ACE524" }}
        >
          <path
            d="M8 8 C 30 30, 50 55, 78 75"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M68 62 L78 75 L62 76"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    <aside
      aria-label="Descargar Rial"
      className={`fixed bottom-5 right-5 z-[70] hidden flex-col items-center gap-3 rounded-2xl p-4 backdrop-blur-md transition-transform duration-300 md:flex ${
        isOpen ? "scale-110" : ""
      }`}
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div
        className="rounded-xl p-2.5"
        style={{ backgroundColor: "#fff" }}
      >
        <QRCodeSVG
          value={DOWNLOAD_URL}
          size={132}
          level="M"
          bgColor="#ffffff"
          fgColor="#161616"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-xs font-medium leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Escanea para descargar
        </span>
        <div
          className="flex items-center gap-3"
          style={{ color: "var(--text-muted)" }}
        >
          <AppleIcon />
          <span
            aria-hidden="true"
            className="h-3 w-px"
            style={{ backgroundColor: "var(--border)" }}
          />
          <PlayStoreIcon />
        </div>
      </div>
    </aside>

      <Modal.Backdrop
        isOpen={isOpen && isMobile}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Descarga Rial</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
              >
                Descárgala gratis en tu tienda favorita y empieza a organizar tu dinero hoy.
              </p>
              <div className="mt-5 flex flex-col items-center gap-3">
                <AppStoreBadge />
                <GooglePlayBadge />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary" fullWidth>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-label="App Store"
      role="img"
      width="16"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.05 12.04c.03 3.04 2.65 4.05 2.68 4.07-.02.07-.42 1.43-1.38 2.83-.83 1.21-1.7 2.41-3.06 2.43-1.34.03-1.77-.79-3.31-.79-1.53 0-2 .77-3.27.82-1.31.05-2.31-1.31-3.15-2.51-1.72-2.47-3.04-6.99-1.27-10.04.87-1.51 2.43-2.47 4.12-2.5 1.29-.02 2.51.87 3.31.87.79 0 2.27-1.07 3.82-.91.65.03 2.48.26 3.65 1.97-.09.06-2.18 1.27-2.14 3.76zM14.59 4.13c.71-.86 1.18-2.06 1.05-3.25-1.02.04-2.25.68-2.98 1.54-.66.76-1.23 1.98-1.08 3.15 1.14.09 2.3-.58 3.01-1.44z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      aria-label="Google Play"
      role="img"
      width="16"
      height="18"
      viewBox="0 0 512 512"
    >
      <path
        d="M325.3 234.3 104.6 12.6l280.8 161.2-60.1 60.5z"
        fill="#0079e0"
      />
      <path
        d="M104.6 12.6c-13 7.4-21.9 19.9-21.9 36.3v414.1c0 16.4 8.9 28.9 21.9 36.3l228.4-228.4-228.4-258.3z"
        fill="#00a3ff"
      />
      <path
        d="M385.4 174.1 104.6 12.6l220.7 221.7 60.1-60.2z"
        fill="#26d575"
      />
      <path
        d="M325.3 277.7 104.6 499.4l280.8-161.2-60.1-60.5z"
        fill="#ffce00"
      />
      <path
        d="m465.2 225.9-79.8-51.8-66.6 67.3 66.6 67.3 81.4-49.8c19.4-15.2 19.4-37.2-1.6-33z"
        fill="#ff3946"
      />
    </svg>
  );
}
