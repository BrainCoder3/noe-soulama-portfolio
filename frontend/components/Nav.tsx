"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { UiKey } from "@/lib/ui";

const LINKS: { href: string; key: UiKey }[] = [
  { href: "/projects", key: "nav.projects" },
  { href: "/research", key: "nav.research" },
  { href: "/experience", key: "nav.experience" },
  { href: "/achievements", key: "nav.achievements" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

function ThemeToggle() {
  const { ui } = useLang();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {
      /* storage can be blocked */
    }
    const initial = stored === "light" || stored === "dark" ? stored : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className="btn-quiet" onClick={toggle} aria-label={ui("theme.label")}>
      {theme === "dark" ? ui("theme.light") : ui("theme.dark")}
    </button>
  );
}

export function Nav({ name }: { name: string }) {
  const { ui, lang, setLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="nav">
      <a className="skip" href="#main">
        {ui("nav.skip")}
      </a>
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label={name}>
          <span className="brand-mark" aria-hidden="true" />
          {name}
        </Link>
        <button type="button" className="btn-quiet nav-burger" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((v) => !v)}>
          {ui("nav.menu")}
        </button>
        <nav id="site-nav" className={`nav-links${open ? " open" : ""}`} aria-label="Primary">
          {LINKS.map(({ href, key }) => (
            <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>
              {ui(key)}
            </Link>
          ))}
          <span className="nav-tools">
            <ThemeToggle />
            <button type="button" className="btn-quiet" onClick={() => setLang(lang === "en" ? "fr" : "en")} aria-label={ui("lang.label")}>
              {ui("lang.switch")}
            </button>
          </span>
        </nav>
      </div>
    </header>
  );
}
