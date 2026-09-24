import Link from "next/link";
import { House, Buildings, Scroll, Key, Warehouse, Wrench, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { articlePath } from "@/data/articles";
import { x } from "@/data/extra";

const ICONS = { house: House, buildings: Buildings, scroll: Scroll, key: Key, warehouse: Warehouse, wrench: Wrench };

// Common seller situations, each linking to the matching knowledge-base article.
// Hover and focus use the shared .card-fx system (see globals.css).
export default function Situations({ locale, tone = "white" }) {
  const s = x(locale).situations;
  return (
    <section className={`${tone === "soft" ? "bg-soft" : ""} py-20 md:py-28`}>
      <div className="wrap">
        <h2 className="h-section">{s.title}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it) => {
            const Icon = ICONS[it.icon];
            return (
              <li key={it.title} className="flex">
                <Link href={articlePath(it.article)} className="card-fx group flex w-full flex-col overflow-hidden rounded border border-line bg-white p-7 outline-none">
                  <Icon aria-hidden="true" size={170} weight="thin" className="fx-mark" />
                  <span className="fx-icon relative">
                    <Icon size={34} weight="light" />
                  </span>
                  <h3 className="relative mt-6 text-[1.3rem]">{it.title}</h3>
                  <p className="relative mt-2 flex-1 text-muted">{it.text}</p>
                  <span className="fx-cta relative mt-6">
                    {s.more}
                    <ArrowRight size={18} weight="bold" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
