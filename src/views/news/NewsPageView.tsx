"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { Clock, Calendar, ArrowRight } from "@gravity-ui/icons";
import type { Category as ArticleCategory } from "./data";
import { getFeaturedArticle, getListArticles } from "./data";
import { categoryChipColor } from "./style";

type Filter = "Todos" | ArticleCategory;

const CATEGORIES: Filter[] = [
  "Todos",
  "Producto",
  "Comunidad",
  "Actualización",
  "Educación",
  "Empresa",
];

const FEATURED = getFeaturedArticle();
const LIST_ARTICLES = getListArticles();

function ImagePlaceholder({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${tall ? "h-full min-h-[260px] lg:min-h-[380px]" : "h-[200px]"}`}
      style={{ backgroundColor: "var(--card-bg-subtle)" }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, var(--hero-glow-1) 0%, transparent 70%)",
        }}
      />
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--text-muted)", opacity: 0.4 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

export function NewsPageView() {
  const [active, setActive] = useState<Filter>("Todos");

  const filtered = useMemo(() => {
    if (active === "Todos") return LIST_ARTICLES;
    return LIST_ARTICLES.filter((a) => a.category === active);
  }, [active]);

  return (
    <div className="w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="relative w-full overflow-hidden pt-32 pb-12 lg:pt-36 lg:pb-16">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 80% 20%, var(--hero-glow-1) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Noticias
            </p>
          </div>
          <h1 className="display-heading mt-4 text-[clamp(2.25rem,4vw,4rem)]">
            Lo último<br />de Rial
          </h1>
          <p
            className="mt-6 max-w-xl text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
          >
            Actualizaciones de producto, historias de nuestra comunidad y guías
            prácticas para que saques el máximo provecho a tu dinero.
          </p>
        </div>
      </section>

      <section className="w-full pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Card
            variant="transparent"
            className="overflow-hidden rounded-[24px] border-0 p-0"
            style={{
              backgroundColor: "var(--bg-card)",
              boxShadow: "var(--border) 0px 0px 0px 1px",
            }}
          >
            <div className="grid gap-0 lg:grid-cols-2">
              <ImagePlaceholder tall />
              <div className="flex flex-col justify-between gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <Chip color="accent" variant="soft" size="sm">
                      <Chip.Label>Destacado</Chip.Label>
                    </Chip>
                    <Chip
                      color={categoryChipColor(FEATURED.category)}
                      variant="soft"
                      size="sm"
                    >
                      <Chip.Label>{FEATURED.category}</Chip.Label>
                    </Chip>
                  </div>
                  <h2
                    className="font-[family-name:var(--font-sora)] text-2xl font-[800] lg:text-4xl"
                    style={{ color: "var(--text-primary)", lineHeight: 1.15 }}
                  >
                    {FEATURED.title}
                  </h2>
                  <p
                    className="text-base"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                  >
                    {FEATURED.excerpt}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div
                    className="flex flex-wrap items-center gap-4 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {FEATURED.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {FEATURED.readTime} de lectura
                    </span>
                    <span>Por {FEATURED.author}</span>
                  </div>
                  <Link
                    href={`/noticias/${FEATURED.slug}`}
                    className="btn-pill btn-primary inline-flex items-center gap-2 self-start text-sm no-underline"
                    style={{ padding: "10px 20px" }}
                  >
                    Leer artículo
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="w-full pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const selected = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className="btn-pill text-sm transition-colors"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: selected
                      ? "var(--rial)"
                      : "var(--card-bg-hover)",
                    color: selected
                      ? "var(--text-on-accent)"
                      : "var(--text-primary)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          {filtered.length === 0 ? (
            <div
              className="rounded-[24px] p-10 text-center"
              style={{
                backgroundColor: "var(--bg-card)",
                boxShadow: "var(--border) 0px 0px 0px 1px",
                color: "var(--text-muted)",
              }}
            >
              Aún no tenemos artículos en esta categoría.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <Link
                  key={article.slug}
                  href={`/noticias/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[24px] no-underline transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    boxShadow: "var(--border) 0px 0px 0px 1px",
                  }}
                >
                  <ImagePlaceholder />

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Chip
                        color={categoryChipColor(article.category)}
                        variant="soft"
                        size="sm"
                      >
                        <Chip.Label>{article.category}</Chip.Label>
                      </Chip>
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Clock className="size-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3
                      className="font-[family-name:var(--font-sora)] text-base font-[800] transition-colors group-hover:text-[#ACE524] lg:text-lg"
                      style={{ color: "var(--text-primary)", lineHeight: 1.3 }}
                    >
                      {article.title}
                    </h3>

                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
                    >
                      {article.excerpt}
                    </p>

                    <div
                      className="mt-auto flex items-center justify-between pt-3 text-xs"
                      style={{
                        color: "var(--text-muted)",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                        Leer
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                className="btn-pill btn-secondary inline-flex items-center gap-2 text-sm"
                style={{ padding: "10px 20px" }}
              >
                Cargar más artículos
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
