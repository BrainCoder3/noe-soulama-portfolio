import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ArticleView } from "@/components/views/ArticleView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await api.article(params.slug);
    return {
      title: article.title.en,
      description: article.subtitle.en,
      alternates: { canonical: `/articles/${article.slug}` },
      openGraph: { type: "article", title: article.title.en, description: article.subtitle.en },
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const data = await load(async () => {
    const [article, all] = await Promise.all([api.article(params.slug), api.articles()]);
    const index = all.findIndex((a) => a.slug === article.slug);
    return {
      article,
      prev: index > 0 ? all[index - 1] : null,
      next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
    };
  });
  if (!data) return <ApiDown />;
  return <ArticleView {...data} />;
}
