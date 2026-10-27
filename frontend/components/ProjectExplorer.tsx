"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Project, ProjectKind } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

const KINDS: ("all" | ProjectKind)[] = ["all", "research", "system", "learning"];

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const { ui } = useLang();
  const [kind, setKind] = useState<"all" | ProjectKind>("all");
  const shown = useMemo(() => (kind === "all" ? projects : projects.filter((p) => p.kind === kind)), [kind, projects]);

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
