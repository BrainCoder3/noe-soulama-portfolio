"use client";

import { useLang } from "@/lib/i18n";
import type { Profile } from "@/lib/types";
import { ContactForm } from "../ContactForm";
import { Links, PageHeader } from "../Ui";

export function ContactView({ profile }: { profile: Profile }) {
  const { ui } = useLang();
  return (
    <div className="wrap section narrow">
      <PageHeader titleKey="contact.title" subKey="contact.sub" />
      <ContactForm />
      <section className="section-sub">
        <h2>{ui("contact.direct")}</h2>
        <Links profile={profile} />
      </section>
    </div>
  );
}
