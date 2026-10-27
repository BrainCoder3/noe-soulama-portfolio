"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Bi, Lang } from "./types";
import { UI, type UiKey } from "./ui";

type LangContext = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pick the visitor's language out of a {en, fr} pair coming from the API. */
  t: (pair: Bi) => string;
  /** Look up an interface string. */
  ui: (key: UiKey) => string;
};

const Ctx = createContext<LangContext | null>(null);

export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo<LangContext>(
    () => ({
      lang,
      setLang,
      t: (pair) => pair[lang] || pair.en,
      ui: (key) => UI[lang][key],
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContext {
  const value = useContext(Ctx);
  if (!value) throw new Error("useLang must be used inside <LangProvider>");
  return value;
}
