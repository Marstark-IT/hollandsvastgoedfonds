import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import Logo from "@/components/ui/Logo";
import LangSwitch from "@/components/layout/LangSwitch";
import MobileNav from "@/components/layout/MobileNav";
import { href } from "@/data/site";
import { t } from "@/data/content";

export function navItems(locale) {
  const c = t(locale);
  const seg = c.segments.items;
  return [
    {
      label: c.nav.buy,
      href: href("buy", locale),
      children: ["residential", "commercial", "industrial", "special"].map((k) => ({
        label: seg[k].title,
        href: href(k, locale),
      })),
    },
    { label: c.nav.approach, href: href("approach", locale) },
    { label: c.nav.about, href: href("about", locale) },
    { label: c.nav.faq, href: href("faq", locale) },
    { label: c.nav.contact, href: href("contact", locale) },
  ];
}

export default function Header({ locale }) {
  const c = t(locale);
  const items = navItems(locale);
  const cta = { label: c.cta, href: `${href("home", locale)}#aanbieden` };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="wrap flex h-[76px] items-center justify-between gap-6">
        <Link href={href("home", locale)} aria-label="Hollands Vastgoedfonds, home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Hoofdmenu">
          {items.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-2 font-medium text-ink hover:text-accent"
                >
                  {item.label}
                  <CaretDown size={14} weight="bold" />
                </Link>
                <div className="invisible absolute left-0 top-full w-72 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="rounded border border-line bg-white py-2 shadow-card">
                    {item.children.map((ch) => (
                      <li key={ch.href}>
                        <Link href={ch.href} className="block px-5 py-2.5 text-ink hover:bg-soft hover:text-accent">
                          {ch.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="whitespace-nowrap px-3 py-2 font-medium text-ink hover:text-accent">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <LangSwitch locale={locale} />
          <Link href={cta.href} className="btn">
            {cta.label}
          </Link>
        </div>

        <MobileNav locale={locale} items={items} cta={cta} labels={c.nav} />
      </div>
    </header>
  );
}
