import snapshotData from "@/data/snapshot.json";
import type { Achievement, Experience, Profile, Project, SkillGroup } from "./types";

/**
 * Two ways to get the content, same shape either way:
 *  - API mode: when API_URL / NEXT_PUBLIC_API_URL is set, the Django REST API is called.
 *  - Snapshot mode: otherwise the site reads data/snapshot.json (written by
 *    `manage.py export_snapshot`). No backend has to be running, so the site cannot go down
 *    because a server stopped.
 */
const SERVER_API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

/** Browser-side API address; empty in snapshot mode (the contact form then falls back to e-mail). */
export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Snapshot = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  achievements: Achievement[];
  skills: SkillGroup[];
};

const snapshot = snapshotData as unknown as Snapshot;

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${SERVER_API}${path}`, { next: { revalidate: 60 } });
  } catch {
    throw new ApiError(0, "The content API is unreachable.");
  }
  if (!response.ok) throw new ApiError(response.status, `API answered ${response.status} for ${path}`);
  return (await response.json()) as T;
}

function snapshotProjects(query: string): Project[] {
  const params = new URLSearchParams(query);
  let items = snapshot.projects;
  const kind = params.get("kind");
  if (kind) items = items.filter((p) => p.kind === kind);
  if (params.get("featured") === "1" || params.get("featured") === "true") items = items.filter((p) => p.featured);
  return items;
}

export const api = SERVER_API
  ? {
      profile: () => get<Profile>("/profile/"),
      projects: (query = "") => get<Project[]>(`/projects/${query}`),
      project: (slug: string) => get<Project>(`/projects/${slug}/`),
      experience: () => get<Experience[]>("/experience/"),
      achievements: () => get<Achievement[]>("/achievements/"),
      skills: () => get<SkillGroup[]>("/skills/"),
    }
  : {
      profile: async () => snapshot.profile,
      projects: async (query = "") => snapshotProjects(query),
      project: async (slug: string) => {
        const found = snapshot.projects.find((p) => p.slug === slug);
        if (!found) throw new ApiError(404, `No project ${slug}`);
        return found;
      },
      experience: async () => snapshot.experience,
      achievements: async () => snapshot.achievements,
      skills: async () => snapshot.skills,
    };
