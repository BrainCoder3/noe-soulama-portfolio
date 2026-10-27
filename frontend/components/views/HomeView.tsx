"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Achievement, Experience, Profile, Project } from "@/lib/types";
import { NoiseTrace } from "../NoiseTrace";
import { ProjectCard } from "../ProjectCard";
import { AchievementList, SectionHead, StatsStrip, Timeline } from "../Ui";

export function HomeView({
  profile,
  featured,
  experience,
  achievements,
}: {
  profile: Profile;
  featured: Project[];
  experience: Experience[];
  achievements: Achievement[];
}) {
  const { t, ui } = useLang();
  const [lead, ...rest] = featured;
  const ranked = achievements.filter((a) => a.rank).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>{t(profile.headline)}</h1>
            <p className="lede">{t(profile.tagline)}</p>
            <div className="cta">
              <Link href="/projects" className="btn">
                {ui("hero.cta_projects")}
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                {ui("hero.cta_contact")}
              </Link>
            </div>
            <p className="byline">
              {profile.name}, {profile.location}
            </p>
          </div>
          <NoiseTrace />
        </div>
      </section>

      <div className="wrap">
        <StatsStrip stats={profile.stats} />
      </div>

      <section className="section wrap">
        <SectionHead titleKey="home.featured.title" linkHref="/projects" linkKey="home.all_projects" />
        <p className="lede">{ui("home.featured.sub")}</p>
        {lead && <ProjectCard project={lead} lead />}
        <div className="grid">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap band-inner">
          <h2>{ui("home.honest.title")}</h2>
          <p>{ui("home.honest.text")}</p>
        </div>
      </section>

      <section className="section wrap split">
        <div>
          <SectionHead titleKey="home.experience.title" linkHref="/experience" linkKey="home.more" />
          <Timeline items={experience.slice(0, 3)} />
        </div>
        <div>
          <SectionHead titleKey="home.achievements.title" linkHref="/achievements" linkKey="home.more" />
          <AchievementList items={ranked} />
        </div>
      </section>

      <section className="section wrap cta-block">
        <h2>{ui("home.contact.title")}</h2>
        <p className="lede">{ui("home.contact.text")}</p>
        <Link href="/contact" className="btn">
          {ui("nav.contact")}
        </Link>
      </section>
    </>
  );
}
