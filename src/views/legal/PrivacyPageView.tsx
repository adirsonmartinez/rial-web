import { LegalCard } from "./LegalCard";

type Clause = {
  number: string;
  title: string;
  body: string;
  highlight?: { label: string; value: string };
};

const CLAUSES: Clause[] = [
  {
    number: "Primera",
    title: "Consentimiento Informado",
    body: "Los usuarios conceden autorización expresa para que RIAL recolecte, almacene y procese sus datos personales y financieros. El servicio persigue tres objetivos: provisión técnica de gestión financiera, optimización de algoritmos de IA, y generación de estadísticas de mercado.",
  },
  {
    number: "Segunda",
    title: "Tratamiento de Datos",
    body: "La plataforma solicita información de identificación, contacto, saldos bancarios, registros transaccionales, divisas y patrones de gasto. Estos datos provienen directamente del usuario o mediante integraciones autorizadas.\n\nRIAL implementa estándares de seguridad lógica, incluyendo cifrado de datos y protocolos de acceso restringido contra pérdida, alteración o acceso no permitido.",
  },
  {
    number: "Tercera",
    title: "Inteligencia Artificial y Anonimización",
    body: "Se acepta el procesamiento de datos financieros mediante algoritmos de IA para generar análisis personalizados. La compañía garantiza anonimización irreversible para entrenamientos de IA, estudios de mercado y mejora del producto.",
  },
  {
    number: "Cuarta",
    title: "Uso de Datos con Fines Estadísticos y Comerciales",
    body: "Se autoriza tratamiento bajo procesos de agregación. RIAL puede comercializar reportes estadísticos, tendencias y perfiles financieros agregados con información totalmente anónima, sin posibilidad de identificación individual.",
  },
  {
    number: "Quinta",
    title: "Derechos ARCO",
    body: "Los usuarios pueden solicitar acceso, corrección o eliminación de sus datos escribiéndonos al correo de soporte indicado abajo.\n\n5.1 Solicitud de eliminación: ciertos datos transaccionales se conservan bloqueados para cumplir obligaciones legales venezolanas antes de su destrucción definitiva.",
    highlight: { label: "Contacto ARCO", value: "soporte@somosrial.com" },
  },
  {
    number: "Sexta",
    title: "Transferencia de Datos y Proveedores",
    body: "Los datos pueden almacenarse en servidores internacionales bajo estándares globales de seguridad. RIAL comparte información con proveedores únicamente cuando es estrictamente necesario para la operatividad del servicio.",
  },
  {
    number: "Séptima",
    title: "Resguardo y Ciberseguridad",
    body: "Se aplican estándares de seguridad lógica, pero se reconoce que ninguna transmisión por internet es 100% segura y los usuarios asumen los riesgos inherentes al uso de servicios digitales.",
  },
  {
    number: "Octava",
    title: "Vigencia de los Datos",
    body: "La información se retiene durante la relación comercial y hasta cinco años posteriores al cierre de la cuenta, exclusivamente para obligaciones legales, fiscales y de auditoría, siendo eliminada de forma segura una vez transcurrido ese plazo.",
  },
];

export function PrivacyPageView() {
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
              Privacidad
            </span>
          </div>

          <h1
            className="display-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)]"
            style={{ lineHeight: 1.05 }}
          >
            Políticas de privacidad
          </h1>
          <p
            className="mt-5 max-w-2xl text-base lg:text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            En Rial respetamos tu información y la tratamos con los más altos estándares de seguridad. Aquí te explicamos cómo recolectamos, usamos y protegemos tus datos.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full pb-24 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col gap-6">
            {CLAUSES.map((clause) => (
              <LegalCard key={clause.number} number={clause.number} title={clause.title}>
                <div
                  className="flex flex-col gap-3 text-sm lg:text-base"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}
                >
                  {clause.body.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {clause.highlight && (
                  <div
                    className="mt-5 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-sm"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {clause.highlight.label}
                    </span>
                    <a
                      href={`mailto:${clause.highlight.value}`}
                      className="font-medium hover:underline"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {clause.highlight.value}
                    </a>
                  </div>
                )}
              </LegalCard>
            ))}
          </div>

          <div
            className="mt-10 rounded-[24px] p-6 text-sm lg:p-8"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
              lineHeight: 1.55,
            }}
          >
            <p className="font-[family-name:var(--font-sora)] text-base font-bold lg:text-lg">
              ¿Tienes dudas sobre tus datos?
            </p>
            <p className="mt-2">
              Escríbenos a{" "}
              <a href="mailto:soporte@somosrial.com" className="font-semibold underline">
                soporte@somosrial.com
              </a>{" "}
              y te respondemos lo antes posible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
