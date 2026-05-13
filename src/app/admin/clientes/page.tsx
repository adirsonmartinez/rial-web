import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes · Admin",
};

export default function AdminClientesPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <header className="flex flex-col gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Admin
        </span>
        <h1
          className="display-heading text-[clamp(1.75rem,3vw,2.25rem)]"
          style={{ color: "var(--text-primary)" }}
        >
          Clientes
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Próximamente: lista de usuarios con filtros, búsqueda y acciones de
          suscripción.
        </p>
      </header>
    </div>
  );
}
