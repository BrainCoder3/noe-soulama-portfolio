"use client";

/** Small presentational pieces shared by several pages. */
import Link from "next/link";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import type { Achievement, Experience, Profile, SkillGroup, Stat } from "@/lib/types";
import type { UiKey } from "@/lib/ui";

export function PageHeader({ titleKey, subKey, extra }: { titleKey: UiKey; subKey?: UiKey; extra?: ReactNode }) {
  const { ui } = useLang();
  return (
    <header className="page-head">
      <h1>{ui(titleKey)}</h1>
      {subKey && <p className="lede">{ui(subKey)}</p>}
      {extra}
    </header>
  );
}

export function SectionHead({ titleKey, linkHref, linkKey }: { titleKey: UiKey; linkHref?: string; linkKey?: UiKey }) {
  const { ui } = useLang();
  return (
    <div className="section-head">
      <h2>{ui(titleKey)}</h2>
      {linkHref && linkKey && (
        <Link href={linkHref} className="more">
          {ui(linkKey)}
        </Link>
      )}
    </div>
  );
}

export function StatsStrip({ stats }: { stats: Stat[] }) {
  const { t } = useLang();
  return (
    <dl className="stats">
      {stats.map((stat) => (
        <div key={stat.value} className={`stat stat-${stat.tone}`}>
          <dt className="stat-label">{t(stat.label)}</dt>
          <dd className="stat-value">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ items }: { items: Experience[] }) {
  const { t, ui } = useLang();
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={`${item.org}-${item.role.en}`} className="tl-item">
          <p className="tl-when">
            {item.start} - {item.end || ui("experience.present")}
          </p>
          <h3 className="tl-role">{t(item.role)}</h3>
          <p className="tl-org">
            {item.org}
            {item.place && <span>, {item.place}</span>}
          </p>
          <p className="tl-text">{t(item.description)}</p>
        </li>
      ))}
    </ol>
  );
}

export function AchievementList({ items }: { items: Achievement[] }) {
  const { t } = useLang();
  return (
    <ul className="ach">
      {items.map((item) => (
        <li key={item.title.en + item.event.en} className={`ach-item${item.rank ? " ach-ranked" : ""}`}>
          <span className="ach-rank" aria-label={item.rank || undefined}>
            {item.rank || "·"}
          </span>
          <div>
            <h3 className="ach-title">{t(item.title)}</h3>
            <p className="ach-event">
              {t(item.event)}
              {item.year ? `, ${item.year}` : ""}
            </p>
            {t(item.detail) && <p className="ach-detail">{t(item.detail)}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Skills({ groups }: { groups: SkillGroup[] }) {
  const { t } = useLang();
  return (
    <div className="skills">
      {groups.map((group) => (
        <section key={group.key} className="skill">
          <h3>{t(group.name)}</h3>
          <ul className="tags">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="skill-proof">{t(group.proof)}</p>
        </section>
      ))}
    </div>
  );
}

export function Links({ profile }: { profile: Pick<Profile, "email" | "github" | "linkedin"> }) {
  return (
    <ul className="direct">
      <li>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </li>
      <li>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          github.com/BrainCoder3
        </a>
      </li>
      {profile.linkedin && (
        <li>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      )}
    </ul>
  );
}

export function ApiDown() {
  const { ui } = useLang();
  return (
    <div className="notice" role="alert">
      <h1>{ui("error.title")}</h1>
      <p>{ui("error.text")}</p>
    </div>
  );
}
