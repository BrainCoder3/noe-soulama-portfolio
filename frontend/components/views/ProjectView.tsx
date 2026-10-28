"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { MetricBars } from "../MetricBars";
import { StatusBadge } from "../StatusBadge";

export function ProjectView({ project, prev, next }: { project: Project; prev: Project | null; next: Project | null }) {
  const { t, ui } = useLang();
  const hasLinks = Boolean(project.repo_url || project.demo_url);

  return (
    <article className="wrap section project">
      <Link href="/projects" className="back">
        {ui("project.back")}
      </Link>
      <header className="project-head">
        <div className="card-top">
          <StatusBadge status={project.status} />
          <span className="card-kind">{ui(`kind.${project.kind}`)}</span>
          {project.year && <span className="card-kind">{project.year}</span>}
        </div>
        <h1>{project.title}</h1>
        <p className="lede">{t(project.summary)}</p>
      </header>

      {project.image && (
        <figure className="project-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={t(project.image_alt)} style={{ objectFit: project.image_fit }} />
        </figure>
      )}

      <div className="project-body">
        <div className="project-main">
          {t(project.result) && (
            <section>
              <h2>{ui("project.result")}</h2>
              <p>{t(project.result)}</p>
              <MetricBars metrics={project.metrics} />
            </section>
          )}
          {t(project.limit) && (
            <section className="limit">
              <h2>{ui("project.limit")}</h2>
              <p>{t(project.limit)}</p>
            </section>
          )}
        </div>

        <aside className="project-side">
          {t(project.role) && (
            <section>
              <h2>{ui("project.role")}</h2>
              <p>{t(project.role)}</p>
            </section>
          )}
          <section>
            <h2>{ui("project.stack")}</h2>
            <ul className="tags">
              {project.stack.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </section>
          {(hasLinks || project.code_is_private) && (
            <section>
              <h2>{ui("project.links")}</h2>
              {project.demo_url && (
                <p>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    {ui("project.live")}
                  </a>
                </p>
              )}
              {project.repo_url && (
                <p>
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                    {ui("project.code")}
                  </a>
                </p>
              )}
              {project.code_is_private && <p className="muted">{ui("project.private")}</p>}
            </section>
          )}
        </aside>
      </div>

      <nav className="pager" aria-label="Projects">
        {prev ? (
          <Link href={`/projects/${prev.slug}`}>
            <span>{ui("project.prev")}</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/projects/${next.slug}`} className="pager-next">
            <span>{ui("project.next")}</span>
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  );
}
