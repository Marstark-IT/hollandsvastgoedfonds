import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Logo from "@/components/ui/Logo";
import { COMPANY, href } from "@/data/site";
import { t } from "@/data/content";

export default function Footer({ locale }) {
  const c = t(locale);
  const seg = c.segments.items;
  const col = (title, links) => (
    <div>
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
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-white/80">{c.footer.text}</p>
          <a href={COMPANY.emailHref} className="mt-5 inline-flex items-center gap-2 font-semibold hover:underline">
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
          [c.nav.about, href("about", locale)],
          [c.nav.faq, href("faq", locale)],
          [c.nav.contact, href("contact", locale)],
        ])}
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
      </div>
    </footer>
  );
}
