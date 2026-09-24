import Image from "next/image";
import Link from "next/link";
import { ARTICLES, articlePath } from "@/data/articles";
import { IMAGES, href } from "@/data/site";
import { x } from "@/data/extra";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

// Knowledge-base cards. `slugs` picks specific articles, else the first three.
export default function ArticleTeaser({ locale, slugs, exclude, tone = "white" }) {
  const a = x(locale).articlesTeaser;
  const list = (slugs ? slugs.map((s) => ARTICLES.find((z) => z.slug === s)) : ARTICLES)
    .filter(Boolean)
    .filter((z) => z.slug !== exclude)
    .slice(0, 3);
  return (
    <section className={`${tone === "soft" ? "bg-soft" : ""} py-20 md:py-28`}>
      <div className="wrap">
        <h2 className="h-section">{a.title}</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {list.map((art) => (
            <li key={art.slug} className="flex">
              <Link href={articlePath(art.slug)} className="card-fx group flex w-full flex-col overflow-hidden rounded border border-line bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={IMAGES[art.image]} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="fx-zoom object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.85rem] font-semibold text-muted">{art.minutes} {a.read}</p>
                  <h3 className="mt-2 text-[1.25rem] group-hover:text-accent">{art.title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-[0.98rem] text-muted">{art.description}</p>
                  <span className="fx-cta mt-4">{x(locale).situations.more}<ArrowRight size={18} weight="bold" /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={href("kennisbank", locale)} className="btn-outline mt-10">
          {a.all}
        </Link>
      </div>
    </section>
  );
}
