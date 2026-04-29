"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

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
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // TODO: connect to Supabase auth
    console.log("login", data);
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "#f5f6f5",
        ["--field-background" as string]: "#f5f6f5",
        ["--field-border" as string]: "var(--border)",
      }}
    >
      <header
        className="w-full"
        style={{ borderBottom: "1px solid #d4d7dc" }}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center px-6">
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
        </div>
      </header>

      <div
        className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col"
        style={{ borderLeft: "1px solid #d4d7dc", borderRight: "1px solid #d4d7dc" }}
      >
        <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div
          className="w-full max-w-[540px] rounded-2xl px-16 py-8"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #edeef0",
            boxShadow: "0 1px 2px rgba(22, 22, 22, 0.04), 0 8px 24px rgba(22, 22, 22, 0.06)",
          }}
        >
          <div className="mb-8 text-center">
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

          <Form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField name="email" type="email" isRequired fullWidth>
              <Label>Email</Label>
              <Input placeholder="tu@email.com" fullWidth />
              <FieldError />
            </TextField>

            <TextField name="password" type="password" isRequired fullWidth>
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
              <Input placeholder="••••••••" fullWidth />
              <FieldError />
            </TextField>

            <Checkbox
              name="remember"
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>Mantener sesión iniciada</Checkbox.Content>
            </Checkbox>

            <Button type="submit" variant="primary" fullWidth className="mt-2">
              Ingresar
            </Button>

            <div className="my-2 flex items-center gap-4">
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                o continúa con
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="gap-2"
              style={{ ["--button-fg" as string]: "var(--text-primary)" }}
            >
              <GoogleIcon />
              Ingresar con Google
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

        <p className="px-6 pb-8 text-left text-sm" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Rial · Hecho en Venezuela
        </p>
      </div>
    </div>
  );
}
