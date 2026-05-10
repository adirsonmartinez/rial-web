"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Chip } from "@heroui/react";
import {
  House,
  ChartPie,
  CreditCard,
  Receipt,
  Percent,
  Gear,
  CircleQuestion,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  badge?: string;
};

const items: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: House },
  { href: "/app/portafolio", label: "Portafolio", icon: ChartPie },
  { href: "/app/gastos", label: "Gastos", icon: CreditCard },
  { href: "/app/movimientos", label: "Movimientos", icon: Receipt },
  { href: "/app/ganar", label: "Ganar", icon: Percent, badge: "Nuevo" },
  { href: "/app/ajustes", label: "Ajustes", icon: Gear },
];

function NavRow({
  href,
  label,
  icon: Icon,
  badge,
  isActive,
}: NavItem & { isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex h-11 w-full items-center gap-3 rounded-full px-4 text-sm font-medium no-underline transition-colors ${
        isActive ? "" : "hover:bg-[var(--card-bg-hover)]"
      }`}
      style={{
        backgroundColor: isActive ? "var(--card-bg-subtle)" : undefined,
        color: "var(--text-primary)",
      }}
    >
      <Icon width={20} height={20} />
      <span className="flex-1">{label}</span>
      {badge && (
        <Chip color="success" variant="soft" size="sm">
          {badge}
        </Chip>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegación principal"
      className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col px-4 py-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3 px-2 pb-6">
        <Avatar size="md">
          <Avatar.Fallback>
            <span
              className="flex h-full w-full items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #c4b5fd 0%, #93c5fd 50%, #a5b4fc 100%)",
              }}
            />
          </Avatar.Fallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Usuario
          </p>
          <p
            className="truncate text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            usuario@rial.app
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return <NavRow key={item.href} {...item} isActive={isActive} />;
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <Link
          href="/app/ayuda"
          className="flex h-11 w-full items-center gap-3 rounded-full px-4 text-sm font-medium no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
          style={{ color: "var(--text-primary)" }}
        >
          <CircleQuestion width={20} height={20} />
          <span>Ayuda e información</span>
        </Link>
        <Link
          href="/logout"
          className="flex h-11 w-full items-center gap-3 rounded-full px-4 text-sm font-medium no-underline transition-colors hover:bg-[var(--card-bg-hover)]"
          style={{ color: "var(--text-primary)" }}
        >
          <ArrowRightFromSquare width={20} height={20} />
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}
