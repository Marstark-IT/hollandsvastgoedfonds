import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Logo from "@/components/ui/Logo";
import { COMPANY, href } from "@/data/site";
import { t } from "@/data/content";
import { REGIONS, regionPath } from "@/data/regions";
import { CookieSettingsLink } from "@/components/ui/CookieConsent";

export default function Footer({ locale }) {
  const c = t(locale);
  const seg = c.segments.items;
  const col = (title, links) => (
    <div className="min-w-0">
      <h2 className="text-[1.05rem] font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link href={to} className="text-white/80 hover:text-white hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-brand-dark text-white">
      <div className={`wrap grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3 ${locale === "nl" ? "xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]" : "xl:grid-cols-[1.4fr_1fr_1fr_1fr]"}`}>
        <div className="min-w-0 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Logo light />
          <p className="mt-5 max-w-sm text-white/80">{c.footer.text}</p>
          <a href={COMPANY.emailHref} className="mt-5 inline-flex max-w-full items-center gap-2 break-all font-semibold hover:underline">
            <EnvelopeSimple size={20} weight="bold" />
            {COMPANY.email}
          </a>
        </div>
        {col(
          c.footer.buy,
          ["residential", "commercial", "industrial", "special"].map((k) => [seg[k].title, href(k, locale)])
        )}
        {col(c.footer.explore, [
          [c.nav.approach, href("approach", locale)],
          ...(locale === "nl"
            ? [
                [c.nav.regions, href("regions", locale)],
                [c.nav.kennisbank, href("kennisbank", locale)],
              ]
            : []),
          [c.nav.about, href("about", locale)],
          [c.nav.faq, href("faq", locale)],
          [c.nav.contact, href("contact", locale)],
        ])}
        {locale === "nl" && col(c.nav.regions, REGIONS.map((r) => [r.name, regionPath(r.slug)]))}
        {col(c.footer.legal, [
          [c.meta.privacy.title, href("privacy", locale)],
          [c.meta.cookies.title, href("cookies", locale)],
          [c.meta.disclaimer.title, href("disclaimer", locale)],
        ])}
      </div>
      <div className="border-t border-white/15">
        <p className="wrap py-6 text-[0.85rem] text-white/70">
          © {new Date().getFullYear()} {COMPANY.name}. {c.footer.rights}
        </p>
        <div className="wrap -mt-3 pb-6 text-[0.85rem]">
          <CookieSettingsLink label={locale === "nl" ? "Cookie-instellingen" : "Cookie settings"} />
        </div>
      </div>
    </footer>
  );
}
