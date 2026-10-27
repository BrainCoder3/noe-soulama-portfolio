"use client";

import { useLang } from "@/lib/i18n";
import type { Achievement } from "@/lib/types";
import { AchievementList, PageHeader } from "../Ui";

const GROUPS = ["award", "academic", "certificate"] as const;

export function AchievementsView({ items }: { items: Achievement[] }) {
  const { ui } = useLang();
  return (
    <div className="wrap section narrow">
      <PageHeader titleKey="achievements.title" subKey="achievements.sub" />
      {GROUPS.map((group) => {
        const subset = items.filter((item) => item.kind === group);
        if (subset.length === 0) return null;
        return (
          <section key={group} className="ach-group">
            <h2>{ui(`achievements.group.${group}`)}</h2>
            <AchievementList items={subset} />
          </section>
        );
      })}
    </div>
  );
}
