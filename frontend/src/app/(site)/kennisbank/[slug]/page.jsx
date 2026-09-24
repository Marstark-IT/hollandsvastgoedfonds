import { notFound } from "next/navigation";
import ArticleView from "@/components/views/ArticleView";
import { ARTICLES, articleBySlug } from "@/data/articles";
import { articleMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return articleMetadata(articleBySlug(slug));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
