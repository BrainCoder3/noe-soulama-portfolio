"use client";

import { useLang } from "@/lib/i18n";
import type { ProjectStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { ui } = useLang();
  return (
    <span className={`status status-${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {ui(`status.${status}`)}
    </span>
  );
}
