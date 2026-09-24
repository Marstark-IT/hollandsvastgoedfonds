import { COMPANY } from "@/data/site";
import { ARTICLES, articlePath } from "@/data/articles";

export const dynamic = "force-static";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// RSS feed of the kennisbank, linked from <head> for feed readers and discovery.
export function GET() {
  const items = ARTICLES.map((a) => {
    const url = `${COMPANY.url}${articlePath(a.slug)}`;
    return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.description)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Kennisbank | ${COMPANY.name}</title><link>${COMPANY.url}/kennisbank/</link><atom:link href="${COMPANY.url}/kennisbank/feed.xml" rel="self" type="application/rss+xml"/><description>Artikelen over vastgoed verkopen aan een directe koper.</description><language>nl-NL</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
