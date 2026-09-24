# SEO: status, keyword map and off-page plan

Last audit: 24 September 2026. Written for the owner and whoever runs marketing.

## 1. Where the site stands

| Check | Result |
|---|---|
| Google PageSpeed Insights, live, mobile | Performance 96, Accessibility 100, Best Practices 96 before the fix below (100 after), SEO 100 |
| Core Web Vitals (live, mobile lab) | LCP 2.3 s, CLS 0, TBT 100 ms (all "good") |
| Lighthouse SEO, all 46 indexable pages | 100 on every page |
| Lighthouse Accessibility, all 50 pages | 100 on every page |
| On-page crawl (titles, descriptions, H1, headings, canonical, hreflang, Open Graph, alt text, links, JSON-LD, word count) | 0 issues on 50 pages |
| Pages deliberately kept out of Google | Thank-you pages and 404 pages (`noindex`). Lighthouse gives these 69 by design. Indexing them would hurt. |

Fixed during this audit: 21 titles over 60 characters, 18 descriptions outside 110 to 160 characters, 4 duplicate titles, 5 thin pages (offer, regions, about, contact), and a 403 on Next.js prefetch files (`__next.*.txt`) that caused console errors and slower navigation.

## 2. Technical SEO in place

- Static HTML on a CDN, HTTPS with HSTS, one canonical URL per page (trailing slash, apex domain, `/index.html` redirected).
- Dutch at `/`, English at `/en/`, `hreflang` nl-NL / en-GB / x-default, reciprocal.
- `sitemap.xml` with 40 URLs, image entries and stable `lastmod`; `robots.txt` pointing to it.
- Structured data: Organization, WebSite, BreadcrumbList (all inner pages), Service (property types and cities), FAQPage (home, FAQ, segment, city, offer), Article (knowledge base).
- Per-page Open Graph and Twitter images (1200x630).
- RSS feed for the knowledge base (`/kennisbank/feed.xml`), linked in every Dutch page.
- `llms.txt` so AI search tools (ChatGPT, Perplexity, Google AI Overviews) understand the site.
- IndexNow: every deploy pings Bing, Yandex, Seznam and Naver with all sitemap URLs.
- Responsive images (5 sizes each), preloaded hero and font, no layout shift.
- Internal links: header, footer (all property types, cities, knowledge base), breadcrumbs, related articles, city blocks on property pages.

## 3. Keyword map (Dutch, primary market)

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| `/` | vastgoed verkopen aan belegger | pand verkopen aan investeerder, vastgoed opkoper, direct verkopen zonder makelaar |
| `/wat-wij-kopen/woningen/` | woning verkopen aan belegger | woningportefeuille verkopen, appartementencomplex verkopen |
| `/wat-wij-kopen/commercieel-vastgoed/` | commercieel vastgoed verkopen | kantoorpand verkopen, winkelpand verkopen |
| `/wat-wij-kopen/bedrijfsvastgoed/` | bedrijfspand verkopen | bedrijfshal verkopen, sale and leaseback |
| `/wat-wij-kopen/bijzondere-situaties/` | pand met achterstallig onderhoud verkopen | transformatiepand verkopen |
| `/kennisbank/verhuurde-woning-verkopen/` | verhuurde woning verkopen | huis verkopen met huurder |
| `/kennisbank/woningportefeuille-verkopen/` | woningportefeuille verkopen | verhuurde portefeuille verkopen |
| `/kennisbank/geerfd-vastgoed-verkopen/` | geërfde woning verkopen | huis erven en verkopen |
| `/kennisbank/stoppen-als-verhuurder/` | stoppen als verhuurder | verhuurder verkopen wet betaalbare huur |
| `/kennisbank/bedrijfspand-verkopen/` | bedrijfspand verkopen aan belegger | sale and leaseback bedrijfspand |
| `/kennisbank/verkopen-zonder-makelaar/` | vastgoed verkopen zonder makelaar | huis verkopen zonder makelaar |
| `/kennisbank/koop-breekt-geen-huur/` | koop breekt geen huur | verkoop verhuurde woning huurder |
| `/kennisbank/leegstaand-pand-verkopen/` | leegstaand pand verkopen | pand verkopen achterstallig onderhoud |
| `/regios/<stad>/` | vastgoed verkopen in <stad> | pand verkopen <stad>, verhuurde woning verkopen <stad> |

## 4. Content roadmap (next 3 months)

Competitors such as sonsrealestate.nl rank with dozens of long-tail pages. Add two articles a month, each 800 to 1,200 words, same structure as the existing ones:

1. Beleggingspand verkopen: hoe werkt het?
2. Huis verkopen aan een investeerder of opkoper: waar let u op?
3. Appartementencomplex verkopen
4. Kantoorpand verkopen (inclusief transformatie naar wonen)
5. Winkelpand verkopen met huurder
6. Sale-and-leaseback voor ondernemers
7. Verhuurde woning verkopen onder de WOZ-waarde: wat betekent dat?
8. Studentenpand of kamerverhuurpand verkopen

More city pages, each with its own market notes (not copies): Haarlem, Leiden, Breda, 's-Hertogenbosch, Amersfoort, Zwolle, Almere, Maastricht.

## 5. Off-page plan (needs the owner)

1. **Google Search Console**: verify the domain (DNS TXT record) and submit `https://hollandsvastgoedfonds.com/sitemap.xml`. The site supports a `NEXT_PUBLIC_GSC_VERIFICATION` meta tag as an alternative.
2. **Bing Webmaster Tools**: import from Search Console (IndexNow already pings Bing).
3. **Google Business Profile**: needs a real address (office or service-area business). Category: "Vastgoedbelegger" or "Vastgoedbedrijf". Use the exact same name, address and email as the website footer.
4. **KvK number and address on the website**: required by Dutch law and a trust signal for Google. Send them and they go in the footer and the Organization schema.
5. **Citations** (same name, address and email everywhere): Apple Business Connect, Bing Places, Telefoonboek.nl, Opendi, Cylex, Yelp NL, Hotfrog, bedrijvenpagina.nl.
6. **Reviews**: after each completed purchase, ask the seller for a Google review. Reviews drive local rankings and conversion for sellers aged 50+.
7. **Links from relevant sites**: property and investor media (Vastgoedmarkt, PropertyNL, Vastgoedjournaal: publish a transaction or a market opinion), local business associations, notary and tax advisor partners, and guest articles on landlord platforms (Vastgoed Belang, landlord forums).
8. **Google Analytics 4 and Google Ads**: send the GTM container ID and the site switches on GTM with Consent Mode v2 and the cookie banner automatically.

## 6. How to keep it at 100

- New page: add its title and description in `src/data/content.js` (title at most 35 characters, because " | Hollands Vastgoedfonds" adds 25; description 110 to 160 characters).
- Bump `SITE_UPDATED` in `src/data/site.js` when page copy changes.
- Run the crawler and Lighthouse before a big release (see the SEO section of the README).
