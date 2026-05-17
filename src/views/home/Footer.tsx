"use client";

import Image from "next/image";

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "Nosotros", href: "#" },
  { label: "Soporte", href: "/soporte" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Términos y condiciones", href: "/condiciones" },
];

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor">
      <path d="M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0 0 48 59.49zM345.8 174L89.22 32.64l-.16-.09c-4.42-2.4-8.62 3.58-5 7.06L285.19 231.93zm26.49 15.46L295.6 243.2 415.4 256 372.29 189.46zM89.05 479.45c-3.59 3.48.56 9.46 5 7.06l.16-.09L345.8 338l-60.61-53.74z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#0e0e0e" }}>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Top: logo + newsletter */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 max-w-sm">
            <Image
              src="/logos/logo-light.png"
              alt="Rial"
              width={90}
              height={36}
              className="h-auto"
            />
            <p className="text-sm text-white/50" style={{ lineHeight: 1.6 }}>
              La app de finanzas personales para Venezuela. Organiza, ahorra y gestiona tu dinero en bolívares, dólares y euros.
            </p>
            {/* Download buttons */}
            <div className="flex gap-2 mt-2">
              <a
                href="https://apps.apple.com/us/app/rial-finanzas-personales/id6755372307"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Descargar en App Store"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-[#ACE524] hover:text-[#161616] transition-colors"
              >
                <AppleIcon />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.adimtnez.rial&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Descargar en Google Play"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-[#ACE524] hover:text-[#161616] transition-colors"
              >
                <PlayStoreIcon />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md w-full lg:max-w-sm">
            <p className="text-sm font-medium text-white lg:text-base">
              Recibe consejos financieros y novedades de Rial.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button className="btn-pill bg-[#ACE524] text-[#161616] px-5 py-2.5 text-xs font-medium uppercase tracking-wider cursor-pointer">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }} />

        {/* Middle: contact */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/40">Hablemos</p>
          <a href="mailto:soporte@somosrial.com" className="inline-flex items-center gap-3 text-xl font-medium text-white hover:text-[#ACE524] lg:text-2xl">
            soporte@somosrial.com
            <span className="text-white/40">↗</span>
          </a>
        </div>

        {/* Divider */}
        <div className="my-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

        {/* Bottom: company links + copyright + venflow + social */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
              {COMPANY_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
              <p className="text-xs text-white/30">
                © {new Date().getFullYear()} Rial. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/30">Pagos por</span>
                <a href="https://www.venflow.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Image
                    src="/logos/venflow-white.png"
                    alt="Venflow"
                    width={60}
                    height={16}
                    className="h-auto opacity-40 hover:opacity-70 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Instagram", href: "https://www.instagram.com/rial.app/", path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
              { label: "TikTok", href: "https://www.tiktok.com/@rial.app", path: "M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" },
              { label: "LinkedIn", href: "https://www.linkedin.com/company/quierorial/", path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href === "#" ? undefined : "_blank"}
                rel={social.href === "#" ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-[#ACE524] hover:text-[#161616] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
