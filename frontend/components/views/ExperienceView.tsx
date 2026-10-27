"use client";

import type { Experience } from "@/lib/types";
import { PageHeader, Timeline } from "../Ui";

export function ExperienceView({ items }: { items: Experience[] }) {
  return (
    <div className="wrap section narrow">
      <PageHeader titleKey="experience.title" subKey="experience.sub" />
      <Timeline items={items} />
    </div>
  );
}
