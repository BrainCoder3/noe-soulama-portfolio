import type { ReactNode } from "react";

/** Re-mounted on every navigation, so each page settles in with one gentle movement. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
