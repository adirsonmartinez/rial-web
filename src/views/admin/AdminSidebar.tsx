"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Dropdown,
  Header,
  Label,
} from "@heroui/react";
import {
  House,
  Persons,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
};

const items: NavItem[] = [
  { href: "/admin", label: "Inicio", icon: House },
  { href: "/admin/clientes", label: "Clientes", icon: Persons },
];

function NavRow({
  href,
  label,
  icon: Icon,
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
    </Link>
  );
}

type AdminSidebarProps = {
  userEmail: string;
  userName: string;
};

export function AdminSidebar({ userEmail, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const initial = (userName || userEmail || "?").trim().charAt(0).toUpperCase();

  return (
    <aside
      aria-label="Navegación admin"
      className="flex h-full w-[280px] shrink-0 flex-col px-4 py-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <Link
        href="/admin"
        className="mb-2 inline-flex items-center px-2 no-underline"
        aria-label="Rial admin"
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
      <span
        className="mb-6 px-2 text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        Admin
      </span>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return <NavRow key={item.href} {...item} isActive={isActive} />;
        })}
      </nav>

      <Dropdown>
        <Dropdown.Trigger
          aria-label="Menú de admin"
          className="mt-auto flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-[var(--card-bg-hover)]"
        >
          <Avatar size="md">
            <Avatar.Fallback>
              <span
                className="flex h-full w-full items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: "var(--accent-soft-bg)",
                  color: "var(--accent-soft-icon)",
                }}
              >
                {initial}
              </span>
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {userName}
            </p>
            <p
              className="truncate text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {userEmail}
            </p>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-[240px]" placement="top start">
          <Dropdown.Menu
            onAction={(key) => {
              switch (key) {
                case "logout":
                  void handleLogout();
                  break;
              }
            }}
          >
            <Dropdown.Section>
              <Header>{userEmail}</Header>
            </Dropdown.Section>
            <Dropdown.Item id="logout" textValue="Cerrar sesión">
              <ArrowRightFromSquare />
              <Label>Cerrar sesión</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </aside>
  );
}
