import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { api } from "@/lib/api";
import { LangProvider } from "@/lib/i18n";
import type { Lang, Profile } from "@/lib/types";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const text = Source_Serif_4({ subsets: ["latin"], variable: "--font-text", display: "swap" });

/** Decides, before first paint, whether the opening plays: home page only, once per session, never with reduced motion. */
const INTRO_GATE = `try{if(location.pathname==="/"&&!sessionStorage.getItem("intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="1"}}catch(e){}`;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Noé Soulama - AI reliability, speech recognition and software engineering",
    template: "%s - Noé Soulama",
  },
  description:
    "Noé Soulama, engineering student in Big Data and AI at ENSA Tétouan, ranked 1st of 49. Experiments on how AI models behave under noise (speech, vision, multimodal) and the software built around them.",
  applicationName: "Noé Soulama portfolio",
  authors: [{ name: "Noé Soulama", url: SITE }],
  creator: "Noé Soulama",
  keywords: [
    "Noé Soulama",
    "Soulama Noé",
    "Noé Soulama portfolio",
    "Noé Soulama ENSA Tétouan",
    "AI robustness",
    "speech recognition",
    "machine learning",
    "Django REST Framework",
    "Next.js",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Noé Soulama",
    title: "Noé Soulama - AI reliability and systems",
    description: "Experiments on how AI models behave under noise, and the software built around them.",
    url: SITE,
  },
  twitter: { card: "summary_large_image", title: "Noé Soulama - AI reliability and systems" },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

const FALLBACK: Pick<Profile, "name" | "email" | "github" | "linkedin"> = {
  name: "Noé Soulama",
  email: "soulama0758@gmail.com",
  github: "https://github.com/BrainCoder3",
  linkedin: "",
};

function initialLang(): Lang {
  const saved = cookies().get("lang")?.value;
  if (saved === "fr" || saved === "en") return saved;
  return (headers().get("accept-language") ?? "").toLowerCase().startsWith("fr") ? "fr" : "en";
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = initialLang();
  let identity = FALLBACK;
  try {
    const profile = await api.profile();
    identity = { name: profile.name, email: profile.email, github: profile.github, linkedin: profile.linkedin };
  } catch {
    /* pages show their own "content unavailable" notice */
  }

  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      </head>
      <body>
        <LangProvider initial={lang}>
          <Intro name={identity.name} />
          <Nav name={identity.name} />
          <main id="main">{children}</main>
          <Footer {...identity} />
        </LangProvider>
      </body>
    </html>
  );
}
