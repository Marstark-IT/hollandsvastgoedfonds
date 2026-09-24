import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import FormSection from "@/components/sections/FormSection";
import { ARTICLES, articlePath } from "@/data/articles";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";
import { x } from "@/data/extra";

export default function KennisbankView({ locale = "nl" }) {
  const c = t(locale);
  const read = x(locale).articlesTeaser.read;
  const [first, ...rest] = ARTICLES;
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.street}
        imageAlt={c.direct.imageAlt}
        title={c.meta.kennisbank.title}
        text={c.meta.kennisbank.description}
        trail={[{ key: "kennisbank", label: c.nav.kennisbank }]}
      />
      <section className="py-16 md:py-24">
        <div className="wrap">
          <Link href={articlePath(first.slug)} className="card-fx group grid overflow-hidden rounded border border-line bg-white md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image src={IMAGES[first.image]} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="fx-zoom object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-[0.9rem] font-semibold text-muted">{first.minutes} {read}</p>
              <h2 className="mt-3 text-[1.7rem] group-hover:text-accent md:text-[2rem]">{first.title}</h2>
              <p className="mt-4 text-[1.08rem] text-muted">{first.description}</p>
            </div>
          </Link>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <li key={a.slug} className="flex">
                <Link href={articlePath(a.slug)} className="card-fx group flex w-full flex-col overflow-hidden rounded border border-line bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={IMAGES[a.image]} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="fx-zoom object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.85rem] font-semibold text-muted">{a.minutes} {read}</p>
                    <h2 className="mt-2 text-[1.25rem] group-hover:text-accent">{a.title}</h2>
                    <p className="mt-3 text-[0.98rem] text-muted">{a.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FormSection locale={locale} source="kennisbank" />
    </>
  );
}
