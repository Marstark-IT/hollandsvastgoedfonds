import { COMPANY, ROUTES, NOINDEX, OG_IMAGE, SITE_UPDATED } from "@/data/site";
import { ARTICLES, articlePath } from "@/data/articles";
import { REGIONS, regionPath } from "@/data/regions";

export const dynamic = "force-static";

const LEGAL = ["privacy", "cookies", "disclaimer"];
const abs = (p) => `${COMPANY.url}${p}`;
const img = (name) => [abs(`/og/${name || "hero-wide"}.jpg`)];

// Every indexable page with its main image. Pages with an English twin list
// both as alternates. lastmod is the content date, not the build time.
export default function sitemap() {
  const updated = new Date(SITE_UPDATED);
  const pages = Object.keys(ROUTES)
    .filter((k) => !NOINDEX.includes(k))
    .flatMap((k) =>
      ["nl", "en"]
        .filter((loc) => ROUTES[k][loc])
        .map((loc) => ({
          url: abs(ROUTES[k][loc]),
          lastModified: updated,
          changeFrequency: k === "home" || k === "kennisbank" ? "weekly" : "monthly",
          priority: k === "home" ? 1 : LEGAL.includes(k) ? 0.3 : loc === "en" ? 0.6 : 0.8,
          images: LEGAL.includes(k) ? undefined : img(OG_IMAGE[k]),
          ...(ROUTES[k].en
            ? { alternates: { languages: { "nl-NL": abs(ROUTES[k].nl), "en-GB": abs(ROUTES[k].en) } } }
            : {}),
        }))
    );
  const articles = ARTICLES.map((a) => ({ url: abs(articlePath(a.slug)), lastModified: new Date(a.date), changeFrequency: "monthly", priority: 0.7, images: img(a.image) }));
  const regions = REGIONS.map((r) => ({ url: abs(regionPath(r.slug)), lastModified: updated, changeFrequency: "monthly", priority: 0.7, images: img(r.image) }));
  return [...pages, ...articles, ...regions];
}
