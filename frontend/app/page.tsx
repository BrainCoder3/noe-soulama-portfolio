import { HomeView } from "@/components/views/HomeView";
import { ApiDown } from "@/components/Ui";
import { api } from "@/lib/api";
import { load } from "@/lib/load";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function HomePage() {
  const data = await load(async () => {
    const [profile, featured, experience, achievements] = await Promise.all([
      api.profile(),
      api.projects("?featured=1"),
      api.experience(),
      api.achievements(),
    ]);
    return { profile, featured, experience, achievements };
  });
  if (!data) return <ApiDown />;
  const { profile } = data;
  // Structured data: tells search engines who this site is about, so that a search for the name lands here.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: ["Soulama Noé", profile.full_name, "BrainCoder3"],
    url: SITE,
    jobTitle: "Engineering student, Big Data and AI",
    affiliation: { "@type": "CollegeOrUniversity", name: "ENSA Tétouan, Abdelmalek Essaâdi University" },
    nationality: { "@type": "Country", name: "Burkina Faso" },
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
    knowsAbout: ["Machine learning", "Speech recognition", "Computer vision", "Multimodal learning", "Software engineering", "Computer networks"],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <HomeView {...data} />
    </>
  );
}
