import Link from "next/link";
import { Chip } from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Copy,
  LogoFacebook,
  LogoLinkedin,
  Link as LinkIcon,
} from "@gravity-ui/icons";
import type { Article, ArticleBlock } from "./data";
import { categoryChipColor } from "./style";

type ArticleViewProps = {
  article: Article;
  related: Article[];
};

function ArticleHero() {
  return (
    <div
      className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-[24px] lg:h-[440px]"
      style={{ backgroundColor: "var(--card-bg-subtle)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, var(--hero-glow-1) 0%, transparent 70%)",
        }}
      />
      <svg
        width="72"
        height="72"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--text-muted)", opacity: 0.35 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className="text-base lg:text-lg"
          style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
        >
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2
          className="font-[family-name:var(--font-sora)] text-2xl font-[800] lg:text-3xl"
          style={{ color: "var(--text-primary)", lineHeight: 1.2 }}
        >
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote
          className="my-2 rounded-[24px] px-6 py-6 lg:px-8 lg:py-8"
          style={{
            backgroundColor: "var(--card-bg-subtle)",
            borderLeft: "4px solid var(--rial)",
          }}
        >
          <p
            className="font-[family-name:var(--font-sora)] text-lg font-[700] lg:text-xl"
            style={{ color: "var(--text-primary)", lineHeight: 1.4 }}
          >
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <footer
              className="mt-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-3 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base lg:text-lg"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              <span
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ACE524]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

function ShareRow() {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-[20px] px-5 py-4"
      style={{
        backgroundColor: "var(--card-bg-subtle)",
      }}
    >
      <span
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        Compartir
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Compartir en Facebook"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <LogoFacebook className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Compartir en LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <LogoLinkedin className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Copiar enlace"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <LinkIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Copiar texto"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <Copy className="size-4" />
        </button>
      </div>
    </div>
  );
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-[24px] no-underline transition-transform hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--border) 0px 0px 0px 1px",
      }}
    >
      <div
        className="relative flex h-[160px] items-center justify-center"
        style={{ backgroundColor: "var(--card-bg-subtle)" }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--text-muted)", opacity: 0.3 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Chip color={categoryChipColor(article.category)} variant="soft" size="sm">
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
      </div>
    </Link>
  );
}

export function ArticleView({ article, related }: ArticleViewProps) {
  const initial = article.author.charAt(0).toUpperCase();

  return (
    <div className="w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="relative w-full overflow-hidden pt-32 pb-10 lg:pt-36 lg:pb-12">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 80% 20%, var(--hero-glow-1) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 self-start text-sm no-underline"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="size-4" />
            Volver a Noticias
          </Link>

          <div className="flex items-center gap-2">
            <Chip color={categoryChipColor(article.category)} variant="soft" size="sm">
              <Chip.Label>{article.category}</Chip.Label>
            </Chip>
          </div>

          <h1 className="display-heading text-[clamp(2rem,4vw,3.5rem)]">
            {article.title}
          </h1>

          <p
            className="text-lg lg:text-xl"
            style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
          >
            {article.excerpt}
          </p>

          <div
            className="flex flex-wrap items-center gap-4 pt-2"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-[family-name:var(--font-sora)] text-sm font-[800]"
                style={{ backgroundColor: "var(--rial)", color: "var(--text-on-accent)" }}
              >
                {initial}
              </div>
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {article.author}
                </span>
                <span className="text-xs">{article.authorRole}</span>
              </div>
            </div>
            <div className="hidden h-8 w-px sm:block" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {article.readTime} de lectura
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-12 lg:pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <ArticleHero />
        </div>
      </section>

      <article className="w-full pb-16 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          <div className="pt-6">
            <ShareRow />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section
          className="w-full py-16 lg:py-20"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ACE524]" />
                  <p
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Sigue leyendo
                  </p>
                </div>
                <h2 className="display-heading text-[clamp(1.75rem,3vw,2.5rem)]">
                  Artículos relacionados
                </h2>
              </div>
              <Link
                href="/noticias"
                className="btn-pill btn-secondary inline-flex items-center gap-2 self-start text-sm no-underline lg:self-auto"
                style={{ padding: "8px 16px" }}
              >
                Ver todas
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RelatedCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
