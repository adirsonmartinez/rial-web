import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/views/home/Footer";
import { ArticleView } from "@/views/news/ArticleView";
import {
  ARTICLES,
  getArticleBySlug,
  getRelatedArticles,
} from "@/views/news/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Artículo no encontrado" };
  }
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);

  return (
    <>
      <ArticleView article={article} related={related} />
      <Footer />
    </>
  );
}
