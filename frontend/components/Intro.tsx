"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const PLAY_MS = 5600; // how long the opening plays before the curtain lifts
const LEAVE_MS = 900; // curtain duration, keep in sync with globals.css

type Phase = "idle" | "play" | "leave" | "done";

/** A sine-like wave echoing the hero's signal, drawn across the opening. */
const WAVE = Array.from({ length: 121 }, (_, i) => {
  const x = (i / 120) * 1200;
  const envelope = 0.3 + 0.7 * Math.abs(Math.sin((i / 120) * Math.PI * 2.2));
  const y = 60 - envelope * (34 * Math.sin(i * 0.62) + 14 * Math.sin(i * 1.7 + 1));
  return `${i ? "L" : "M"}${x.toFixed(0)} ${y.toFixed(1)}`;
}).join("");

/**
 * The opening: introduces the person, then lifts like a curtain onto the home page.
 * It plays once per browser session, only on the home page, never with reduced motion.
 * The decision is made by a tiny inline script in <head> (see app/layout.tsx) so the
 * page never flashes before the opening covers it.
 */
export function Intro({ name }: { name: string }) {
  const { ui } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    try {
      sessionStorage.setItem("intro", "1");
    } catch {
      /* storage can be blocked */
    }
    // Releasing the page lets its own entrance animations start while the curtain rises.
    delete document.documentElement.dataset.intro;
    setPhase("leave");
    timers.current.push(window.setTimeout(() => setPhase("done"), LEAVE_MS));
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") {
      setPhase("done");
      return;
    }
    setPhase("play");
    timers.current.push(window.setTimeout(finish, PLAY_MS));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      timers.current.forEach(window.clearTimeout);
    };
  }, [finish]);

  if (phase === "done") return null;

  return (
    <div className="intro" data-phase={phase} role="dialog" aria-label={ui("intro.label")} onClick={finish}>
      <svg className="intro-wave" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d={WAVE} fill="none" pathLength={1} />
      </svg>
      <div className="intro-inner">
        <p className="intro-hello">{ui("intro.hello")}</p>
        <h2 className="intro-name" aria-label={name}>
          {Array.from(name).map((char, i) => (
            <span key={i} style={{ ["--i" as string]: i }} aria-hidden="true">
              {char === " " ? " " : char}
            </span>
          ))}
        </h2>
        <ul className="intro-facts">
          <li style={{ ["--d" as string]: "1.7s" }} className="intro-gold">
            {ui("intro.fact3")}
          </li>
          <li style={{ ["--d" as string]: "2.15s" }}>{ui("intro.fact1")}</li>
          <li style={{ ["--d" as string]: "2.6s" }}>{ui("intro.fact2")}</li>
        </ul>
        <div className="intro-passions">
          <p style={{ ["--d" as string]: "3.2s" }}>{ui("intro.passion")}</p>
          <ul>
            {(["intro.p1", "intro.p2", "intro.p3"] as const).map((key, i) => (
              <li key={key} style={{ ["--d" as string]: `${3.5 + i * 0.4}s` }}>
                {ui(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button type="button" className="btn-quiet intro-skip" onClick={finish} autoFocus>
        {ui("intro.skip")}
      </button>
    </div>
  );
}
