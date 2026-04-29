"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "¿Qué monedas puedo gestionar con Rial?",
    answer:
      "Rial te permite organizar tus finanzas en bolívares (VES), dólares (USD) y euros (EUR) desde una sola app. Puedes registrar ingresos, gastos y ahorros en cualquiera de estas monedas.",
  },
  {
    question: "¿Rial está conectado a mi cuenta bancaria?",
    answer:
      "Actualmente Rial no se conecta directamente a cuentas bancarias. Funciona como un gestor financiero personal donde tú registras tus movimientos de forma manual o por voz.",
  },
  {
    question: "¿Es seguro usar Rial para mis datos financieros?",
    answer:
      "Sí. Tus datos se almacenan de forma segura y encriptada. No compartimos tu información con terceros y seguimos las mejores prácticas de seguridad en la industria.",
  },
  {
    question: "¿Rial es gratis?",
    answer:
      "Rial ofrece un plan gratuito con todas las funcionalidades esenciales. También contamos con planes premium que incluyen características avanzadas como plantillas ilimitadas y reportes detallados.",
  },
  {
    question: "¿Cómo funciona el registro por voz?",
    answer:
      "Solo presiona el botón de micrófono y di algo como \"Gasté 15 dólares en almuerzo\". Rial transcribe tu voz, detecta el monto, la categoría y registra la transacción automáticamente.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium"
            style={{
              backgroundColor: open ? "#ACE524" : "var(--card-bg-subtle)",
              color: open ? "#161616" : "var(--text-muted)",
            }}
          >
            {open ? "×" : "+"}
          </div>
          <span className="text-sm font-medium lg:text-base" style={{ color: "var(--text-primary)" }}>
            {question}
          </span>
        </div>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pl-9 text-sm" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              FAQ&apos;s
            </p>
          </div>
          <h2 className="display-heading text-[clamp(2rem,4vw,3rem)]">
            Preguntas frecuentes
          </h2>
          <p className="max-w-md text-sm lg:text-base" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Todo lo que necesitas saber sobre Rial y cómo puede ayudarte a gestionar tus finanzas.
          </p>
        </div>

        {/* Questions */}
        <div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
