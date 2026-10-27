import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const STATIC = ["", "/projects", "/research", "/experience", "/achievements", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    slugs = (await api.projects()).map((p) => p.slug);
  } catch {
    /* sitemap falls back to the static routes */
  }
  return [...STATIC, ...slugs.map((slug) => `/projects/${slug}`)].map((path) => ({ url: `${SITE}${path}` }));
}
