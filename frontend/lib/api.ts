import type { Achievement, Experience, Profile, Project, SkillGroup } from "./types";

const SERVER_API =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

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

export const api = {
  profile: () => get<Profile>("/profile/"),
  projects: (query = "") => get<Project[]>(`/projects/${query}`),
  project: (slug: string) => get<Project>(`/projects/${slug}/`),
  experience: () => get<Experience[]>("/experience/"),
  achievements: () => get<Achievement[]>("/achievements/"),
  skills: () => get<SkillGroup[]>("/skills/"),
};
