"use client";

import Image from "next/image";
import { Persons } from "@gravity-ui/icons";

const TEAM = [
  { name: "Rafael Graziani", role: "CEO & Co-founder", linkedin: "https://www.linkedin.com/in/ragraziani", photo: "/founders/rafael-graziani.png" },
  { name: "Anselmo Velazco", role: "CFO & Co-founder", linkedin: "https://www.linkedin.com/in/anselmo-velazco", photo: "/founders/anselmo-velazco.png" },
  { name: "Adirson Martinez", role: "CTO & Co-founder", linkedin: "https://www.linkedin.com/in/martinezadirson", photo: "/founders/adirson-martinez.png" },
  { name: "Inaki Umerez", role: "CMO & Co-founder", linkedin: "https://www.linkedin.com/in/i%C3%B1aki-um%C3%A9rez-su%C3%A9-98a393209", photo: "/founders/inaki-umerez.png" },
];

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function TeamSection() {
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: "var(--card-bg-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <Persons width={12} height={12} />
            Equipo
          </span>
          <h2 className="display-heading text-[clamp(2rem,4vw,3rem)]">
            Los que hacen Rial posible
          </h2>
          <p className="max-w-md text-sm lg:text-base" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Un equipo apasionado por transformar la forma en que los venezolanos manejan su dinero.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="group flex flex-col overflow-hidden rounded-[24px]"
              style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--border) 0px 0px 0px 1px" }}
            >
              {/* Photo */}
              <div
                className="relative flex h-[280px] lg:h-[340px] items-center justify-center overflow-hidden"
                style={{ backgroundColor: "var(--card-bg-subtle)" }}
              >
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-[family-name:var(--font-sora)] text-sm font-[800] lg:text-base" style={{ color: "var(--text-primary)" }}>
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {member.role}
                  </p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn de ${member.name}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                  style={{ backgroundColor: "var(--card-bg-subtle)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ACE524"; e.currentTarget.style.color = "#161616"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--card-bg-subtle)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
