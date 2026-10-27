"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/** Real Whisper-small word error rates from my pilot (5 recordings, 1 speaker). */
const LEVELS = [
  { id: "clean", snr: null as number | null, wer: 12.9 },
  { id: "db20", snr: 20, wer: 13.9 },
  { id: "db10", snr: 10, wer: 53.6 },
];

const N = 520;
const W = 960;
const H = 260;
const MID = H / 2;
const AMP = 92;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function toPath(values: number[]) {
  return values
    .map((v, i) => `${i ? "L" : "M"}${((i / (N - 1)) * W).toFixed(1)} ${(MID - Math.max(-1.3, Math.min(1.3, v)) * AMP).toFixed(1)}`)
    .join("");
}

/** Noise amplitude relative to the signal RMS for a given SNR: 10^(-SNR/20). */
const noiseFactor = (snr: number | null) => (snr === null ? 0 : Math.pow(10, -snr / 20));

export function NoiseTrace() {
  const { ui, lang } = useLang();
  const [index, setIndex] = useState(0);
  const group = useId();

  // Values drawn on screen. They glide toward the chosen level, so the noise rises and falls
  // instead of jumping. The measured error rate only exists at the three real levels.
  const [factor, setFactor] = useState(0);
  const [wer, setWer] = useState(LEVELS[0].wer);
  const frame = useRef<number | null>(null);

  // A speech-like signal: two carriers under a slow, uneven envelope.
  const signal = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      const envelope = 0.22 + 0.78 * Math.pow(Math.abs(Math.sin(2 * Math.PI * 2.2 * x)), 0.8);
      out.push(envelope * (0.7 * Math.sin(2 * Math.PI * 14 * x) + 0.3 * Math.sin(2 * Math.PI * 37 * x + 1)));
    }
    return out;
  }, []);

  const rms = useMemo(() => Math.sqrt(signal.reduce((s, v) => s + v * v, 0) / N), [signal]);

  // One fixed noise sample, scaled by the current factor: the same noise gets louder, never reshuffled.
  const noise = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: N }, () => gaussian(rand));
  }, []);

  const cleanPath = useMemo(() => toPath(signal), [signal]);
  const noisyPath = useMemo(
    () => toPath(signal.map((v, i) => v + rms * factor * noise[i])),
    [signal, noise, rms, factor],
  );

  // Current animated values live in refs, so each frame computes from the real previous value.
  const live = useRef({ factor: 0, wer: LEVELS[0].wer });

  useEffect(() => {
    const target = LEVELS[index];
    const targetFactor = noiseFactor(target.snr);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const publish = () => {
      setFactor(live.current.factor);
      setWer(live.current.wer);
    };
    if (reduce) {
      live.current = { factor: targetFactor, wer: target.wer };
      publish();
      return;
    }
    // Time-based easing (not per frame), so it takes the same ~0.6 s at any frame rate.
    let last = performance.now();
    const step = (now: number) => {
      const alpha = 1 - Math.exp(-(now - last) / 140);
      last = now;
      const f = live.current.factor + (targetFactor - live.current.factor) * alpha;
      const w = live.current.wer + (target.wer - live.current.wer) * alpha;
      const done = Math.abs(targetFactor - f) < 0.002 && Math.abs(target.wer - w) < 0.05;
      live.current = done ? { factor: targetFactor, wer: target.wer } : { factor: f, wer: w };
      publish();
      frame.current = done ? null : requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [index]);

  const shown = wer.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const labels = [ui("trace.clean"), "20 dB", "10 dB"];

  return (
    <figure className="scope" aria-labelledby={`${group}-title`}>
      <figcaption id={`${group}-title`} className="scope-title">
        {ui("trace.title")}
      </figcaption>
      <div className="scope-screen">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ui("trace.legend")} preserveAspectRatio="none">
          <g className="scope-grid" aria-hidden="true">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={(W / 10) * i} y1="0" x2={(W / 10) * i} y2={H} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={(H / 4) * i} x2={W} y2={(H / 4) * i} />
            ))}
          </g>
          <path className="scope-clean" d={cleanPath} fill="none" />
          <path className="scope-noisy" d={noisyPath} fill="none" pathLength={1} />
        </svg>
      </div>
      <div className="scope-controls">
        <fieldset>
          <legend>{ui("trace.legend")}</legend>
          {LEVELS.map((level, i) => (
            <span key={level.id} className="seg">
              <input type="radio" name={group} id={`${group}-${level.id}`} checked={index === i} onChange={() => setIndex(i)} />
              <label htmlFor={`${group}-${level.id}`}>{labels[i]}</label>
            </span>
          ))}
        </fieldset>
        <div className="scope-readout" aria-live="off">
          <span className="scope-num">{shown}</span>
          <span className="scope-unit">{ui("trace.unit")}</span>
        </div>
        {/* Screen readers get the final value once, not 40 intermediate ones. */}
        <span className="sr-only" aria-live="polite">
          {labels[index]}: {LEVELS[index].wer.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")} {ui("trace.unit")}
        </span>
      </div>
      <div className="scope-meter" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.min(1, wer / 60)})` }} />
      </div>
      <p className="scope-caption">{ui("trace.caption")}</p>
    </figure>
  );
}
