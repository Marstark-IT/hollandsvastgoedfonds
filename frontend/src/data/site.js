// Company facts. Phone, address and KvK are intentionally left out until the
// client supplies them; components only render fields that are set.
export const COMPANY = {
  name: "Hollands Vastgoedfonds",
  email: "hello@hollandsvastgoedfonds.com",
  emailHref: "mailto:hello@hollandsvastgoedfonds.com",
  url: "https://hollandsvastgoedfonds.com",
  phone: null,
  kvk: null,
  address: null,
};

export const LOCALES = ["nl", "en"];

// Every page exists in both languages. The key links a Dutch URL to its
// English counterpart (language toggle, hreflang, sitemap).
export const ROUTES = {
  home: { nl: "/", en: "/en/" },
  approach: { nl: "/werkwijze/", en: "/en/approach/" },
  buy: { nl: "/wat-wij-kopen/", en: "/en/what-we-buy/" },
  residential: { nl: "/wat-wij-kopen/woningen/", en: "/en/what-we-buy/residential/" },
  commercial: { nl: "/wat-wij-kopen/commercieel-vastgoed/", en: "/en/what-we-buy/commercial/" },
  industrial: { nl: "/wat-wij-kopen/bedrijfsvastgoed/", en: "/en/what-we-buy/industrial-logistics/" },
  special: { nl: "/wat-wij-kopen/bijzondere-situaties/", en: "/en/what-we-buy/special-situations/" },
  about: { nl: "/over-ons/", en: "/en/about/" },
  faq: { nl: "/veelgestelde-vragen/", en: "/en/faq/" },
  contact: { nl: "/contact/", en: "/en/contact/" },
  offer: { nl: "/vastgoed-aanbieden/", en: "/en/offer-property/" },
  thanks: { nl: "/bedankt/", en: "/en/thank-you/" },
  privacy: { nl: "/privacy/", en: "/en/privacy/" },
  cookies: { nl: "/cookies/", en: "/en/cookies/" },
  disclaimer: { nl: "/disclaimer/", en: "/en/disclaimer/" },
  notFound: { nl: "/niet-gevonden/", en: "/en/not-found/" },
  // Dutch-only sections (articles and local pages target Dutch searchers).
  kennisbank: { nl: "/kennisbank/", en: null },
  regions: { nl: "/regios/", en: null },
};

// Pages kept out of the sitemap and marked noindex.
export const NOINDEX = ["thanks", "notFound"];

// Falls back to the Dutch URL when a page has no English version.
export const href = (key, locale) => ROUTES[key][locale] || ROUTES[key].nl;

// Open Graph image per route key (1200x630 JPGs in public/og).
export const OG_IMAGE = {
  home: "hero-wide", approach: "region", buy: "street", residential: "residential",
  commercial: "commercial", industrial: "industrial", special: "special", about: "hero",
  faq: "residential", contact: "street", offer: "hero-wide", kennisbank: "street", regions: "region",
};

export const IMAGES = {
  hero: "/images/hero.webp",
  heroWide: "/images/hero-wide.webp",
  residential: "/images/residential.webp",
  commercial: "/images/commercial.webp",
  industrial: "/images/industrial.webp",
  special: "/images/special.webp",
  region: "/images/region.webp",
  street: "/images/street.webp",
};
