"use client";

import { useLang } from "@/lib/i18n";
import type { Profile, Project } from "@/lib/types";
import { MetricBars } from "../MetricBars";
import { ProjectCard } from "../ProjectCard";
import { PageHeader } from "../Ui";

export function ResearchView({ projects, profile }: { projects: Project[]; profile: Profile }) {
  const { t, ui } = useLang();
  const studies = projects.filter((p) => p.metrics.length > 0);

  return (
    <div className="wrap section">
      <PageHeader titleKey="research.title" subKey="research.sub" />

      <section className="question">
        <h2>{ui("research.question.title")}</h2>
        <p>{ui("research.question.text")}</p>
      </section>

      <div className="studies">
        {studies.map((project) => (
          <section key={project.slug} className="study">
            <h2>{project.title}</h2>
            <p>{t(project.result)}</p>
            <MetricBars metrics={project.metrics} />
            <p className="limit-inline">
              <strong>{ui("project.limit")}.</strong> {t(project.limit)}
            </p>
          </section>
        ))}
      </div>

      <section className="how">
        <h2>{ui("research.how.title")}</h2>
        <ul>
          <li>{ui("research.how.1")}</li>
          <li>{ui("research.how.2")}</li>
          <li>{ui("research.how.3")}</li>
        </ul>
      </section>

      <section>
        <h2>{ui("projects.title")}</h2>
        <div className="grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section>
        <h2>{ui("research.interests")}</h2>
        <ul className="tags tags-big">
          {profile.interests.map((interest) => (
            <li key={interest.en}>{t(interest)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
