import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const link = z.object({ label: z.string(), url: z.url() });

// A work without an end year is current.
const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    start: z.number(),
    end: z.number().optional(),
    role: z.string().optional(),
    with: z.string().optional(),
    links: z.array(link).default([]),
    images: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
    video: z.url().optional(),
  }),
});

// Publications: earlier papers here, PhD papers from tsost (one source; edit them there).
// `equal`: how many of the first authors contributed equally.
const publication = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  equal: z.number().optional(),
  year: z.number(),
  date: z.coerce.date().optional(),
  venue: z.string(),
  kind: z.string(),
  status: z.string().optional(),
  award: z.string().optional(),
  doi: z.string().optional(),
  url: z.url().optional(),
});

const publications = defineCollection({ loader: file("src/data/publications.yaml"), schema: publication });

// TSOST_URL points the build at a local tsost for testing.
const tsost = process.env.TSOST_URL ?? "https://francesco-di-maggio.github.io/tsost";
const phd = defineCollection({
  loader: async () => {
    const res = await fetch(`${tsost}/publications.json`);
    if (!res.ok) throw new Error(`tsost publications: ${res.status} ${res.url}`);
    return res.json();
  },
  schema: publication,
});

const cv = defineCollection({
  loader: file("src/data/cv.yaml"),
  schema: z.object({
    section: z.enum(["work", "teaching", "education", "performances", "presentations"]),
    group: z.enum(["monolith", "a-pole-tragedy"]).optional(),
    when: z.coerce.string(),
    title: z.string(),
    sub: z.string().optional(),
    url: z.url().optional(),
  }),
});

export const collections = { works, publications, phd, cv };
