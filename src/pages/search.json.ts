import { getCollection } from "astro:content";
import { url } from "../url";
import { publications as all } from "../publications";

// One entry per work, publication and CV line. `find` is what the search matches; it is not shown.
export async function GET() {
  const works = (await getCollection("works")).map((w) => ({
    type: "Work",
    title: w.data.title,
    text: w.data.summary,
    href: url(`works/${w.id}/`),
    find: [w.data.title, w.data.summary, w.data.role, w.data.with, w.body].join(" "),
  }));
  const publications = (await all()).map((p) => ({
    type: "Publication",
    title: p.data.title,
    text: `${p.data.venue} · ${p.data.kind}`,
    href: `${url("publications/")}#${p.id}`,
    find: [p.data.title, p.data.authors.join(" "), p.data.venue, p.data.kind, p.data.year, p.data.award].join(" "),
  }));
  const cv = (await getCollection("cv")).map((e) => ({
    type: "CV",
    title: e.data.title,
    text: [e.data.sub, e.data.when].filter(Boolean).join(" · "),
    href: `${url("cv/")}#${e.id}`,
    find: [e.data.title, e.data.sub, e.data.when].join(" "),
  }));
  return new Response(JSON.stringify([...works, ...publications, ...cv]), { headers: { "Content-Type": "application/json" } });
}
