import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ProjectsView } from "@/components/views/ProjectsView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Projects",
  description: "All of Noé Soulama's projects: AI robustness experiments, speech recognition, platforms and APIs, with their measured results and limits.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await load(() => api.projects());
  if (!projects) return <ApiDown />;
  return <ProjectsView projects={projects} />;
}
