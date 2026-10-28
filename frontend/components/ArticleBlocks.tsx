"use client";

import { useLang } from "@/lib/i18n";
import type { Block } from "@/lib/types";

/** Renders the typed blocks of an article. Every block carries both languages. */
export function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  const { t, lang } = useLang();

  return (
    <div className="prose-article">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return <h2 key={index}>{t(block.text)}</h2>;
          case "p":
            return <p key={index}>{t(block.text)}</p>;
          case "callout":
            return (
              <aside key={index} className="callout">
                {t(block.text)}
              </aside>
            );
          case "list":
            return (
              <ul key={index} className="article-list">
                {block.items[lang].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "table":
            return (
              <figure key={index} className="data-table">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {block.headers[lang].map((header, i) => (
                          <th key={i} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows[lang].map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td key={c}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption>{t(block.caption)}</figcaption>
              </figure>
            );
          case "figure":
            return (
              <figure key={index} className="article-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={t(block.alt)} loading="lazy" decoding="async" />
                <figcaption>{t(block.caption)}</figcaption>
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
