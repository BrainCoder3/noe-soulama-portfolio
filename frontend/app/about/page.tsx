import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { AboutView } from "@/components/views/AboutView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "About",
  description: "About Noé Soulama: engineering student from Burkina Faso, interests in robust AI, speech recognition and secure systems.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const data = await load(async () => {
    const [profile, skills] = await Promise.all([api.profile(), api.skills()]);
    return { profile, skills };
  });
  if (!data) return <ApiDown />;
  return <AboutView {...data} />;
}
