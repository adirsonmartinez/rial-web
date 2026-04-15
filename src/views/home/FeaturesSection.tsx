"use client";

interface Feature {
  title: string;
  description: string;
  cta: string;
  screen: React.ReactNode;
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[520px] w-[260px] rounded-[3rem] border-[6px] border-[#161616] bg-white p-2" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
      <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-[#161616]" />
      <div className="h-full w-full overflow-hidden rounded-[2.25rem] bg-[#f7f9f7]">
        {children}
      </div>
    </div>
  );
}

function AccountsScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Saldo total</p>
      <p className="mt-1 text-2xl font-medium text-[#161616]">$2,736.15</p>
      <div className="mt-5 flex flex-col gap-2">
        {[
          { currency: "USD", amount: "$1,200.00", color: "bg-[#ACE524]" },
          { currency: "EUR", amount: "€580.30", color: "bg-blue-400" },
          { currency: "VES", amount: "Bs. 82,400", color: "bg-orange-400" },
        ].map((acc) => (
          <div key={acc.currency} className="flex items-center justify-between rounded-[16px] bg-white p-3" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${acc.color}`} />
              <span className="text-xs font-medium text-[#161616]">{acc.currency}</span>
            </div>
            <span className="text-xs font-medium text-[#161616]">{acc.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="h-28 w-full rounded-[20px] bg-gradient-to-br from-[#ACE524] to-[#c8f05a] p-4">
          <p className="text-[10px] font-medium text-[#161616] opacity-70">Rial Card</p>
          <p className="mt-3 text-lg font-medium text-[#161616]">$2,736.15</p>
          <p className="mt-2 text-[10px] tracking-widest text-[#161616]">•••• 5318</p>
        </div>
      </div>
    </div>
  );
}

function GoalsScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Metas activas</p>
      <p className="mt-1 text-lg font-medium text-[#161616]">Mis metas</p>
      <div className="mt-5 flex flex-col gap-3">
        {[
          { icon: "🚗", name: "Carro nuevo", target: "$15,000", pct: 90 },
          { icon: "🏠", name: "Casa propia", target: "$250,000", pct: 95 },
          { icon: "✈️", name: "Vacaciones", target: "$3,000", pct: 40 },
          { icon: "💻", name: "Laptop", target: "$2,000", pct: 40 },
        ].map((goal) => (
          <div key={goal.name} className="rounded-[16px] bg-white p-3" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{goal.icon}</span>
                <span className="text-xs font-medium text-[#161616]">{goal.name}</span>
              </div>
              <span className="text-[10px] text-[#8E9399]">{goal.target}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#EEEEEE]">
              <div className="h-1.5 rounded-full bg-[#ACE524]" style={{ width: `${goal.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetsScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Abril 2026</p>
      <p className="mt-1 text-lg font-medium text-[#161616]">Presupuestos</p>
      <div className="mt-5 flex flex-col gap-3">
        {[
          { name: "Comida", spent: 280, total: 400 },
          { name: "Transporte", spent: 120, total: 200 },
          { name: "Entretenimiento", spent: 90, total: 100 },
          { name: "Servicios", spent: 45, total: 150 },
        ].map((b) => (
          <div key={b.name} className="rounded-[16px] bg-white p-3" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#161616]">{b.name}</span>
              <span className="text-[10px] text-[#8E9399]">${b.spent} / ${b.total}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#EEEEEE]">
              <div
                className={`h-1.5 rounded-full ${b.spent / b.total > 0.85 ? "bg-red-500" : "bg-[#ACE524]"}`}
                style={{ width: `${(b.spent / b.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-center gap-1.5">
        {[35, 55, 40, 70, 50, 65, 80].map((h, i) => (
          <div key={i} className="w-5 rounded-md bg-[#ACE524]/80" style={{ height: `${h * 0.6}px` }} />
        ))}
      </div>
    </div>
  );
}

function VoiceScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Registro rápido</p>
      <p className="mt-1 text-lg font-medium text-[#161616]">Voz</p>
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="rounded-[16px] bg-white p-4 w-full" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
          <p className="text-xs text-[#8E9399]">Transcripción</p>
          <p className="mt-1 text-sm font-medium text-[#161616]">&quot;Gasté 15 dólares en almuerzo&quot;</p>
        </div>
        <div className="flex items-center gap-0.5">
          {[12, 20, 30, 15, 25, 35, 18, 28, 22, 32, 14, 26, 20, 30, 16, 24, 18].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-[#ACE524]/70" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ACE524]" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
        <div className="mt-2 rounded-[16px] bg-white p-3 w-full" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#161616]">Almuerzo</span>
            <span className="text-xs font-medium text-red-500">-$15.00</span>
          </div>
          <p className="mt-1 text-[10px] text-[#8E9399]">Comida · Hoy 1:30 PM</p>
        </div>
      </div>
    </div>
  );
}

function CalculatorScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Tasas del día</p>
      <p className="mt-1 text-lg font-medium text-[#161616]">Calculadora</p>
      <div className="mt-5 rounded-[16px] bg-white p-4" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
          <span className="text-xs text-[#8E9399]">USD</span>
          <span className="text-lg font-medium text-[#161616]">$1.00</span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-[#8E9399]">VES</span>
          <span className="text-lg font-medium text-[#ACE524]">Bs. 86.40</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {[
          { from: "$1.00", to: "Bs. 86.40", label: "USD → VES" },
          { from: "€1.00", to: "Bs. 93.20", label: "EUR → VES" },
          { from: "$1.00", to: "€0.93", label: "USD → EUR" },
        ].map((rate) => (
          <div key={rate.label} className="flex items-center justify-between rounded-[16px] bg-white px-3 py-2" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
            <span className="text-[10px] text-[#8E9399]">{rate.label}</span>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-[#161616]">{rate.from}</span>
              <span className="text-[#8E9399]">=</span>
              <span className="font-medium text-[#ACE524]">{rate.to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesScreen() {
  return (
    <div className="flex h-full flex-col px-4 pt-10">
      <p className="text-xs text-[#8E9399]">Recurrentes</p>
      <p className="mt-1 text-lg font-medium text-[#161616]">Plantillas</p>
      <div className="mt-5 flex flex-col gap-2">
        {[
          { name: "Netflix", amount: "$8.99", freq: "Mensual", icon: "🎬" },
          { name: "Spotify", amount: "$5.99", freq: "Mensual", icon: "🎵" },
          { name: "Internet", amount: "$40.00", freq: "Mensual", icon: "🌐" },
          { name: "Gym", amount: "$25.00", freq: "Mensual", icon: "💪" },
          { name: "Seguro", amount: "$120.00", freq: "Trimestral", icon: "🛡️" },
        ].map((t) => (
          <div key={t.name} className="flex items-center justify-between rounded-[16px] bg-white p-3" style={{ boxShadow: "rgba(22,22,22,0.12) 0px 0px 0px 1px" }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">{t.icon}</span>
              <div>
                <p className="text-xs font-medium text-[#161616]">{t.name}</p>
                <p className="text-[10px] text-[#8E9399]">{t.freq}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#161616]">{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES: Feature[] = [
  {
    title: "Cuentas multimoneda",
    description:
      "Gestiona bolívares, dólares y euros desde un solo lugar. Visualiza todos tus saldos y movimientos en tiempo real sin cambiar de app.",
    cta: "Conoce más",
    screen: <AccountsScreen />,
  },
  {
    title: "Metas de ahorro",
    description:
      "Define objetivos financieros y haz seguimiento de tu progreso hasta alcanzarlos. Organiza tus ahorros por categorías y mantén la motivación.",
    cta: "Conoce más",
    screen: <GoalsScreen />,
  },
  {
    title: "Presupuestos inteligentes",
    description:
      "Crea presupuestos personalizados y visualiza tu progreso en tiempo real. Recibe alertas antes de exceder tus límites.",
    cta: "Conoce más",
    screen: <BudgetsScreen />,
  },
  {
    title: "Registro por voz",
    description:
      "Registra gastos e ingresos con un simple mensaje de voz. Sin escribir, sin complicaciones — solo habla y Rial se encarga del resto.",
    cta: "Conoce más",
    screen: <VoiceScreen />,
  },
  {
    title: "Calculadora de tasas",
    description:
      "Convierte entre monedas al instante con las tasas más actualizadas. Ideal para saber cuánto vale tu dinero en cualquier momento.",
    cta: "Conoce más",
    screen: <CalculatorScreen />,
  },
  {
    title: "Plantillas de transacciones",
    description:
      "Automatiza tus transacciones recurrentes con plantillas. Configura una vez y registra tus gastos fijos con un solo toque.",
    cta: "Conoce más",
    screen: <TemplatesScreen />,
  },
];

function FeatureRow({ feature, reversed }: { feature: Feature; reversed: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-12 lg:gap-20 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
      <div className="flex flex-1 items-center justify-center">
        <PhoneFrame>{feature.screen}</PhoneFrame>
      </div>
      <div className="flex flex-1 flex-col gap-4 text-center lg:text-left">
        <h3 className="font-[family-name:var(--font-sora)] text-3xl font-[800] text-[#161616] lg:text-4xl" style={{ lineHeight: 0.95 }}>
          {feature.title}
        </h3>
        <p className="text-base text-[#2D3B44] lg:text-lg" style={{ lineHeight: 1.5 }}>
          {feature.description}
        </p>
        <a href="#" className="btn-pill mt-2 inline-flex items-center gap-1 self-center bg-[#ACE524] px-4 py-2 text-sm font-medium text-[#161616] lg:self-start">
          {feature.cta}
          <span aria-hidden="true">›</span>
        </a>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-2xl">
          <h2 className="display-heading text-[clamp(2.5rem,5vw,4rem)]">
            Todo lo que necesitas para{" "}
            <span className="text-[#ACE524]">controlar tus finanzas personales</span>
          </h2>
          <p className="mt-6 text-lg text-[#2D3B44]" style={{ lineHeight: 1.5 }}>
            Descubre las características que hacen de Rial tu aliado financiero en Venezuela.
          </p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {FEATURES.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} reversed={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
