"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  Header,
  Label,
  Modal,
  Separator,
} from "@heroui/react";
import {
  House,
  CreditCard,
  Receipt,
  Tag,
  Target,
  ArrowRightArrowLeft,
  ArrowsRotateRight,
  Sparkles,
  Gear,
  Globe,
  CircleQuestion,
  CircleArrowUp,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";
import { SettingsModal, type SettingsSectionId } from "./SettingsModal";

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

const USER_EMAIL = "usuario@rial.app";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);
  const [settings, setSettings] = useState<{
    open: boolean;
    section: SettingsSectionId;
  }>({ open: false, section: "perfil" });

  const openSettings = (section: SettingsSectionId) => {
    setSettings({ open: true, section });
  };

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

      <Dropdown>
        <Dropdown.Trigger
          aria-label="Menú de usuario"
          className="mt-auto flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-[var(--card-bg-hover)]"
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
              {USER_EMAIL}
            </p>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-[260px]" placement="top start">
          <Dropdown.Menu
            onAction={(key) => {
              switch (key) {
                case "ajustes":
                  openSettings("perfil");
                  break;
                case "mejorar":
                  router.push("/app/plan");
                  break;
                case "idioma":
                case "ayuda":
                  setComingSoonLabel(
                    key === "idioma" ? "Idioma" : "Obtener ayuda"
                  );
                  break;
                case "logout":
                  // TODO: wire up to supabase signOut
                  break;
              }
            }}
          >
            <Dropdown.Section>
              <Header>{USER_EMAIL}</Header>
              <Dropdown.Item id="ajustes" textValue="Ajustes">
                <Gear />
                <Label>Ajustes</Label>
              </Dropdown.Item>
              <Dropdown.Item id="idioma" textValue="Idioma">
                <Globe />
                <Label>Idioma</Label>
              </Dropdown.Item>
              <Dropdown.Item id="ayuda" textValue="Obtener ayuda">
                <CircleQuestion />
                <Label>Obtener ayuda</Label>
              </Dropdown.Item>
            </Dropdown.Section>
            <Separator />
            <Dropdown.Item id="mejorar" textValue="Mejorar plan">
              <CircleArrowUp />
              <Label>Mejorar plan</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Item id="logout" textValue="Cerrar sesión">
              <ArrowRightFromSquare />
              <Label>Cerrar sesión</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

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

      <SettingsModal
        isOpen={settings.open}
        onOpenChange={(open) =>
          setSettings((prev) => ({ ...prev, open }))
        }
        initialSection={settings.section}
      />
    </aside>
  );
}
