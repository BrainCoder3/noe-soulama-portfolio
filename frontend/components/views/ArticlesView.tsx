"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Article } from "@/lib/types";
import { PageHeader } from "../Ui";

export function ArticlesView({ articles }: { articles: Article[] }) {
  const { t, ui } = useLang();
  return (
    <div className="wrap section">
      <PageHeader titleKey="articles.title" subKey="articles.sub" />
      <ol className="article-index">
        {articles.map((article, index) => (
          <li key={article.slug} className="article-row">
            <span className="article-no" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>
                <Link href={`/articles/${article.slug}`}>{t(article.title)}</Link>
              </h2>
              <p>{t(article.subtitle)}</p>
              <p className="article-meta">
                {article.date} · {article.reading_minutes} {ui("article.minutes")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
