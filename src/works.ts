import { getCollection, type CollectionEntry } from "astro:content";

export type Work = CollectionEntry<"works">;

// Current work first, then by start year, then by end year.
export async function works() {
  const all = await getCollection("works");
  const end = (w: Work) => w.data.end ?? Infinity;
  return all.sort((a, b) => end(b) - end(a) || b.data.start - a.data.start);
}

export function years(w: Work) {
  const { start, end } = w.data;
  if (end === undefined) return `${start}–present`;
  return start === end ? `${start}` : `${start}–${end}`;
}
