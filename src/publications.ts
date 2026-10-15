import { getCollection, type CollectionEntry } from "astro:content";

export type Pub = CollectionEntry<"publications">;

// Newest first; entries without a date go last within their year.
export async function publications() {
  const time = (p: Pub) => p.data.date?.getTime() ?? 0;
  return (await getCollection("publications")).sort((a, b) => b.data.year - a.data.year || time(b) - time(a));
}
