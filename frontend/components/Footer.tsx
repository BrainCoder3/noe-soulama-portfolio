"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export function Footer({ name, email, github, linkedin }: { name: string; email: string; github: string; linkedin: string }) {
  const { ui } = useLang();
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <p className="footer-name">{name}</p>
          <p className="footer-note">{ui("footer.rights")}</p>
          <p className="footer-note">{ui("footer.built")}</p>
        </div>
        <ul className="footer-links">
          <li>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li>
            <a href={github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          )}
          <li>
            <Link href="/contact">{ui("nav.contact")}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
