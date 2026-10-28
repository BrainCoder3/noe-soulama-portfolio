import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ProjectView } from "@/components/views/ProjectView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const project = await api.project(params.slug);
    return { title: project.title, description: project.summary.en.slice(0, 200) };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const data = await load(async () => {
    const [project, all, articles] = await Promise.all([api.project(params.slug), api.projects(), api.articles()]);
    const index = all.findIndex((p) => p.slug === project.slug);
    return {
      project,
      article: articles.find((a) => a.project_slug === project.slug) ?? null,
      prev: index > 0 ? all[index - 1] : null,
      next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
    };
  });
  if (!data) return <ApiDown />;
  return <ProjectView {...data} />;
}
