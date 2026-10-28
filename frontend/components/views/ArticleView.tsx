"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Article } from "@/lib/types";
import { ArticleBlocks } from "../ArticleBlocks";

export function ArticleView({ article, prev, next }: { article: Article; prev: Article | null; next: Article | null }) {
  const { t, ui } = useLang();
  return (
    <article className="wrap section article">
      <Link href="/articles" className="back">
        {ui("article.back")}
      </Link>
      <header className="article-head">
        <p className="article-meta">
          {ui("article.report")} · {article.date} · {article.reading_minutes} {ui("article.minutes")}
        </p>
        <h1>{t(article.title)}</h1>
        <p className="lede">{t(article.subtitle)}</p>
        <p className="article-links">
          <Link href={`/projects/${article.project_slug}`}>{ui("article.project")}</Link>
          {article.repo_url && (
            <a href={article.repo_url} target="_blank" rel="noopener noreferrer">
              {ui("article.code")}
            </a>
          )}
        </p>
      </header>

      <ArticleBlocks blocks={article.blocks} />

      <nav className="pager" aria-label="Articles">
        {prev ? (
          <Link href={`/articles/${prev.slug}`}>
            <span>{ui("project.prev")}</span>
            {t(prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/articles/${next.slug}`} className="pager-next">
            <span>{ui("project.next")}</span>
            {t(next.title)}
          </Link>
        )}
      </nav>
    </article>
  );
}
