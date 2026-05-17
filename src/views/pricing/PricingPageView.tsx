"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs } from "@heroui/react";
import {
  type Cadence,
  cadences,
  FreePlanCard,
  PlusPlanCard,
} from "@/views/dashboard/PlanView";

function PaymentProviderCard({
  label,
  providerName,
  providerHref,
  logoSrc,
  logoAlt,
  logoClassName,
}: {
  label: string;
  providerName: string;
  providerHref: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl p-5 lg:p-6"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <a
          href={providerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--text-primary)" }}
        >
          Procesado por {providerName}
        </a>
      </div>
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={120}
        height={28}
        className={logoClassName}
      />
    </div>
  );
}

export function PricingPageView() {
  const [cadenceId, setCadenceId] = useState<Cadence>("mensual");
  const cadence = cadences.find((c) => c.id === cadenceId) ?? cadences[0];

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

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-secondary)" }}
            >
              Precios
            </span>
          </div>

          <h1
            className="display-heading mt-4 text-[clamp(2rem,4vw,3rem)]"
            style={{ lineHeight: 1.1 }}
          >
            Planes que crecen contigo
          </h1>
          <p
            className="mt-5 max-w-xl text-base lg:text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            Empieza gratis y desbloquea todo el poder de Rial cuando lo necesites. Sin sorpresas.
          </p>
        </div>
      </section>

      {/* Cadence tabs + plans */}
      <section className="w-full pb-24 lg:pb-32">
        <div className="mx-auto w-full max-w-[1100px] px-6">
          <div className="flex justify-center">
            <Tabs
              selectedKey={cadenceId}
              onSelectionChange={(key) => setCadenceId(String(key) as Cadence)}
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label="Cadencia de facturación">
                  {cadences.map((c) => (
                    <Tabs.Tab key={c.id} id={c.id}>
                      {c.tabLabel}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            <FreePlanCard isCurrent={false} />
            <PlusPlanCard
              cadence={cadence}
              isCurrent={false}
              periodEndLabel={null}
              cancelAtPeriodEnd={false}
            />
          </div>

          {/* Payment providers */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <PaymentProviderCard
              label="Pagos en Bolívares"
              providerName="Venflow"
              providerHref="https://www.venflow.app/"
              logoSrc="/logos/venflow-black.png"
              logoAlt="Venflow"
              logoClassName="h-5 w-auto dark:brightness-0 dark:invert"
            />
            <PaymentProviderCard
              label="Pagos internacionales"
              providerName="Stripe"
              providerHref="https://stripe.com"
              logoSrc="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              logoAlt="Stripe"
              logoClassName="h-7 w-auto brightness-0 dark:brightness-0 dark:invert"
            />
          </div>

          <p
            className="mx-auto mt-10 max-w-3xl text-center text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Precios en USD. Aplica IVA 16%. Los precios y los planes están sujetos a cambios sin previo aviso.
          </p>
        </div>
      </section>
    </div>
  );
}
