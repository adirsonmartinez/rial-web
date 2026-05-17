type LegalCardProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

export function LegalCard({ number, title, children }: LegalCardProps) {
  return (
    <section
      className="rounded-2xl p-2"
      style={{
        backgroundColor: "var(--bg-card-outer)",
        border: "1px solid var(--border)",
      }}
    >
      <header className="flex items-start justify-between gap-3 px-3 pt-2 pb-3">
        <div className="min-w-0">
          <span
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Cláusula {number}
          </span>
          <h2
            className="mt-1 text-base font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
        </div>
      </header>
      <div
        className="overflow-hidden rounded-xl"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="p-5 lg:p-6">{children}</div>
      </div>
    </section>
  );
}
