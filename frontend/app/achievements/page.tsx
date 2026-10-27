import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { AchievementsView } from "@/components/views/AchievementsView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Noé Soulama, ranked 1st of 49 at ENSA Tétouan, with competition wins and academic results.",
  alternates: { canonical: "/achievements" },
};

export default async function AchievementsPage() {
  const items = await load(() => api.achievements());
  if (!items) return <ApiDown />;
  return <AchievementsView items={items} />;
}
