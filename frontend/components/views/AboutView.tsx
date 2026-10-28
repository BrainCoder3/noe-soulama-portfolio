"use client";

import { useLang } from "@/lib/i18n";
import type { Profile, SkillGroup } from "@/lib/types";
import { Links, PageHeader, Skills } from "../Ui";

export function AboutView({ profile, skills }: { profile: Profile; skills: SkillGroup[] }) {
  const { t, ui, lang } = useLang();
  const paragraphs = t(profile.bio).split("\n\n");

  return (
    <div className="wrap section">
      <PageHeader titleKey="about.title" />
      <div className="about-grid">
        <div className="prose">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <p className="muted">
            {ui("about.from")} {t(profile.origin)}. {ui("about.based")} {t(profile.location)}.
          </p>
        </div>
        <aside className="about-side">
          <section>
            <h2>{ui("about.interests")}</h2>
            <ul className="plain">
              {profile.interests.map((interest) => (
                <li key={interest.en}>{t(interest)}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>{ui("about.languages")}</h2>
            <ul className="plain">
              {profile.languages.map((language) => (
                <li key={language.name}>
                  {language.name}, {lang === "fr" ? language.level_fr : language.level_en}
                </li>
              ))}
            </ul>
          </section>
          <Links profile={profile} />
        </aside>
      </div>

      <section className="section-sub">
        <h2>{ui("about.skills")}</h2>
        <Skills groups={skills} />
      </section>

      <section className="next">
        <h2>{ui("about.next.title")}</h2>
        <ul>
          <li>{ui("about.next.1")}</li>
          <li>{ui("about.next.2")}</li>
        </ul>
      </section>
    </div>
  );
}
