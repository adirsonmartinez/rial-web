"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button, Chip, Modal } from "@heroui/react";
import {
  House,
  CreditCard,
  Receipt,
  Tag,
  Target,
  ArrowRightArrowLeft,
  ArrowsRotateRight,
  CircleQuestion,
  ArrowRightFromSquare,
  Sparkles,
} from "@gravity-ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  badge?: string;
};

const items: NavItem[] = [
  { href: "/app", label: "Inicio", icon: House },
  { href: "/app/cuentas", label: "Cuentas", icon: CreditCard },
  { href: "/app/movimientos", label: "Movimientos", icon: Receipt },
  { href: "/app/categorias", label: "Categorías", icon: Tag },
  { href: "/app/metas", label: "Metas y Ahorros", icon: Target },
  { href: "/app/pagar-cobrar", label: "Pagar/Cobrar", icon: ArrowRightArrowLeft },
  { href: "/app/recurrentes", label: "Recurrentes", icon: ArrowsRotateRight },
];

function NavRow({
  href,
  label,
  icon: Icon,
  badge,
  isActive,
  onComingSoon,
}: NavItem & { isActive: boolean; onComingSoon: (label: string) => void }) {
  const isComingSoon = href !== "/app";

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={
        isComingSoon
          ? (e) => {
              e.preventDefault();
              onComingSoon(label);
            }
          : undefined
      }
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
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  return (
    <aside
      aria-label="Navegación principal"
      className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col px-4 py-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <Link
        href="/app"
        className="mb-6 inline-flex items-center px-2 no-underline"
        aria-label="Rial"
      >
        <Image
          src="/logos/logo-dark.png"
          alt="Rial"
          width={90}
          height={36}
          className="block h-auto dark:hidden"
          priority
        />
        <Image
          src="/logos/logo-light.png"
          alt="Rial"
          width={90}
          height={36}
          className="hidden h-auto dark:block"
          priority
        />
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return (
            <NavRow
              key={item.href}
              {...item}
              isActive={isActive}
              onComingSoon={setComingSoonLabel}
            />
          );
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

      <div
        className="mt-3 flex items-center gap-3 px-2 pt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
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

      <Modal.Backdrop
        isOpen={comingSoonLabel !== null}
        onOpenChange={(open) => {
          if (!open) setComingSoonLabel(null);
        }}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[380px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon
                style={{
                  backgroundColor: "var(--accent-soft-bg)",
                  color: "var(--accent-soft-icon)",
                }}
              >
                <Sparkles className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{comingSoonLabel}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                Esta función está en desarrollo y estará disponible próximamente.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" className="w-full">
                Entendido
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </aside>
  );
}
