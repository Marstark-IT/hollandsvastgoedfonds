import { COMPANY } from "@/data/site";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${COMPANY.url}/sitemap.xml`,
    host: COMPANY.url,
  };
}
