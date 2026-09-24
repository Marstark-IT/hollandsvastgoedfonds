import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/data/site";
import { t } from "@/data/content";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

// Inner-page banner: photo with a solid white title card, breadcrumbs inside.
// `trail` is a list of { key, label } after Home; the last item is this page.
export default function PageHero({ locale, image, imageAlt, title, text, trail }) {
  const c = t(locale);
  return (
    <section className="relative bg-soft">
      <JsonLd data={breadcrumbLd(locale, trail)} />
      {image && (
        <div className="relative h-56 sm:h-72 lg:absolute lg:inset-0 lg:h-auto">
          <Image src={image} alt={imageAlt || ""} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 hidden bg-brand-dark/25 lg:block" />
        </div>
      )}
      <div className={`wrap relative ${image ? "pb-12 lg:py-24" : "py-14 md:py-20"}`}>
        <div className={`max-w-[720px] rounded bg-white p-7 sm:p-10 ${image ? "-mt-14 shadow-card lg:mt-0" : ""}`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.9rem] text-muted">
              <li>
                <Link href={ROUTES.home[locale]} className="hover:text-accent hover:underline">
                  {c.nav.home}
                </Link>
              </li>
              {trail.map((b, i) => (
                <li key={b.path || b.key} className="inline-flex items-center gap-1.5">
                  <CaretRight size={12} weight="bold" />
                  {i === trail.length - 1 ? (
                    <span aria-current="page" className="font-semibold text-ink">{b.label}</span>
                  ) : (
                    <Link href={b.path || ROUTES[b.key][locale] || ROUTES[b.key].nl} className="hover:text-accent hover:underline">
                      {b.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-5 text-[2rem] leading-[1.15] sm:text-[2.5rem]">{title}</h1>
          {text && <p className="mt-5 text-[1.15rem] text-muted">{text}</p>}
        </div>
      </div>
    </section>
  );
}
