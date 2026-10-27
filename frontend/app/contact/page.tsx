import type { Metadata } from "next";
import { ApiDown } from "@/components/Ui";
import { ContactView } from "@/components/views/ContactView";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Noé Soulama for research internships, engineering roles or questions about his projects.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await load(() => api.profile());
  if (!profile) return <ApiDown />;
  return <ContactView profile={profile} />;
}
