import { COMPANY, ROUTES, NOINDEX } from "@/data/site";
import { t } from "@/data/content";

const OG_LOCALE = { nl: "nl_NL", en: "en_GB" };

// Page metadata for a route key, with canonical + hreflang alternates so the
// Dutch and English versions point at each other.
export function pageMetadata(key, locale) {
  const m = t(locale).meta[key];
  const path = ROUTES[key][locale];
  const noindex = NOINDEX.includes(key);
  const title = key === "home" ? { absolute: m.title } : m.title;

  return {
    title,
    description: m.description,
    alternates: {
      canonical: path,
      languages: {
        "nl-NL": ROUTES[key].nl,
        "en-GB": ROUTES[key].en,
        "x-default": ROUTES[key].nl,
      },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: COMPANY.name,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === "nl" ? "en" : "nl"],
      title: m.title,
      description: m.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: COMPANY.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: ["/og.jpg"],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export function baseMetadata(locale) {
  return {
    metadataBase: new URL(COMPANY.url),
    title: { default: COMPANY.name, template: `%s | ${COMPANY.name}` },
    applicationName: COMPANY.name,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
      apple: "/apple-touch-icon.png",
    },
    formatDetection: { telephone: false },
    other: { "content-language": locale },
  };
}

export const organizationLd = (locale) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${COMPANY.url}/#organization`,
  name: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/logo.png`,
  email: COMPANY.email,
  description: t(locale).meta.home.description,
  areaServed: { "@type": "Country", name: "Netherlands" },
  knowsAbout: ["Real estate investment", "Residential real estate", "Commercial real estate", "Logistics real estate"],
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

export const breadcrumbLd = (locale, trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ key: "home", label: t(locale).nav.home }, ...trail].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: `${COMPANY.url}${ROUTES[c.key][locale]}`,
  })),
});

export const faqLd = (locale) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: t(locale).faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
