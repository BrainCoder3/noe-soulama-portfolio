"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import { useLang } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { MetricBars } from "./MetricBars";
import { StatusBadge } from "./StatusBadge";

/** The soft light that follows the pointer across a card. Pure decoration: it sets two CSS variables. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
}

export function ProjectCard({ project, lead = false }: { project: Project; lead?: boolean }) {
  const { t, ui } = useLang();
  return (
    <article className={`card${lead ? " card-lead" : ""}`} onPointerMove={trackPointer}>
      <div className="card-body">
        <div className="card-top">
          <StatusBadge status={project.status} />
          <span className="card-kind">{ui(`kind.${project.kind}`)}</span>
        </div>
        <h3 className="card-title">
          <Link href={`/projects/${project.slug}`} className="card-link">
            {project.title}
          </Link>
        </h3>
        <p className="card-summary">{t(project.summary)}</p>
        {project.result.en && lead && <p className="card-result">{t(project.result)}</p>}
        <ul className="tags" aria-label={ui("project.stack")}>
          {project.stack.slice(0, lead ? 8 : 5).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {(project.repo_url || project.demo_url) && (
          <p className="card-ext">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                {ui("project.live")}
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                {ui("project.code")}
              </a>
            )}
          </p>
        )}
      </div>
      {lead && project.metrics.length > 0 && (
        <div className="card-metrics">
          <MetricBars metrics={project.metrics} />
        </div>
      )}
    </article>
  );
}
