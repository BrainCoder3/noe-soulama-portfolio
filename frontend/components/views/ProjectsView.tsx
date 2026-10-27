"use client";

import type { Project } from "@/lib/types";
import { ProjectExplorer } from "../ProjectExplorer";
import { PageHeader } from "../Ui";

export function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <div className="wrap section">
      <PageHeader titleKey="projects.title" subKey="projects.sub" />
      <ProjectExplorer projects={projects} />
    </div>
  );
}
