"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Project, ProjectKind } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

type Filter = "featured" | "all" | ProjectKind;
const KINDS: Filter[] = ["featured", "all", "research", "system", "learning"];

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const { ui } = useLang();
  const [kind, setKind] = useState<Filter>("featured");
  const shown = useMemo(() => {
    if (kind === "all") return projects;
    if (kind === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.kind === kind);
  }, [kind, projects]);

  return (
    <>
      <div className="filters" role="group" aria-label={ui("projects.title")}>
        {KINDS.map((value) => (
          <button
            key={value}
            type="button"
            className={`chip${kind === value ? " chip-on" : ""}`}
            aria-pressed={kind === value}
            onClick={() => setKind(value)}
          >
            {ui(`kind.${value}`)}
          </button>
        ))}
        <span className="filters-count" aria-live="polite">
          {shown.length} {ui("projects.count")}
        </span>
      </div>
      <div className="grid">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
