import { COMPANY, ROUTES, NOINDEX } from "@/data/site";
import { ARTICLES, articlePath } from "@/data/articles";
import { REGIONS, regionPath } from "@/data/regions";

export const dynamic = "force-static";

const LEGAL = ["privacy", "cookies", "disclaimer"];
const abs = (p) => `${COMPANY.url}${p}`;

// Every indexable page. Pages with an English twin list both as alternates.
export default function sitemap() {
  const built = new Date();
  const pages = Object.keys(ROUTES)
    .filter((k) => !NOINDEX.includes(k))
    .flatMap((k) =>
      ["nl", "en"]
        .filter((loc) => ROUTES[k][loc])
        .map((loc) => ({
          url: abs(ROUTES[k][loc]),
          lastModified: built,
          changeFrequency: k === "home" || k === "kennisbank" ? "weekly" : "monthly",
          priority: k === "home" ? 1 : LEGAL.includes(k) ? 0.3 : loc === "en" ? 0.6 : 0.8,
          ...(ROUTES[k].en
            ? { alternates: { languages: { "nl-NL": abs(ROUTES[k].nl), "en-GB": abs(ROUTES[k].en) } } }
            : {}),
        }))
    );
  const articles = ARTICLES.map((a) => ({ url: abs(articlePath(a.slug)), lastModified: new Date(a.date), changeFrequency: "monthly", priority: 0.7 }));
  const regions = REGIONS.map((r) => ({ url: abs(regionPath(r.slug)), lastModified: built, changeFrequency: "monthly", priority: 0.7 }));
  return [...pages, ...articles, ...regions];
}
