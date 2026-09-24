import { COMPANY, ROUTES, NOINDEX } from "@/data/site";

export const dynamic = "force-static";

// Every indexable page in both languages, each entry listing its alternate.
export default function sitemap() {
  const now = new Date();
  return Object.keys(ROUTES)
    .filter((k) => !NOINDEX.includes(k))
    .flatMap((k) =>
      ["nl", "en"].map((loc) => ({
        url: `${COMPANY.url}${ROUTES[k][loc]}`,
        lastModified: now,
        changeFrequency: k === "home" ? "weekly" : "monthly",
        priority: k === "home" ? 1 : ["privacy", "cookies", "disclaimer"].includes(k) ? 0.3 : 0.8,
        alternates: {
          languages: {
            "nl-NL": `${COMPANY.url}${ROUTES[k].nl}`,
            "en-GB": `${COMPANY.url}${ROUTES[k].en}`,
          },
        },
      }))
    );
}
