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

// `equal`: how many of the first authors contributed equally. `tsost`: the id of the entry on the tsost site.
const publications = defineCollection({
  loader: file("src/data/publications.yaml"),
  schema: z.object({
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
    tsost: z.string().optional(),
  }),
});

const cv = defineCollection({
  loader: file("src/data/cv.yaml"),
  schema: z.object({
    section: z.enum(["work", "teaching", "education", "performances", "presentations"]),
    when: z.coerce.string(),
    title: z.string(),
    sub: z.string().optional(),
    url: z.url().optional(),
  }),
});

export const collections = { works, publications, cv };
