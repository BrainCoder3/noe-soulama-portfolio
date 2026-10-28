import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ArticlesView } from "@/components/views/ArticlesView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Articles",
  description: "Short technical reports by Noé Soulama on AI robustness, speech recognition, action recognition and dubbing, with measured results and stated limits.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await load(() => api.articles());
  if (!articles) return <ApiDown />;
  return <ArticlesView articles={articles} />;
}
