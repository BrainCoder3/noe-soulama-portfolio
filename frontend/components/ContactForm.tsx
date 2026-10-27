"use client";

import { FormEvent, useState } from "react";
import { PUBLIC_API } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { UiKey } from "@/lib/ui";

/** Where mail goes when no backend is configured. Public on the page anyway. */
const MAIL_TO = "soulama0758@gmail.com";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done" }
  | { kind: "mail" }
  | { kind: "error"; key: UiKey };

export function ContactForm() {
  const { ui } = useLang();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!PUBLIC_API) {
      // No backend configured: open the visitor's mail client with the message already written.
      const name = String(data.get("name") ?? "");
      const email = String(data.get("email") ?? "");
      const message = String(data.get("message") ?? "");
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${MAIL_TO}?subject=${subject}&body=${body}`;
      setState({ kind: "mail" });
      return;
    }

    setState({ kind: "sending" });
    try {
      const response = await fetch(`${PUBLIC_API}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website") ?? "",
        }),
      });
      if (response.status === 201) {
        form.reset();
        setState({ kind: "done" });
      } else if (response.status === 400) {
        setState({ kind: "error", key: "contact.invalid" });
      } else if (response.status === 429) {
        setState({ kind: "error", key: "contact.throttled" });
      } else {
        setState({ kind: "error", key: "contact.error" });
      }
    } catch {
      setState({ kind: "error", key: "contact.error" });
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <label>
        <span>{ui("contact.name")}</span>
        <input name="name" type="text" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        <span>{ui("contact.email")}</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        <span>{ui("contact.message")}</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={7} />
      </label>
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button type="submit" className="btn" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? ui("contact.sending") : ui("contact.send")}
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {state.kind === "done" && ui("contact.sent")}
        {state.kind === "mail" && ui("contact.mail")}
        {state.kind === "error" && ui(state.key)}
      </p>
    </form>
  );
}
