import { LegalCard } from "./LegalCard";

type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

type Section = {
  title?: string;
  blocks: Block[];
};

type Clause = {
  number: string;
  title: string;
  sections: Section[];
};

const CLAUSES: Clause[] = [
  {
    number: "Primera",
    title: "Condiciones Generales",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "Los usuarios deben ser mayores de edad y proporcionar consentimiento libre e informado. Los menores requieren autorización de su tutor. Al registrarse, los usuarios aceptan cumplir completamente con estos términos después de revisar cuidadosamente la documentación disponible.",
          },
          {
            type: "p",
            text: "RIAL se reserva el derecho de suspender cuentas que violen obligaciones o proporcionen información falsa, excluyendo al usuario de servicios futuros.",
          },
        ],
      },
    ],
  },
  {
    number: "Segunda",
    title: "Definiciones",
    sections: [
      {
        blocks: [
          {
            type: "list",
            items: [
              "Insights: reportes, categorizaciones y sugerencias generadas automáticamente por algoritmos.",
              "Plataforma: software para planificación financiera personal adaptado a la economía venezolana.",
              "Usuario: persona mayor de edad con capacidad legal para contratar.",
            ],
          },
        ],
      },
    ],
  },
  {
    number: "Tercera",
    title: "Servicios",
    sections: [
      {
        blocks: [
          { type: "p", text: "RIAL ofrece herramientas de finanzas personales impulsadas por IA:" },
          {
            type: "list",
            items: [
              "Consolidación multimoneda (bolívares, dólares, euros, criptoactivos).",
              "Categorización automática de ingresos y egresos.",
              "Análisis financiero personalizado.",
              "Registro por voz de transacciones.",
              "Visualización de tasas cambiarias.",
            ],
          },
        ],
      },
      {
        title: "3.1. Limitación de Responsabilidad por IA",
        blocks: [
          {
            type: "p",
            text: "Las categorizaciones son referencias estadísticas. RIAL no presta servicios de asesoría financiera, contable, fiscal ni legal. El usuario es responsable de verificar sus registros.",
          },
        ],
      },
    ],
  },
  {
    number: "Cuarta",
    title: "Naturaleza No-Bancaria",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "RIAL no es una institución bancaria ni un procesador de pagos. No capta fondos ni ejecuta transferencias. Funciona exclusivamente como herramienta de lectura y registro.",
          },
        ],
      },
    ],
  },
  {
    number: "Quinta",
    title: "Modalidades de Acceso",
    sections: [
      {
        title: "5.1. Plan Gratis",
        blocks: [
          {
            type: "list",
            items: [
              "Hasta 5 cuentas (3 nacionales, 2 internacionales).",
              "30 transacciones mensuales máximo.",
              "5 registros por voz al mes.",
              "Historial de 1 mes.",
              "3 listas guardadas.",
            ],
          },
        ],
      },
      {
        title: "5.2. Plan Plus",
        blocks: [
          {
            type: "p",
            text: "Cuatro dólares de los Estados Unidos de América con noventa y nueve centavos (USD 4.99) al mes, más IVA.",
          },
          {
            type: "list",
            items: [
              "Cuentas, transacciones y registro por voz ilimitados.",
              "Historial completo.",
              "Plantillas de registro rápido.",
            ],
          },
        ],
      },
      {
        title: "5.3. Facturación y No Reembolso",
        blocks: [
          {
            type: "p",
            text: "Los cargos son finales y no reembolsables. Las suscripciones se renuevan automáticamente. El usuario renuncia al derecho de retracto una vez iniciado el servicio.",
          },
        ],
      },
      {
        title: "5.4. Modificación de Tarifas",
        blocks: [
          {
            type: "p",
            text: "RIAL notificará cualquier cambio con 15 días de anticipación. No cancelar antes de la fecha de entrada en vigor implica aceptación tácita.",
          },
        ],
      },
    ],
  },
  {
    number: "Sexta",
    title: "Acceso a la Plataforma",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "RIAL no garantiza el acceso ni el uso continuado o ininterrumpido del servicio debido a dificultades técnicas. La compañía no es responsable por daños derivados de fallas del sistema, internet o virus.",
          },
        ],
      },
    ],
  },
  {
    number: "Séptima",
    title: "Modificación de Condiciones",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "RIAL puede modificar unilateralmente estos términos en cualquier momento. Los cambios son efectivos al publicarse. Los usuarios deben revisar las condiciones periódicamente.",
          },
        ],
      },
    ],
  },
  {
    number: "Octava",
    title: "Políticas de Privacidad",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "Los datos personales y financieros se procesan en servidores seguros. Para más detalles consulta la Política de Privacidad completa.",
          },
          {
            type: "p",
            text: "Los usuarios pueden solicitar la eliminación de su cuenta por correo electrónico o desde la configuración de la aplicación.",
          },
        ],
      },
    ],
  },
  {
    number: "Novena",
    title: "Privacidad y Comercialización",
    sections: [
      {
        title: "9.1. Consentimiento para Uso Estadístico",
        blocks: [
          {
            type: "p",
            text: "El usuario autoriza el uso anonimizado de datos para reportes, entrenamiento de IA y comercialización de insights agregados. El usuario renuncia expresamente a cualquier derecho, regalía o compensación derivada de esta explotación.",
          },
        ],
      },
    ],
  },
  {
    number: "Décima",
    title: "Legislación y Jurisdicción",
    sections: [
      {
        blocks: [
          {
            type: "p",
            text: "Estos términos se rigen por las leyes de la República Bolivariana de Venezuela.",
          },
        ],
      },
      {
        title: "10.1. Acuerdo de Arbitraje",
        blocks: [
          {
            type: "p",
            text: "Las disputas se resuelven mediante arbitraje en Caracas conforme al Reglamento del Centro Empresarial de Conciliación y Arbitraje (CEDCA).",
          },
        ],
      },
      {
        title: "10.2. Renuncia a Jurisdicción Ordinaria",
        blocks: [
          {
            type: "p",
            text: "Las partes renuncian a la jurisdicción de tribunales ordinarios, limitando su intervención a la ejecución del laudo arbitral.",
          },
        ],
      },
    ],
  },
];

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "p") {
    return <p>{block.text}</p>;
  }
  return (
    <ul className="flex flex-col gap-2 pl-1">
      {block.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--accent-soft-icon)" }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TermsPageView() {
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
              Términos
            </span>
          </div>

          <h1
            className="display-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)]"
            style={{ lineHeight: 1.05 }}
          >
            Términos y condiciones
          </h1>
          <p
            className="mt-5 max-w-2xl text-base lg:text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            Las condiciones que rigen el uso de Rial. Al registrarte aceptas estos términos; te recomendamos leerlos con calma.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full pb-24 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col gap-6">
            {CLAUSES.map((clause) => (
              <LegalCard key={clause.number} number={clause.number} title={clause.title}>
                <div className="flex flex-col gap-5">
                  {clause.sections.map((section, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-3">
                      {section.title && (
                        <h3
                          className="text-sm font-semibold lg:text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {section.title}
                        </h3>
                      )}
                      <div
                        className="flex flex-col gap-3 text-sm lg:text-base"
                        style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}
                      >
                        {section.blocks.map((block, bIdx) => (
                          <BlockRenderer key={bIdx} block={block} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
              ¿Tienes dudas sobre estos términos?
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
