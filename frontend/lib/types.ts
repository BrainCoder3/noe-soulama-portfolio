export type Lang = "en" | "fr";
export type Bi = { en: string; fr: string };

export type Stat = { value: Bi; tone: "gold" | "blue"; label: Bi };

export type Profile = {
  name: string;
  full_name: string;
  headline: Bi;
  tagline: Bi;
  bio: Bi;
  location: Bi;
  origin: Bi;
  cv_url: string;
  email: string;
  github: string;
  linkedin: string;
  stats: Stat[];
  interests: Bi[];
  languages: { name: string; level_en: string; level_fr: string }[];
};

export type PairMetric = {
  type: "pair";
  label: Bi;
  before: number;
  after: number;
  unit: string;
  max: number;
  before_label: Bi;
  after_label: Bi;
};

export type SeriesMetric = {
  type: "series";
  label: Bi;
  unit: string;
  max: number;
  points: { x: Bi; y: number }[];
};

export type Metric = PairMetric | SeriesMetric;

export type ProjectKind = "research" | "system" | "learning";
export type ProjectStatus = "live" | "demo" | "study" | "built" | "not_launched";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  status: ProjectStatus;
  priority: number;
  featured: boolean;
  year: number | null;
  summary: Bi;
  result: Bi;
  limit: Bi;
  role: Bi;
  image: string;
  image_fit: "cover" | "contain";
  image_alt: Bi;
  stack: string[];
  metrics: Metric[];
  repo_url: string;
  demo_url: string;
  code_is_private: boolean;
};

export type Experience = {
  org: string;
  kind: "company" | "community" | "leadership";
  role: Bi;
  place: Bi;
  start: string;
  end: string;
  description: Bi;
};

export type Achievement = {
  kind: "award" | "academic" | "certificate";
  title: Bi;
  rank: Bi;
  event: Bi;
  year: number | null;
  detail: Bi;
};

export type SkillGroup = { key: string; name: Bi; items: string[]; proof: Bi };
