import { COMPANY, ROUTES, NOINDEX, OG_IMAGE } from "@/data/site";
import { t } from "@/data/content";
import { articlePath } from "@/data/articles";
import { regionPath } from "@/data/regions";

const OG_LOCALE = { nl: "nl_NL", en: "en_GB" };
const abs = (path) => `${COMPANY.url}${path}`;

// One place that turns page facts into Next metadata: canonical, hreflang (only
// for languages that exist), Open Graph with a page-specific image, robots.
export function buildMeta({ title, description, path, locale, alternates, image = "hero-wide", type = "website", noindex = false, absoluteTitle = false, published }) {
  const languages = {};
  if (alternates?.nl) languages["nl-NL"] = alternates.nl;
  if (alternates?.en) languages["en-GB"] = alternates.en;
  if (alternates?.nl) languages["x-default"] = alternates.nl;
  const og = `/og/${image}.jpg`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, ...(Object.keys(languages).length > 1 ? { languages } : {}) },
    openGraph: {
      type,
      url: path,
      siteName: COMPANY.name,
      locale: OG_LOCALE[locale],
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
      ...(published ? { publishedTime: published, modifiedTime: published } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
  };
}

export function pageMetadata(key, locale) {
  const m = t(locale).meta[key] || t("nl").meta[key];
  return buildMeta({
    title: m.title,
    description: m.description,
    path: ROUTES[key][locale] || ROUTES[key].nl,
    locale,
    alternates: ROUTES[key],
    image: OG_IMAGE[key],
    noindex: NOINDEX.includes(key),
    absoluteTitle: key === "home",
  });
}

export const articleMetadata = (a) =>
  buildMeta({ title: a.title, description: a.description, path: articlePath(a.slug), locale: "nl", alternates: { nl: articlePath(a.slug) }, image: a.image === "hero" ? "hero" : a.image, type: "article", published: a.date });

export const regionMetadata = (r) =>
  buildMeta({
    title: `Vastgoed verkopen in ${r.name}`,
    description: `${r.intro.split(". ")[0]}. Geen makelaar, discreet en snel duidelijkheid.`,
    path: regionPath(r.slug),
    locale: "nl",
    alternates: { nl: regionPath(r.slug) },
    image: r.image,
  });

export function baseMetadata(locale) {
  const verification = {};
  if (process.env.NEXT_PUBLIC_GSC_VERIFICATION) verification.google = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  if (process.env.NEXT_PUBLIC_BING_VERIFICATION) verification.other = { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION };
  return {
    metadataBase: new URL(COMPANY.url),
    title: { default: COMPANY.name, template: `%s | ${COMPANY.name}` },
    applicationName: COMPANY.name,
    authors: [{ name: COMPANY.name, url: COMPANY.url }],
    creator: COMPANY.name,
    publisher: COMPANY.name,
    category: "real estate",
    manifest: "/site.webmanifest",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
      apple: "/apple-touch-icon.png",
    },
    formatDetection: { telephone: false, address: false, email: false },
    ...(Object.keys(verification).length ? { verification } : {}),
    other: { "content-language": locale },
  };
}

// ---------- JSON-LD ----------

export const organizationLd = (locale) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${COMPANY.url}/#organization`,
  name: COMPANY.name,
  url: COMPANY.url,
  logo: { "@type": "ImageObject", url: `${COMPANY.url}/logo.png`, width: 362, height: 132 },
  image: `${COMPANY.url}/og/hero-wide.jpg`,
  email: COMPANY.email,
  description: t(locale).meta.home.description,
  areaServed: { "@type": "Country", name: "Nederland" },
  knowsLanguage: ["nl", "en"],
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: COMPANY.email, availableLanguage: ["Dutch", "English"], areaServed: "NL" }],
  knowsAbout: ["Vastgoedbelegging", "Residentieel vastgoed", "Commercieel vastgoed", "Logistiek vastgoed", "Vastgoedportefeuilles"],
});

export const websiteLd = (locale) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${COMPANY.url}/#website`,
  name: COMPANY.name,
  url: COMPANY.url,
  inLanguage: locale === "nl" ? "nl-NL" : "en-GB",
  publisher: { "@id": `${COMPANY.url}/#organization` },
});

// trail items: { key, label } for route keys, or { path, label } for articles/cities.
export const breadcrumbLd = (locale, trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ key: "home", label: t(locale).nav.home }, ...trail].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: abs(c.path || ROUTES[c.key][locale] || ROUTES[c.key].nl),
  })),
});

export const faqLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const serviceLd = ({ name, description, path, area = "Nederland", serviceType }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  serviceType: serviceType || name,
  url: abs(path),
  provider: { "@id": `${COMPANY.url}/#organization` },
  areaServed: { "@type": area === "Nederland" ? "Country" : "City", name: area },
});

export const articleLd = (a) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  image: [abs(`/og/${a.image}.jpg`)],
  datePublished: a.date,
  dateModified: a.date,
  inLanguage: "nl-NL",
  mainEntityOfPage: abs(articlePath(a.slug)),
  author: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
  publisher: { "@id": `${COMPANY.url}/#organization` },
});

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
