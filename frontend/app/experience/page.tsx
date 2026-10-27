import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ExperienceView } from "@/components/views/ExperienceView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Experience",
  description: "Experience of Noé Soulama: UniTchad co-founder, full-stack developer, technical lead at the Africa Research Center.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const items = await load(() => api.experience());
  if (!items) return <ApiDown />;
  return <ExperienceView items={items} />;
}
