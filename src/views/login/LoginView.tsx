"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Envelope, Lock, Eye, EyeSlash } from "@gravity-ui/icons";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginView() {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // TODO: connect to Supabase auth
    console.log("login", data);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div
        className="relative flex flex-col px-6 py-8 lg:px-16 lg:py-12"
        style={{
          backgroundColor: "var(--bg-secondary)",
          ["--field-background" as string]: "var(--bg-card)",
          ["--field-border" as string]: "var(--border)",
        }}
      >
        <Link href="/" className="inline-flex items-center no-underline">
          <Image
            src="/logos/logo-dark.png"
            alt="Rial"
            width={90}
            height={36}
            className="block dark:hidden h-auto"
            priority
          />
          <Image
            src="/logos/logo-light.png"
            alt="Rial"
            width={90}
            height={36}
            className="hidden dark:block h-auto"
            priority
          />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="display-heading text-[clamp(1.75rem,3vw,2.25rem)]">
                Bienvenido de nuevo
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                Ingresa a tu cuenta de Rial
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="gap-2"
              style={{ ["--button-fg" as string]: "var(--text-primary)" }}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                o continúa con email
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            </div>

            <Form onSubmit={onSubmit} className="flex flex-col gap-4">
              <TextField name="email" type="email" isRequired fullWidth>
                <Label>Email</Label>
                <div className="relative w-full">
                  <Envelope
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <Input placeholder="tu@email.com" className="pl-10" fullWidth />
                </div>
                <FieldError />
              </TextField>

              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                isRequired
                fullWidth
              >
                <div className="flex items-center justify-between">
                  <Label>Contraseña</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium no-underline hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative w-full">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <Input placeholder="••••••••" className="pl-10 pr-10" fullWidth />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: "var(--text-muted)" }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <FieldError />
              </TextField>

              <Button type="submit" variant="primary" fullWidth className="mt-2">
                Ingresar
              </Button>
            </Form>

            <p
              className="mt-8 text-center text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              ¿No tienes cuenta?{" "}
              <Link
                href="/signup"
                className="font-medium no-underline hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Rial · Hecho en Venezuela
        </p>
      </div>

      {/* Brand side */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12"
        style={{ backgroundColor: "var(--rial)" }}
      >
        <div
          className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full"
          style={{ backgroundColor: "rgba(22, 22, 22, 0.08)" }}
        />
        <div
          className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full"
          style={{ backgroundColor: "rgba(22, 22, 22, 0.06)" }}
        />

        <div className="relative">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "rgba(22, 22, 22, 0.6)" }}
          >
            Finanzas personales para Venezuela
          </p>
        </div>

        <div className="relative">
          <h2
            className="font-[family-name:var(--font-sora)] text-[clamp(2.5rem,4vw,4rem)] font-[800] leading-[0.95]"
            style={{ color: "#161616" }}
          >
            Organiza, ahorra y gestiona tu dinero
          </h2>
          <p
            className="mt-6 max-w-md text-base"
            style={{ color: "rgba(22, 22, 22, 0.7)", lineHeight: 1.6 }}
          >
            Bolívares, dólares y euros en un solo lugar. Únete a más de 40 mil
            venezolanos que ya confían en Rial.
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-[#ACE524]"
                style={{ backgroundImage: `url(https://i.pravatar.cc/40?img=${i})`, backgroundSize: "cover" }}
              />
            ))}
          </div>
          <p className="text-sm font-medium" style={{ color: "#161616" }}>
            +40K usuarios activos
          </p>
        </div>
      </div>
    </div>
  );
}
