"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";

const ICON_PATHS = {
  email: "M4 6h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v.5l8 5 8-5V8H4zm16 2.36l-7.47 4.67a1 1 0 0 1-1.06 0L4 10.36V18h16v-7.64z",
  instagram: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
  tiktok: "M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z",
  linkedin: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
};

const CONTACT_CHANNELS = [
  {
    label: "Correo electrónico",
    value: "soporte@somosrial.com",
    href: "mailto:soporte@somosrial.com",
    iconPath: ICON_PATHS.email,
  },
  {
    label: "Instagram",
    value: "@rial.app",
    href: "https://www.instagram.com/rial.app/",
    iconPath: ICON_PATHS.instagram,
  },
  {
    label: "TikTok",
    value: "@rial.app",
    href: "https://www.tiktok.com/@rial.app",
    iconPath: ICON_PATHS.tiktok,
  },
  {
    label: "LinkedIn",
    value: "quierorial",
    href: "https://www.linkedin.com/company/quierorial/",
    iconPath: ICON_PATHS.linkedin,
  },
];

const SUBJECTS = [
  { id: "problema", label: "Reporte de problema" },
  { id: "sugerencia", label: "Sugerencia" },
  { id: "planes", label: "Consulta sobre planes" },
  { id: "cuenta", label: "Cuenta y datos personales" },
  { id: "otro", label: "Otro" },
];

const SUPPORT_EMAIL = "soporte@somosrial.com";

export function SupportPageView() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const asuntoId = String(data.get("asunto") ?? "");
    const mensaje = String(data.get("mensaje") ?? "").trim();

    const asuntoLabel =
      SUBJECTS.find((s) => s.id === asuntoId)?.label ?? "Consulta";

    const subject = `[Soporte Rial] ${asuntoLabel}`;
    const body = `Nombre: ${nombre}\nCorreo: ${email}\n\n${mensaje}`;

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative w-full overflow-hidden pt-32 pb-12 lg:pt-36 lg:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 80% 20%, var(--hero-glow-1) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-secondary)" }}
            >
              Soporte
            </span>
          </div>

          <h1
            className="display-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)]"
            style={{ lineHeight: 1.05 }}
          >
            ¿Cómo podemos ayudarte?
          </h1>
          <p
            className="mt-5 max-w-2xl text-base lg:text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            Escríbenos y nuestro equipo te responderá lo antes posible. También puedes contactarnos por nuestros canales directos.
          </p>
        </div>
      </section>

      {/* Form + channels */}
      <section className="w-full pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Form card */}
            <div
              className="rounded-[32px] p-8 lg:p-10"
              style={{
                backgroundColor: "var(--bg-card)",
                boxShadow: "var(--border) 0px 0px 0px 1px",
                ["--field-background" as string]: "var(--card-bg-subtle)",
                ["--field-border" as string]: "var(--border)",
              }}
            >
              {submitted ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2
                    className="font-[family-name:var(--font-sora)] text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Abriendo tu correo…
                  </h2>
                  <p
                    className="max-w-sm text-sm lg:text-base"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
                  >
                    Termina de enviar el mensaje desde tu cliente de correo. Si no se abre, escríbenos directo a{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="font-medium hover:underline"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    .
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onPress={() => setSubmitted(false)}
                    className="mt-2"
                  >
                    Volver
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2
                      className="font-[family-name:var(--font-sora)] text-2xl font-bold lg:text-3xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Envíanos un mensaje
                    </h2>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Completa el formulario y te respondemos por correo.
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextField name="nombre" isRequired fullWidth>
                        <Label>Nombre</Label>
                        <Input placeholder="Tu nombre" fullWidth />
                      </TextField>

                      <TextField name="email" type="email" isRequired fullWidth>
                        <Label>Correo electrónico</Label>
                        <Input placeholder="tu@correo.com" fullWidth />
                      </TextField>
                    </div>

                    <Select name="asunto" placeholder="Selecciona un asunto" isRequired fullWidth>
                      <Label>Asunto</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {SUBJECTS.map((s) => (
                            <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                              {s.label}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="mensaje">Mensaje</Label>
                      <TextArea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={6}
                        placeholder="Cuéntanos en qué te podemos ayudar"
                        aria-label="Mensaje"
                        fullWidth
                      />
                    </div>

                    <Button type="submit" variant="primary" className="mt-2 self-start">
                      Enviar mensaje
                    </Button>
                  </Form>
                </>
              )}
            </div>

            {/* Contact channels */}
            <div className="flex flex-col gap-3">
              <div
                className="rounded-[32px] p-6 lg:p-8"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold lg:text-2xl">
                  Otros canales
                </h3>
                <p className="mt-2 text-sm" style={{ lineHeight: 1.5 }}>
                  Si prefieres, escríbenos directo por cualquiera de estos medios.
                </p>
              </div>

              {CONTACT_CHANNELS.map(({ label, value, href, iconPath }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl p-4 transition-colors lg:p-5"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    boxShadow: "var(--border) 0px 0px 0px 1px",
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors group-hover:scale-105"
                    style={{
                      backgroundColor: "var(--accent-soft-bg)",
                      color: "var(--accent-soft-icon)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={iconPath} />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="truncate text-sm font-medium lg:text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {value}
                    </span>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
