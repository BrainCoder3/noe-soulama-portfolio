"use client";

import { useLang } from "@/lib/i18n";
import type { Metric } from "@/lib/types";

function fmt(value: number, lang: string) {
  return value.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

function Bar({ value, max, tone, label, lang, unit }: { value: number; max: number; tone: "muted" | "signal" | "gold"; label: string; lang: string; unit: string }) {
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <span className="bar-track" aria-hidden="true">
        <span className={`bar-fill bar-${tone}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </span>
      <span className="bar-value">
        {fmt(value, lang)} {unit}
      </span>
    </div>
  );
}

export function MetricBars({ metrics }: { metrics: Metric[] }) {
  const { t, lang } = useLang();
  if (metrics.length === 0) return null;
  return (
    <div className="metrics">
      {metrics.map((metric, index) => (
        <figure className="metric" key={index}>
          <figcaption>{t(metric.label)}</figcaption>
          {metric.type === "pair" ? (
            <>
              <Bar value={metric.before} max={metric.max} tone="muted" label={t(metric.before_label)} lang={lang} unit={metric.unit} />
              <Bar value={metric.after} max={metric.max} tone="signal" label={t(metric.after_label)} lang={lang} unit={metric.unit} />
            </>
          ) : (
            metric.points.map((point, i) => (
              <Bar
                key={i}
                value={point.y}
                max={metric.max}
                tone={i === metric.points.length - 1 ? "signal" : "muted"}
                label={t(point.x)}
                lang={lang}
                unit={metric.unit}
              />
            ))
          )}
        </figure>
      ))}
    </div>
  );
}
