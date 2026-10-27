"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export function NotFoundView() {
  const { ui } = useLang();
  return (
    <div className="wrap section narrow notice">
      <h1>{ui("notfound.title")}</h1>
      <p className="lede">{ui("notfound.text")}</p>
      <p>
        <Link href="/" className="btn">
          {ui("notfound.home")}
        </Link>{" "}
        <Link href="/projects" className="btn btn-ghost">
          {ui("nav.projects")}
        </Link>
      </p>
    </div>
  );
}
