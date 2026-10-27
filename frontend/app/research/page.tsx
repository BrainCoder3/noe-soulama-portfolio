import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ResearchView } from "@/components/views/ResearchView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Research",
  description: "Research by Noé Soulama: how AI models behave under noise, with measured results, limits and public code.",
  alternates: { canonical: "/research" },
};

export default async function ResearchPage() {
  const data = await load(async () => {
    const [projects, profile] = await Promise.all([api.projects("?kind=research"), api.profile()]);
    return { projects, profile };
  });
  if (!data) return <ApiDown />;
  return <ResearchView {...data} />;
}
